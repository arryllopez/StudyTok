"use client";

import { useState } from "react";
import TopicManagerSidebar, { Topic } from "./components/TopicManagerSidebar";
import FlashcardFeed from "./components/FlashcardFeed";
import { Button } from "@/components/ui/button";
import { Maximize } from "lucide-react";
import RecordingIndicator from "./components/RecordingIndicator";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const startRecording = async () => {
    // Determine expected input from the current flashcard answer (if available)
    const expectedInput =
      selectedTopic && selectedTopic.questions[currentIndex]
        ? selectedTopic.questions[currentIndex].answer
        : "N/A";
    console.log("Recording initiated. Expected input:", expectedInput);

    setIsRecording(true);

    try {
      // Send expected input to the /check-answer endpoint.
      const formData = new FormData();
      formData.append("expected", expectedInput);

      const response = await fetch("http://127.0.0.1:5001/check-answer", {
        method: "POST",
        body: formData,
      });
      const { transcript, is_correct } = await response.json();
      console.log("Recording complete. Heard input:", transcript);
      setFeedback(is_correct ? "correct" : "incorrect");
    } catch (error) {
      console.error("Error during voice check:", error);
    }

    setIsRecording(false);

    // Remove feedback overlay after 2 seconds
    setTimeout(() => {
      setFeedback(null);
    }, 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <TopicManagerSidebar onTopicSelect={setSelectedTopic} />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 right-4 z-50">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Feedback overlay */}
        {feedback && (
          <div
            className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${
              feedback === "correct" ? "bg-green-500 opacity-50" : "bg-red-500 opacity-50"
            }`}
          ></div>
        )}

        {isRecording && <RecordingIndicator isRecording={isRecording} />}
        {selectedTopic ? (
          <FlashcardFeed flashcards={selectedTopic.questions} setCurrentIndex={setCurrentIndex} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-lg">Select a topic to view flashcards</p>
          </div>
        )}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <Button onClick={startRecording} disabled={isRecording}>
            {isRecording ? "Recording..." : "Speak Answer"}
          </Button>
        </div>
      </main>
    </div>
  );
}