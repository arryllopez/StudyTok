# we will be leveraging the pre trained models from hugging face to generate q and a questions regarding certain context the user can input
# leveraging pipeline 
# the flow of use cases could look like
# user has notes --> copy paste into textbox --> ai models will generate a select amount of flashcard q and as based on the main points of the text

from transformers import pipeline  

# Load summarization model (BART)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Load question generation model (T5)
qg_pipeline = pipeline("text2text-generation", model="valhalla/t5-base-qg-hl")  

# Load question answering model (RoBERTa)
qa_pipeline = pipeline("question-answering", model="deepset/roberta-base-squad2")  

#chatgpt generated essay on dogs, this can be the user inputted notes 
long_text = """ 
Dogs have been human companions for thousands of years. They were domesticated from wolves and have evolved into various breeds, each suited for different tasks. 
Some dogs are working animals, assisting in hunting, herding, or even detecting diseases. Others are loyal pets, providing companionship and emotional support.

Dogs communicate through barking, body language, and facial expressions. They have an exceptional sense of smell, allowing them to detect drugs, bombs, and even medical conditions like cancer. 
Their intelligence varies by breed, but most dogs can be trained to follow commands and perform specific tasks.

In recent years, therapy dogs have become popular in hospitals and nursing homes, helping patients cope with stress and anxiety. 
Some dogs are trained as guide dogs for the visually impaired, while others assist law enforcement in search and rescue missions.

"""
summary_output = summarizer(long_text, max_length=100, min_length=50, do_sample=False)
summary = summary_output[0]['summary_text']

print("Summary:", summary)


question_output = qg_pipeline(f"generate question: {summary}")
question = question_output[0]['generated_text']

print("Generated Question:", question)

answer_output = qa_pipeline(question=question, context=long_text)
answer = answer_output['answer']

print("Extracted Answer:", answer)
