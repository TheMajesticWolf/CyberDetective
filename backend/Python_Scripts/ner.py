import json
import sys


user_obj = {
	"userQuestion": "This vulnerability is found in the Windows and Linux operating systems",
	"analysisType": "ner"
}

user_obj = dict(json.loads(sys.stdin.read()))


with open("/home/aditya/Desktop/Aditya/Tranberg USB/USB Drive/Aditya new/Aditya/CSM A/III Year/I Semester/PS_Cyber_Detective/venv/ner_based_on_freq.json", "r") as f:
	narrowed_mapping = dict(json.load(f))


def predict_tags(sentence: 'str') -> 'list[list[str]]':

	scraped_data = {"context": sentence}



	tokens = scraped_data["context"].split(" ")
	tags = []

	for token in tokens:
		tags.append(narrowed_mapping.get(token, "NIL"))
	

	return list(zip(tokens, tags))

predicted_tags_and_tokens = predict_tags(user_obj.get("userQuestion", ""))


to_send = {
	"output": predicted_tags_and_tokens,
	"question": f'Perform NER on: {user_obj["userQuestion"]}',
	"return_format": "ner_list"
}

to_send = json.dumps(to_send)

sys.stdout.write(to_send)


	

	