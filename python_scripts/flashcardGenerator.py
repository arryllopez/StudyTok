#using openAI api to generate flashcard questions based on a general topic inputted by the user

#"Due to the broad range of topics in the world, 
# training an AI model was found to be difficult due to the shortage of 
# sufficient datasets that cover all possible topics in the world"

#trying gemini api
import os
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_SPEECH"))


# Define route for generating flashcards
def generate_flashcards(topic, num_questions=5):
    # Create a dynamic prompt based on the user input number of questions
    prompt = (
        f"Generate {num_questions} flashcard questions based on '{topic}'. "
        "Each flashcard should follow this format: \n"
        "Question: <the question text>\n"
        "Answer: <the answer text>\n"
        "Provide each question-answer pair on separate lines."
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    flashcards = []
    if response and response.text:
        content = response.text.strip().split("\n")
        question = None
        for line in content:
            line = line.strip()
            if line.startswith("Question:"):
                question = line[len("Question:"):].strip()
            elif line.startswith("Answer:") and question is not None:
                answer = line[len("Answer:"):].strip()
                flashcards.append({"question": question, "answer": answer})
                question = None  # Reset for the next pair
    return flashcards

@app.route("/get-flashcards/<topic>", methods=["GET"])
def get_flashcards(topic):
    # Get the number of questions from the query parameters (defaults to 5 if not provided)
    num_questions = request.args.get("num_questions", default=5, type=int)
    flashcards = generate_flashcards(topic, num_questions)
    return jsonify(flashcards)

if __name__ == "__main__":
    app.run(debug=True)
