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

export default function ScoreCard({ performanceMetrics, overallScore, ranking, improvements }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreGrade = (score: number) => {
    if (score >= 9) return "A+"
    if (score >= 8) return "A"
    if (score >= 7) return "B+"
    if (score >= 6) return "B"
    if (score >= 5) return "C+"
    return "C"
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Performance Score Card
          {getRankingBadge(ranking)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>{overallScore.toFixed(1)}/10</div>
          <div className="text-lg font-semibold text-gray-600">Overall Grade: {getScoreGrade(overallScore)}</div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Argument Quality</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.averageArgumentQuality)}`}>
                {performanceMetrics.averageArgumentQuality.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.averageArgumentQuality * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Clash Engagement</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.clashEngagement)}`}>
                {performanceMetrics.clashEngagement.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.clashEngagement * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Structure</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.structuralCoherence)}`}>
                {performanceMetrics.structuralCoherence.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.structuralCoherence * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Evidence Usage</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.evidenceUsage)}`}>
                {performanceMetrics.evidenceUsage.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.evidenceUsage * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Rhetorical Style</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.rhetoricalEffectiveness)}`}>
                {performanceMetrics.rhetoricalEffectiveness.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.rhetoricalEffectiveness * 10} className="h-2" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">Strategic Awareness</span>
              <span className={`ml-auto font-bold ${getScoreColor(performanceMetrics.strategicAwareness)}`}>
                {performanceMetrics.strategicAwareness.toFixed(1)}
              </span>
            </div>
            <Progress value={performanceMetrics.strategicAwareness * 10} className="h-2" />
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">🎯 Next Practice Focus:</h3>
          <ul className="space-y-1">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap gap-2">
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
