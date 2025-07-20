"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Play, Pause, Square, FileText, ArrowLeft } from "lucide-react"

interface PrepTimerProps {
  motion: string
  role: string
  onComplete: (notes: string) => void
  onBackToSetup: () => void
}

export default function PrepTimer({ motion, role, onComplete, onBackToSetup }: PrepTimerProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [notes, setNotes] = useState("")
  const [structuredNotes, setStructuredNotes] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(15 * 60)
  }

  const structureNotes = async () => {
    try {
      const response = await fetch("/api/structure-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motion,
          role,
          notes,
        }),
      })

      const data = await response.json()
      setStructuredNotes(data.structuredNotes)
    } catch (error) {
      console.error("Error structuring notes:", error)
    }
  }

  const finishPrep = () => {
    const finalNotes = structuredNotes || notes || "No preparation notes provided"
    onComplete(finalNotes)
  }

  const getProgressColor = () => {
    const percentage = (timeLeft / (15 * 60)) * 100
    if (percentage > 50) return "bg-green-500"
    if (percentage > 25) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <Button onClick={onBackToSetup} variant="outline" className="flex items-center gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Back to Setup
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Preparation Phase - {formatTime(timeLeft)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
                style={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
              />
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={toggleTimer} variant="outline">
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
              <Button onClick={resetTimer} variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Motion:</h3>
              <p className="text-sm">{motion}</p>
              <p className="text-sm text-gray-600 mt-2">Your Role: {role}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Preparation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your case preparation here... Consider your arguments, evidence, rebuttals, and strategy."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <div className="mt-4 flex gap-2">
              <Button
                onClick={structureNotes}
                disabled={!notes.trim()}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <FileText className="h-4 w-4 mr-2" />
                Structure My Notes
              </Button>
              <Button onClick={finishPrep} className="flex-1">
                Finish Preparation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-t-lg -m-6 mb-4">
              📋 Structured Case
            </CardTitle>
          </CardHeader>
          <CardContent>
            {structuredNotes ? (
              <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 rounded-xl border-2 border-blue-200 shadow-inner">
                <div className="prose prose-blue max-w-none">
                  <pre className="whitespace-pre-wrap text-sm font-medium text-slate-800 leading-relaxed font-mono bg-white/60 p-4 rounded-lg shadow-sm">
                    {structuredNotes}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Click "Structure My Notes"</p>
                  <p className="text-sm">to organize your preparation using debate formats</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
