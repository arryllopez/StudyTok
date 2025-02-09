from google.cloud import speech

def list_speech_features():
    client = speech.SpeechClient()
    # This is just a simple call to verify that our client is working.
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )
    # Create an empty audio object (for testing, this won't perform actual transcription)
    audio = speech.RecognitionAudio(content=b"")

    try:
        response = client.recognize(config=config, audio=audio)
        print("API call successful.")
    except Exception as err:
        print("Error during API call:", err)

if __name__ == "__main__":
    list_speech_features() 