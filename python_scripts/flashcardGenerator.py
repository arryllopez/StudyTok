#using openAI api to generate flashcard questions based on a general topic inputted by the user

#"Due to the broad range of topics in the world, 
# training an AI model was found to be difficult due to the shortage of 
# sufficient datasets that cover all possible topics in the world"

#trying gemini api
import os
from google import genai
from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Gemini client
client = genai.Client(api_key=os.getenv("API_KEY"))

# Define route for generating flashcards
def generate_flashcards(topic):
    # Request flashcard generation from Gemini API
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=f"Generate 5 flashcard questions based on {topic}"
    )

    flashcards = []
    if response and response.text:
        content = response.text.split("\n")
        for i in range(0, len(content), 2):  # Assuming questions and answers alternate
            question = content[i].strip()
            answer = content[i + 1].strip() if i + 1 < len(content) else ""
            flashcards.append({"question": question, "answer": answer})

    return flashcards

@app.route("/get-flashcards/<topic>", methods=["GET"])
def get_flashcards(topic):
    # Generate flashcards based on topic
    flashcards = generate_flashcards(topic)
    return jsonify(flashcards)

if __name__ == "__main__":
    app.run(debug=True)
