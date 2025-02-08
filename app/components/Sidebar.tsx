"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [topic, setTopic] = useState("")

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <Button variant="ghost" className="mb-4" onClick={() => setOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
        <h2 className="text-lg font-semibold mb-4">Flashcard Topic</h2>
        <div className="space-y-2">
          <Label htmlFor="topic">Enter a topic:</Label>
          <Input id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., JavaScript" />
          <Button className="w-full" onClick={() => console.log("Generate flashcards for:", topic)}>
            Generate Flashcards
          </Button>
        </div>
      </div>
    </div>
  )
}

