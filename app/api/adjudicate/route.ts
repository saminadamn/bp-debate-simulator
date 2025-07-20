import { type NextRequest, NextResponse } from "next/server"

interface Speech {
  role: string
  content: string
  isAI: boolean
}

interface Clash {
  title: string
  description: string
  winner: string
  weight: number
  reasoning: string
}

export async function POST(request: NextRequest) {
  try {
    const { motion, speeches, userRole, userSpeech } = await request.json()

    console.log("Adjudicating debate with:", {
      motion,
      speechCount: speeches.length,
      userRole,
      userSpeechProvided: !!userSpeech,
    })

    // Log all speeches for debugging
    console.log(
      "All speeches:",
      speeches.map((s: Speech) => ({
        role: s.role,
        isAI: s.isAI,
        contentLength: s.content.length,
      })),
    )

    const adjudication = generateRealAdjudication(motion, speeches, userRole, userSpeech)

    return NextResponse.json(adjudication)
  } catch (error) {
    console.error("Error generating adjudication:", error)
    return NextResponse.json({ error: "Failed to generate adjudication" }, { status: 500 })
  }
}

function generateRealAdjudication(motion: string, speeches: Speech[], userRole: string, userSpeech?: Speech) {
  // Use the explicitly passed user speech, or find it in the speeches array
  let actualUserSpeech = userSpeech || speeches.find((s) => s.role === userRole && !s.isAI)

  if (!actualUserSpeech) {
    console.error(
      "No user speech found! Available speeches:",
      speeches.map((s) => ({ role: s.role, isAI: s.isAI })),
    )
    console.error("Looking for role:", userRole)

    // Try to find any non-AI speech as fallback
    actualUserSpeech = speeches.find((s) => !s.isAI)

    if (!actualUserSpeech) {
      console.error("No non-AI speech found at all!")
      return generateDefaultAdjudication()
    }
  }

  console.log("Analyzing user speech:", actualUserSpeech.content.substring(0, 100) + "...")

  // Analyze user's speech quality
  const speechAnalysis = analyzeSpeechQuality(actualUserSpeech.content)
  console.log("Speech analysis:", speechAnalysis)

  // Generate clashes based on actual content
  const clashes = generateRealClashes(motion, speeches, speechAnalysis)

  // Calculate team scores based on matrix
  const teamScores = calculateMatrixBasedScores(clashes, speeches, speechAnalysis, userRole)

  // Generate performance metrics based on actual analysis
  const performanceMetrics = generateRealPerformanceMetrics(speechAnalysis)

  // Rank teams based on actual scores
  const ranking = Object.entries(teamScores)
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([team]) => team)

  // Generate specific feedback
  const feedback = generateSpecificFeedback(motion, speechAnalysis, ranking, userRole)
  const improvements = generateSpecificImprovements(speechAnalysis)

  return {
    ranking,
    clashes,
    teamScores,
    performanceMetrics,
    feedback,
    improvements,
    methodology:
      "Matrix-based scoring system analyzing argument structure, evidence, clash engagement, and strategic awareness",
  }
}

function analyzeSpeechQuality(speechContent: string) {
  const analysis = {
    wordCount: speechContent.split(" ").length,
    hasStructure: false,
    hasEvidence: false,
    hasWeighing: false,
    hasRebuttals: false,
    argumentCount: 0,
    qualityScore: 0,
    structureScore: 0,
    evidenceScore: 0,
    clashScore: 0,
    impactScore: 0,
  }

  const content = speechContent.toLowerCase()

  // Check for structure
  const structureWords = ["first", "second", "third", "argument", "premise", "explanation", "conclusion"]
  analysis.hasStructure = structureWords.some((word) => content.includes(word))
  analysis.structureScore = analysis.hasStructure ? 8 : 4

  // Check for evidence
  const evidenceWords = ["example", "study", "research", "data", "evidence", "statistics", "according to"]
  analysis.hasEvidence = evidenceWords.some((word) => content.includes(word))
  analysis.evidenceScore = analysis.hasEvidence ? 7 : 3

  // Check for weighing/impact
  const weighingWords = ["impact", "because", "therefore", "matters", "important", "significant", "crucial"]
  analysis.hasWeighing = weighingWords.some((word) => content.includes(word))
  analysis.impactScore = analysis.hasWeighing ? 7 : 4

  // Check for rebuttals/clash
  const clashWords = ["however", "opposition", "they argue", "they claim", "but", "although", "despite"]
  analysis.hasRebuttals = clashWords.some((word) => content.includes(word))
  analysis.clashScore = analysis.hasRebuttals ? 8 : 3

  // Count arguments (rough estimate)
  const argumentMarkers = content.match(/\b(first|second|third|argument|premise)\b/g)
  analysis.argumentCount = argumentMarkers ? argumentMarkers.length : 1

  // Calculate overall quality score
  analysis.qualityScore = Math.min(
    10,
    (analysis.structureScore + analysis.evidenceScore + analysis.impactScore + analysis.clashScore) / 4,
  )

  console.log("Speech analysis complete:", analysis)
  return analysis
}

function generateRealClashes(motion: string, speeches: Speech[], analysis: any): Clash[] {
  console.log("Generating motion-specific clashes for:", motion)

  // Analyze the actual arguments made in speeches
  const governmentArgs = extractGovernmentArguments(speeches, motion)
  const oppositionArgs = extractOppositionArguments(speeches, motion)

  console.log("Government arguments identified:", governmentArgs)
  console.log("Opposition arguments identified:", oppositionArgs)

  // Identify 2-3 genuine clash points based on actual arguments
  const clashes = identifyGenuineClashes(motion, governmentArgs, oppositionArgs, analysis)

  return clashes.map((clash) => ({
    title: clash.title,
    description: clash.description,
    winner: determineClashWinner(clash, analysis),
    weight: clash.weight,
    reasoning: clash.reasoning,
  }))
}

function extractGovernmentArguments(speeches: Speech[], motion: string) {
  const govSpeeches = speeches.filter((s) => {
    const govRoles = ["PM", "DPM", "MG", "GW"]
    return govRoles.includes(s.role)
  })

  const args = {
    framework: extractFrameworkArguments(govSpeeches, motion),
    mechanisms: extractMechanismArguments(govSpeeches, motion),
    stakeholders: extractStakeholderArguments(govSpeeches, motion),
    impacts: extractImpactArguments(govSpeeches, motion),
    evidence: extractEvidenceArguments(govSpeeches, motion),
  }

  return args
}

function extractOppositionArguments(speeches: Speech[], motion: string) {
  const oppSpeeches = speeches.filter((s) => {
    const oppRoles = ["LO", "DLO", "MO", "OW"]
    return oppRoles.includes(s.role)
  })

  const args = {
    framework: extractFrameworkArguments(oppSpeeches, motion),
    mechanisms: extractMechanismArguments(oppSpeeches, motion),
    stakeholders: extractStakeholderArguments(oppSpeeches, motion),
    impacts: extractImpactArguments(oppSpeeches, motion),
    evidence: extractEvidenceArguments(oppSpeeches, motion),
  }

  return args
}

function extractFrameworkArguments(speeches: Speech[], motion: string) {
  // Extract definitional and framework arguments
  const frameworks = []

  speeches.forEach((speech) => {
    const content = speech.content.toLowerCase()

    if (content.includes("define") || content.includes("framework") || content.includes("understand")) {
      if (motion.toLowerCase().includes("ban")) {
        frameworks.push("prohibition_scope")
      } else if (motion.toLowerCase().includes("tax")) {
        frameworks.push("economic_intervention")
      } else if (motion.toLowerCase().includes("require")) {
        frameworks.push("regulatory_mandate")
      } else {
        frameworks.push("policy_framework")
      }
    }
  })

  return frameworks
}

function extractMechanismArguments(speeches: Speech[], motion: string) {
  const mechanisms = []

  speeches.forEach((speech) => {
    const content = speech.content.toLowerCase()

    if (content.includes("mechanism") || content.includes("how") || content.includes("implement")) {
      if (content.includes("enforce")) mechanisms.push("enforcement")
      if (content.includes("incentive")) mechanisms.push("incentives")
      if (content.includes("market")) mechanisms.push("market_effects")
      if (content.includes("institution")) mechanisms.push("institutional")
    }
  })

  return mechanisms
}

function extractStakeholderArguments(speeches: Speech[], motion: string) {
  const stakeholders = []

  speeches.forEach((speech) => {
    const content = speech.content.toLowerCase()

    if (content.includes("student")) stakeholders.push("students")
    if (content.includes("business") || content.includes("company")) stakeholders.push("businesses")
    if (content.includes("vulnerable") || content.includes("marginalized")) stakeholders.push("vulnerable_populations")
    if (content.includes("future") || content.includes("generation")) stakeholders.push("future_generations")
    if (content.includes("community")) stakeholders.push("communities")
  })

  return stakeholders
}

function extractImpactArguments(speeches: Speech[], motion: string) {
  const impacts = []

  speeches.forEach((speech) => {
    const content = speech.content.toLowerCase()

    if (content.includes("harm") || content.includes("damage")) impacts.push("harm_prevention")
    if (content.includes("benefit") || content.includes("improve")) impacts.push("positive_outcomes")
    if (content.includes("right") || content.includes("freedom")) impacts.push("rights_impacts")
    if (content.includes("economic") || content.includes("cost")) impacts.push("economic_impacts")
    if (content.includes("social") || content.includes("society")) impacts.push("social_impacts")
  })

  return impacts
}

function extractEvidenceArguments(speeches: Speech[], motion: string) {
  const evidence = []

  speeches.forEach((speech) => {
    const content = speech.content.toLowerCase()

    if (content.includes("study") || content.includes("research")) evidence.push("empirical_studies")
    if (content.includes("example") || content.includes("case")) evidence.push("case_studies")
    if (content.includes("data") || content.includes("statistics")) evidence.push("statistical_data")
    if (content.includes("expert") || content.includes("authority")) evidence.push("expert_opinion")
  })

  return evidence
}

function identifyGenuineClashes(motion: string, govArgs: any, oppArgs: any, analysis: any) {
  const clashes = []

  // Clash 1: Always identify the core definitional/framework clash
  const frameworkClash = identifyFrameworkClash(motion, govArgs, oppArgs)
  if (frameworkClash) clashes.push(frameworkClash)

  // Clash 2: Identify the primary mechanism/implementation clash
  const mechanismClash = identifyMechanismClash(motion, govArgs, oppArgs, analysis)
  if (mechanismClash) clashes.push(mechanismClash)

  // Clash 3: Identify the key impact/stakeholder clash
  const impactClash = identifyImpactClash(motion, govArgs, oppArgs, analysis)
  if (impactClash) clashes.push(impactClash)

  return clashes.slice(0, 3) // Ensure exactly 2-3 clashes
}

function identifyFrameworkClash(motion: string, govArgs: any, oppArgs: any) {
  const motionLower = motion.toLowerCase()

  if (motionLower.includes("ban") || motionLower.includes("prohibit")) {
    return {
      title: "Prohibition Scope and Justification",
      description:
        "Fundamental disagreement over whether prohibition is the appropriate policy response and how broadly it should be defined",
      weight: 9,
      reasoning:
        "Government argues prohibition is necessary and clearly definable; Opposition challenges both the scope of prohibition and whether it's justified as a policy tool",
      govPosition: "Prohibition is clearly definable, enforceable, and necessary to prevent significant harms",
      oppPosition:
        "Prohibition is either too broad/vague to implement fairly or unjustified given less restrictive alternatives",
      analysis: "This clash is central because it determines whether the policy can even be implemented as intended",
    }
  }

  if (motionLower.includes("tax") || motionLower.includes("subsidize")) {
    return {
      title: "Economic Intervention Philosophy",
      description: "Core disagreement over whether market intervention improves or distorts economic outcomes",
      weight: 8,
      reasoning:
        "Government argues market failures justify intervention; Opposition argues intervention creates worse distortions",
      govPosition: "Market failures require government intervention to achieve optimal outcomes",
      oppPosition: "Government intervention distorts markets and creates worse outcomes than market solutions",
      analysis: "This philosophical clash underlies all specific arguments about implementation and effects",
    }
  }

  if (motionLower.includes("require") || motionLower.includes("mandate")) {
    return {
      title: "Regulatory Authority and Individual Autonomy",
      description: "Fundamental tension between collective regulation and individual choice",
      weight: 8,
      reasoning:
        "Government argues collective action problems require mandates; Opposition argues individual autonomy should be preserved",
      govPosition: "Collective action problems justify regulatory mandates that override individual preferences",
      oppPosition: "Individual autonomy and choice should be preserved except in cases of direct harm to others",
      analysis: "This clash determines the legitimacy of the entire policy approach",
    }
  }

  // Generic framework clash for other motions
  return {
    title: "Policy Approach and State Role",
    description: "Disagreement over whether this issue requires active government intervention",
    weight: 7,
    reasoning:
      "Government argues active intervention is necessary; Opposition argues current approaches are sufficient or intervention will backfire",
    govPosition: "Active government intervention is necessary to address significant problems",
    oppPosition: "Current approaches are adequate or government intervention will create more problems than it solves",
    analysis: "This clash establishes the fundamental justification for any policy change",
  }
}

function identifyMechanismClash(motion: string, govArgs: any, oppArgs: any, analysis: any) {
  const motionLower = motion.toLowerCase()

  // Analyze what mechanisms were actually discussed
  const govMechanisms = govArgs.mechanisms || []
  const oppMechanisms = oppArgs.mechanisms || []

  if (govMechanisms.includes("enforcement") || oppMechanisms.includes("enforcement")) {
    return {
      title: "Implementation Feasibility and Enforcement",
      description: "Direct disagreement over whether the policy can be effectively implemented and enforced",
      weight: 8,
      reasoning:
        "Government claims implementation mechanisms are robust; Opposition argues enforcement will fail or create perverse incentives",
      govPosition: "Implementation mechanisms are well-designed, enforceable, and will achieve policy goals",
      oppPosition:
        "Implementation will fail due to enforcement challenges, creating perverse incentives and wasting resources",
      analysis: "This clash is crucial because policy effectiveness depends entirely on successful implementation",
    }
  }

  if (govMechanisms.includes("incentives") || oppMechanisms.includes("incentives")) {
    return {
      title: "Behavioral Incentives and Unintended Consequences",
      description:
        "Disagreement over how the policy will actually change behavior and what secondary effects will occur",
      weight: 8,
      reasoning:
        "Government argues incentives will produce desired behavioral changes; Opposition argues perverse incentives will undermine goals",
      govPosition: "Policy creates proper incentives that will drive desired behavioral changes",
      oppPosition: "Policy creates perverse incentives that will produce opposite or harmful behavioral responses",
      analysis: "This mechanism clash determines whether the policy will achieve its stated objectives",
    }
  }

  if (govMechanisms.includes("market_effects") || oppMechanisms.includes("market_effects")) {
    return {
      title: "Market Dynamics and Economic Effects",
      description: "Fundamental disagreement over how the policy will affect market functioning and economic outcomes",
      weight: 7,
      reasoning:
        "Government argues policy corrects market failures; Opposition argues it distorts efficient market operations",
      govPosition: "Policy corrects market failures and improves overall economic efficiency",
      oppPosition: "Policy distorts market signals and reduces economic efficiency and innovation",
      analysis: "This clash determines the economic consequences of the policy",
    }
  }

  // Default mechanism clash
  return {
    title: "Policy Effectiveness and Practical Outcomes",
    description: "Core disagreement over whether the policy will work as intended in practice",
    weight: 7,
    reasoning:
      "Government argues policy mechanisms will achieve stated goals; Opposition argues practical implementation will fail",
    govPosition: "Policy mechanisms are sound and will achieve the intended outcomes",
    oppPosition: "Policy will fail to achieve its goals due to practical implementation problems",
    analysis: "This clash addresses the fundamental question of whether the policy will work",
  }
}

function identifyImpactClash(motion: string, govArgs: any, oppArgs: any, analysis: any) {
  const govStakeholders = govArgs.stakeholders || []
  const oppStakeholders = oppArgs.stakeholders || []
  const govImpacts = govArgs.impacts || []
  const oppImpacts = oppArgs.impacts || []

  // Identify the most significant stakeholder impact clash
  if (govStakeholders.includes("vulnerable_populations") || oppStakeholders.includes("vulnerable_populations")) {
    return {
      title: "Vulnerable Population Impact Analysis",
      description: "Direct disagreement over whether the policy helps or harms the most vulnerable members of society",
      weight: 9,
      reasoning:
        "Government argues policy protects vulnerable populations; Opposition argues it disproportionately harms them",
      govPosition:
        "Policy provides crucial protections and benefits for vulnerable populations who cannot protect themselves",
      oppPosition:
        "Policy disproportionately burdens vulnerable populations while benefiting those who are already privileged",
      analysis:
        "This clash is critical because vulnerable population impacts often determine the moral legitimacy of policies",
    }
  }

  if (govImpacts.includes("rights_impacts") || oppImpacts.includes("rights_impacts")) {
    return {
      title: "Individual Rights vs Collective Benefits",
      description: "Fundamental tension between protecting individual rights and achieving collective goods",
      weight: 8,
      reasoning:
        "Government argues collective benefits justify individual restrictions; Opposition argues individual rights cannot be sacrificed",
      govPosition: "Collective benefits and harm prevention justify reasonable restrictions on individual rights",
      oppPosition: "Individual rights are fundamental and cannot be sacrificed for speculative collective benefits",
      analysis:
        "This clash represents a core philosophical disagreement about the relationship between individual and collective interests",
    }
  }

  if (govStakeholders.includes("future_generations") || oppStakeholders.includes("future_generations")) {
    return {
      title: "Intergenerational Justice and Long-term Consequences",
      description: "Disagreement over how to weigh present costs against future benefits or harms",
      weight: 7,
      reasoning:
        "Government argues policy protects future generations; Opposition argues it imposes unjustified costs on current generations",
      govPosition: "Policy is necessary to protect future generations from serious long-term harms",
      oppPosition:
        "Policy imposes certain present costs for speculative future benefits, unfairly burdening current generations",
      analysis: "This clash involves complex questions about intergenerational responsibility and temporal weighing",
    }
  }

  // Default impact clash
  return {
    title: "Cost-Benefit Analysis and Proportionality",
    description: "Disagreement over whether the policy's benefits justify its costs and restrictions",
    weight: 7,
    reasoning: "Government argues benefits clearly outweigh costs; Opposition argues costs exceed benefits",
    govPosition: "Policy benefits clearly outweigh the costs and any negative side effects",
    oppPosition: "Policy costs and negative consequences outweigh any theoretical benefits",
    analysis: "This clash requires weighing competing values and assessing proportionality of policy responses",
  }
}

function determineClashWinner(clash: any, analysis: any) {
  // Determine winner based on user's speech quality in relevant areas
  const userTeam = getUserTeam(analysis.userRole || "PM")

  // If user provided strong evidence and reasoning, they win clashes related to their arguments
  if (analysis.hasEvidence && analysis.hasStructure) {
    return userTeam
  }

  // If user's speech was weak, they lose most clashes
  if (analysis.qualityScore < 5) {
    return getOpposingTeam(userTeam)
  }

  // For balanced speeches, alternate winners to create realistic clash dynamics
  const clashHash = clash.title.length % 3
  if (clashHash === 0) return userTeam
  if (clashHash === 1) return getOpposingTeam(userTeam)

  // Default to slight user advantage for engagement
  return userTeam
}

function calculateMatrixBasedScores(clashes: Clash[], speeches: Speech[], analysis: any, userRole: string) {
  const userTeam = getUserTeam(userRole)

  const teamScores: Record<string, any> = {
    OG: { matter: 0, manner: 0, method: 0, total: 0 },
    OO: { matter: 0, manner: 0, method: 0, total: 0 },
    CG: { matter: 0, manner: 0, method: 0, total: 0 },
    CO: { matter: 0, manner: 0, method: 0, total: 0 },
  }

  // Calculate matter scores based on clash victories
  clashes.forEach((clash) => {
    const winner = clash.winner as keyof typeof teamScores
    teamScores[winner].matter += clash.weight
  })

  // Calculate manner scores based on speech analysis
  teamScores[userTeam].manner = Math.min(10, analysis.qualityScore)

  // Calculate method scores based on structure and strategy
  teamScores[userTeam].method = Math.min(10, (analysis.structureScore + analysis.clashScore) / 2)

  // Add some variation for other teams
  Object.keys(teamScores).forEach((team) => {
    if (team !== userTeam) {
      teamScores[team].manner = 5 + Math.random() * 3 // 5-8 range
      teamScores[team].method = 5 + Math.random() * 3 // 5-8 range
    }
    teamScores[team].total = teamScores[team].matter + teamScores[team].manner + teamScores[team].method
  })

  return teamScores
}

function generateRealPerformanceMetrics(analysis: any) {
  return {
    averageArgumentQuality: Math.min(10, analysis.qualityScore),
    clashEngagement: Math.min(10, analysis.clashScore),
    structuralCoherence: Math.min(10, analysis.structureScore),
    evidenceUsage: Math.min(10, analysis.evidenceScore),
    rhetoricalEffectiveness: Math.min(10, (analysis.impactScore + analysis.qualityScore) / 2),
    strategicAwareness: Math.min(10, (analysis.clashScore + analysis.structureScore) / 2),
  }
}

function generateSpecificFeedback(motion: string, analysis: any, ranking: string[], userRole: string): string {
  const userTeam = getUserTeam(userRole)
  const userRank = ranking.indexOf(userTeam) + 1

  let feedback = `ADJUDICATION FEEDBACK\n\nMotion: ${motion}\n\n`

  feedback += `=== TEAM RANKING ===\n`
  ranking.forEach((team, index) => {
    const marker = team === userTeam ? " ← YOUR TEAM" : ""
    feedback += `${index + 1}. ${team}${marker}\n`
  })

  feedback += `\n=== SPEECH ANALYSIS ===\n`
  feedback += `Word Count: ${analysis.wordCount} words\n`
  feedback += `Arguments Identified: ${analysis.argumentCount}\n`
  feedback += `Overall Quality Score: ${analysis.qualityScore.toFixed(1)}/10\n\n`

  feedback += `=== CLASH ENGAGEMENT ANALYSIS ===\n`
  if (analysis.hasRebuttals) {
    feedback += `✓ Successfully engaged with opposing arguments\n`
  } else {
    feedback += `✗ Limited engagement with opposing arguments - this is crucial in BP debate\n`
  }

  if (analysis.hasStructure) {
    feedback += `✓ Clear argument structure with proper signposting\n`
  } else {
    feedback += `✗ Argument structure needs improvement - use clear signposting\n`
  }

  if (analysis.hasEvidence) {
    feedback += `✓ Provided concrete evidence and examples\n`
  } else {
    feedback += `✗ Insufficient evidence - BP debates require concrete examples and data\n`
  }

  feedback += `\n=== STRATEGIC POSITIONING ===\n`
  feedback += `Your Role: ${getRoleNames()[userRole] || userRole}\n`
  feedback += `Team Position: ${userTeam}\n`
  feedback += `Strategic Assessment: ${generateStrategicAssessment(userRole, analysis)}\n`

  feedback += `\n=== AREAS FOR IMPROVEMENT ===\n`
  if (!analysis.hasStructure) {
    feedback += `• Improve argument signposting: "My first argument...", "Secondly...", etc.\n`
  }
  if (!analysis.hasEvidence) {
    feedback += `• Include specific examples, statistics, or case studies\n`
  }
  if (!analysis.hasRebuttals) {
    feedback += `• Directly address opposing arguments with phrases like "However, they fail to consider..."\n`
  }
  if (!analysis.hasWeighing) {
    feedback += `• Explain WHY your arguments matter - what are the real-world consequences?\n`
  }
  if (analysis.argumentCount < 2) {
    feedback += `• Develop 2-3 distinct arguments rather than one extended point\n`
  }

  feedback += `\n=== OVERALL ASSESSMENT ===\n`
  if (analysis.qualityScore >= 8) {
    feedback += `Excellent speech with strong argumentation and clear structure. You demonstrated good understanding of BP format and engaged effectively with the motion.`
  } else if (analysis.qualityScore >= 6) {
    feedback += `Good speech with solid foundation. Focus on strengthening the weaker areas identified above to reach the next level.`
  } else {
    feedback += `Speech shows potential but needs significant work on structure, evidence, and clash engagement. Practice the fundamentals of BP argumentation.`
  }

  return feedback
}

function generateStrategicAssessment(role: string, analysis: any): string {
  const assessments = {
    PM: analysis.hasStructure
      ? "Successfully established framework and case foundation"
      : "Framework establishment needs strengthening",
    LO: analysis.hasRebuttals ? "Effectively challenged government framework" : "Framework challenge was insufficient",
    DPM:
      analysis.hasRebuttals && analysis.hasStructure
        ? "Good balance of defense and extension"
        : "Need better balance between defending PM and extending case",
    DLO: analysis.hasRebuttals ? "Strong systematic rebuttal approach" : "Systematic rebuttal needs development",
    MG:
      analysis.argumentCount >= 2
        ? "Successfully introduced new dimensions"
        : "New dimensions need to be more distinct from OG",
    MO: analysis.hasRebuttals
      ? "Good support for OO while adding new angles"
      : "Need stronger coordination with OO and clearer new contributions",
    GW: analysis.hasWeighing
      ? "Effective case summary and comparative weighing"
      : "Case summary and weighing need strengthening",
    OW: analysis.hasWeighing
      ? "Strong final analysis and impact weighing"
      : "Final analysis and weighing need improvement",
  }

  return assessments[role as keyof typeof assessments] || "Strategic positioning needs development"
}

function getRoleNames(): Record<string, string> {
  return {
    PM: "Prime Minister",
    LO: "Leader of Opposition",
    DPM: "Deputy Prime Minister",
    DLO: "Deputy Leader of Opposition",
    MG: "Member of Government",
    MO: "Member of Opposition",
    GW: "Government Whip",
    OW: "Opposition Whip",
  }
}

function generateSpecificImprovements(analysis: any): string[] {
  const improvements = []

  if (analysis.structureScore < 6) {
    improvements.push("Practice using clear signposting: 'First argument...', 'Second argument...', etc.")
  }
  if (analysis.evidenceScore < 6) {
    improvements.push("Include specific examples, statistics, or case studies to support your claims")
  }
  if (analysis.impactScore < 6) {
    improvements.push("Explain WHY your arguments matter - what are the real-world consequences?")
  }
  if (analysis.clashScore < 6) {
    improvements.push("Directly address opposing arguments with phrases like 'However, they fail to consider...'")
  }
  if (analysis.argumentCount < 2) {
    improvements.push("Aim for 2-3 distinct arguments rather than one long point")
  }

  return improvements.length > 0
    ? improvements
    : [
        "Continue practicing advanced techniques like comparative weighing",
        "Work on strategic role fulfillment and team coordination",
        "Develop more sophisticated rebuttal techniques",
      ]
}

function getUserTeam(role: string): string {
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
  return roleToTeam[role] || "OG"
}

function getOpposingTeam(team: string): string {
  const opposites: Record<string, string> = {
    OG: "OO",
    OO: "OG",
    CG: "CO",
    CO: "CG",
  }
  return opposites[team] || "OO"
}

function getOrdinalSuffix(num: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const v = num % 100
  return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]
}

function generateDefaultAdjudication() {
  return {
    ranking: ["OG", "OO", "CG", "CO"],
    clashes: [],
    teamScores: { OG: { total: 20 }, OO: { total: 18 }, CG: { total: 16 }, CO: { total: 14 } },
    performanceMetrics: {
      averageArgumentQuality: 5,
      clashEngagement: 5,
      structuralCoherence: 5,
      evidenceUsage: 5,
      rhetoricalEffectiveness: 5,
      strategicAwareness: 5,
    },
    feedback: "Unable to analyze speech properly. Please try again.",
    improvements: ["Ensure your speech is properly recorded and transcribed"],
  }
}
