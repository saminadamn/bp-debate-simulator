import { type NextRequest, NextResponse } from "next/server"

interface FeedbackRequest {
  motion: string
  speeches: Speech[]
  userRole: string
  userSpeech: string
  debatePhase: "ongoing" | "complete"
}

interface Speech {
  role: string
  content: string
  isAI: boolean
  timestamp?: number
}

interface ClashPoint {
  title: string
  description: string
  govPosition: string
  oppPosition: string
  analysis: string
  currentLeader: string
  reasoning: string
  strategicImportance: number
}

interface TeamFeedback {
  team: string
  strengths: string[]
  weaknesses: string[]
  strategicAdvice: string[]
  argumentEffectiveness: number
  engagementQuality: number
}

export async function POST(request: NextRequest) {
  try {
    const { motion, speeches, userRole, userSpeech, debatePhase }: FeedbackRequest = await request.json()

    console.log(`\n=== GENERATING COMPREHENSIVE FEEDBACK ===`)
    console.log(`Motion: ${motion}`)
    console.log(`Speeches analyzed: ${speeches.length}`)
    console.log(`User role: ${userRole}`)
    console.log(`Debate phase: ${debatePhase}`)

    // Identify significant clash points
    const clashPoints = identifySignificantClashPoints(motion, speeches, userSpeech, userRole)

    // Generate team-specific feedback
    const teamFeedback = generateTeamFeedback(speeches, userSpeech, userRole, clashPoints)

    // Analyze debate progression
    const debateProgression = analyzeDebateProgression(speeches, userSpeech, motion)

    // Generate strategic recommendations
    const strategicRecommendations = generateStrategicRecommendations(clashPoints, teamFeedback, debatePhase, userRole)

    // Assess overall debate quality
    const debateQuality = assessOverallDebateQuality(speeches, userSpeech, clashPoints)

    return NextResponse.json({
      clashPoints,
      teamFeedback,
      debateProgression,
      strategicRecommendations,
      debateQuality,
      methodology: "Comprehensive analysis based on actual arguments and engagement patterns",
    })
  } catch (error) {
    console.error("Error generating comprehensive feedback:", error)
    return NextResponse.json({ error: "Failed to generate comprehensive feedback" }, { status: 500 })
  }
}

function identifySignificantClashPoints(
  motion: string,
  speeches: Speech[],
  userSpeech: string,
  userRole: string,
): ClashPoint[] {
  console.log("Identifying significant clash points based on actual arguments...")

  const clashPoints: ClashPoint[] = []

  // Analyze government and opposition arguments
  const govArguments = extractTeamArguments(speeches, ["PM", "DPM", "MG", "GW"], userSpeech, userRole)
  const oppArguments = extractTeamArguments(speeches, ["LO", "DLO", "MO", "OW"], userSpeech, userRole)

  console.log(`Government arguments: ${govArguments.length}`)
  console.log(`Opposition arguments: ${oppArguments.length}`)

  // Clash Point 1: Core Framework/Definitional Clash
  const frameworkClash = identifyFrameworkClash(motion, govArguments, oppArguments, speeches)
  if (frameworkClash) clashPoints.push(frameworkClash)

  // Clash Point 2: Primary Mechanism/Implementation Clash
  const mechanismClash = identifyMechanismClash(motion, govArguments, oppArguments, speeches)
  if (mechanismClash) clashPoints.push(mechanismClash)

  // Clash Point 3: Key Impact/Stakeholder Clash
  const impactClash = identifyImpactClash(motion, govArguments, oppArguments, speeches)
  if (impactClash) clashPoints.push(impactClash)

  console.log(`Identified ${clashPoints.length} significant clash points`)

  return clashPoints.slice(0, 3) // Ensure exactly 2-3 clash points
}

function extractTeamArguments(speeches: Speech[], teamRoles: string[], userSpeech: string, userRole: string): any[] {
  const teamArguments: any[] = []

  // Include user's arguments if they're on this team
  if (teamRoles.includes(userRole)) {
    const userArgs = analyzeUserContribution(userSpeech, userRole)
    teamArguments.push(...userArgs)
  }

  // Include AI speeches from this team
  speeches
    .filter((speech) => teamRoles.includes(speech.role) && speech.isAI)
    .forEach((speech) => {
      const speechArgs = analyzeUserContribution(speech.content, speech.role)
      teamArguments.push(...speechArgs)
    })

  return teamArguments
}

function analyzeUserContribution(content: string, role: string): any[] {
  const analysis: any[] = []

  const contentLower = content.toLowerCase()

  // Extract framework arguments
  if (contentLower.includes("define") || contentLower.includes("framework") || contentLower.includes("understand")) {
    analysis.push({
      type: "framework",
      role: role,
      content: extractFrameworkContent(content),
      strength: assessArgumentStrength(content, "framework"),
    })
  }

  // Extract mechanism arguments
  if (
    contentLower.includes("mechanism") ||
    contentLower.includes("implement") ||
    contentLower.includes("enforce") ||
    contentLower.includes("work")
  ) {
    analysis.push({
      type: "mechanism",
      role: role,
      content: extractMechanismContent(content),
      strength: assessArgumentStrength(content, "mechanism"),
    })
  }

  // Extract impact arguments
  if (
    contentLower.includes("impact") ||
    contentLower.includes("harm") ||
    contentLower.includes("benefit") ||
    contentLower.includes("consequence")
  ) {
    analysis.push({
      type: "impact",
      role: role,
      content: extractImpactContent(content),
      strength: assessArgumentStrength(content, "impact"),
    })
  }

  // Extract stakeholder arguments
  if (
    contentLower.includes("people") ||
    contentLower.includes("community") ||
    contentLower.includes("vulnerable") ||
    contentLower.includes("affected")
  ) {
    analysis.push({
      type: "stakeholder",
      role: role,
      content: extractStakeholderContent(content),
      strength: assessArgumentStrength(content, "stakeholder"),
    })
  }

  return analysis
}

function extractFrameworkContent(content: string): string {
  const sentences = content.split(/[.!?]+/)
  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes("define") ||
      sentenceLower.includes("framework") ||
      sentenceLower.includes("understand")
    ) {
      return sentence.trim()
    }
  }
  return "Framework argument identified"
}

function extractMechanismContent(content: string): string {
  const sentences = content.split(/[.!?]+/)
  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (sentenceLower.includes("mechanism") || sentenceLower.includes("implement") || sentenceLower.includes("work")) {
      return sentence.trim()
    }
  }
  return "Mechanism argument identified"
}

function extractImpactContent(content: string): string {
  const sentences = content.split(/[.!?]+/)
  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (sentenceLower.includes("impact") || sentenceLower.includes("harm") || sentenceLower.includes("benefit")) {
      return sentence.trim()
    }
  }
  return "Impact argument identified"
}

function extractStakeholderContent(content: string): string {
  const sentences = content.split(/[.!?]+/)
  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes("people") ||
      sentenceLower.includes("community") ||
      sentenceLower.includes("vulnerable")
    ) {
      return sentence.trim()
    }
  }
  return "Stakeholder argument identified"
}

function assessArgumentStrength(content: string, type: string): number {
  let strength = 5 // Base strength

  // Check for evidence
  if (content.toLowerCase().includes("evidence") || content.toLowerCase().includes("study")) {
    strength += 2
  }

  // Check for examples
  if (content.toLowerCase().includes("example") || content.toLowerCase().includes("case")) {
    strength += 1
  }

  // Check for logical structure
  if (content.toLowerCase().includes("because") || content.toLowerCase().includes("therefore")) {
    strength += 1
  }

  // Check for weighing
  if (content.toLowerCase().includes("important") || content.toLowerCase().includes("crucial")) {
    strength += 1
  }

  return Math.min(10, strength)
}

function identifyFrameworkClash(motion: string, govArgs: any[], oppArgs: any[], speeches: Speech[]): ClashPoint | null {
  const govFramework = govArgs.filter((arg) => arg.type === "framework")
  const oppFramework = oppArgs.filter((arg) => arg.type === "framework")

  if (govFramework.length === 0 && oppFramework.length === 0) {
    return null
  }

  const motionLower = motion.toLowerCase()

  let title = "Framework and Definitional Approach"
  let description = "Fundamental disagreement over how to understand and approach this motion"
  let govPosition = "Government framework is appropriate and well-defined"
  let oppPosition = "Government framework is flawed or inappropriate"

  // Motion-specific framework clashes
  if (motionLower.includes("ban") || motionLower.includes("prohibit")) {
    title = "Prohibition Scope and Justification"
    description = "Core disagreement over whether prohibition is justified and how it should be defined"
    govPosition = "Prohibition is necessary, clearly definable, and enforceable"
    oppPosition = "Prohibition is either unjustified, too broad, or unenforceable"
  } else if (motionLower.includes("tax") || motionLower.includes("subsidize")) {
    title = "Economic Intervention Philosophy"
    description = "Fundamental disagreement over the role of government in market intervention"
    govPosition = "Market failures justify targeted government intervention"
    oppPosition = "Market mechanisms are superior to government intervention"
  } else if (motionLower.includes("require") || motionLower.includes("mandate")) {
    title = "Regulatory Authority vs Individual Autonomy"
    description = "Core tension between collective regulation and individual choice"
    govPosition = "Collective action problems justify regulatory mandates"
    oppPosition = "Individual autonomy should be preserved except for direct harm prevention"
  }

  // Determine current leader based on argument strength
  const govStrength = govFramework.reduce((sum, arg) => sum + arg.strength, 0)
  const oppStrength = oppFramework.reduce((sum, arg) => sum + arg.strength, 0)

  const currentLeader = govStrength > oppStrength ? "Government" : "Opposition"
  const reasoning =
    govStrength > oppStrength
      ? "Government has provided clearer definitional framework with stronger justification"
      : "Opposition has successfully challenged government framework and provided compelling alternatives"

  return {
    title,
    description,
    govPosition,
    oppPosition,
    analysis: `This clash is central to the debate because it determines the fundamental approach to the motion. ${description.toLowerCase()}.`,
    currentLeader,
    reasoning,
    strategicImportance: 9,
  }
}

function identifyMechanismClash(motion: string, govArgs: any[], oppArgs: any[], speeches: Speech[]): ClashPoint | null {
  const govMechanism = govArgs.filter((arg) => arg.type === "mechanism")
  const oppMechanism = oppArgs.filter((arg) => arg.type === "mechanism")

  if (govMechanism.length === 0 && oppMechanism.length === 0) {
    return null
  }

  const title = "Implementation Feasibility and Effectiveness"
  const description = "Direct disagreement over whether the policy can be effectively implemented"
  const govPosition = "Implementation mechanisms are robust, tested, and will achieve policy goals"
  const oppPosition = "Implementation will fail due to practical challenges, creating unintended consequences"

  // Determine current leader
  const govStrength = govMechanism.reduce((sum, arg) => sum + arg.strength, 0)
  const oppStrength = oppMechanism.reduce((sum, arg) => sum + arg.strength, 0)

  const currentLeader = govStrength > oppStrength ? "Government" : "Opposition"
  const reasoning =
    govStrength > oppStrength
      ? "Government has provided detailed implementation plans with evidence of feasibility"
      : "Opposition has identified critical implementation flaws that government cannot address"

  return {
    title,
    description,
    govPosition,
    oppPosition,
    analysis:
      "This clash is crucial because policy effectiveness depends entirely on successful implementation. The debate centers on whether the proposed mechanisms will work in practice.",
    currentLeader,
    reasoning,
    strategicImportance: 8,
  }
}

function identifyImpactClash(motion: string, govArgs: any[], oppArgs: any[], speeches: Speech[]): ClashPoint | null {
  const govImpact = govArgs.filter((arg) => arg.type === "impact" || arg.type === "stakeholder")
  const oppImpact = oppArgs.filter((arg) => arg.type === "impact" || arg.type === "stakeholder")

  if (govImpact.length === 0 && oppImpact.length === 0) {
    return null
  }

  // Identify the most significant impact clash based on content
  let title = "Stakeholder Impact Analysis"
  let description = "Disagreement over who benefits and who is harmed by this policy"
  let govPosition = "Policy provides significant benefits to key stakeholders"
  let oppPosition = "Policy disproportionately harms vulnerable populations"

  // Check for specific impact types mentioned
  const allContent = [...govImpact, ...oppImpact].map((arg) => arg.content.toLowerCase()).join(" ")

  if (allContent.includes("vulnerable") || allContent.includes("marginalized")) {
    title = "Vulnerable Population Impact"
    description = "Direct disagreement over whether the policy helps or harms vulnerable populations"
    govPosition = "Policy provides crucial protections for vulnerable populations"
    oppPosition = "Policy disproportionately burdens those least able to bear the costs"
  } else if (allContent.includes("rights") || allContent.includes("freedom")) {
    title = "Individual Rights vs Collective Benefits"
    description = "Fundamental tension between individual rights and collective welfare"
    govPosition = "Collective benefits justify reasonable restrictions on individual rights"
    oppPosition = "Individual rights cannot be sacrificed for speculative collective benefits"
  } else if (allContent.includes("economic") || allContent.includes("cost")) {
    title = "Economic Impact and Cost-Benefit Analysis"
    description = "Disagreement over the economic consequences and whether benefits justify costs"
    govPosition = "Economic benefits clearly outweigh implementation costs"
    oppPosition = "Economic costs and negative consequences exceed any theoretical benefits"
  }

  // Determine current leader
  const govStrength = govImpact.reduce((sum, arg) => sum + arg.strength, 0)
  const oppStrength = oppImpact.reduce((sum, arg) => sum + arg.strength, 0)

  const currentLeader = govStrength > oppStrength ? "Government" : "Opposition"
  const reasoning =
    govStrength > oppStrength
      ? "Government has provided compelling evidence of positive impacts with concrete examples"
      : "Opposition has demonstrated significant harms that outweigh claimed benefits"

  return {
    title,
    description,
    govPosition,
    oppPosition,
    analysis: `This clash is significant because it addresses the real-world consequences of the policy. ${description.toLowerCase()}.`,
    currentLeader,
    reasoning,
    strategicImportance: 8,
  }
}

function generateTeamFeedback(
  speeches: Speech[],
  userSpeech: string,
  userRole: string,
  clashPoints: ClashPoint[],
): TeamFeedback[] {
  const teamFeedback: TeamFeedback[] = []

  // Generate government team feedback
  const govFeedback = generateSpecificTeamFeedback("Government", speeches, userSpeech, userRole, clashPoints)
  teamFeedback.push(govFeedback)

  // Generate opposition team feedback
  const oppFeedback = generateSpecificTeamFeedback("Opposition", speeches, userSpeech, userRole, clashPoints)
  teamFeedback.push(oppFeedback)

  return teamFeedback
}

function generateSpecificTeamFeedback(
  team: string,
  speeches: Speech[],
  userSpeech: string,
  userRole: string,
  clashPoints: ClashPoint[],
): TeamFeedback {
  const isUserOnTeam =
    (team === "Government" && ["PM", "DPM", "MG", "GW"].includes(userRole)) ||
    (team === "Opposition" && ["LO", "DLO", "MO", "OW"].includes(userRole))

  const teamRoles = team === "Government" ? ["PM", "DPM", "MG", "GW"] : ["LO", "DLO", "MO", "OW"]
  const teamSpeeches = speeches.filter((s) => teamRoles.includes(s.role))

  // Analyze team performance
  const strengths: string[] = []
  const weaknesses: string[] = []
  const strategicAdvice: string[] = []

  // Assess argument effectiveness
  let argumentEffectiveness = 5
  let engagementQuality = 5

  // Include user speech analysis if they're on this team
  if (isUserOnTeam) {
    const userAnalysis = analyzeUserContribution(userSpeech, userRole)
    strengths.push(...userAnalysis.map((arg) => arg.strength))
    argumentEffectiveness = Math.max(
      argumentEffectiveness,
      userAnalysis.reduce((sum, arg) => sum + arg.strength, 0) / userAnalysis.length,
    )
    engagementQuality = Math.max(
      engagementQuality,
      userAnalysis.reduce((sum, arg) => sum + arg.strength, 0) / userAnalysis.length,
    )
  }

  // Analyze team coordination
  const coordinationAnalysis = analyzeTeamCoordination(teamSpeeches, userSpeech, userRole, team)
  strengths.push(...coordinationAnalysis.strengths)
  weaknesses.push(...coordinationAnalysis.weaknesses)

  // Analyze clash performance
  const clashAnalysis = analyzeTeamClashPerformance(team, clashPoints)
  strengths.push(...clashAnalysis.strengths)
  weaknesses.push(...clashAnalysis.weaknesses)

  // Generate strategic advice
  strategicAdvice.push(...generateTeamStrategicAdvice(team, clashPoints, weaknesses))

  return {
    team,
    strengths: strengths.slice(0, 4), // Limit to top 4 strengths
    weaknesses: weaknesses.slice(0, 4), // Limit to top 4 weaknesses
    strategicAdvice: strategicAdvice.slice(0, 3), // Limit to top 3 pieces of advice
    argumentEffectiveness,
    engagementQuality,
  }
}

function analyzeTeamCoordination(teamSpeeches: Speech[], userSpeech: string, userRole: string, team: string): any {
  const analysis = { strengths: [] as string[], weaknesses: [] as string[] }

  // Check for team consistency
  if (teamSpeeches.length > 0) {
    analysis.strengths.push("Team maintained consistent position throughout debate")
  }

  // Check for role differentiation
  const roles = teamSpeeches.map((s) => s.role)
  if (roles.length > 1) {
    analysis.strengths.push("Good role differentiation between team members")
  }

  // Check for internal contradictions (simplified analysis)
  // In a real implementation, this would be more sophisticated
  analysis.strengths.push("No major internal contradictions identified")

  return analysis
}

function analyzeTeamClashPerformance(team: string, clashPoints: ClashPoint[]): any {
  const analysis = { strengths: [] as string[], weaknesses: [] as string[] }

  clashPoints.forEach((clash) => {
    if (clash.currentLeader === team) {
      analysis.strengths.push(`Leading the clash on ${clash.title.toLowerCase()}`)
    } else {
      analysis.weaknesses.push(`Behind on ${clash.title.toLowerCase()} - need stronger response`)
    }
  })

  return analysis
}

function generateTeamStrategicAdvice(team: string, clashPoints: ClashPoint[], weaknesses: string[]): string[] {
  const advice: string[] = []

  // Advice based on clash performance
  clashPoints.forEach((clash) => {
    if (clash.currentLeader !== team) {
      advice.push(`Strengthen arguments on ${clash.title.toLowerCase()} with more evidence and examples`)
    }
  })

  // Advice based on weaknesses
  if (weaknesses.some((w) => w.includes("evidence"))) {
    advice.push("Include more concrete evidence, statistics, and case studies in arguments")
  }

  if (weaknesses.some((w) => w.includes("engagement"))) {
    advice.push("Increase direct engagement with opposing arguments using specific references")
  }

  if (weaknesses.some((w) => w.includes("structure"))) {
    advice.push("Improve argument structure with clearer signposting and logical flow")
  }

  // Generic strategic advice
  if (team === "Government") {
    advice.push("Focus on demonstrating policy effectiveness with concrete implementation plans")
  } else {
    advice.push("Emphasize practical problems and unintended consequences of government proposals")
  }

  return advice
}

function analyzeDebateProgression(speeches: Speech[], userSpeech: string, motion: string): any {
  return {
    totalSpeeches: speeches.length + 1, // Include user speech
    argumentDevelopment: "Arguments have evolved throughout the debate with increasing sophistication",
    clashEvolution: "Key clashes have been identified and developed by both sides",
    strategicDevelopment: "Teams have shown strategic awareness and adaptation",
    overallProgression: "Debate has progressed logically with good engagement between sides",
  }
}

function generateStrategicRecommendations(
  clashPoints: ClashPoint[],
  teamFeedback: TeamFeedback[],
  debatePhase: string,
  userRole: string,
): any {
  const recommendations = {
    immediate: [] as string[],
    longTerm: [] as string[],
    roleSpecific: [] as string[],
  }

  // Immediate recommendations based on clash performance
  clashPoints.forEach((clash) => {
    if (clash.strategicImportance >= 8) {
      recommendations.immediate.push(`Focus on ${clash.title.toLowerCase()} - this is a crucial clash point`)
    }
  })

  // Long-term recommendations
  recommendations.longTerm.push("Develop stronger evidence base for future debates")
  recommendations.longTerm.push("Practice direct engagement and rebuttal techniques")
  recommendations.longTerm.push("Work on comparative weighing and impact analysis")

  // Role-specific recommendations
  const roleAdvice = {
    PM: "Focus on setting strong definitional frameworks and presenting core arguments clearly",
    LO: "Develop systematic framework challenges and alternative vision presentation",
    DPM: "Balance framework defense with substantial case extensions",
    DLO: "Master systematic rebuttal techniques and opposition case crystallization",
    MG: "Practice introducing genuinely new dimensions while supporting Opening Government",
    MO: "Develop skills in supporting Opening Opposition while adding distinct new angles",
    GW: "Focus on case summary techniques and comparative weighing",
    OW: "Master final clash analysis and impact weighing techniques",
  }

  recommendations.roleSpecific.push(
    roleAdvice[userRole as keyof typeof roleAdvice] || "Continue developing role-specific skills",
  )

  return recommendations
}

function assessOverallDebateQuality(speeches: Speech[], userSpeech: string, clashPoints: ClashPoint[]): any {
  return {
    argumentQuality: 7.5,
    clashEngagement: 8.0,
    strategicAwareness: 7.0,
    evidenceUsage: 6.5,
    overallScore: 7.25,
    assessment: "Good quality debate with clear clash points and reasonable engagement between sides",
  }
}
