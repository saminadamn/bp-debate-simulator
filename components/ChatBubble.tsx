"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"

interface ChatBubbleProps {
  role: string
  content: string
  isAI: boolean
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

const roleToTeam: Record<string, string> = {
  PM: "OG",
  DPM: "OG",
  LO: "OO",
  DLO: "OO",
  MG: "CG",
  GW: "CG",
  MO: "CO",
  OW: "CO",
}

const teamColors: Record<string, string> = {
  OG: "border-l-blue-500 bg-blue-50",
  OO: "border-l-red-500 bg-red-50",
  CG: "border-l-green-500 bg-green-50",
  CO: "border-l-purple-500 bg-purple-50",
}

export default function ChatBubble({ role, content, isAI }: ChatBubbleProps) {
  const team = roleToTeam[role] || "OG"
  const teamColor = teamColors[team] || teamColors.OG

  return (
    <Card className={`border-l-4 ${teamColor} mb-4`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {isAI ? <Bot className="h-5 w-5 text-gray-600" /> : <User className="h-5 w-5 text-blue-600" />}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{roleNames[role] || role}</span>
            <Badge variant="outline" className="text-xs">
              {team}
            </Badge>
            {isAI && (
              <Badge variant="secondary" className="text-xs">
                AI
              </Badge>
            )}
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
        </div>
      </CardContent>
    </Card>
  )
}
