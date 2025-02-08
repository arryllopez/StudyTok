"use client"

import { useState } from "react"
import Flashcard from "./Flashcard"

const mockFlashcards = [
  { id: 1, question: "What is the capital of France?", answer: "Paris" },
  { id: 2, question: 'Who wrote "Romeo and Juliet"?', answer: "William Shakespeare" },
  { id: 3, question: "What is the largest planet in our solar system?", answer: "Jupiter" },
  { id: 4, question: "What is the chemical symbol for gold?", answer: "Au" },
  { id: 5, question: "In which year did World War II end?", answer: "1945" },
]

export default function FlashcardFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && currentIndex < mockFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="h-full overflow-hidden" onWheel={handleScroll}>
      <div
        className="h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {mockFlashcards.map((flashcard) => (
          <div key={flashcard.id} className="h-full flex items-center justify-center">
            <Flashcard question={flashcard.question} answer={flashcard.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}

