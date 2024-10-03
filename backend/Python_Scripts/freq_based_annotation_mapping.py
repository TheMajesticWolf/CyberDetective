import json
from collections import defaultdict



with open("../../Dataset/NER/train.json", "r") as f:
	data = json.load(f)


unique_tokens = dict()

for obj in data:
	for tag, token in zip(obj["tags"], obj["tokens"]):
		if(token not in unique_tokens.keys()):
			unique_tokens[token] = []

for obj in data:
	for tag, token in zip(obj["tags"], obj["tokens"]):
		# print(f"{tag} => {token}")
		unique_tokens[token].append(tag)
	# break

for key in unique_tokens:
	unique_tokens[key] = list(set(unique_tokens[key]))

unique_tokens




def build_token_tag_frequency(attacker_data):
	token_tag_map = defaultdict(lambda: defaultdict(int))
	
	for entry in attacker_data:
		tokens = entry['tokens']
		tags = entry['tags']
		
		for token, tag in zip(tokens, tags):
			tag = tag.split("-")[1] if(tag != "O") else "O"
			token_tag_map[token][tag] += 1
	
	return token_tag_map

# Getting all the possible tags for a given word (like "The", "method") and their frequencies
freq_dict = {key: dict(value) for key, value in build_token_tag_frequency(data).items()}


# Sorting the frequencies in decreasing order
for key in freq_dict:
	freq_dict[key] = dict(sorted(freq_dict[key].items(), key=lambda x: x[1], reverse=True))
	


narrowed_mapping = dict()


# Selecting only the top 3 most used tags for a give token
for key in freq_dict:
	narrowed_mapping[key] = dict(list(freq_dict[key].items())[:3])


# Making sure that we use "O" only if the number of occurences of "O" is twice the number of the next highest tag, else we use the next highest tag, excluding "O"
for key in narrowed_mapping:
	
	actual_freq = list(narrowed_mapping[key].items())

	if(actual_freq[0][0] == "O"):
		
		try:
			if(actual_freq[0][1] < 2*actual_freq[1][1]):
				narrowed_mapping[key] = dict(actual_freq[1:])
		
		except Exception as e:        
			# print(e)
			pass
		  

# Selecting the tag for a given token as the most frequent one (index 0, since sorted in dec. order)
for key in narrowed_mapping:
	narrowed_mapping[key] = list(narrowed_mapping[key].keys())[0]



assert narrowed_mapping.__len__() == freq_dict.__len__()



	
with open("./Models/ner_based_on_freq.json", "w") as f:
	json.dump(narrowed_mapping, f, indent=4)
