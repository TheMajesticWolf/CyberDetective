import json
import sys
import joblib



number_to_tag = {
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

tag_to_number = {v: k for k, v in number_to_tag.items()}



def predict_ml(sentence: 'str'):

	from sentence_transformers import SentenceTransformer

	embedding_model = SentenceTransformer("all-MiniLM-L6-v2").to("cpu")
	model = joblib.load("./Python_Scripts/Models/rfc.joblib")
	
	tokens = sentence.split()
	
	embeddings = embedding_model.encode(tokens)
	
	preds = model.predict(embeddings)
	preds = list(map(lambda num: number_to_tag.get(num, "NIL"), preds))
	
	return list(zip(tokens, preds))


def predict_freq(sentence: 'str'):

	with open("./Python_Scripts/Models/ner_based_on_freq.json", "r") as f:
		narrowed_mapping = dict(json.load(f))

	tokens = sentence.split()
	
	tags = [narrowed_mapping.get(token, "NIL") for token in tokens]
	
	return list(zip(tokens, tags))


def predict(sentence: 'str', annotation_type: 'str'):

	if(annotation_type == "rfc"):
		return predict_ml(sentence)
	
	elif(annotation_type == "freq"):
		return predict_freq(sentence)
	
	else:
		raise ValueError("Invalid annotation type. Use 'ml' for ML-based or 'freq' for frequency-based.")


user_obj = {
	"userQuestion": "This is an exploit in the Linux and Windows and Apple operating systems",
	"analysisType": "ner-freq"
}

user_obj = dict(json.loads(sys.stdin.read()))


sentence = user_obj.get("userQuestion", "")
annotation_type = user_obj.get("analysisType", "ner-freq")

sys.stderr.write(f"Here: {annotation_type}")

annotation_type = annotation_type.split("-")[1]
sys.stderr.write(f"Here: {annotation_type}")

predicted_tags_and_tokens = predict(sentence, annotation_type)

to_send = {
	"output": predicted_tags_and_tokens,
	"question": f'Perform NER on: {user_obj["userQuestion"]}',
	"return_format": "ner_list"
}

sys.stdout.write(json.dumps(to_send))
