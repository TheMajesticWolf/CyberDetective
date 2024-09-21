# Cyber-Attack Attribution and Investigation Tool

## Project Overview
Investigating and attributing cyber-attacks are crucial processes that enable the implementation of efficient countermeasures. Cyber-attack attribution involves identifying the attacker responsible for a cyber-attack and is an essential step in allowing cybersecurity experts to take attacker-oriented countermeasures and pursue legal actions.

This project is a **web-based Question-Answering (QA) application** aimed at assisting cybersecurity professionals in investigating cyber-attacks and attributing them to attackers. The application leverages **Retrieval-Augmented Generation (RAG)** techniques along with a **Large Language Model (LLM)** to provide accurate answers to user queries based on:
1. A **Knowledge Base (KB)** containing curated information about cyber-attacks, investigations, and attribution.
2. External resources provided by the user.

## Features
- **Named Entity Recognition (NER):** Automatically identifies key entities in text related to cyber-attacks.
- **Question-Answering (QA) System:** Responds to user queries using RAG-based techniques and an LLM.
- **Frontend Interface:** A simple, user-friendly interface for interacting with the QA system.
- **Secure:** Added support for JWT based authentication.

## Tech Stack
- **Frontend:**
  - React, HTML, CSS, JavaScript
- **Backend:**
  - Express for handling server requests and serving data to frontend
  - Python
- **Database:**
  - MongoDB: Storing and managing user data and conversations.
  

### Running the project locally
1. ```git clone https://github.com/TheMajesticWolf/CyberDetective.git```
2. ```cd backend```
3. ```echo -e "MONGO_URI={Your MongoDB URI}\nACCESS_TOKEN_SECRET={random string}\nREFRESH_TOKEN_SECRET={random string}" > .env```
4. ```npm i```
5. ```npm start```
6. ```cd ../frontend```
7. ```npm i```
8. ```npm start```

## References
- [AttackER: Towards Enhancing Cyber-Attack Attribution with a Named Entity Recognition Dataset](https://arxiv.org/pdf/2408.05149v1)
- [A RAG-Based Question-Answering Solution for Cyber-Attack Investigation and Attribution](https://arxiv.org/pdf/2408.06272)
- [AttackER dataset](https://zenodo.org/records/10276922)
- [Question Answer Pairs for RAG](https://github.com/sampathrajapaksha/RAG-based-QA)


