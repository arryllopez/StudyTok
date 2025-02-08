"use client"

import { useState, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SelectedTopicContext, Topic } from "@/context/SelectedTopicContext"

interface FlashCard {
  id: string
  question: string
  answer: string
}

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const { selectedTopic, setSelectedTopic } = useContext(SelectedTopicContext)
  const [newTopicName, setNewTopicName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [aiCardCount, setAiCardCount] = useState(5)
  const [isEditing, setIsEditing] = useState(false)

  const createNewTopic = () => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName,
      flashcards: []
    }
    setTopics([...topics, newTopic])
    setSelectedTopic(newTopic)
    setNewTopicName("")
    setIsCreating(true)
  }

  const deleteTopic = (topicId: string) => {
    setTopics(topics.filter(t => t.id !== topicId))
    setSelectedTopic(null)
  }

  const addFlashcard = (question: string, answer: string) => {
    if (!selectedTopic) return
    const newCard: FlashCard = {
      id: Date.now().toString(),
      question,
      answer
    }
    const updatedTopic = {
      ...selectedTopic,
      flashcards: [...selectedTopic.flashcards, newCard]
    }
    setTopics(topics.map(t => t.id === selectedTopic.id ? updatedTopic : t))
    setSelectedTopic(updatedTopic)
  }

  const deleteFlashcard = (cardId: string) => {
    if (!selectedTopic) return
    const updatedTopic = {
      ...selectedTopic,
      flashcards: selectedTopic.flashcards.filter(card => card.id !== cardId)
    }
    setTopics(topics.map(t => t.id === selectedTopic.id ? updatedTopic : t))
    setSelectedTopic(updatedTopic)
  }

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
        <h2 className="text-lg font-semibold mb-4">Topics</h2>
        
        <div className="space-y-2 mb-4">
          <Input
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="New topic name"
          />
          <Button className="w-full" onClick={createNewTopic}>
            Create Topic
          </Button>
        </div>

        <div className="space-y-2">
          {topics.map(topic => (
            <div key={topic.id} className="flex items-center justify-between p-2 border rounded">
              <button
                className="flex-1 text-left"
                onClick={() => {
                  setSelectedTopic(topic)
                  setIsEditing(true)
                }}
              >
                {topic.name}
              </button>
              <Button variant="destructive" size="sm" onClick={() => deleteTopic(topic.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTopic?.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <Button onClick={() => setIsCreating(true)}>Add Manual Card</Button>
                <Button onClick={() => {/* Implement AI generation */}}>Generate AI Cards</Button>
              </div>

              {selectedTopic?.flashcards.map(card => (
                <div key={card.id} className="border p-4 rounded space-y-2">
                  <div className="flex justify-between">
                    <h3>Question:</h3>
                    <Button variant="destructive" size="sm" onClick={() => deleteFlashcard(card.id)}>
                      Delete
                    </Button>
                  </div>
                  <Textarea defaultValue={card.question} />
                  <h3>Answer:</h3>
                  <Textarea defaultValue={card.answer} />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Flashcard</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Textarea id="question" />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea id="answer" />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                <Button onClick={() => {
                  const question = (document.getElementById('question') as HTMLTextAreaElement).value
                  const answer = (document.getElementById('answer') as HTMLTextAreaElement).value
                  addFlashcard(question, answer)
                  setIsCreating(false)
                }}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

