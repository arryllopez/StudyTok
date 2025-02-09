"use client"

import { useState, type React } from "react"
import Flashcard from "./Flashcard"

interface FlashcardData {
  id: string
  question: string
  answer: string
}

interface FlashcardFeedProps {
  flashcards: FlashcardData[]
}

export default function FlashcardFeed({ flashcards }: FlashcardFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!flashcards || flashcards.length === 0) return

    if (event.deltaY > 0 && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="text-xl text-gray-500">No flashcards available. Please select a topic or add questions.</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full overflow-hidden" onWheel={handleScroll}>
      <div
        className="h-full w-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {flashcards.map((flashcard, index) => (
          <div key={flashcard.id} className="h-full w-full flex items-center justify-center p-8">
            <Flashcard question={flashcard.question} answer={flashcard.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}

