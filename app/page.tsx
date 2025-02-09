"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import FlashcardFeed from "./components/FlashcardFeed"
import { Button } from "@/components/ui/button"
import { Maximize } from "lucide-react"


export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [topic, setTopic] = useState("math")
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)

  const fetchFlashcards = async (currentTopic: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-flashcards/${currentTopic}`)
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error("Error fetching flashcards", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const startRecording = async () => {
    if (!flashcards.length) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      let chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/wav" })
        const formData = new FormData()
        formData.append("audio", blob, "recording.wav")
        // Use the first flashcard's answer as the "expected" answer.
        formData.append("expected", flashcards[0].answer)

        try {
          // This URL points to your Python server's /check-answer endpoint running on port 5001.
          const res = await fetch("http://127.0.0.1:5001/check-answer", {
            method: "POST",
            body: formData,
          })
          const result = await res.json()
          if (result.is_correct) {
            setFeedback("correct")
          } else {
            setFeedback("incorrect")
          }
        } catch (error) {
          console.error("Error checking answer", error)
        }
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        // Remove the feedback overlay after 1 second.
        setTimeout(() => setFeedback(null), 1000)
      }

      setIsRecording(true)
      mediaRecorder.start()

      // Automatically stop recording after 3 seconds.
      setTimeout(() => {
        if (mediaRecorder.state !== "inactive") {
          mediaRecorder.stop()
        }
      }, 3000)
    } catch (error) {
      console.error("Error accessing microphone", error)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        topic={topic}
        setTopic={setTopic}
        onGenerateFlashcards={() => fetchFlashcards(topic)}
      />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-50">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-50">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Feedback overlay with lower z-index */}
        {feedback && (
          <div
            className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-500 ${
              feedback === "correct" ? "bg-green-500 opacity-50" : "bg-red-500 opacity-50"
            }`}
          ></div>
        )}

        <div className="relative z-30 h-full">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <FlashcardFeed flashcards={flashcards} />
          )}
        </div>

        {flashcards.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
            <Button onClick={startRecording} disabled={isRecording}>
              {isRecording ? "Recording..." : "Speak Answer"}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

