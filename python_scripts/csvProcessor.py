#processing datasets into CSV with columns topic, question, answer
# download_dataset.py
from datasets import load_dataset

# Load the SQuAD dataset (or any dataset you're using)
dataset = load_dataset("squad")

# Print the structure of a sample entry from the training split
print(dataset["train"][0])  # This will print the first example in the training split
