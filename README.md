@@ -1,14 +1,65 @@
<h1 align="center" id="title">StudyTok</h1>

# HackHive 2025: StudyTok
<p id="description">This is a Next.js project helping students effectively study with active recall. This app is an AI-powered scroll-based learning for an engaging study experience. Upload your own questions or use AI-generated ones for personalized learning. Voice recognition lets users answer aloud and get instant AI feedback. Active recall and real-time analysis improve retention and understanding. Transforms studying into an interactive social media-style experience.</p>

Setup Instructions:
  
  
<h2>🧐 Features</h2>

To set up and run our AI-powered study platform, first install the required Python dependencies by running pip install google flask flask-cors python-dotenv, followed by pip install transformers and pip install sounddevice numpy flask flask-cors google-cloud-speech google-auth python-dotenv scipy fuzzywuzzy. Next, navigate to your project folder and install Node.js dependencies using npm install. Once installed, start the development server with npm run dev, then access the platform at http://localhost:3000/. For AI-generated flashcards, navigate to the python_scripts folder and run python flashcardGenerator.py. To enable voice recognition for spoken answers, run python voiceChecker.py in the same folder. Ensure all required libraries are installed before running the scripts. Once everything is set up, explore the platform’s features, generate AI-powered flashcards, and enjoy an interactive, voice-enabled study experience! 
Here're some of the project's best features:

*   AI Flashcard Generation
*   Organize Flashcards by Topic
*   Speech Recognition
*   More to come...

<h2>🛠️ Installation Steps:</h2>

About StudyTok:
<p>1. To get started first clone the repository and setup the working environment</p>

StudyTok is an AI-powered, scroll-based learning platform designed for maximum engagement. Users can upload their own questions or leverage AI-generated ones for personalized study sessions. Voice recognition enables spoken answers with instant AI feedback, enhancing active recall and comprehension. Real-time analysis helps track progress and optimize learning. By blending education with a social media-style interface, this platform transforms studying into an interactive and dynamic experience
```
git clone https://github.com/arryllopez/StudyTok
```

```
npm install
```

<p>3. Setup your API Key (or email support)</p>

```
make a .env file and paste in your API Key!
```

<p>4. Make a new terminal and switch to the python_scripts directory and boot up the Flask servers</p>

```
cd python_scripts
```

```
python flashcardGenerator.py
```

```
python voiceChecker.py
```

<p>7. Run the application with:</p>

```
npm run dev
```

  
  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Next.js
*   Google Cloud Speech-to-Text API
*   Gemini 2.0 API
*   Flask
*   React
*   Tailwind CSS


<h2>🧐 Features</h2>

Here're some of the project's best features:

*   AI Flashcard Generation
*   Organize Flashcards by Topic
*   Speech Recognition
*   More to come...

