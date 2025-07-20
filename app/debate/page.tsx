"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import MotionCard from "@/components/MotionCard"
import RoleAssignment from "@/components/RoleAssignment"
import PrepTimer from "@/components/PrepTimer"
import SpeechRecorder from "@/components/SpeechRecorder"
import SpeechPlayer from "@/components/SpeechPlayer"
import ChatBubble from "@/components/ChatBubble"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ScoreCard from "@/components/ScoreCard"
import type { DebateState } from "@/types/debate"
import SkillLevelSelector from "@/components/SkillLevelSelector"
import { ArrowLeft } from "lucide-react"

type Role = "PM" | "LO" | "DPM" | "DLO" | "MG" | "MO" | "GW" | "OW"
type Team = "OG" | "OO" | "CG" | "CO"

const roleOrder: Role[] = ["PM", "LO", "DPM", "DLO", "MG", "MO", "GW", "OW"]

const roleToTeam: Record<Role, Team> = {
  PM: "OG",
  DPM: "OG",
  LO: "OO",
  DLO: "OO",
  MG: "CG",
  GW: "CG",
  MO: "CO",
  OW: "CO",
}

const roleNames: Record<Role, string> = {
  PM: "Prime Minister",
  LO: "Leader of Opposition",
  DPM: "Deputy Prime Minister",
  DLO: "Deputy Leader of Opposition",
  MG: "Member of Government",
  MO: "Member of Opposition",
  GW: "Government Whip",
  OW: "Opposition Whip",
}

export default function DebatePage() {
  const [debateState, setDebateState] = useState<DebateState>({
    motion: "",
    userRole: "PM",
    userTeam: "OG",
    userSkillLevel: "intermediate",
    currentSpeaker: "PM",
    phase: "setup",
    speeches: [],
    prepNotes: "",
    currentTranscript: "",
  })

  const [isMotionLocked, setIsMotionLocked] = useState(false)
  const [adjudication, setAdjudication] = useState<any>(null)
  const [isGeneratingSpeeches, setIsGeneratingSpeeches] = useState(false)

  const handleMotionGenerated = (motion: string) => {
    setDebateState((prev) => ({ ...prev, motion }))
  }

  const handleRoleAssigned = (role: Role) => {
    setDebateState((prev) => ({
      ...prev,
      userRole: role,
      userTeam: roleToTeam[role],
    }))
  }

  const handlePrepComplete = (notes: string) => {
    setDebateState((prev) => ({
      ...prev,
      phase: "speech",
      prepNotes: notes,
    }))
  }

  const handleSpeechComplete = async (transcript: string) => {
    console.log("Speech completed with transcript:", transcript.substring(0, 100) + "...")

    const newSpeech = {
      role: debateState.userRole,
      content: transcript,
      transcript,
      isAI: false,
    }

    console.log("Adding user speech:", newSpeech)

    // Update state with user speech first
    setDebateState((prev) => {
      const updatedState = {
        ...prev,
        speeches: [...prev.speeches, newSpeech],
      }
      console.log(
        "Updated debate state speeches:",
        updatedState.speeches.map((s) => ({ role: s.role, isAI: s.isAI })),
      )
      return updatedState
    })

    // Generate AI speeches for other roles
    await generateAISpeeches(transcript)
  }

  const generateAISpeeches = async (userSpeech: string) => {
    setIsGeneratingSpeeches(true)
    console.log("Starting AI speech generation...")

    try {
      // Get current speeches including the user's speech
      const currentSpeeches = [
        ...debateState.speeches,
        {
          role: debateState.userRole,
          content: userSpeech,
          isAI: false,
        },
      ]

      // Generate speeches for all other roles
      for (let i = 0; i < roleOrder.length; i++) {
        const currentRole = roleOrder[i]

        if (currentRole !== debateState.userRole) {
          console.log(`Generating speech for ${currentRole}...`)

          const response = await fetch("/api/generate-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              motion: debateState.motion,
              role: currentRole,
              previousSpeeches: currentSpeeches,
              userNotes: debateState.prepNotes,
              userSkillLevel: debateState.userSkillLevel,
              userSpeech: userSpeech,
            }),
          })

          if (!response.ok) {
            throw new Error(`Failed to generate speech for ${currentRole}`)
          }

          const data = await response.json()
          console.log(`Generated speech for ${currentRole}:`, data.speech.substring(0, 100) + "...")

          const newAISpeech = {
            role: currentRole,
            content: data.speech,
            isAI: true,
          }

          // Add to current speeches for next iteration
          currentSpeeches.push(newAISpeech)

          setDebateState((prev) => ({
            ...prev,
            speeches: [...prev.speeches, newAISpeech],
          }))

          // Small delay between generations
          await new Promise((resolve) => setTimeout(resolve, 500))
        }
      }

      console.log("All AI speeches generated, moving to feedback phase...")

      // Move to feedback phase and generate adjudication
      setDebateState((prev) => ({ ...prev, phase: "feedback" }))

      // Wait a bit for state to update, then generate adjudication
      setTimeout(() => {
        generateAdjudication()
      }, 1000)
    } catch (error) {
      console.error("Error generating AI speeches:", error)
    } finally {
      setIsGeneratingSpeeches(false)
    }
  }

  const generateAdjudication = async () => {
    console.log("Generating adjudication...")
    try {
      // Find the user's speech
      const userSpeech = debateState.speeches.find((s) => s.role === debateState.userRole && !s.isAI)

      console.log("User speech found:", userSpeech ? "Yes" : "No")
      console.log(
        "All speeches:",
        debateState.speeches.map((s) => ({ role: s.role, isAI: s.isAI, contentLength: s.content.length })),
      )

      const response = await fetch("/api/adjudicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motion: debateState.motion,
          speeches: debateState.speeches,
          userRole: debateState.userRole,
          userSpeech: userSpeech, // Explicitly pass the user speech
        }),
      })

      const data = await response.json()
      console.log("Adjudication generated:", data)
      setAdjudication(data)
    } catch (error) {
      console.error("Error generating adjudication:", error)
    }
  }

  const backToSetup = () => {
    setDebateState((prev) => ({ ...prev, phase: "setup" }))
  }

  const backToPrep = () => {
    setDebateState((prev) => ({ ...prev, phase: "prep" }))
  }

  const startNewRound = () => {
    setDebateState({
      motion: "",
      userRole: "PM",
      userTeam: "OG",
      userSkillLevel: "intermediate",
      currentSpeaker: "PM",
      phase: "setup",
      speeches: [],
      prepNotes: "",
      currentTranscript: "",
    })
    setIsMotionLocked(false)
    setAdjudication(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">BP Debate Simulator</h1>
          <div className="flex gap-2">
            <Badge variant="outline">Phase: {debateState.phase}</Badge>
            {debateState.userRole && (
              <Badge variant="secondary">
                {roleNames[debateState.userRole]} ({debateState.userTeam})
              </Badge>
            )}
          </div>
        </div>

        {debateState.phase === "setup" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <MotionCard
              onMotionGenerated={handleMotionGenerated}
              isLocked={isMotionLocked}
              onLock={() => setIsMotionLocked(true)}
            />
            <RoleAssignment
              onRoleAssigned={handleRoleAssigned}
              motion={debateState.motion}
              isMotionLocked={isMotionLocked}
              onStartPrep={() => setDebateState((prev) => ({ ...prev, phase: "prep" }))}
            />
            <SkillLevelSelector
              onSkillLevelSelected={(level) => setDebateState((prev) => ({ ...prev, userSkillLevel: level }))}
              selectedLevel={debateState.userSkillLevel}
            />
          </div>
        )}

        {debateState.phase === "prep" && (
          <PrepTimer
            motion={debateState.motion}
            role={debateState.userRole}
            onComplete={handlePrepComplete}
            onBackToSetup={backToSetup}
          />
        )}

        {debateState.phase === "speech" && (
          <div className="space-y-6">
            {/* Back to Prep Button */}
            <div className="flex justify-start">
              <Button onClick={backToPrep} variant="outline" className="flex items-center gap-2 bg-transparent">
                <ArrowLeft className="h-4 w-4" />
                Back to Preparation
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Speech - {roleNames[debateState.userRole]}</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpeechRecorder
                    onSpeechComplete={handleSpeechComplete}
                    role={debateState.userRole}
                    motion={debateState.motion}
                    skillLevel={debateState.userSkillLevel}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Debate Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Motion:</h3>
                      <p className="text-sm bg-gray-100 p-3 rounded">{debateState.motion}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Your Prep Notes:</h3>
                      <div className="text-sm bg-blue-50 p-3 rounded max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{debateState.prepNotes}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {isGeneratingSpeeches && (
              <Card className="border-2 border-blue-300 bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-blue-800">Generating AI Opponent Speeches...</h3>
                  <p className="text-blue-600">Please wait while we create responses from other debaters</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {debateState.phase === "feedback" && (
          <Tabs defaultValue="speeches" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="speeches">All Speeches</TabsTrigger>
              <TabsTrigger value="scorecard">Score Card</TabsTrigger>
              <TabsTrigger value="adjudication">Adjudication</TabsTrigger>
              <TabsTrigger value="analysis">Clash Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="speeches" className="space-y-4">
              {debateState.speeches.map((speech, index) => (
                <div key={index}>
                  <ChatBubble role={speech.role} content={speech.content} isAI={speech.isAI} />
                  {speech.isAI && <SpeechPlayer text={speech.content} role={speech.role} />}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="scorecard">
              {adjudication && (
                <ScoreCard
                  performanceMetrics={adjudication.performanceMetrics}
                  overallScore={adjudication.teamScores[debateState.userTeam]?.total / 10 || 0}
                  ranking={adjudication.ranking.indexOf(debateState.userTeam) + 1}
                  improvements={
                    adjudication.improvements || [
                      "Practice stronger mechanism explanation in SEXC framework",
                      "Develop more sophisticated comparative weighing techniques",
                      "Improve integration of evidence with argument structure",
                      "Focus on strategic extension and crystallization skills",
                    ]
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="adjudication">
              {adjudication && (
                <Card>
                  <CardHeader>
                    <CardTitle>Judge's Decision</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Overall Ranking:</h3>
                        <ol className="list-decimal list-inside space-y-1">
                          {adjudication.ranking?.map((team: string, index: number) => (
                            <li key={index} className={team === debateState.userTeam ? "font-bold text-blue-600" : ""}>
                              {team}
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Feedback:</h3>
                        <div className="text-sm whitespace-pre-wrap">{adjudication.feedback}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis">
              {adjudication && (
                <Card>
                  <CardHeader>
                    <CardTitle>Clash Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {adjudication.clashes?.map((clash: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold">{clash.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{clash.description}</p>
                          <div className="text-sm">
                            <strong>Winner:</strong> {clash.winner}
                            <span className="ml-2 text-gray-500">Weight: {clash.weight}/10</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}

        {debateState.phase === "feedback" && (
          <div className="mt-6 text-center">
            <Button onClick={startNewRound} size="lg">
              Start New Debate Round
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
