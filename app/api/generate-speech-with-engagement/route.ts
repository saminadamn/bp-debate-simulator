import { type NextRequest, NextResponse } from "next/server"

interface SpeechRequest {
  motion: string
  role: string
  previousSpeeches: Speech[]
  userNotes: string
  userSkillLevel: string
  userSpeech: string
  structuredCase?: any
}

interface Speech {
  role: string
  content: string
  isAI: boolean
  timestamp?: number
}

interface EngagementAnalysis {
  directReferences: string[]
  rebuttals: string[]
  extensions: string[]
  clashPoints: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { motion, role, previousSpeeches, userNotes, userSkillLevel, userSpeech, structuredCase }: SpeechRequest =
      await request.json()

    console.log(`\n=== GENERATING ENGAGED SPEECH FOR ${role} ===`)
    console.log(`Motion: ${motion}`)
    console.log(`Previous speeches: ${previousSpeeches.length}`)
    console.log(`User speech length: ${userSpeech.length}`)

    // Analyze previous speeches for engagement opportunities
    const engagementAnalysis = analyzePreviousSpeeches(previousSpeeches, userSpeech, role)

    // Generate debate state summary
    const debateState = summarizeDebateState(motion, previousSpeeches, userSpeech, role)

    // Generate speech with direct engagement
    const speech = generateEngagedSpeech({
      motion,
      role,
      previousSpeeches,
      userSpeech,
      userSkillLevel,
      engagementAnalysis,
      debateState,
      structuredCase,
    })

    // Analyze engagement quality
    const engagementQuality = assessEngagementQuality(speech, engagementAnalysis)

    return NextResponse.json({
      speech,
      engagementAnalysis,
      debateState,
      engagementQuality,
      clashPoints: identifyNewClashPoints(speech, previousSpeeches, userSpeech),
    })
  } catch (error) {
    console.error("Error generating engaged speech:", error)
    return NextResponse.json({ error: "Failed to generate engaged speech" }, { status: 500 })
  }
}

function analyzePreviousSpeeches(
  previousSpeeches: Speech[],
  userSpeech: string,
  currentRole: string,
): EngagementAnalysis {
  console.log("Analyzing previous speeches for engagement opportunities...")

  const directReferences: string[] = []
  const rebuttals: string[] = []
  const extensions: string[] = []
  const clashPoints: string[] = []

  // Analyze user's speech first
  const userArguments = extractKeyArguments(userSpeech)
  const userClaims = extractKeyClaims(userSpeech)

  console.log(`User arguments identified: ${userArguments.length}`)
  console.log(`User claims identified: ${userClaims.length}`)

  // Analyze each previous AI speech for engagement opportunities
  previousSpeeches.forEach((speech) => {
    if (speech.isAI && speech.role !== currentRole) {
      const speechArguments = extractKeyArguments(speech.content)
      const speechClaims = extractKeyClaims(speech.content)

      // Identify direct reference opportunities
      speechClaims.forEach((claim) => {
        directReferences.push(`${speech.role} claimed: "${claim}"`)
      })

      // Identify rebuttal opportunities
      if (isOpposingTeam(speech.role, currentRole)) {
        speechArguments.forEach((arg) => {
          rebuttals.push(`Counter ${speech.role}'s argument about ${arg}`)
        })
      }

      // Identify extension opportunities
      if (isSameTeam(speech.role, currentRole)) {
        speechArguments.forEach((arg) => {
          extensions.push(`Extend ${speech.role}'s point about ${arg}`)
        })
      }

      // Identify clash points
      userArguments.forEach((userArg) => {
        speechArguments.forEach((speechArg) => {
          if (areClashingArguments(userArg, speechArg)) {
            clashPoints.push(`Clash between user's ${userArg} and ${speech.role}'s ${speechArg}`)
          }
        })
      })
    }
  })

  console.log(`Engagement analysis complete:`)
  console.log(`- Direct references: ${directReferences.length}`)
  console.log(`- Rebuttals: ${rebuttals.length}`)
  console.log(`- Extensions: ${extensions.length}`)
  console.log(`- Clash points: ${clashPoints.length}`)

  return { directReferences, rebuttals, extensions, clashPoints }
}

function extractKeyArguments(speechContent: string): string[] {
  const args: string[] = []
  const content = speechContent.toLowerCase()

  // Extract argument indicators
  const argumentPatterns = [
    /first argument[^.]*\.?/gi,
    /second argument[^.]*\.?/gi,
    /third argument[^.]*\.?/gi,
    /my argument is[^.]*\.?/gi,
    /i argue that[^.]*\.?/gi,
    /the reason is[^.]*\.?/gi,
  ]

  argumentPatterns.forEach((pattern) => {
    const matches = speechContent.match(pattern)
    if (matches) {
      args.push(...matches.map((match) => match.trim()))
    }
  })

  // Extract topic-based arguments
  if (content.includes("economic")) args.push("economic argument")
  if (content.includes("rights") || content.includes("freedom")) args.push("rights argument")
  if (content.includes("social") || content.includes("community")) args.push("social argument")
  if (content.includes("practical") || content.includes("implementation")) args.push("practical argument")
  if (content.includes("environment") || content.includes("climate")) args.push("environmental argument")

  return args.slice(0, 5) // Limit to top 5 arguments
}

function extractKeyClaims(speechContent: string): string[] {
  const claims: string[] = []

  // Extract sentences that contain strong claims
  const sentences = speechContent.split(/[.!?]+/)

  sentences.forEach((sentence) => {
    const sentenceLower = sentence.toLowerCase().trim()
    if (
      sentenceLower.length > 20 &&
      (sentenceLower.includes("will") ||
        sentenceLower.includes("must") ||
        sentenceLower.includes("should") ||
        sentenceLower.includes("because") ||
        sentenceLower.includes("therefore"))
    ) {
      claims.push(sentence.trim())
    }
  })

  return claims.slice(0, 3) // Limit to top 3 claims
}

function isOpposingTeam(role1: string, role2: string): boolean {
  const govRoles = ["PM", "DPM", "MG", "GW"]
  const oppRoles = ["LO", "DLO", "MO", "OW"]

  return (
    (govRoles.includes(role1) && oppRoles.includes(role2)) || (oppRoles.includes(role1) && govRoles.includes(role2))
  )
}

function isSameTeam(role1: string, role2: string): boolean {
  const govRoles = ["PM", "DPM", "MG", "GW"]
  const oppRoles = ["LO", "DLO", "MO", "OW"]

  return (
    (govRoles.includes(role1) && govRoles.includes(role2)) || (oppRoles.includes(role1) && oppRoles.includes(role2))
  )
}

function areClashingArguments(arg1: string, arg2: string): boolean {
  // Simple clash detection - would be more sophisticated in production
  const arg1Lower = arg1.toLowerCase()
  const arg2Lower = arg2.toLowerCase()

  // Economic clashes
  if (arg1Lower.includes("economic") && arg2Lower.includes("economic")) {
    return true
  }

  // Rights clashes
  if (
    (arg1Lower.includes("rights") || arg1Lower.includes("freedom")) &&
    (arg2Lower.includes("rights") || arg2Lower.includes("freedom"))
  ) {
    return true
  }

  // Implementation clashes
  if (
    (arg1Lower.includes("practical") || arg1Lower.includes("implementation")) &&
    (arg2Lower.includes("practical") || arg2Lower.includes("implementation"))
  ) {
    return true
  }

  return false
}

function summarizeDebateState(
  motion: string,
  previousSpeeches: Speech[],
  userSpeech: string,
  currentRole: string,
): string {
  const govSpeeches = previousSpeeches.filter((s) => ["PM", "DPM", "MG", "GW"].includes(s.role))
  const oppSpeeches = previousSpeeches.filter((s) => ["LO", "DLO", "MO", "OW"].includes(s.role))

  let summary = `DEBATE STATE SUMMARY:\n\n`
  summary += `Motion: ${motion}\n\n`

  // Summarize government position
  if (govSpeeches.length > 0) {
    summary += `GOVERNMENT POSITION:\n`
    govSpeeches.forEach((speech) => {
      const keyPoints = extractKeyArguments(speech.content).slice(0, 2)
      summary += `- ${speech.role}: ${keyPoints.join(", ") || "Core government arguments"}\n`
    })
    summary += `\n`
  }

  // Summarize opposition position
  if (oppSpeeches.length > 0) {
    summary += `OPPOSITION POSITION:\n`
    oppSpeeches.forEach((speech) => {
      const keyPoints = extractKeyArguments(speech.content).slice(0, 2)
      summary += `- ${speech.role}: ${keyPoints.join(", ") || "Core opposition arguments"}\n`
    })
    summary += `\n`
  }

  // Add user's contribution
  const userTeam = ["PM", "DPM", "MG", "GW"].includes(currentRole) ? "GOVERNMENT" : "OPPOSITION"
  const userRole = getRoleName(currentRole)
  const userKeyPoints = extractKeyArguments(userSpeech).slice(0, 2)

  summary += `YOUR CONTRIBUTION (${userTeam}):\n`
  summary += `- ${userRole}: ${userKeyPoints.join(", ") || "Your key arguments"}\n\n`

  summary += `CURRENT SPEAKER: ${getRoleName(currentRole)}\n`

  return summary
}

function generateEngagedSpeech(params: {
  motion: string
  role: string
  previousSpeeches: Speech[]
  userSpeech: string
  userSkillLevel: string
  engagementAnalysis: EngagementAnalysis
  debateState: string
  structuredCase?: any
}): string {
  const { motion, role, engagementAnalysis, debateState, userSpeech } = params

  console.log(`Generating engaged speech for ${role}...`)

  // Generate role-specific engaged speech
  switch (role) {
    case "LO":
      return generateLOEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "DPM":
      return generateDPMEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "DLO":
      return generateDLOEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "MG":
      return generateMGEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "MO":
      return generateMOEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "GW":
      return generateGWEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    case "OW":
      return generateOWEngagedSpeech(motion, userSpeech, engagementAnalysis, debateState)
    default:
      return generateGenericEngagedSpeech(role, motion, userSpeech, engagementAnalysis)
  }
}

function generateLOEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Leader of the Opposition, I rise to fundamentally challenge the motion: "${motion}"

**DIRECT RESPONSE TO PRIME MINISTER**

The Prime Minister just argued ${userArguments[0] || "for this motion"}, but I'm afraid their analysis contains critical flaws that undermine their entire case.

${generateDirectRebuttals(engagement.directReferences, "PM")}

**SYSTEMATIC CHALLENGE TO GOVERNMENT FRAMEWORK**

Let me address the PM's core arguments directly:

${generateSystematicRebuttals(userArguments, engagement)}

**OPPOSITION CASE: WHY THIS MOTION FAILS**

Beyond merely responding to the government, I present three fundamental reasons why this motion is not just wrong, but actively harmful:

**First Opposition Argument: ${generateOppositionArgument(motion, userArguments, 1)}**

This directly contradicts the PM's claim that ${userArguments[0] || "their policy will work"}. The mechanism actually operates in reverse...

**Second Opposition Argument: ${generateOppositionArgument(motion, userArguments, 2)}**

While the PM focused on ${userArguments[1] || "theoretical benefits"}, they ignored the practical reality that...

**Third Opposition Argument: ${generateOppositionArgument(motion, userArguments, 3)}**

The PM's entire framework fails because...

**WEIGHING AND CONCLUSION**

The Prime Minister asks us to accept their vision based on ${extractPMClaim(userSpeech)}, but we have demonstrated concrete, measurable harms that will result.

The fundamental clash here is clear: they believe ${extractGovBelief(userSpeech)}, while we have shown ${generateOppCounterBelief(motion)}.

For these reasons, we firmly oppose this motion.

Thank you.`
}

function generateDPMEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Deputy Prime Minister, I rise to reinforce our framework while directly addressing the Leader of Opposition's challenges.

**DEFENDING THE PRIME MINISTER'S CASE**

The Leader of Opposition attempted to undermine the PM's arguments about ${userArguments[0] || "our core case"}, but their challenges fail for several critical reasons:

${generateFrameworkDefense(engagement.rebuttals, userArguments)}

**SYSTEMATIC RESPONSE TO OPPOSITION CHALLENGES**

Let me address each of the LO's specific attacks:

${generateDirectOppositionResponse(engagement.directReferences, userArguments)}

**EXTENDING THE GOVERNMENT CASE**

Beyond defending our position, I present additional substantive material that strengthens our case:

**Government Extension 1: ${generateGovExtension(motion, userArguments, 1)}**

This builds on the PM's argument about ${userArguments[0] || "our first point"} by demonstrating...

**Government Extension 2: ${generateGovExtension(motion, userArguments, 2)}**

While the PM established ${userArguments[1] || "our framework"}, I want to extend this analysis to show...

**STRATEGIC ANALYSIS OF OPPOSITION APPROACH**

The Opposition's strategy is clear: they want to ${extractOppStrategy(engagement)} while ignoring ${generateGovCounterpoint(motion)}.

This approach fails because it fundamentally misunderstands ${generateStrategicCritique(motion, userArguments)}.

**CONCLUSION**

The Opposition has failed to address our core arguments while we have demonstrated both the necessity and feasibility of this motion.

Our case stands stronger than ever.

Thank you.`
}

function generateDLOEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Deputy Leader of Opposition, I will systematically dismantle the government's responses while extending our opposition case.

**GOVERNMENT RESPONSES FAIL**

The Deputy Prime Minister claimed to address our concerns about ${userArguments[0] || "their policy"}, but their responses are fundamentally inadequate:

${generateDPMResponseCritique(engagement.rebuttals, userArguments)}

**SYSTEMATIC REBUTTAL OF GOVERNMENT CASE**

Let me address the government's arguments systematically:

${generateSystematicGovernmentRebuttal(engagement.directReferences, userArguments)}

**EXTENDING THE OPPOSITION CASE**

Building upon the Leader of Opposition's foundation, I present additional analysis:

**Opposition Extension 1: ${generateOppExtension(motion, userArguments, 1)}**

This deepens our analysis of why the PM's argument about ${userArguments[0] || "their first point"} fails...

**Opposition Extension 2: ${generateOppExtension(motion, userArguments, 2)}**

Beyond the LO's critique of ${userArguments[1] || "government framework"}, I demonstrate...

**CRYSTALLIZING THE CLASH**

The fundamental clash in this debate is now clear: ${generateClashCrystallization(motion, engagement, userArguments)}

The government wants us to believe ${extractGovCentralClaim(userSpeech)}, but this ignores ${generateOppCounterClaim(motion)}.

**CONCLUSION**

The government's case crumbles under systematic analysis. They have failed to address our core concerns while we have demonstrated why this motion is fundamentally flawed.

Thank you.`
}

function generateMGEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Member of Government, I bring a fresh perspective while supporting the Opening Government's framework.

**SUPPORTING OPENING GOVERNMENT**

The Opening Government established a solid foundation with their arguments about ${userArguments[0] || "core policy benefits"} and ${userArguments[1] || "implementation strategy"}.

I want to reinforce their analysis by ${generateOGSupport(userArguments, engagement)}.

**RESPONDING TO OPENING OPPOSITION**

The Opening Opposition raised concerns, but they fail to account for crucial dimensions that I will now explore:

${generateOOResponse(engagement.rebuttals, motion)}

**NEW GOVERNMENT DIMENSION: ${generateMGNewDimension(motion, userArguments)}**

This angle is crucial because the Opening Government couldn't fully explore ${generateMGJustification(motion, userArguments)} in their time.

**CG Argument 1: ${generateCGArgument(motion, userArguments, 1)}**

This extends beyond the PM's focus on ${userArguments[0] || "immediate benefits"} to demonstrate...

**CG Argument 2: ${generateCGArgument(motion, userArguments, 2)}**

While the DPM addressed ${userArguments[1] || "opposition concerns"}, I want to show how...

**CLOSING GOVERNMENT STRATEGY**

As Closing Government, we occupy a unique position. We can see both the Opening Government's framework and the Opposition's concerns, allowing us to present a more complete analysis.

The Opposition bench has focused on ${extractOppFocus(engagement)}, but they've missed ${generateCGCounterpoint(motion)}.

**CONCLUSION**

Together with the Opening Government, we present a comprehensive case that addresses both immediate concerns and long-term implications.

Thank you.`
}

function generateMOEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Member of Opposition, I stand with the Opening Opposition while bringing crucial new analysis.

**SUPPORTING OPENING OPPOSITION**

The Opening Opposition correctly identified the fundamental flaws in this motion. The LO's argument about ${userArguments[0] || "policy failure"} and the DLO's extension regarding ${userArguments[1] || "implementation problems"} form a solid foundation.

I reinforce their analysis by ${generateOOSupport(userArguments, engagement)}.

**RESPONDING TO CLOSING GOVERNMENT**

The Member of Government attempted to introduce new dimensions, but ${generateCGResponse(engagement.directReferences, motion)}.

Their argument about ${extractCGClaim(engagement)} actually strengthens our case because...

**NEW OPPOSITION DIMENSION: ${generateMONewDimension(motion, userArguments)}**

This critical angle hasn't been fully explored: ${generateMOJustification(motion, userArguments)}.

**CO Argument 1: ${generateCOArgument(motion, userArguments, 1)}**

This builds on the OO's analysis of ${userArguments[0] || "government failure"} by demonstrating...

**CO Argument 2: ${generateCOArgument(motion, userArguments, 2)}**

Beyond the Opening Opposition's critique of ${userArguments[1] || "policy framework"}, I show how...

**CLOSING OPPOSITION STRATEGY**

As Closing Opposition, we must demonstrate why even the government's extended case fails to justify this motion.

The government bench has tried to ${extractGovStrategy(engagement)}, but they cannot escape the fundamental problems we've identified.

**CONCLUSION**

The government bench, despite their attempts to shore up their case, has failed to address the core issues we've raised.

Thank you.`
}

function generateGWEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Government Whip, I have the privilege of summarizing our case and providing final analysis.

**GOVERNMENT CASE SUMMARY**

Throughout this debate, the government bench has presented a comprehensive case:

The Prime Minister established ${userArguments[0] || "our core framework"} and demonstrated ${userArguments[1] || "policy necessity"}.

The Deputy Prime Minister reinforced this by ${generateDPMSummary(engagement)} while addressing opposition concerns.

The Member of Government extended our case with ${generateMGSummary(engagement)}, showing dimensions the Opening Government couldn't fully explore.

**FINAL RESPONSE TO OPPOSITION**

Let me address the opposition's arguments systematically:

${generateFinalOppositionResponse(engagement.rebuttals, userArguments)}

**COMPARATIVE WEIGHING**

When we weigh the arguments presented by both sides:

${generateComparativeWeighing(engagement, userArguments, motion)}

**FINAL GOVERNMENT ARGUMENTS**

${generateFinalGovArguments(motion, userArguments, engagement)}

**CONCLUSION**

Chair, this debate has demonstrated that ${motion.toLowerCase()} is not just beneficial, but essential.

The opposition's concerns are either manageable or outweighed by the significant benefits we've outlined.

The choice is clear. We must support this motion.

Thank you.`
}

function generateOWEngagedSpeech(
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
  debateState: string,
): string {
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As Opposition Whip, I will summarize our case and demonstrate why this motion must be rejected.

**OPPOSITION CASE SUMMARY**

The opposition bench has presented a devastating critique:

The Leader of Opposition showed ${userArguments[0] || "fundamental policy flaws"} and established ${userArguments[1] || "our alternative framework"}.

The Deputy Leader systematically dismantled government responses by ${generateDLOSummary(engagement)}.

The Member of Opposition brought crucial new analysis showing ${generateMOSummary(engagement)}.

**GOVERNMENT CASE FAILURES**

Despite their attempts, the government has failed to address our core concerns:

${generateGovFailureAnalysis(engagement.rebuttals, userArguments)}

**FINAL CLASH ANALYSIS**

The fundamental clash in this debate is ${generateFinalClashAnalysis(engagement, motion, userArguments)}.

**IMPACT WEIGHING**

When we consider the real-world impacts:

${generateImpactWeighing(engagement, userArguments, motion)}

**FINAL OPPOSITION ARGUMENTS**

${generateFinalOppArguments(motion, userArguments, engagement)}

**CONCLUSION**

Chair, this motion is fundamentally flawed. The government has failed to meet their burden of proof while we have demonstrated significant harms.

We urge you to reject this motion.

Thank you.`
}

function generateGenericEngagedSpeech(
  role: string,
  motion: string,
  userSpeech: string,
  engagement: EngagementAnalysis,
): string {
  const roleName = getRoleName(role)
  const userArguments = extractKeyArguments(userSpeech).slice(0, 2)

  return `Thank you, Chair. As ${roleName}, I will engage directly with the arguments presented.

**DIRECT ENGAGEMENT WITH PREVIOUS SPEAKERS**

${generateGenericEngagement(engagement, userArguments)}

**MY CONTRIBUTION TO THE DEBATE**

${generateGenericContribution(role, motion, userArguments)}

**CONCLUSION**

${generateGenericConclusion(role, motion)}

Thank you.`
}

// Helper functions for generating specific content sections

function generateDirectRebuttals(directReferences: string[], targetRole: string): string {
  if (directReferences.length === 0) {
    return "The Prime Minister's arguments lack the foundation necessary to support this motion."
  }

  return directReferences
    .slice(0, 2)
    .map((ref) => `${ref} - but this analysis is fundamentally flawed because...`)
    .join("\n\n")
}

function generateSystematicRebuttals(userArguments: string[], engagement: EngagementAnalysis): string {
  let rebuttals = ""

  userArguments.forEach((arg, index) => {
    rebuttals += `\n**Rebuttal ${index + 1}: ${arg}**\n`
    rebuttals += `The PM's argument fails because it ignores crucial counterevidence and relies on unsubstantiated assumptions.\n`
  })

  return rebuttals || "The PM's arguments lack empirical support and ignore crucial implementation challenges."
}

function generateOppositionArgument(motion: string, userArguments: string[], index: number): string {
  const argTypes = ["Enforcement Impossibility", "Stakeholder Harm Analysis", "Superior Alternatives"]
  return argTypes[index - 1] || `Opposition Argument ${index}`
}

function extractPMClaim(userSpeech: string): string {
  const claims = extractKeyClaims(userSpeech)
  return claims[0] || "theoretical benefits without concrete evidence"
}

function extractGovBelief(userSpeech: string): string {
  return "policy intervention will solve complex social problems"
}

function generateOppCounterBelief(motion: string): string {
  return "such interventions create more problems than they solve"
}

function generateFrameworkDefense(rebuttals: string[], userArguments: string[]): string {
  return "The opposition's challenges ignore the practical realities of implementation and the documented success of similar policies."
}

function generateDirectOppositionResponse(directReferences: string[], userArguments: string[]): string {
  return directReferences
    .slice(0, 2)
    .map((ref) => `Regarding ${ref}: This challenge misunderstands our core mechanism...`)
    .join("\n\n")
}

function generateGovExtension(motion: string, userArguments: string[], index: number): string {
  const extensions = ["International Competitiveness", "Long-term Sustainability", "Stakeholder Empowerment"]
  return extensions[index - 1] || `Government Extension ${index}`
}

function extractOppStrategy(engagement: EngagementAnalysis): string {
  return "focus on theoretical problems while ignoring practical solutions"
}

function generateGovCounterpoint(motion: string): string {
  return "the concrete benefits and safeguards we've outlined"
}

function generateStrategicCritique(motion: string, userArguments: string[]): string {
  return "the balance between individual concerns and collective welfare"
}

// Additional helper functions would continue in similar pattern...

function getRoleName(role: string): string {
  const names = {
    PM: "Prime Minister",
    LO: "Leader of Opposition",
    DPM: "Deputy Prime Minister",
    DLO: "Deputy Leader of Opposition",
    MG: "Member of Government",
    MO: "Member of Opposition",
    GW: "Government Whip",
    OW: "Opposition Whip",
  }
  return names[role as keyof typeof names] || role
}

function assessEngagementQuality(speech: string, engagement: EngagementAnalysis): any {
  return {
    directReferences: countDirectReferences(speech),
    rebuttalsIncluded: countRebuttals(speech),
    clashEngagement: assessClashEngagement(speech, engagement),
    overallScore: calculateEngagementScore(speech, engagement),
  }
}

function countDirectReferences(speech: string): number {
  const referencePatterns = [
    /the prime minister/gi,
    /the leader of opposition/gi,
    /the deputy/gi,
    /the member of/gi,
    /they argued/gi,
    /they claimed/gi,
  ]

  return referencePatterns.reduce((count, pattern) => {
    const matches = speech.match(pattern)
    return count + (matches ? matches.length : 0)
  }, 0)
}

function countRebuttals(speech: string): number {
  const rebuttalPatterns = [/however/gi, /but/gi, /fails because/gi, /ignores/gi, /overlooks/gi]

  return rebuttalPatterns.reduce((count, pattern) => {
    const matches = speech.match(pattern)
    return count + (matches ? matches.length : 0)
  }, 0)
}

function assessClashEngagement(speech: string, engagement: EngagementAnalysis): number {
  // Assess how well the speech engages with identified clash points
  return Math.min(10, engagement.clashPoints.length * 2 + 4)
}

function calculateEngagementScore(speech: string, engagement: EngagementAnalysis): number {
  const references = countDirectReferences(speech)
  const rebuttals = countRebuttals(speech)
  const clashEngagement = assessClashEngagement(speech, engagement)

  return Math.min(10, (references + rebuttals + clashEngagement) / 3)
}

function identifyNewClashPoints(speech: string, previousSpeeches: Speech[], userSpeech: string): string[] {
  // Identify new clash points created by this speech
  const newClashes = []

  const speechArguments = extractKeyArguments(speech)
  const userArguments = extractKeyArguments(userSpeech)

  speechArguments.forEach((speechArg) => {
    userArguments.forEach((userArg) => {
      if (areClashingArguments(speechArg, userArg)) {
        newClashes.push(`New clash: ${speechArg} vs ${userArg}`)
      }
    })
  })

  return newClashes.slice(0, 3)
}

// Placeholder implementations for remaining helper functions
function generateDPMResponseCritique(rebuttals: string[], userArguments: string[]): string {
  return "Their framework defense ignores practical implementation realities and fails to address our core concerns."
}

function generateSystematicGovernmentRebuttal(directReferences: string[], userArguments: string[]): string {
  return "Each government argument fails systematic analysis and relies on unsubstantiated assumptions."
}

function generateOppExtension(motion: string, userArguments: string[], index: number): string {
  const extensions = ["Democratic Legitimacy Crisis", "Intergenerational Justice", "Cultural Impact Analysis"]
  return extensions[index - 1] || `Opposition Extension ${index}`
}

function generateClashCrystallization(motion: string, engagement: EngagementAnalysis, userArguments: string[]): string {
  return "between the government's technocratic faith and our evidence-based analysis of implementation realities"
}

function extractGovCentralClaim(userSpeech: string): string {
  return "technical solutions can solve complex social problems"
}

function generateOppCounterClaim(motion: string): string {
  return "the political and social context that determines policy success"
}

// Continue with remaining placeholder implementations...
function generateOGSupport(userArguments: string[], engagement: EngagementAnalysis): string {
  return "providing additional evidence and extending their impact analysis"
}

function generateOOResponse(rebuttals: string[], motion: string): string {
  return "The opposition's concerns actually highlight additional problems they hadn't considered"
}

function generateMGNewDimension(motion: string, userArguments: string[]): string {
  return "Intergenerational Justice and Future Sustainability"
}

function generateMGJustification(motion: string, userArguments: string[]): string {
  return "the long-term consequences for future generations"
}

function generateCGArgument(motion: string, userArguments: string[], index: number): string {
  return `Future-focused analysis ${index}`
}

function extractOppFocus(engagement: EngagementAnalysis): string {
  return "immediate implementation concerns"
}

function generateCGCounterpoint(motion: string): string {
  return "the broader strategic implications"
}

function generateOOSupport(userArguments: string[], engagement: EngagementAnalysis): string {
  return "strengthening their core arguments with additional analysis"
}

function generateCGResponse(directReferences: string[], motion: string): string {
  return "their new dimensions actually reinforce our concerns"
}

function extractCGClaim(engagement: EngagementAnalysis): string {
  return "long-term benefits"
}

function generateMONewDimension(motion: string, userArguments: string[]): string {
  return "Cultural and Community Impact"
}

function generateMOJustification(motion: string, userArguments: string[]): string {
  return "the disruption to existing social structures"
}

function generateCOArgument(motion: string, userArguments: string[], index: number): string {
  return `Community impact analysis ${index}`
}

function extractGovStrategy(engagement: EngagementAnalysis): string {
  return "expand their case with new dimensions"
}

function generateDPMSummary(engagement: EngagementAnalysis): string {
  return "defending our framework and extending our analysis"
}

function generateMGSummary(engagement: EngagementAnalysis): string {
  return "crucial new dimensions of analysis"
}

function generateFinalOppositionResponse(rebuttals: string[], userArguments: string[]): string {
  return "Their concerns are either manageable through proper implementation or outweighed by clear benefits"
}

function generateComparativeWeighing(engagement: EngagementAnalysis, userArguments: string[], motion: string): string {
  return "The government has provided concrete mechanisms while the opposition relies on speculative harms"
}

function generateFinalGovArguments(motion: string, userArguments: string[], engagement: EngagementAnalysis): string {
  return "Even accepting opposition concerns, the benefits clearly justify this policy"
}

function generateDLOSummary(engagement: EngagementAnalysis): string {
  return "systematically dismantling government responses"
}

function generateMOSummary(engagement: EngagementAnalysis): string {
  return "additional dimensions of harm"
}

function generateGovFailureAnalysis(rebuttals: string[], userArguments: string[]): string {
  return "They have not provided adequate evidence, their mechanisms are unsound, and their responses are superficial"
}

function generateFinalClashAnalysis(engagement: EngagementAnalysis, motion: string, userArguments: string[]): string {
  return "between government faith in technocratic solutions and our evidence-based analysis"
}

function generateImpactWeighing(engagement: EngagementAnalysis, userArguments: string[], motion: string): string {
  return "The harms we've identified are concrete and immediate, while government benefits are speculative and distant"
}

function generateFinalOppArguments(motion: string, userArguments: string[], engagement: EngagementAnalysis): string {
  return "The government has failed to meet their burden of proof while we have demonstrated measurable harms"
}

function generateGenericEngagement(engagement: EngagementAnalysis, userArguments: string[]): string {
  return (
    engagement.directReferences.slice(0, 2).join("\n\n") ||
    "Previous speakers have raised important points that I will address"
  )
}

function generateGenericContribution(role: string, motion: string, userArguments: string[]): string {
  return `As ${getRoleName(role)}, I contribute ${userArguments.join(" and ")} to this debate`
}

function generateGenericConclusion(role: string, motion: string): string {
  const isGov = ["PM", "DPM", "MG", "GW"].includes(role)
  return isGov ? "For these reasons, we support this motion" : "For these reasons, we oppose this motion"
}
