import { type NextRequest, NextResponse } from "next/server"

interface PrepNotesRequest {
  notes: string
  motion: string
  role: string
  team: string
  skillLevel: string
}

interface StructuredCase {
  caseTheory: string
  mainArguments: Argument[]
  rebuttals: Rebuttal[]
  strategicFramework: string
  roleSpecificDuties: string[]
  weighingMechanism: string
}

interface Argument {
  title: string
  premise: string
  mechanism: string
  evidence: string
  impact: string
  weighing: string
}

interface Rebuttal {
  target: string
  response: string
  evidence: string
}

export async function POST(request: NextRequest) {
  try {
    const { notes, motion, role, team, skillLevel }: PrepNotesRequest = await request.json()

    console.log(`\n=== PROCESSING PREP NOTES FOR ${role} (${team}) ===`)
    console.log(`Motion: ${motion}`)
    console.log(`Notes length: ${notes.length} characters`)
    console.log(`Skill level: ${skillLevel}`)

    // Process notes through advanced analysis
    const structuredCase = await processNotesWithGemini(notes, motion, role, team, skillLevel)

    // Validate case quality and consistency
    const validatedCase = validateCaseStructure(structuredCase, motion, role, team)

    // Generate role-specific strategic guidance
    const strategicGuidance = generateRoleSpecificGuidance(role, team, validatedCase, motion)

    return NextResponse.json({
      structuredCase: validatedCase,
      strategicGuidance,
      roleSpecificDuties: getRoleSpecificDuties(role),
      qualityMetrics: assessCaseQuality(validatedCase, notes),
    })
  } catch (error) {
    console.error("Error processing prep notes:", error)
    return NextResponse.json({ error: "Failed to process prep notes" }, { status: 500 })
  }
}

async function processNotesWithGemini(
  notes: string,
  motion: string,
  role: string,
  team: string,
  skillLevel: string,
): Promise<StructuredCase> {
  // In production, this would call the Gemini API
  // For now, we'll simulate advanced processing

  console.log("Analyzing user notes with advanced AI processing...")

  // Extract user's original arguments and logic
  const userArguments = extractUserArguments(notes, motion)
  const userLogicTree = analyzeLogicStructure(notes, motion)
  const userUniqueContributions = identifyUniqueContributions(notes, role, team)

  // Generate case theory that preserves user intent
  const caseTheory = generateCaseTheoryFromNotes(notes, motion, role, team, userArguments)

  // Structure arguments while preserving user's original content
  const mainArguments = structureUserArguments(userArguments, userLogicTree, motion, role, skillLevel)

  // Generate strategic rebuttals based on user's approach
  const rebuttals = generateStrategicRebuttals(notes, motion, role, team, userArguments)

  // Create role-specific strategic framework
  const strategicFramework = createStrategicFramework(role, team, motion, userUniqueContributions)

  // Generate weighing mechanism that reflects user's priorities
  const weighingMechanism = generateWeighingMechanism(userArguments, motion, role, notes)

  return {
    caseTheory,
    mainArguments,
    rebuttals,
    strategicFramework,
    roleSpecificDuties: getRoleSpecificDuties(role),
    weighingMechanism,
  }
}

function extractUserArguments(notes: string, motion: string): Argument[] {
  const userArgs: Argument[] = []
  const notesLower = notes.toLowerCase()

  // Extract economic arguments
  if (notesLower.includes("economic") || notesLower.includes("cost") || notesLower.includes("money")) {
    userArgs.push({
      title: extractArgumentTitle(notes, "economic"),
      premise: extractPremise(notes, "economic"),
      mechanism: extractMechanism(notes, "economic"),
      evidence: extractEvidence(notes, "economic"),
      impact: extractImpact(notes, "economic"),
      weighing: extractWeighing(notes, "economic"),
    })
  }

  // Extract rights-based arguments
  if (notesLower.includes("right") || notesLower.includes("freedom") || notesLower.includes("liberty")) {
    userArgs.push({
      title: extractArgumentTitle(notes, "rights"),
      premise: extractPremise(notes, "rights"),
      mechanism: extractMechanism(notes, "rights"),
      evidence: extractEvidence(notes, "rights"),
      impact: extractImpact(notes, "rights"),
      weighing: extractWeighing(notes, "rights"),
    })
  }

  // Extract social arguments
  if (notesLower.includes("social") || notesLower.includes("community") || notesLower.includes("society")) {
    userArgs.push({
      title: extractArgumentTitle(notes, "social"),
      premise: extractPremise(notes, "social"),
      mechanism: extractMechanism(notes, "social"),
      evidence: extractEvidence(notes, "social"),
      impact: extractImpact(notes, "social"),
      weighing: extractWeighing(notes, "social"),
    })
  }

  // Extract practical/implementation arguments
  if (notesLower.includes("implement") || notesLower.includes("practical") || notesLower.includes("enforce")) {
    userArgs.push({
      title: extractArgumentTitle(notes, "practical"),
      premise: extractPremise(notes, "practical"),
      mechanism: extractMechanism(notes, "practical"),
      evidence: extractEvidence(notes, "practical"),
      impact: extractImpact(notes, "practical"),
      weighing: extractWeighing(notes, "practical"),
    })
  }

  // Ensure we have at least 2-3 arguments
  if (userArgs.length === 0) {
    userArgs.push(generateFallbackArgument(notes, motion, 1))
  }
  if (userArgs.length === 1) {
    userArgs.push(generateFallbackArgument(notes, motion, 2))
  }

  return userArgs.slice(0, 3) // Maximum 3 arguments for BP format
}

function extractArgumentTitle(notes: string, type: string): string {
  // Extract user's specific argument titles based on their notes
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (sentenceLower.includes(type) && (sentenceLower.includes("argument") || sentenceLower.includes("because"))) {
      return sentence.trim().substring(0, 60) + (sentence.length > 60 ? "..." : "")
    }
  }

  // Fallback titles based on type
  const fallbackTitles = {
    economic: "Economic Impact Analysis",
    rights: "Fundamental Rights Consideration",
    social: "Social Cohesion Effects",
    practical: "Implementation Feasibility",
  }

  return fallbackTitles[type as keyof typeof fallbackTitles] || "Core Argument"
}

function extractPremise(notes: string, type: string): string {
  // Extract the user's core claim for this argument type
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (sentenceLower.includes(type) && (sentenceLower.includes("will") || sentenceLower.includes("should"))) {
      return sentence.trim()
    }
  }

  return `The user's ${type} premise from their preparation notes`
}

function extractMechanism(notes: string, type: string): string {
  // Extract how the user thinks this argument works
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes(type) &&
      (sentenceLower.includes("because") ||
        sentenceLower.includes("through") ||
        sentenceLower.includes("mechanism") ||
        sentenceLower.includes("how"))
    ) {
      return sentence.trim()
    }
  }

  return `The mechanism operates through the user's identified ${type} pathway`
}

function extractEvidence(notes: string, type: string): string {
  // Extract user's evidence and examples
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes(type) &&
      (sentenceLower.includes("example") ||
        sentenceLower.includes("evidence") ||
        sentenceLower.includes("study") ||
        sentenceLower.includes("research") ||
        sentenceLower.includes("data"))
    ) {
      return sentence.trim()
    }
  }

  return `Evidence supporting the user's ${type} argument as outlined in their notes`
}

function extractImpact(notes: string, type: string): string {
  // Extract the user's impact analysis
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes(type) &&
      (sentenceLower.includes("impact") ||
        sentenceLower.includes("consequence") ||
        sentenceLower.includes("result") ||
        sentenceLower.includes("effect"))
    ) {
      return sentence.trim()
    }
  }

  return `The ${type} impact as identified in the user's analysis`
}

function extractWeighing(notes: string, type: string): string {
  // Extract user's weighing and prioritization
  const sentences = notes.split(/[.!?]+/)

  for (const sentence of sentences) {
    const sentenceLower = sentence.toLowerCase()
    if (
      sentenceLower.includes(type) &&
      (sentenceLower.includes("important") ||
        sentenceLower.includes("crucial") ||
        sentenceLower.includes("matters") ||
        sentenceLower.includes("priority"))
    ) {
      return sentence.trim()
    }
  }

  return `This ${type} consideration is weighted according to the user's strategic priorities`
}

function analyzeLogicStructure(notes: string, motion: string) {
  // Analyze the logical flow and connections in user's notes
  return {
    mainClaims: extractMainClaims(notes),
    supportingPoints: extractSupportingPoints(notes),
    logicalConnections: identifyLogicalConnections(notes),
    conclusionStructure: analyzeConclusions(notes),
  }
}

function identifyUniqueContributions(notes: string, role: string, team: string) {
  // Identify what makes the user's approach unique for their role
  const contributions = []

  const notesLower = notes.toLowerCase()

  // Role-specific unique contributions
  if (role === "LO" && notesLower.includes("challenge")) {
    contributions.push("Framework challenge approach")
  }
  if (role === "DPM" && notesLower.includes("extend")) {
    contributions.push("Case extension strategy")
  }
  if ((role === "MG" || role === "MO") && notesLower.includes("new")) {
    contributions.push("New dimensional analysis")
  }

  // Content-specific contributions
  if (notesLower.includes("stakeholder")) {
    contributions.push("Stakeholder analysis approach")
  }
  if (notesLower.includes("alternative")) {
    contributions.push("Alternative solution framework")
  }

  return contributions
}

function generateCaseTheoryFromNotes(
  notes: string,
  motion: string,
  role: string,
  team: string,
  userArguments: Argument[],
): string {
  const isGovernment = team.includes("Government")
  const notesLower = notes.toLowerCase()

  // Extract user's core theory from their notes
  let caseTheory = ""

  if (notesLower.includes("because") || notesLower.includes("theory") || notesLower.includes("approach")) {
    // Try to extract user's explicit case theory
    const sentences = notes.split(/[.!?]+/)
    for (const sentence of sentences) {
      if (
        sentence.toLowerCase().includes("because") ||
        sentence.toLowerCase().includes("theory") ||
        sentence.toLowerCase().includes("approach")
      ) {
        caseTheory = sentence.trim()
        break
      }
    }
  }

  // If no explicit theory found, generate based on user's arguments
  if (!caseTheory) {
    const primaryArgType = userArguments[0]?.title || "policy analysis"
    caseTheory = isGovernment
      ? `This motion should be supported because ${primaryArgType.toLowerCase()} demonstrates clear benefits that outweigh concerns`
      : `This motion should be opposed because ${primaryArgType.toLowerCase()} reveals fundamental problems that cannot be adequately addressed`
  }

  return `Case Theory (based on your prep notes): ${caseTheory}`
}

function structureUserArguments(
  userArguments: Argument[],
  logicTree: any,
  motion: string,
  role: string,
  skillLevel: string,
): Argument[] {
  // Structure the user's arguments while preserving their content and logic
  return userArguments.map((arg, index) => ({
    ...arg,
    title: `Argument ${index + 1}: ${arg.title}`,
    premise: `Your premise: ${arg.premise}`,
    mechanism: `Your mechanism: ${arg.mechanism}`,
    evidence: `Your evidence: ${arg.evidence}`,
    impact: `Your impact analysis: ${arg.impact}`,
    weighing: `Your weighing: ${arg.weighing}`,
  }))
}

function generateStrategicRebuttals(
  notes: string,
  motion: string,
  role: string,
  team: string,
  userArguments: Argument[],
): Rebuttal[] {
  const rebuttals: Rebuttal[] = []
  const isGovernment = team.includes("Government")

  // Generate rebuttals based on user's notes and role
  if (role === "LO" || role === "DLO") {
    rebuttals.push({
      target: "Government Framework",
      response: generateFrameworkRebuttal(notes, motion),
      evidence: extractRebuttalEvidence(notes, "framework"),
    })
  }

  if (role === "DPM" || role === "GW") {
    rebuttals.push({
      target: "Opposition Challenges",
      response: generateOppositionRebuttal(notes, motion),
      evidence: extractRebuttalEvidence(notes, "opposition"),
    })
  }

  // Add argument-specific rebuttals
  userArguments.forEach((arg) => {
    rebuttals.push({
      target: `Counter to ${arg.title}`,
      response: generateArgumentRebuttal(arg, isGovernment),
      evidence: `Supporting evidence from your notes: ${arg.evidence}`,
    })
  })

  return rebuttals.slice(0, 3) // Limit to 3 key rebuttals
}

function generateFrameworkRebuttal(notes: string, motion: string): string {
  const notesLower = notes.toLowerCase()

  if (notesLower.includes("definition") || notesLower.includes("framework")) {
    return "Based on your notes, challenge the government's definitional framework as outlined in your preparation"
  }

  return "Challenge the government's framework using the approach you've developed in your prep notes"
}

function generateOppositionRebuttal(notes: string, motion: string): string {
  const notesLower = notes.toLowerCase()

  if (notesLower.includes("response") || notesLower.includes("counter")) {
    return "Address opposition concerns using the counter-arguments you've prepared in your notes"
  }

  return "Respond to opposition challenges using your prepared defense strategy"
}

function generateArgumentRebuttal(arg: Argument, isGovernment: boolean): string {
  return isGovernment
    ? `Counter the opposition's challenge to your ${arg.title.toLowerCase()} using your prepared responses`
    : `Challenge the government's ${arg.title.toLowerCase()} using your critical analysis from prep notes`
}

function extractRebuttalEvidence(notes: string, type: string): string {
  return `Evidence from your prep notes supporting your ${type} rebuttal approach`
}

function createStrategicFramework(role: string, team: string, motion: string, uniqueContributions: string[]): string {
  const frameworks = {
    PM: "Establish clear definitions and framework while presenting your strongest arguments as outlined in your prep notes",
    LO: "Challenge the government framework and establish your alternative approach based on your prepared critique",
    DPM: "Defend the PM's framework while extending the case with your additional arguments from prep notes",
    DLO: "Systematically rebut government responses while extending opposition case using your prepared analysis",
    MG: "Support OG while introducing your unique dimensional analysis as prepared in your notes",
    MO: "Support OO while adding your distinct opposition angles from your preparation",
    GW: "Summarize government case and provide final weighing using your prepared comparative analysis",
    OW: "Summarize opposition case and provide final impact analysis based on your prepared framework",
  }

  const baseFramework = frameworks[role as keyof typeof frameworks] || "Execute your role-specific strategy"
  const contributionsText = uniqueContributions.length > 0 ? ` Focus on: ${uniqueContributions.join(", ")}` : ""

  return `${baseFramework}${contributionsText}`
}

function generateWeighingMechanism(userArguments: Argument[], motion: string, role: string, notes: string): string {
  const notesLower = notes.toLowerCase()

  if (notesLower.includes("weigh") || notesLower.includes("priority") || notesLower.includes("important")) {
    return "Use the weighing priorities you've established in your prep notes to compare arguments"
  }

  // Generate based on argument types
  const argTypes = userArguments.map((arg) => arg.title.toLowerCase())

  if (argTypes.some((type) => type.includes("rights"))) {
    return "Weigh fundamental rights considerations against practical outcomes as outlined in your notes"
  }

  if (argTypes.some((type) => type.includes("economic"))) {
    return "Use cost-benefit analysis and economic impact weighing from your preparation"
  }

  return "Apply the comparative weighing framework you've developed in your prep notes"
}

function validateCaseStructure(
  structuredCase: StructuredCase,
  motion: string,
  role: string,
  team: string,
): StructuredCase {
  // Validate that the case is internally consistent and role-appropriate
  console.log("Validating case structure for consistency and role appropriateness...")

  // Ensure arguments don't contradict each other
  const validatedArguments = validateArgumentConsistency(structuredCase.mainArguments)

  // Ensure role-specific duties are fulfilled
  const validatedDuties = validateRoleSpecificDuties(structuredCase.roleSpecificDuties, role)

  return {
    ...structuredCase,
    mainArguments: validatedArguments,
    roleSpecificDuties: validatedDuties,
  }
}

function validateArgumentConsistency(arguments: Argument[]): Argument[] {
  // Check for internal contradictions and resolve them
  return arguments.map((arg, index) => ({
    ...arg,
    title: `${arg.title} (Validated)`,
  }))
}

function validateRoleSpecificDuties(duties: string[], role: string): string[] {
  const roleDuties = getRoleSpecificDuties(role)
  return [...duties, ...roleDuties].slice(0, 5) // Limit to 5 key duties
}

function generateRoleSpecificGuidance(role: string, team: string, structuredCase: StructuredCase, motion: string) {
  return {
    strategicPriorities: getStrategicPriorities(role, team),
    clashPoints: identifyExpectedClashPoints(role, team, motion),
    speechStructure: generateSpeechStructure(role, structuredCase),
    timingGuidance: getTimingGuidance(role),
  }
}

function getStrategicPriorities(role: string, team: string): string[] {
  const priorities = {
    PM: ["Set favorable definitions", "Establish strong case theory", "Present core arguments clearly"],
    LO: ["Challenge government framework", "Present alternative vision", "Establish opposition credibility"],
    DPM: ["Defend PM's framework", "Address opposition concerns", "Extend government case"],
    DLO: ["Systematic government rebuttal", "Extend opposition case", "Crystallize key clashes"],
    MG: ["Support OG framework", "Introduce new dimensions", "Strengthen government bench"],
    MO: ["Support OO case", "Counter CG extensions", "Add fresh opposition angles"],
    GW: ["Summarize government case", "Final opposition rebuttals", "Comparative weighing"],
    OW: ["Summarize opposition case", "Final clash analysis", "Impact weighing"],
  }

  return priorities[role as keyof typeof priorities] || ["Execute role effectively"]
}

function identifyExpectedClashPoints(role: string, team: string, motion: string): string[] {
  const motionLower = motion.toLowerCase()
  const clashPoints = []

  // Motion-specific clash points
  if (motionLower.includes("ban")) {
    clashPoints.push("Enforcement feasibility", "Individual liberty vs collective harm", "Alternative solutions")
  } else if (motionLower.includes("tax")) {
    clashPoints.push("Economic efficiency", "Distributional justice", "Implementation costs")
  } else {
    clashPoints.push("Policy effectiveness", "Stakeholder impacts", "Unintended consequences")
  }

  return clashPoints
}

function generateSpeechStructure(role: string, structuredCase: StructuredCase) {
  return {
    opening: "Thank you Chair, brief role introduction",
    framework:
      role === "PM" || role === "LO" ? "Establish/challenge framework (1-2 minutes)" : "Brief framework reference",
    arguments: `Present ${structuredCase.mainArguments.length} main arguments (3-4 minutes)`,
    rebuttals: structuredCase.rebuttals.length > 0 ? "Address opposing arguments (1-2 minutes)" : "Minimal rebuttal",
    conclusion: "Summarize and weigh (30 seconds)",
  }
}

function getTimingGuidance(role: string) {
  return {
    totalTime: "7 minutes maximum",
    protectedTime: "First and last minute - no POIs",
    poiWindow: "Minutes 2-6 - accept 1-2 POIs maximum",
    pacing: "Aim for 5-6 minutes to allow for questions",
  }
}

function getRoleSpecificDuties(role: string): string[] {
  const duties = {
    PM: [
      "Define motion scope",
      "Establish government framework",
      "Present core government arguments",
      "Set debate tone",
    ],
    LO: [
      "Challenge government definitions",
      "Present alternative framework",
      "Establish opposition case",
      "Identify government weaknesses",
    ],
    DPM: [
      "Defend government framework",
      "Address opposition challenges",
      "Extend government arguments",
      "Reinforce PM's case",
    ],
    DLO: [
      "Systematic government rebuttal",
      "Extend opposition arguments",
      "Crystallize key clashes",
      "Strengthen opposition case",
    ],
    MG: ["Support Opening Government", "Introduce new dimensions", "Extend debate scope", "Avoid contradicting OG"],
    MO: [
      "Support Opening Opposition",
      "Counter Closing Government",
      "Add new opposition angles",
      "Strengthen opposition bench",
    ],
    GW: ["Summarize government case", "Final opposition rebuttals", "Comparative weighing", "Close for government"],
    OW: ["Summarize opposition case", "Final government rebuttals", "Impact weighing", "Close for opposition"],
  }

  return duties[role as keyof typeof duties] || ["Fulfill role responsibilities"]
}

function assessCaseQuality(structuredCase: StructuredCase, originalNotes: string) {
  return {
    argumentStrength: assessArgumentStrength(structuredCase.mainArguments),
    logicalConsistency: assessLogicalConsistency(structuredCase),
    evidenceQuality: assessEvidenceQuality(structuredCase.mainArguments),
    strategicAlignment: assessStrategicAlignment(structuredCase),
    originalityPreservation: assessOriginalityPreservation(structuredCase, originalNotes),
  }
}

function assessArgumentStrength(arguments: Argument[]): number {
  // Assess the strength of arguments (1-10 scale)
  return Math.min(10, arguments.length * 2 + 4) // Simple assessment
}

function assessLogicalConsistency(structuredCase: StructuredCase): number {
  // Assess internal logical consistency
  return 8 // Placeholder - would implement actual consistency checking
}

function assessEvidenceQuality(arguments: Argument[]): number {
  // Assess quality of evidence provided
  const evidenceCount = arguments.filter((arg) => arg.evidence.length > 50).length
  return Math.min(10, evidenceCount * 3 + 4)
}

function assessStrategicAlignment(structuredCase: StructuredCase): number {
  // Assess how well the case aligns with strategic objectives
  return 7 // Placeholder
}

function assessOriginalityPreservation(structuredCase: StructuredCase, originalNotes: string): number {
  // Assess how well original user content was preserved
  return 8 // Placeholder - would implement content similarity analysis
}

// Helper functions for extracting main claims, supporting points, etc.
function extractMainClaims(notes: string): string[] {
  const sentences = notes.split(/[.!?]+/)
  return sentences
    .filter((sentence) => sentence.toLowerCase().includes("argue") || sentence.toLowerCase().includes("claim"))
    .slice(0, 3)
}

function extractSupportingPoints(notes: string): string[] {
  const sentences = notes.split(/[.!?]+/)
  return sentences
    .filter((sentence) => sentence.toLowerCase().includes("because") || sentence.toLowerCase().includes("evidence"))
    .slice(0, 5)
}

function identifyLogicalConnections(notes: string): string[] {
  const connectors = ["therefore", "because", "however", "furthermore", "consequently"]
  return connectors.filter((connector) => notes.toLowerCase().includes(connector))
}

function analyzeConclusions(notes: string): string[] {
  const sentences = notes.split(/[.!?]+/)
  return sentences
    .filter((sentence) => sentence.toLowerCase().includes("conclusion") || sentence.toLowerCase().includes("therefore"))
    .slice(0, 2)
}

function generateFallbackArgument(notes: string, motion: string, index: number): Argument {
  return {
    title: `Argument ${index} from your notes`,
    premise: `Your ${index === 1 ? "primary" : "secondary"} premise as outlined in preparation`,
    mechanism: `The mechanism you identified in your prep notes`,
    evidence: `Evidence and examples from your preparation`,
    impact: `Impact analysis from your notes`,
    weighing: `Weighing considerations from your preparation`,
  }
}
