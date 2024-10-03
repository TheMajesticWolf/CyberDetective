from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier

import os
import json
import tqdm
import torch
import joblib
import numpy as np
import pandas as pd

from sklearn.metrics import accuracy_score

from sentence_transformers import SentenceTransformer


with open("../../Dataset/NER/train.json", "r") as f:
	data = json.load(f)

print("AttackER Dataset loaded")

main_tags = dict()
for obj in data:
	for tag in obj["tags"]:
		# tag = tag.split("-")[1] if(tag != "O") else "O"
		main_tags[tag] = 0

for obj in data:
	for tag in obj["tags"]:
		# tag = tag.split("-")[1] if(tag != "O") else "O"
		main_tags[tag] += 1



tag_to_number = {tag: idx for idx, tag in enumerate(main_tags.keys())}
number_to_tag = {v: k for k, v in tag_to_number.items()}

number_to_tag

try:
	print(f"CUDA available: {torch.cuda.is_available()}")
	# print(torch.cuda.memory_summary())
except Exception as e:
	print(f"CUDA not available: {e}")



embedding_model = SentenceTransformer("all-MiniLM-L6-v2").to("cpu")


all_tokens = []
all_tags = []

for obj in data:
	tokens = obj["tokens"]
	tags = obj["tags"]

	# tags = list(map(lambda tag: tag.split("-")[1] if(tag != "O") else "O", tags))
	

	all_tokens.extend(tokens)
	all_tags.extend(tags)


assert all_tags.__len__() == all_tokens.__len__()


embeddings = embedding_model.encode(all_tokens, batch_size=2048)

print("Created vector embeddings")



assert embeddings.__len__() == all_tokens.__len__()
assert all_tags.__len__() == all_tokens.__len__()

df = pd.DataFrame(embeddings)


df["target"] = all_tags
df["target"] = df["target"].apply(lambda tag: tag_to_number.get(tag, ""))




# model = SVC()
# model = DecisionTreeClassifier()
model = RandomForestClassifier()
# model = KNeighborsClassifier()
# model = GaussianNB()

X = df.drop(["target"], axis=1).values
y = df["target"].values

model.fit(X, y)

print("ML model training done")


def predict(sentence: 'str'):

	tokens = sentence.split()

	op = embedding_model.encode(tokens)
	
	preds = model.predict(op)
	preds = list(map(lambda num: number_to_tag.get(num, "UNKNOWN"), preds))

	return preds



# Function for comparing the actual data and predicted data
def compare(idx, using_test=False):

	if(using_test):
		with open("../../Dataset/NER/test.json", "r") as f:
			data = json.load(f)
	else:
		with open("../../Dataset/NER/train.json", "r") as f:
			data = json.load(f)

	

	pred = predict(" ".join(data[idx]["tokens"]))
	words = data[idx]["tokens"]

	actual = data[idx]["tags"]
	# actual = list(map(lambda tag: tag.split("-")[1] if(tag != "O") else "O", actual))
	
	df = pd.DataFrame([words, pred, actual]).T
	df.columns = ["Word", "Prediction", "Actual"]


	return df
	return accuracy_score(df["Prediction"], df["Actual"]), df


def accuracy():
	with open("../../Dataset/NER/test.json", "r") as f:
		data = json.load(f)


	acc = 0.0

	for i in tqdm.tqdm(range(len(data))):
		try:
			df = compare(i, using_test=True)
			acc += accuracy_score(df["Prediction"], df["Actual"])
		except Exception as e:
			print(e)

	return acc / len(data)



if(__name__ == "__main__"):

	print(f"Test accuracy: {accuracy()}")

	# df_test = compare(2295)
	# df_test = compare(121)
	# df_test = compare(669)
	# df_test = compare(24)

	# predict("This vulnerability is found in the Windows and Linux operating systems")	
	joblib.dump(model, "./Models/rfc.joblib")








