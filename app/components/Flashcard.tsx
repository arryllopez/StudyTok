"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface FlashcardProps {
  question: string
  answer: string
}

export default function Flashcard({ question, answer }: FlashcardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Card className="w-full h-full max-w-4xl mx-auto flex flex-col justify-between shadow-lg">
      <CardContent className="flex flex-col items-center justify-center h-full p-8">
        <div className="text-center mb-8 w-full">
          <h3 className="text-3xl font-semibold mb-4">Question:</h3>
          <p className="text-xl">{question}</p>
        </div>
        {showAnswer && (
          <div className="text-center mt-8 w-full">
            <h3 className="text-3xl font-semibold mb-4">Answer:</h3>
            <p className="text-xl">{answer}</p>
          </div>
        )}
      </CardContent>
      <div className="p-6">
        <Button className="w-full text-lg py-6" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </div>
    </Card>
  )
}

