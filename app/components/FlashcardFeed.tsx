"use client"

import { useState } from "react"
import Flashcard from "./Flashcard"

interface FlashcardFeedProps {
  flashcards: any[]
  setCurrentIndex: (index: number) => void
}

export default function FlashcardFeed({ flashcards, setCurrentIndex }: FlashcardFeedProps) {
  const [currentIndex, setLocalIndex] = useState(0)

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && currentIndex < flashcards.length - 1) {
      const newIndex = currentIndex + 1
      setLocalIndex(newIndex)
      setCurrentIndex(newIndex)
    } else if (event.deltaY < 0 && currentIndex > 0) {
      const newIndex = currentIndex - 1
      setLocalIndex(newIndex)
      setCurrentIndex(newIndex)
    }
  }

  return (
    <div className="h-full overflow-hidden" onWheel={handleScroll}>
      <div
        className="h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {flashcards.map((flashcard, index) => (
          <div key={index} className="h-full flex items-center justify-center">
            <Flashcard question={flashcard.question} answer={flashcard.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}
