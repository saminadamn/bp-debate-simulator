"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, Square, Volume2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SpeechPlayerProps {
  text: string
  role: string
}

const roleNames: Record<string, string> = {
  PM: "Prime Minister",
  LO: "Leader of Opposition",
  DPM: "Deputy Prime Minister",
  DLO: "Deputy Leader of Opposition",
  MG: "Member of Government",
  MO: "Member of Opposition",
  GW: "Government Whip",
  OW: "Opposition Whip",
}

export default function SpeechPlayer({ text, role }: SpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const playPause = () => {
    if (!isPlaying) {
      // Start playing
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1

        utterance.onstart = () => setIsPlaying(true)
        utterance.onend = () => {
          setIsPlaying(false)
          setCurrentPosition(0)
        }
        utterance.onerror = () => {
          setIsPlaying(false)
          setCurrentPosition(0)
        }

        utteranceRef.current = utterance
        speechSynthesis.speak(utterance)
      }
    } else {
      // Pause/stop
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel()
        setIsPlaying(false)
      }
    }
  }

  const stop = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel()
    }
    setIsPlaying(false)
    setCurrentPosition(0)
  }

  return (
    <Card className="mt-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          AI Speech - {roleNames[role] || role}
          <Badge variant="secondary" className="ml-auto">
            AI Generated
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2 mb-3">
          <Button onClick={playPause} size="sm" variant="outline">
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play Speech
              </>
            )}
          </Button>
          <Button onClick={stop} size="sm" variant="outline" disabled={!isPlaying}>
            <Square className="h-4 w-4 mr-1" />
            Stop
          </Button>
        </div>

        <div className="text-sm bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">{text}</div>

        {isPlaying && <div className="mt-2 text-xs text-gray-600">🔊 Playing AI speech...</div>}
      </CardContent>
    </Card>
  )
}
