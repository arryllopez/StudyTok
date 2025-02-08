#using openAI api to generate flashcard questions based on a general topic inputted by the user

#"Due to the broad range of topics in the world, 
# training an AI model was found to be difficult due to the shortage of 
# sufficient datasets that cover all possible topics in the world"

#trying gemini api

from google import genai

client = genai.Client(api_key="AIzaSyD8yibqQ-JEYma-fQWzYQHCmNjg7jp2vXs")
response = client.models.generate_content(
    model="gemini-2.0-flash", contents="Generate 5 flashcard questions based on math"
)
print(response.text)