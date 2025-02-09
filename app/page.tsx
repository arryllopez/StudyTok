"use client"

import { useState } from "react"
import Sidebar from "./components/Sidebar"
import FlashcardFeed from "./components/FlashcardFeed"
import { Button } from "@/components/ui/button"
import { Maximize } from "lucide-react"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </Button>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
        <FlashcardFeed />
      </main>
    </div>
  )
}

