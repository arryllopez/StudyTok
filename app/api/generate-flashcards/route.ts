import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
  try {
    const { topic, count } = await request.json()

    const prompt = `Generate ${count} flashcards for studying ${topic}. 
    Return them in the following JSON format:
    [
      {
        "id": "1",
        "question": "Question text here",
        "answer": "Answer text here"
      }
    ]
    Make the questions challenging but concise, and ensure the answers are clear and informative.`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content
    const flashcards = JSON.parse(response || '[]')

    // Ensure each flashcard has a unique ID
    const cardsWithIds = flashcards.map((card: any) => ({
      ...card,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }))

    return NextResponse.json(cardsWithIds)
  } catch (error) {
    console.error('Error generating flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to generate flashcards' },
      { status: 500 }
    )
  }
} 