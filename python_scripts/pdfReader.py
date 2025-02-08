import PyPDF2
from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def generate_questions_and_answers(text, num_questions=5):
    # Load pre-trained T5 model and tokenizer
    model_name = "t5-base"
    tokenizer = T5Tokenizer.from_pretrained(model_name)
    model = T5ForConditionalGeneration.from_pretrained(model_name)

    # Prepare the text for question generation
    max_length = 512
    chunks = [text[i:i+max_length] for i in range(0, len(text), max_length)]

    questions_and_answers = []

    for chunk in chunks:
        if len(questions_and_answers) >= num_questions:
            break

        # Generate question
        input_text = f"generate question: {chunk}"
        input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        question_ids = model.generate(input_ids, max_length=64, num_return_sequences=1, no_repeat_ngram_size=2, top_k=50, top_p=0.95)
        question = tokenizer.decode(question_ids[0], skip_special_tokens=True)

        # Generate answer
        input_text = f"answer question: {question} context: {chunk}"
        input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        answer_ids = model.generate(input_ids, max_length=128, num_return_sequences=1, no_repeat_ngram_size=2, top_k=50, top_p=0.95)
        answer = tokenizer.decode(answer_ids[0], skip_special_tokens=True)

        questions_and_answers.append((question, answer))

    return questions_and_answers

def main(pdf_path):
    # Extract text from PDF
    text = extract_text_from_pdf(pdf_path)

    # Generate questions and answers
    qa_pairs = generate_questions_and_answers(text)

    # Print questions and answers
    for i, (question, answer) in enumerate(qa_pairs, 1):
        print(f"Question {i}: {answer}")
        print(f"Answer {i}: {question}")
        print()

if __name__ == "__main__":
    pdf_path = r"C:\Users\arryl\Desktop\tiktok-style-flashcards\python_scripts\assets\dog.pdf"
    main(pdf_path)