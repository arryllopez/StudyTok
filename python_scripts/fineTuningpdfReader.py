# # the fine tuning script for the pdfReader so that it better creates questions and answers 


# import torch
# from transformers import T5ForConditionalGeneration, T5Tokenizer, Trainer, TrainingArguments
# from datasets import load_dataset

# # Load the pre-trained model and tokenizer
# model_name = "t5-large"
# tokenizer = T5Tokenizer.from_pretrained(model_name)
# model = T5ForConditionalGeneration.from_pretrained(model_name)

# # Load your dataset
# dataset = load_dataset('csv', data_files='your_dataset.csv')

# # Preprocess the dataset
# def preprocess_function(examples):
#     inputs = [f"context: {text} question: {question}" for text, question in zip(examples['text'], examples['question'])]
#     targets = [f"answer: {answer}" for answer in examples['answer']]
    
#     model_inputs = tokenizer(inputs, max_length=512, truncation=True, padding="max_length")
#     labels = tokenizer(targets, max_length=64, truncation=True, padding="max_length")
    
#     model_inputs["labels"] = labels["input_ids"]
#     return model_inputs

# tokenized_datasets = dataset.map(preprocess_function, batched=True)

# # Define training arguments
# training_args = TrainingArguments(
#     output_dir="./results",
#     num_train_epochs=3,
#     per_device_train_batch_size=8,
#     per_device_eval_batch_size=8,
#     warmup_steps=500,
#     weight_decay=0.01,
#     logging_dir="./logs",
# )

# # Create Trainer instance
# trainer = Trainer(
#     model=model,
#     args=training_args,
#     train_dataset=tokenized_datasets["train"],
#     eval_dataset=tokenized_datasets["test"],
# )

# # Start training
# trainer.train()

# # Save the fine-tuned model
# model.save_pretrained("./fine_tuned_t5_qa")
# tokenizer.save_pretrained("./fine_tuned_t5_qa")


