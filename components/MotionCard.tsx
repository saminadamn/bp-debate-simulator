"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shuffle, Lock, Unlock } from "lucide-react"
import { motions } from "@/data/motions"

interface MotionCardProps {
  onMotionGenerated: (motion: string) => void
  isLocked: boolean
  onLock: () => void
}

export default function MotionCard({ onMotionGenerated, isLocked, onLock }: MotionCardProps) {
  const [currentMotion, setCurrentMotion] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRandomMotion = () => {
    if (isLocked) return

    setIsGenerating(true)

    // Simulate loading for better UX
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motions.length)
      const motion = motions[randomIndex]
      setCurrentMotion(motion)
      onMotionGenerated(motion)
      setIsGenerating(false)
    }, 500)
  }

  const lockMotion = () => {
    if (currentMotion) {
      onLock()
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5" />
          Motion Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {currentMotion ? (
            <div className="space-y-2">
              <p className="font-medium text-lg">{currentMotion}</p>
              {isLocked && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <Lock className="h-4 w-4" />
                  Motion Locked
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Click "Generate Motion" to get started
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={generateRandomMotion} disabled={isGenerating || isLocked} className="flex-1">
            {isGenerating ? (
              <>
                <Shuffle className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Motion
              </>
            )}
          </Button>

          {currentMotion && !isLocked && (
            <Button onClick={lockMotion} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Unlock className="h-4 w-4" />
              Lock
            </Button>
          )}
        </div>

        {currentMotion && !isLocked && (
          <p className="text-sm text-gray-600">Lock this motion to proceed to role assignment and preparation.</p>
        )}
      </CardContent>
    </Card>
  )
}
