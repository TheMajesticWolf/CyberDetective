from flask import Flask, jsonify, request
import json
import sys
import joblib
from sentence_transformers import SentenceTransformer
from sentence_transformers import  util
import pandas as pd
import torch
import numpy as np
import os
from transformers import pipeline, AutoTokenizer, AutoModelForQuestionAnswering


is_docker = os.getenv('ENVIRONMENT') == 'docker'

# Use relative path or dataset path based on the environment
if(is_docker):
    dataset_path = './Dataset'
else:
    dataset_path = '../../Dataset'  # Adjust this based on your local setup



class MyPredictor:

	def __init__(self) -> None:

		self.number_to_tag = {
			0: 'O', 1: 'B-ATTACK_PATTERN', 2: 'I-ATTACK_PATTERN', 3: 'B-GENERAL_IDENTITY',
			4: 'B-INFRASTRUCTURE', 5: 'I-INFRASTRUCTURE', 6: 'B-INDICATOR', 7: 'B-GENERAL_TOOL',
			8: 'I-GENERAL_TOOL', 9: 'B-COURSE_OF_ACTION', 10: 'I-COURSE_OF_ACTION', 11: 'I-INDICATOR',
			12: 'B-THREAT_ACTOR', 13: 'B-VULNERABILITY', 14: 'I-VULNERABILITY', 15: 'B-MALWARE_ANALYSIS',
			16: 'I-MALWARE_ANALYSIS', 17: 'B-INTRUSION_SET', 18: 'I-INTRUSION_SET', 19: 'B-VICTIM_IDENTITY',
			20: 'I-VICTIM_IDENTITY', 21: 'B-MALWARE', 22: 'I-GENERAL_IDENTITY', 23: 'I-THREAT_ACTOR',
			24: 'I-MALWARE', 25: 'B-IMPACT', 26: 'I-IMPACT', 27: 'B-ATTACK_TOOL', 28: 'B-OBSERVED_DATA',
			29: 'I-OBSERVED_DATA', 30: 'B-LOCATION', 31: 'I-LOCATION', 32: 'I-ATTACK_TOOL',
			33: 'B-CAMPAIGN', 34: 'B-ATTACK_MOTIVATION', 35: 'I-ATTACK_MOTIVATION', 36: 'I-CAMPAIGN',
			37: 'B-ATTACK_RESOURCE_LEVEL', 38: 'I-ATTACK_RESOURCE_LEVEL', 39: 'B-ATTACK_SOPHISTICATION_LEVEL',
			40: 'I-ATTACK_SOPHISTICATION_LEVEL'
		}

		self.tag_to_number = {v: k for k, v in self.number_to_tag.items()}
		

		self.embedding_model = SentenceTransformer("all-MiniLM-L6-v2").to("cpu")
		self.model = joblib.load("./Models/rfc.joblib")

		with open("./Models/ner_based_on_freq.json", "r") as f:
			self.narrowed_mapping = dict(json.load(f))



	def predict_ml(self, sentence: 'str'):
		
		tokens = sentence.split()
		
		embeddings = self.embedding_model.encode(tokens)
		
		preds = self.model.predict(embeddings)
		preds = list(map(lambda num: self.number_to_tag.get(num, "NIL"), preds))
		
		return list(zip(tokens, preds))


	def predict_freq(self, sentence: 'str'):

		tokens = sentence.split()
		
		tags = [self.narrowed_mapping.get(token, "NIL") for token in tokens]
		
		return list(zip(tokens, tags))


	def predict(self, sentence: 'str', annotation_type: 'str'):

		if(annotation_type == "rfc"):
			return self.predict_ml(sentence)
		
		elif(annotation_type == "freq"):
			return self.predict_freq(sentence)
		
		else:
			raise ValueError("Invalid annotation type. Use 'ner-rfc' for ML-based or 'ner-freq' for frequency-based.")


	def perform_ner_on_data(self, user_obj: 'dict'):

		# user_obj = {
		# 	"userQuestion": "This is an exploit in the Linux and Windows and Apple operating systems",
		# 	"analysisType": "ner-freq"
		# }



		sentence = user_obj.get("userQuestion", "")
		annotation_type = user_obj.get("analysisType", "ner-freq")

		app.logger.debug(f"Here: {annotation_type}\n")

		annotation_type = annotation_type.split("-")[1]
		app.logger.debug(f"Here: {annotation_type}\n")

		predicted_tags_and_tokens = self.predict(sentence, annotation_type)

		to_send = {
			"output": predicted_tags_and_tokens,
			"question": f'Perform NER on: {user_obj["userQuestion"]}',
			"return_format": "ner_list",
			# "userID": user_obj.get("userID", 0) + 1					# For simulating multiuser environment by sending multiple requests using threads and verify, whether sender and receiver are same
		}

		return to_send
		# sys.stdout.write(json.dumps(to_send))


	def rag_based_qa(self, user_obj: 'dict'):

		given_question = user_obj["userQuestion"]
		neighbors = int(user_obj["neighbors"])

		chunks_and_embeddings_df = pd.concat([
			pd.read_json(os.path.join(dataset_path, "Embeddings/malwarebytes_glossary.json")),
			pd.read_json(os.path.join(dataset_path, "Embeddings/all_talos_vuln_reports.json")),
			pd.read_json(os.path.join(dataset_path, "Embeddings/basic_definitions.json")),
			pd.read_json(os.path.join(dataset_path, "Embeddings/processed_qa_contexts.json")),
			pd.read_json(os.path.join(dataset_path, "Embeddings/scraped_wikipedia.json")),

		], ignore_index=True)

		embeddings = np.array(chunks_and_embeddings_df["embedding"].to_list())

		embeddings = torch.tensor(embeddings,  dtype=torch.float32)

		query_embedding = torch.tensor(self.embedding_model.encode(given_question))

		dot_scores = util.dot_score(a=query_embedding, b=embeddings)

		top_results = torch.topk(dot_scores, k=neighbors)


		relavant = chunks_and_embeddings_df.iloc[top_results.indices.tolist()[0]]["chunk"].tolist()

		response = ""

		for idx, answer in enumerate(relavant):
			answer = answer.replace("Answer:", "").strip()
			# response += answer + "\n\n"
			# response += f"{answer}\n==========================\nSimilarity Score = {top_results.values.tolist()[0][idx]:0.5f}\n==========================\n\n"
			response += f"{answer}\n"

		model_name = "./Models/cyber_squad_bert"
		model_name = "./Models/fully_custom_bert"

		tokenizer = AutoTokenizer.from_pretrained(model_name)
		model = AutoModelForQuestionAnswering.from_pretrained(model_name).to("cpu")

		question_answerer = pipeline('question-answering', model=model, tokenizer=tokenizer, device="cpu")


		generated_text = question_answerer(question=given_question, context=response)



		data_to_send = {

			"output": generated_text["answer"],
			"question": given_question,
			"return_format": "string"
		}


		return data_to_send

			



app = Flask(__name__)

predictor = MyPredictor()


@app.route("/")
def hello():
	
	return "Hello, World! Flask server running on port 5000"


@app.route("/perform-ner", methods=["POST"])
def perform_ner():
	
	user_obj = request.get_json()

	print(user_obj)

	out = predictor.perform_ner_on_data(user_obj)

	return jsonify(out)

@app.route("/rag-based-qa", methods=["POST"])
def rag_based_qa():
	
	user_obj = request.get_json()

	print(user_obj)

	out = predictor.rag_based_qa(user_obj)

	return jsonify(out)


@app.route("/db-preview", methods=["GET"])
def db_preview():

	path = os.path.join(dataset_path, "QA", "groq_generated.json")

	df = pd.read_json(path)

	contexts = df["context"].tolist()
	questions = df["question"].tolist()
	answers = df["answers"].apply(lambda x: x["answer_text"][0]).tolist()


	
	combined = list(zip(contexts, questions, answers))

	# df = pd.DataFrame(combined, columns=["Context", "Question", "Answer"])

	print(request)

	count = int(request.args.get("count", 10))

	data_to_send = {
		"output": combined[:count],
		"question": "Dataset preview",
		"return_format": "dataset-qa-table"
	}

	return jsonify(data_to_send)



if(__name__ == "__main__"):
	app.run(host="0.0.0.0", debug=True, port=5000, threaded=True)