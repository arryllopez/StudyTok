import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

type Question = {
  question: string
  answer: string
}

export type Topic = {
  id: string
  name: string
  questions: Question[]
  method: "auto" | "manual"
}

interface TopicManagerSidebarProps {
  onTopicSelect: (topic: Topic) => void
}

export default function TopicManagerSidebar({ onTopicSelect }: TopicManagerSidebarProps) {
  const [topics, setTopics] = useState<Topic[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createMode, setCreateMode] = useState<"generate" | "manual">("generate")
  const [newTopicName, setNewTopicName] = useState("")
  const [numQuestions, setNumQuestions] = useState(5)
  const [manualQuestions, setManualQuestions] = useState<Question[]>([])
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

  const resetModalFields = () => {
    setNewTopicName("")
    setNumQuestions(5)
    setManualQuestions([])
    setCreateMode("generate")
  }

  const handleGenerate = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-flashcards/${newTopicName}?num_questions=${numQuestions}`)
      const data = await response.json()
      const newTopic: Topic = {
        id: Date.now().toString(),
        name: newTopicName,
        questions: data,
        method: "auto",
      }
      setTopics((prev) => [...prev, newTopic])
      setIsCreateModalOpen(false)
      resetModalFields()
    } catch (error) {
      console.error("Error generating flashcards", error)
    }
  }

  const handleSaveManual = () => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      name: newTopicName,
      questions: manualQuestions,
      method: "manual",
    }
    setTopics((prev) => [...prev, newTopic])
    setIsCreateModalOpen(false)
    resetModalFields()
  }

  const handleDeleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((topic) => topic.id !== id))
  }

  const handleEditTopicSave = (updatedTopic: Topic) => {
    setTopics((prev) => prev.map((topic) => (topic.id === updatedTopic.id ? updatedTopic : topic)))
    setEditingTopic(null)
  }

  const addManualQuestion = () => {
    setManualQuestions((prev) => [...prev, { question: "", answer: "" }])
  }

  return (
    <div className="w-80 bg-background border-r border-border shadow-lg p-6 space-y-6">
    
      <div className="flex justify-center mb-4">
        <img
          src="/sidebarlogo.png" 
          alt="Study App Logo"
          className="w-50 h-50" 
        />
      </div>

      <Button onClick={() => setIsCreateModalOpen(true)} className="w-full" size="lg">
        New Topic
      </Button>

      <div className="space-y-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {topic.questions.length} Question{topic.questions.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="secondary" onClick={() => onTopicSelect(topic)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingTopic(topic)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTopic(topic.id)}
                    className="ml-auto"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Create New Topic</h2>
            <Label htmlFor="topicName">Topic Name:</Label>
            <Input
              id="topicName"
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Enter topic name"
            />

            {createMode === "generate" ? (
              <>
                <Label htmlFor="numQuestions" className="mt-4">
                  Number of Questions:
                </Label>
                <Input
                  id="numQuestions"
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  placeholder="e.g., 5"
                />
                <div className="flex justify-between mt-4">
                  <Button onClick={handleGenerate}>Generate</Button>
                  <Button variant="outline" onClick={() => setCreateMode("manual")}>
                    Add Manually
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <h3 className="font-semibold">Questions &amp; Answers</h3>
                  {manualQuestions.map((q, index) => (
                    <div key={index} className="mt-2 border p-2 rounded">
                      <Input
                        value={q.question}
                        onChange={(e) => {
                          const updated = [...manualQuestions]
                          updated[index].question = e.target.value
                          setManualQuestions(updated)
                        }}
                        placeholder="Question"
                        className="mb-2"
                      />
                      <Input
                        value={q.answer}
                        onChange={(e) => {
                          const updated = [...manualQuestions]
                          updated[index].answer = e.target.value
                          setManualQuestions(updated)
                        }}
                        placeholder="Answer"
                      />
                    </div>
                  ))}
                  <Button className="mt-2" onClick={addManualQuestion}>
                    Add Question
                  </Button>
                </div>
                <div className="flex justify-between mt-4">
                  <Button onClick={handleSaveManual}>Save Questions</Button>
                  <Button variant="outline" onClick={() => setCreateMode("generate")}>
                    Switch to Generate
                  </Button>
                </div>
              </>
            )}
            <div className="mt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetModalFields()
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {editingTopic && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Edit Topic: {editingTopic.name}</h2>
            <Label htmlFor="editTopicName">Topic Name:</Label>
            <Input
              id="editTopicName"
              value={editingTopic.name}
              onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
              placeholder="Enter topic name"
            />
            <div className="mt-4">
              <h3 className="font-semibold">Questions &amp; Answers</h3>
              {editingTopic.questions.map((q, index) => (
                <div key={index} className="mt-2 border p-2 rounded">
                  <Input
                    value={q.question}
                    onChange={(e) => {
                      const updatedQuestions = [...editingTopic.questions]
                      updatedQuestions[index].question = e.target.value
                      setEditingTopic({ ...editingTopic, questions: updatedQuestions })
                    }}
                    placeholder="Question"
                    className="mb-2"
                  />
                  <Input
                    value={q.answer}
                    onChange={(e) => {
                      const updatedQuestions = [...editingTopic.questions]
                      updatedQuestions[index].answer = e.target.value
                      setEditingTopic({ ...editingTopic, questions: updatedQuestions })
                    }}
                    placeholder="Answer"
                  />
                </div>
              ))}
              <Button
                className="mt-2"
                onClick={() =>
                  setEditingTopic({
                    ...editingTopic,
                    questions: [...editingTopic.questions, { question: "", answer: "" }],
                  })
                }
              >
                Add Question
              </Button>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button onClick={() => editingTopic && handleEditTopicSave(editingTopic)}>Save</Button>
              <Button variant="ghost" onClick={() => setEditingTopic(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

