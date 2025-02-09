from transformers import pipeline
import random

# Load models
summarizer = pipeline("summarization", model="pszemraj/led-large-book-summary")
qg_pipeline = pipeline("text2text-generation", model="mrm8488/t5-base-finetuned-question-generation-ap")
qa_pipeline = pipeline("question-answering", model="deepset/bert-large-uncased-whole-word-masking-squad2")

# User inputted notes
long_text = """ 
Dogs have been human companions for thousands of years. They were domesticated from wolves and have evolved into various breeds, each suited for different tasks. 
Some dogs are working animals, assisting in hunting, herding, or even detecting diseases. Others are loyal pets, providing companionship and emotional support.

Dogs communicate through barking, body language, and facial expressions. They have an exceptional sense of smell, allowing them to detect drugs, bombs, and even medical conditions like cancer. 
Their intelligence varies by breed, but most dogs can be trained to follow commands and perform specific tasks.

In recent years, therapy dogs have become popular in hospitals and nursing homes, helping patients cope with stress and anxiety. 
Some dogs are trained as guide dogs for the visually impaired, while others assist law enforcement in search and rescue missions.
"""

# Step 1: Generate multiple summaries
summary_outputs = summarizer(long_text, max_length=100, min_length=50, do_sample=True, num_return_sequences=3)
summaries = [output['summary_text'] for output in summary_outputs]

# Step 2: Randomly select a summary
selected_summary = random.choice(summaries)

# Step 3: Generate multiple questions
num_questions_to_generate = 5
question_outputs = qg_pipeline(
    f"generate question: {selected_summary}",
    do_sample=True,
    temperature=0.7,
    top_k=50,
    num_return_sequences=num_questions_to_generate
)
# Generate multiple Q&A pairs
num_pairs = 5
qa_pairs = []

for _ in range(num_pairs):
    # Randomly select a summary
    selected_summary = random.choice(summaries)

    # Generate multiple questions
    question_outputs = qg_pipeline(
        f"generate question: {selected_summary}",
        do_sample=True,
        temperature=0.7,
        top_k=50,
        num_return_sequences=num_questions_to_generate
    )

    # Randomly select a question
    selected_question = random.choice(question_outputs)['generated_text']

    # Extract an answer
    answer_output = qa_pipeline(question=selected_question, context=long_text)
    answer = answer_output['answer']

    # Store the Q&A pair
    qa_pairs.append({"question": selected_question, "answer": answer})

# Print all Q&A pairs
for i, qa in enumerate(qa_pairs, 1):
    print(f"Question: {qa['question']}")
    print(f"Answer: {qa['answer']}")
    print()