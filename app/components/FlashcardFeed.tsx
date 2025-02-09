"use client"

import Flashcard from "./Flashcard"

interface FlashcardFeedProps {
  flashcards: any[]
  currentIndex: number
  setCurrentIndex: (index: number) => void
}

export default function FlashcardFeed({ flashcards, currentIndex, setCurrentIndex }: FlashcardFeedProps) {
  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && currentIndex < flashcards.length - 1) {
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
        {flashcards.map((flashcard, index) => (
          <div key={index} className="h-full flex items-center justify-center">
            <Flashcard question={flashcard.question} answer={flashcard.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}
