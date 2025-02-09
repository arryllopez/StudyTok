import os
import io
import sounddevice as sd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import speech
from google.oauth2 import service_account
from dotenv import load_dotenv
from scipy.io.wavfile import write
from fuzzywuzzy import fuzz
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

# Load Google Cloud credentials
credentials = service_account.Credentials.from_service_account_file("key.json")
speech_client = speech.SpeechClient(credentials=credentials)

# Audio settings
SAMPLE_RATE = 48000  # Match the config settings
CHANNELS = 1  # Mono audio
DURATION = 6  # Record for 5 seconds

def record_audio():
    """Captures real-time audio without waiting for the full duration."""
    print("[Recording...] Speak now!")

    audio_frames = []

    def callback(indata, frames, time, status):
        if status:
            print(f"Recording Error: {status}")
        audio_frames.append(indata.copy())

    with sd.InputStream(samplerate=SAMPLE_RATE, channels=CHANNELS, dtype=np.int16, callback=callback):
        sd.sleep(int(DURATION * 1000))  # Sleep in milliseconds while streaming audio

    # Convert to NumPy array and flatten
    audio_data = np.concatenate(audio_frames, axis=0)
    
    print("[Microphone Input Captured]")
    return audio_data.tobytes()

def clean_text(text):
    """Normalize text: lowercase, strip spaces, remove punctuation."""
    text = text.lower().strip()  # Lowercase and remove extra spaces
    text = re.sub(r"[^\w\s]", "", text)  # Remove punctuation
    return text

def check_similarity(transcript, expected_answer):
    """Check fuzzy similarity between cleaned texts."""
    cleaned_transcript = clean_text(transcript)
    cleaned_expected = clean_text(expected_answer)

    # Use the best possible fuzzy matching methods
    similarity = max(
        fuzz.ratio(cleaned_transcript, cleaned_expected),  # Standard ratio
        fuzz.token_sort_ratio(cleaned_transcript, cleaned_expected),  # Ignore word order
        fuzz.partial_ratio(cleaned_transcript, cleaned_expected),  # Partial matches
        fuzz.token_set_ratio(cleaned_transcript, cleaned_expected)  # Best for unordered sets
    )

    print(f"Transcript: {cleaned_transcript}")
    print(f"Expected: {cleaned_expected}")
    print(f"Similarity Score: {similarity}%")

    # Lower threshold for fuzzy matching, since the score is inherently lower for certain cases
    return similarity >= 80  # Tweak threshold if needed

@app.route("/check-answer", methods=["POST"])
def check_answer():
    expected_answer = request.form.get("expected", "").strip().lower()
    
    # Record and get audio bytes
    audio_content = record_audio()

    # Configure Google Cloud Speech API settings
    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=SAMPLE_RATE,
        language_code="en-US",
    )

    # Recognize speech
    response = speech_client.recognize(config=config, audio=audio)
    transcript = " ".join([result.alternatives[0].transcript for result in response.results]).strip().lower()

    print(f"[Mic Heard]: {transcript}")  # Log the raw transcription

    # Check similarity between transcript and expected answer
    is_correct = check_similarity(transcript, expected_answer)

    return jsonify({
        "transcript": transcript,
        "is_correct": is_correct
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)
