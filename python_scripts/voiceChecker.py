import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import speech
from dotenv import load_dotenv
from google.oauth2 import service_account

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize the Google Cloud Speech client
credentials_path = service_account.Credentials.from_service_account_file('key.json')
speech_client = speech.SpeechClient(credentials=credentials_path)

@app.route("/check-answer", methods=["POST"])
def check_answer():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    expected_answer = request.form.get("expected", "").strip().lower()

    audio_content = audio_file.read()

    # Configure audio settings.
    # (This example assumes the recording is in LINEAR16 format at 16000 Hz.)
    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=48000,
        language_code="en-US",
    )

    response = speech_client.recognize(config=config, audio=audio)
    transcript = ""
    for result in response.results:
        transcript += result.alternatives[0].transcript

    transcription = transcript.strip().lower()
    is_correct = transcription == expected_answer

    return jsonify({
        "transcript": transcription,
        "is_correct": is_correct
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001) 