#processing datasets into CSV with columns topic, question, answer
# download_dataset.py
import pandas as pd
from datasets import load_dataset

# Load the SQuAD dataset
dataset = load_dataset("squad")

# Prepare the data into the required format: topic, question, answer
formatted_data = []

for example in dataset["train"]:
    topic = example["title"]  # Article title can be used as the topic
    for qa in example["paragraphs"]:
        for qa_pair in qa["qas"]:
            question = qa_pair["question"]
            answer = qa_pair["answers"][0]["text"]  # Take the first answer (usually correct)
            formatted_data.append({"topic": topic, "question": question, "answer": answer})

# Convert the list into a pandas DataFrame
df = pd.DataFrame(formatted_data)

# Save to CSV
df.to_csv('squad_train.csv', index=False)

print("Dataset has been saved as 'squad_train.csv'")
