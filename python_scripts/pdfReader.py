#trying to import a pdf reader so that it can generate flashcard questions based on the pdf
#using pre trained t5-small model from Hugging Face, not sure about t-5 large due to computer hardware limitations

from transformers import T5ForConditionalGeneration, T5Tokenizer

# Load the T5 model and tokenizer
model_name = "t5-large"  # You can use "t5-base" or "t5-large" for better performance
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)


#extracting text from the pdf (for now will just use relative path, will figure out a way to allow user to upload the pdf) 
import PyPDF2 

def extractTextFromPdf(pdfToBeScanned):
    with open(pdfToBeScanned, "rb") as file:
        reader = PyPDF2.PdfReader(file) 
        text = "" 
        for page in reader.pages:
            text+=page.extract_text()
    return text 

#summarizing the extracted text using the T5 Model from hugging face
def summarize_text(text, max_length=150):
    input_text = "summarize: " + text
    inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(inputs, max_length=max_length, min_length=30, length_penalty=2.0, num_beams=4, early_stopping=True)
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary


def generate_questions(text, num_questions=5):
    questions = []
    for _ in range(num_questions):
        input_text = "generate question: " + text
        inputs = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        question_ids = model.generate(inputs, max_length=50, num_beams=4, early_stopping=True)
        question = tokenizer.decode(question_ids[0], skip_special_tokens=True)
        questions.append(question)
    return questions



def process_pdf(pdf_path):
    # Step 1: Extract text from PDF
    text = extractTextFromPdf(pdf_path)
    
    # Step 2: Summarize the text
    summary = summarize_text(text)
    
    # Step 3: Generate flashcard questions
    questions = generate_questions(summary)
    
    return summary, questions

# Example usage
pdf_path = r"C:\Users\arryl\Desktop\tiktok-style-flashcards\python_scripts\assets\dog.pdf"
summary, questions = process_pdf(pdf_path)

print("Summary:")
print(summary)

print("\nFlashcard Questions:")
for i, question in enumerate(questions, 1):
    print(f"{i}. {question}")