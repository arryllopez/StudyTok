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
        model="gemini-2.0-flash", contents=f"Generate 5 flashcard questions based on {topic}, make sure it is in this format Question: .... new line Answer:..."
    )

    flashcards = []
    if response and response.text:
        content = response.text.strip().split("\n")
        
        # Parse the content based on 'Question:' and 'Answer:'
        question = None
        for line in content:
            line = line.strip()
            
            if line.startswith("Question:"):
                question = line[len("Question:"):].strip()  # Extract the question
            elif line.startswith("Answer:") and question is not None:
                answer = line[len("Answer:"):].strip()  # Extract the answer
                flashcards.append({"question": question, "answer": answer})
                question = None  # Reset question for the next pair

    return flashcards

@app.route("/get-flashcards/<topic>", methods=["GET"])
def get_flashcards(topic):
    # Generate flashcards based on topic
    flashcards = generate_flashcards(topic)
    return jsonify(flashcards)

if __name__ == "__main__":
    app.run(debug=True)
