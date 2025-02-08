#since we are using a flashcard generation model, text-to-text models would work best 
import pandas as pd
from datasets import Dataset
from transformers import T5ForConditionalGeneration, T5Tokenizer, Trainer, TrainingArguments

# Load the dataset
df = pd.read_csv('OUR TRAINING DATASET HERE')
dataset = Dataset.from_pandas(df)

# Load the pre-trained model and tokenizer
model_name = "t5-small"
model = T5ForConditionalGeneration.from_pretrained(model_name)
tokenizer = T5Tokenizer.from_pretrained(model_name)

# Prepare the dataset
def preprocess_function(examples):
    inputs = [f"generate flashcard: {topic}" for topic in examples["topic"]]
    targets = [f"Q: {q} A: {a}" for q, a in zip(examples["question"], examples["answer"])]
    model_inputs = tokenizer(inputs, max_length=128, padding="max_length", truncation=True)
    labels = tokenizer(targets, max_length=128, padding="max_length", truncation=True)
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

tokenized_dataset = dataset.map(preprocess_function, batched=True)

# Define training arguments
training_args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir="./logs",
)

# Create Trainer instance
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
)

# Fine-tune the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained("./fine_tuned_flashcard_model")
tokenizer.save_pretrained("./fine_tuned_flashcard_model") 