"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, Zap } from "lucide-react"
import type { SkillLevel } from "@/types/debate"

interface SkillLevelSelectorProps {
  onSkillLevelSelected: (level: SkillLevel) => void
  selectedLevel?: SkillLevel
}

export default function SkillLevelSelector({ onSkillLevelSelected, selectedLevel }: SkillLevelSelectorProps) {
  const skillLevels = [
    {
      level: "beginner" as SkillLevel,
      title: "Beginner",
      icon: <Target className="h-5 w-5" />,
      description: "New to debate or learning basics",
      features: [
        "Simple argument structure",
        "Basic examples and explanations",
        "Clear, straightforward language",
        "Gentle POIs and feedback",
      ],
      color: "bg-green-100 text-green-800 border-green-300",
    },
    {
      level: "intermediate" as SkillLevel,
      title: "Intermediate",
      icon: <Brain className="h-5 w-5" />,
      description: "Some debate experience, developing skills",
      features: ["SEXC argument framework", "Stakeholder analysis", "Moderate clash engagement", "Strategic awareness"],
      color: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      level: "advanced" as SkillLevel,
      title: "Advanced",
      icon: <Zap className="h-5 w-5" />,
      description: "Experienced debater seeking challenge",
      features: [
        "Sophisticated argumentation",
        "Deep clash analysis",
        "Complex weighing mechanisms",
        "Strategic role fulfillment",
      ],
      color: "bg-purple-100 text-purple-800 border-purple-300",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Skill Level</CardTitle>
        <p className="text-sm text-gray-600">This determines how the AI opponents will respond to your arguments</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {skillLevels.map((skill) => (
          <div
            key={skill.level}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedLevel === skill.level ? skill.color : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSkillLevelSelected(skill.level)}
          >
            <div className="flex items-center gap-3 mb-2">
              {skill.icon}
              <h3 className="font-semibold">{skill.title}</h3>
              {selectedLevel === skill.level && (
                <Badge variant="secondary" className="ml-auto">
                  Selected
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
            <ul className="text-xs space-y-1">
              {skill.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {selectedLevel && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selected:</strong> {skillLevels.find((s) => s.level === selectedLevel)?.title}
              <br />
              AI opponents will adapt their arguments and POIs to match your level.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
