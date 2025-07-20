"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SpeechRecorderProps {
  onSpeechComplete: (transcript: string) => void
  role: string
  motion: string
  skillLevel: string
}

export default function SpeechRecorder({ onSpeechComplete, role, motion, skillLevel }: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [speechTime, setSpeechTime] = useState(0)
  const [currentPOI, setCurrentPOI] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const poiTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          }
        }
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript + " ")
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (poiTimeoutRef.current) clearTimeout(poiTimeoutRef.current)
    }
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    setTranscript("")
    setSpeechTime(0)

    if (recognitionRef.current) {
      recognitionRef.current.start()
    }

    // Start timer
    timerRef.current = setInterval(() => {
      setSpeechTime((prev) => prev + 1)
    }, 1000)

    // Schedule POI generation (between 1-6 minutes)
    const poiDelay = (60 + Math.random() * 300) * 1000 // 1-6 minutes
    poiTimeoutRef.current = setTimeout(generatePOI, poiDelay)
  }

  const stopRecording = () => {
    setIsRecording(false)

    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (poiTimeoutRef.current) {
      clearTimeout(poiTimeoutRef.current)
    }
  }

  const generatePOI = async () => {
    if (!isRecording || speechTime < 60 || speechTime > 360) return

    try {
      const response = await fetch("/api/generate-poi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTranscript: transcript,
          role: role,
          motion: motion,
          timeSpoken: speechTime,
          skillLevel: skillLevel,
        }),
      })

      const data = await response.json()
      if (data.poi) {
        setCurrentPOI(data.poi)

        // Auto-dismiss POI after 10 seconds
        setTimeout(() => {
          setCurrentPOI(null)
        }, 10000)
      }
    } catch (error) {
      console.error("Error generating POI:", error)
    }
  }

  const acceptPOI = () => {
    setCurrentPOI(null)
  }

  const rejectPOI = () => {
    setCurrentPOI(null)
  }

  const finishSpeech = () => {
    stopRecording()

    // Ensure we have some content
    const finalTranscript =
      transcript.trim() ||
      "Thank you Chair. I support this motion because it is important for our society. We need to consider the benefits and make the right choice."

    console.log("Finishing speech with transcript:", finalTranscript.substring(0, 100) + "...")
    onSpeechComplete(finalTranscript)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (speechTime < 60) return "text-red-500" // Too short
    if (speechTime <= 420) return "text-green-500" // Good range (1-7 minutes)
    return "text-orange-500" // Getting long
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className={`text-3xl font-mono font-bold ${getTimeColor()}`}>{formatTime(speechTime)}</div>
        <div className="text-sm text-gray-600">
          {speechTime < 60 && "Protected time - no POIs"}
          {speechTime >= 60 && speechTime <= 360 && "POIs allowed"}
          {speechTime > 360 && "Protected time - no POIs"}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {!isRecording ? (
          <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
            <Mic className="h-5 w-5 mr-2" />
            Start Speech
          </Button>
        ) : (
          <>
            <Button onClick={stopRecording} variant="outline" size="lg">
              <Square className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
            <Button onClick={finishSpeech} size="lg">
              Finish Speech
            </Button>
          </>
        )}
      </div>

      {currentPOI && (
        <Card className="border-2 border-yellow-400 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">Point of Information</Badge>
              <div className="text-sm text-gray-600">Auto-dismiss in 10s</div>
            </div>
            <p className="text-sm mb-3">{currentPOI}</p>
            <div className="flex gap-2">
              <Button onClick={acceptPOI} size="sm" variant="outline">
                Accept
              </Button>
              <Button onClick={rejectPOI} size="sm" variant="outline">
                Reject
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {transcript && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Live Transcript:</h3>
            <div className="max-h-40 overflow-y-auto text-sm bg-gray-50 p-3 rounded">{transcript}</div>
          </CardContent>
        </Card>
      )}

      <div className="text-xs text-gray-600 space-y-1">
        <p>• Speech should be 5-7 minutes long</p>
        <p>• POIs can be offered between minutes 1-6</p>
        <p>• Click "Finish Speech" when done to proceed</p>
      </div>
    </div>
  )
}
