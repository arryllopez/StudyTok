"use client"

import * as React from "react"
import { Plus, MoreVertical, Pencil, Trash } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Topic {
  id: string
  name: string
  questions: Array<{
    id: string
    question: string
    answer: string
  }>
}

export function AppSidebar() {
  const [topics, setTopics] = React.useState<Topic[]>([])
  const [isManualAdd, setIsManualAdd] = React.useState(false)
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null)
  const [newTopic, setNewTopic] = React.useState({
    name: "",
    notes: "",
    questionCount: "5",
  })
  const [questions, setQuestions] = React.useState<Array<{ question: string; answer: string }>>([])
  const [isNewTopicOpen, setIsNewTopicOpen] = React.useState(false)
  const [isEditTopicOpen, setIsEditTopicOpen] = React.useState(false)
  const [editingQuestions, setEditingQuestions] = React.useState<
    Array<{ id: string; question: string; answer: string }>
  >([])

  const resetNewTopicForm = () => {
    setNewTopic({
      name: "",
      notes: "",
      questionCount: "5",
    })
    setQuestions([])
    setIsManualAdd(false)
  }

  const handleAddTopic = async () => {
    if (isManualAdd) {
      // Add topic with manually entered questions
      const newTopicData: Topic = {
        id: Math.random().toString(),
        name: newTopic.name,
        questions: questions.map((q) => ({ ...q, id: Math.random().toString() })),
      }
      setTopics([...topics, newTopicData])
    } else {
      // Generate questions using AI based on notes
      // This is a placeholder - implement AI generation logic
      const generatedQuestions = Array(Number.parseInt(newTopic.questionCount))
        .fill(null)
        .map(() => ({
          id: Math.random().toString(),
          question: "Generated question",
          answer: "Generated answer",
        }))

      const newTopicData: Topic = {
        id: Math.random().toString(),
        name: newTopic.name,
        questions: generatedQuestions,
      }
      setTopics([...topics, newTopicData])
    }
    setIsNewTopicOpen(false)
    resetNewTopicForm()
  }

  const handleDeleteTopic = (topicId: string) => {
    setTopics(topics.filter((t) => t.id !== topicId))
  }

  const handleStartEdit = (topic: Topic) => {
    setSelectedTopic(topic)
    setEditingQuestions([...topic.questions])
    setIsEditTopicOpen(true)
  }

  const handleSaveEdit = () => {
    if (selectedTopic) {
      setTopics(topics.map((t) => (t.id === selectedTopic.id ? { ...selectedTopic, questions: editingQuestions } : t)))
      setIsEditTopicOpen(false)
      setSelectedTopic(null)
      setEditingQuestions([])
    }
  }

  const handleCancelEdit = () => {
    setIsEditTopicOpen(false)
    setSelectedTopic(null)
    setEditingQuestions([])
  }

  const handleAddQuestion = () => {
    if (isManualAdd) {
      setQuestions([...questions, { question: "", answer: "" }])
    } else {
      setEditingQuestions([...editingQuestions, { id: Math.random().toString(), question: "", answer: "" }])
    }
  }

  const handleQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    if (isManualAdd) {
      const updatedQuestions = [...questions]
      updatedQuestions[index][field] = value
      setQuestions(updatedQuestions)
    }
  }

  const handleEditingQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    const updatedQuestions = [...editingQuestions]
    updatedQuestions[index][field] = value
    setEditingQuestions(updatedQuestions)
  }

  const handleDeleteQuestion = (index: number) => {
    if (isManualAdd) {
      setQuestions(questions.filter((_, i) => i !== index))
    } else {
      setEditingQuestions(editingQuestions.filter((_, i) => i !== index))
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Dialog open={isNewTopicOpen} onOpenChange={setIsNewTopicOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                New Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isManualAdd ? "Add Questions Manually" : "Create New Topic"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic-name">Topic Name</Label>
                  <Input
                    id="topic-name"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  />
                </div>
                {!isManualAdd && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="notes">Upload Notes</Label>
                      <Textarea
                        id="notes"
                        value={newTopic.notes}
                        onChange={(e) => setNewTopic({ ...newTopic, notes: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="question-count">Number of Questions</Label>
                      <Input
                        id="question-count"
                        type="number"
                        value={newTopic.questionCount}
                        onChange={(e) => setNewTopic({ ...newTopic, questionCount: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {isManualAdd && (
                  <div className="grid gap-4">
                    {questions.map((q, index) => (
                      <div key={index} className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label>Question {index + 1}</Label>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={q.question}
                          onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                          placeholder="Enter question"
                        />
                        <Input
                          value={q.answer}
                          onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                          placeholder="Enter answer"
                        />
                      </div>
                    ))}
                    <Button onClick={handleAddQuestion} variant="outline">
                      Add Question
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button onClick={handleAddTopic}>{isManualAdd ? "Save Questions" : "Generate"}</Button>
                  <Button variant="outline" onClick={() => setIsManualAdd(!isManualAdd)}>
                    {isManualAdd ? "Switch to Generate" : "Add Manually"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Topics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {topics.map((topic) => (
                  <SidebarMenuItem key={topic.id}>
                    <SidebarMenuButton>{topic.name}</SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Dialog open={isEditTopicOpen} onOpenChange={setIsEditTopicOpen}>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault()
                                handleStartEdit(topic)
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Topic: {topic.name}</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {editingQuestions.map((q, index) => (
                                <div key={q.id} className="grid gap-2">
                                  <div className="flex items-center justify-between">
                                    <Label>Question {index + 1}</Label>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(index)}>
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <Input
                                    value={q.question}
                                    onChange={(e) => handleEditingQuestionChange(index, "question", e.target.value)}
                                  />
                                  <Input
                                    value={q.answer}
                                    onChange={(e) => handleEditingQuestionChange(index, "answer", e.target.value)}
                                  />
                                </div>
                              ))}
                              <Button onClick={handleAddQuestion} variant="outline">
                                Add Question
                              </Button>
                              <div className="flex gap-2">
                                <Button onClick={handleSaveEdit}>Save Changes</Button>
                                <Button variant="outline" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTopic(topic.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

