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
    prompt = (
        f"Generate {num_questions} flashcard questions based on '{topic}'. "
        "Each flashcard should follow this format:\n"
        "Question: <the question text>\n"
        "Answer: <the answer text>\n"
        "Ensure each question-answer pair is separated by a new line."
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    
    flashcards = []
    if response and response.text:
        response_text = response.text.strip()
        # Split the text by "Question:".
        segments = response_text.split("Question:")
        # The first segment could be an empty string or intro text, so skip it.
        for seg in segments[1:]:
            if "Answer:" in seg:
                parts = seg.split("Answer:", 1)
                question_text = parts[0].strip()
                answer_text = parts[1].strip()
                if question_text and answer_text:
                    flashcards.append({"question": question_text, "answer": answer_text})
    return flashcards

@app.route("/get-flashcards/<topic>", methods=["GET"])
def get_flashcards(topic):
    # Get the number of questions from the query parameters (defaults to 5 if not provided)
    num_questions = request.args.get("num_questions", default=5, type=int)
    flashcards = generate_flashcards(topic, num_questions)
    return jsonify(flashcards)

if __name__ == "__main__":
    app.run(debug=True)
