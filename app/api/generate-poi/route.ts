import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { currentTranscript, role, motion, timeSpoken, skillLevel } = await request.json()

    // Only generate POIs during appropriate time (1-6 minutes)
    if (timeSpoken < 60 || timeSpoken > 360) {
      return NextResponse.json({ poi: null })
    }

    const poi = await generateContextualPOI({
      transcript: currentTranscript,
      role,
      motion,
      timeSpoken,
      skillLevel: skillLevel || "intermediate",
    })

    return NextResponse.json({ poi })
  } catch (error) {
    console.error("Error generating POI:", error)
    return NextResponse.json({ error: "Failed to generate POI" }, { status: 500 })
  }
}

async function generateContextualPOI(params: {
  transcript: string
  role: string
  motion: string
  timeSpoken: number
  skillLevel: string
}): Promise<string> {
  const { transcript, role, motion, timeSpoken, skillLevel } = params

  // Analyze the current speech content to generate relevant POI
  const prompt = `You are an AI debater listening to a live speech in a British Parliamentary debate.

CONTEXT:
Motion: ${motion}
Speaker Role: ${role}
Time Spoken: ${Math.floor(timeSpoken / 60)}:${(timeSpoken % 60).toString().padStart(2, "0")}
Current Speech Content: "${transcript}"

SKILL LEVEL: ${skillLevel.toUpperCase()}

Generate a contextual Point of Information (POI) that:
1. Directly challenges a specific claim the speaker just made
2. Is appropriate for their skill level (${skillLevel})
3. Is concise (1-2 sentences max)
4. Follows BP POI conventions
5. Targets a logical weakness or assumption

${
  skillLevel === "beginner"
    ? "Keep it simple and direct. Focus on basic clarification or obvious contradictions."
    : skillLevel === "intermediate"
      ? "Use moderate complexity. Challenge assumptions or ask for evidence."
      : "Use sophisticated questioning. Challenge methodology, definitions, or strategic implications."
}

Generate only the POI text (no introduction):`

  // In a real implementation, this would call Gemini API
  return generateMockPOI(transcript, role, skillLevel, timeSpoken)
}

function generateMockPOI(transcript: string, role: string, skillLevel: string, timeSpoken: number): string {
  const poiTemplates = {
    beginner: [
      "Can you give us a specific example of that?",
      "How do you know that's actually true?",
      "What about people who disagree with you?",
      "Isn't that just your opinion?",
      "Can you prove that will really happen?",
    ],
    intermediate: [
      "What evidence do you have that this mechanism would work in practice?",
      "How do you respond to the concern that this could harm vulnerable populations?",
      "Can you clarify how this addresses the root cause rather than symptoms?",
      "What safeguards prevent the abuse you've just described?",
      "How do you weigh this against competing moral principles?",
    ],
    advanced: [
      "How do you account for the endogeneity problem in your causal analysis?",
      "What's your response to the democratic legitimacy concerns this raises?",
      "How do you address the path dependence issues with institutional change?",
      "Can you reconcile this with the empirical evidence from natural experiments?",
      "How do you resolve the tension between your normative and consequentialist claims?",
    ],
  }

  const templates = poiTemplates[skillLevel as keyof typeof poiTemplates] || poiTemplates.intermediate

  // Add some context-awareness based on transcript content
  if (transcript.toLowerCase().includes("example")) {
    return skillLevel === "advanced"
      ? "Is that example representative, or are you cherry-picking supportive cases?"
      : "Can you give us a different example that proves the same point?"
  }

  if (transcript.toLowerCase().includes("evidence") || transcript.toLowerCase().includes("study")) {
    return skillLevel === "advanced"
      ? "What's the methodology behind that study, and how do you address selection bias?"
      : "Where does that evidence come from?"
  }

  // Return random appropriate POI
  return templates[Math.floor(Math.random() * templates.length)]
}
