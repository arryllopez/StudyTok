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
        <div className="absolute top-4 left-4 z-10">
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
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <FlashcardFeed flashcards={flashcards} />
        )}
      </main>
    </div>
  )
}

