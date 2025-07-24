"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Zap, Users, Brain, Star } from "lucide-react"

interface ScoreCardProps {
  performanceMetrics: {
    averageArgumentQuality: number
    clashEngagement: number
    structuralCoherence: number
    evidenceUsage: number
    rhetoricalEffectiveness: number
    strategicAwareness: number
  }
  overallScore: number
  ranking: number
  improvements: string[]
}

export default function ScoreCard({
  performanceMetrics,
  overallScore,
  ranking,
  improvements,
}: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreGrade = (score: number): string => {
    // Because exact floating point equality can be tricky, to handle == 5.0:
    // Use a small epsilon for safety around 5.0
    const EPSILON = 0.0001
    if (score >= 9 && score <= 10) {
      return "A+"
    }
    if (score >= 8 && score < 9) {
      return "A"
    }
    if (score >= 7 && score < 8) {
      return "B"
    }
    if (score >= 6 && score < 7) {
      return "C"
    }
    // Check if score is close enough to 5 to be considered exactly 5
    if (Math.abs(score - 5) < EPSILON) {
      return "E"
    }
    if (score > 5 && score < 6) {
      return "D"
    }
    if (score < 5) {
      return "F"
    }
    // As a fallback, if none above matched (shouldn't occur)
    return "F"
  }

  const getRankingBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Badge className="bg-yellow-500 text-white">🥇 1st Place</Badge>
      case 2:
        return <Badge className="bg-gray-400 text-white">🥈 2nd Place</Badge>
      case 3:
        return <Badge className="bg-amber-600 text-white">🥉 3rd Place</Badge>
      default:
        return <Badge variant="outline">4th Place</Badge>
    }
  }

  // You multiply score by 3 before display as per your earlier requests.
  // If you want to cap this displayed value at 10, uncomment the cap.
  const displayedScore = (score: number) => {
    const val = score * 3
    return val > 10 ? 10 : val
  }

  return (
    <Card className="w-full max-w-2xl mx-auto" role="region" aria-label="Performance Score Card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" aria-hidden="true" />
          Performance Score Card
          {getRankingBadge(ranking)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`} aria-live="polite" aria-atomic="true">
            {displayedScore(overallScore).toFixed(1)}/10
          </div>
          <div className="text-lg font-semibold text-gray-600">Overall Grade: {getScoreGrade(overallScore)}</div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Performance Metrics">
          {[
            { label: "Argument Quality", value: performanceMetrics.averageArgumentQuality, icon: <Brain className="h-4 w-4 text-blue-500" aria-hidden="true" /> },
            { label: "Clash Engagement", value: performanceMetrics.clashEngagement, icon: <Target className="h-4 w-4 text-red-500" aria-hidden="true" /> },
            { label: "Structure", value: performanceMetrics.structuralCoherence, icon: <Users className="h-4 w-4 text-green-500" aria-hidden="true" /> },
            { label: "Evidence Usage", value: performanceMetrics.evidenceUsage, icon: <Star className="h-4 w-4 text-purple-500" aria-hidden="true" /> },
            { label: "Rhetorical Style", value: performanceMetrics.rhetoricalEffectiveness, icon: <Zap className="h-4 w-4 text-orange-500" aria-hidden="true" /> },
            { label: "Strategic Awareness", value: performanceMetrics.strategicAwareness, icon: <Brain className="h-4 w-4 text-indigo-500" aria-hidden="true" /> },
          ].map(({ label, value, icon }, idx) => (
            <div key={idx} className="space-y-3" role="listitem">
              <div className="flex items-center gap-2">
                {icon}
                <span className="text-sm font-medium">{label}</span>
                <span className={`ml-auto font-bold ${getScoreColor(value)}`} aria-label={`${label} score: ${displayedScore(value).toFixed(1)}`}>
                  {displayedScore(value).toFixed(1)}
                </span>
              </div>
              <Progress value={value * 10} className="h-2" />
            </div>
          ))}
        </div>

        {/* Improvement Suggestions */}
        <div className="space-y-2" aria-label="Improvement Suggestions">
          <h3 className="font-semibold text-gray-800">🎯 Next Practice Focus:</h3>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1" aria-hidden="true">
                  •
                </span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap gap-2" aria-label="Achievement Badges">
          {performanceMetrics.averageArgumentQuality >= 8 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              🧠 Strong Arguments
            </Badge>
          )}
          {performanceMetrics.clashEngagement >= 8 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              ⚔️ Clash Master
            </Badge>
          )}
          {performanceMetrics.structuralCoherence >= 8 && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🏗️ Well Structured
            </Badge>
          )}
          {performanceMetrics.strategicAwareness >= 8 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              🎯 Strategic Thinker
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
