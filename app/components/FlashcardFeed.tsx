"use client" 

import { useEffect, useState } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardFeed() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch flashcards from the Flask backend
    const fetchFlashcards = async () => {
      const response = await fetch("http://127.0.0.1:5000/get-flashcards/math");
      const data = await response.json();
      setFlashcards(data);
    };
    
    fetchFlashcards();
  }, []);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (event.deltaY > 0 && currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

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
  );
}