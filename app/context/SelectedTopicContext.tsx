"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

export interface Topic {
  id: string;
  name: string;
  flashcards: FlashCard[];
}

type SelectedTopicContextType = {
  selectedTopic: string | null
  setSelectedTopic: (topic: string | null) => void
}

const SelectedTopicContext = createContext<SelectedTopicContextType | undefined>(undefined)

export function SelectedTopicProvider({ children }: { children: ReactNode }) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  return (
    <SelectedTopicContext.Provider value={{ selectedTopic, setSelectedTopic }}>
      {children}
    </SelectedTopicContext.Provider>
  )
}

export function useSelectedTopic() {
  const context = useContext(SelectedTopicContext)
  if (context === undefined) {
    throw new Error("useSelectedTopic must be used within a SelectedTopicProvider")
  }
  return context
} 