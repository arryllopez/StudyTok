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
    <Card className="w-80 h-96 flex flex-col justify-between">
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">Question:</h3>
          <p>{question}</p>
        </div>
        {showAnswer && (
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </CardContent>
      <div className="p-4">
        <Button className="w-full" onClick={() => setShowAnswer(!showAnswer)}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </div>
    </Card>
  )
}

