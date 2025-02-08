#processing datasets into CSV with columns topic, question, answer
# download_dataset.py
# download_dataset.py
import pandas as pd
from datasets import load_dataset

# Load the SQuAD dataset
dataset = load_dataset("squad")

# Prepare the data into the required format: topic, question, answer
formatted_data = []

for example in dataset["train"]:
    topic = example["title"]  # Article title as the topic
    question = example["question"]
    answer = example["answers"]["text"][0]  # First answer from the list
    
    formatted_data.append({"topic": topic, "question": question, "answer": answer})

# Convert the list into a pandas DataFrame
df = pd.DataFrame(formatted_data)

# Save to CSV
df.to_csv('squad_train.csv', index=False)

print("Dataset has been saved as 'squad_train.csv'")

