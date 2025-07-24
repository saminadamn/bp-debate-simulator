import { type NextRequest, NextResponse } from "next/server"
import type { SkillLevel } from "@/types/debate"

interface DebateContext {
  motion: string
  userRole: string
  userSpeech: string
  userArguments: ArgumentAnalysis[]
  previousSpeeches: any[]
  skillLevel: SkillLevel
}

interface ArgumentAnalysis {
  type: "economic" | "social" | "rights" | "practical" | "moral" | "environmental" | "security"
  claim: string
  mechanism: string
  evidence: string
  impact: string
  weaknesses: string[]
}

interface StrategicFramework {
  caseTheory: string
  burdens: string[]
  uniqueContributions: string[]
  clashPoints: string[]
  extensions: string[]
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

export async function POST(request: NextRequest) {
  try {
    const { motion, role, previousSpeeches, userNotes, userSkillLevel, userSpeech } = await request.json()

    if (!userSpeech) {
      return NextResponse.json({ error: "User must speak first" }, { status: 400 })
    }

    console.log(`\n=== GENERATING SPEECH FOR ${role} ===`)
    console.log(`Motion: ${motion}`)
    console.log(`User speech preview: ${userSpeech.substring(0, 100)}...`)

    // Deep analysis of debate context
    const context: DebateContext = {
      motion,
      userRole: findUserRole(previousSpeeches),
      userSpeech,
      userArguments: analyzeUserArguments(userSpeech, motion),
      previousSpeeches,
      skillLevel: userSkillLevel,
    }

    // Generate strategic framework for this specific role
    const framework = generateStrategicFramework(role, context)

    console.log(`Strategic framework for ${role}:`, framework)

    // Generate authentic, role-specific speech
    const speech = await generateAuthenticSpeech(role, context, framework)

    console.log(`Generated ${speech.length} character speech for ${role}`)

    return NextResponse.json({ speech, skillLevel: userSkillLevel })
  } catch (error) {
    console.error("Error generating speech:", error)
    return NextResponse.json({ error: "Failed to generate speech" }, { status: 500 })
  }
}

function findUserRole(previousSpeeches: any[]): string {
  const userSpeech = previousSpeeches.find((s) => !s.isAI)
  return userSpeech?.role || "PM"
}

function analyzeUserArguments(userSpeech: string, motion: string): ArgumentAnalysis[] {
  const content = userSpeech.toLowerCase()
  const args: ArgumentAnalysis[] = []

  // Economic argument detection
  if (
    content.includes("economic") ||
    content.includes("cost") ||
    content.includes("money") ||
    content.includes("tax")
  ) {
    args.push({
      type: "economic",
      claim: extractEconomicClaim(content, motion),
      mechanism: extractEconomicMechanism(content),
      evidence: extractEconomicEvidence(content),
      impact: extractEconomicImpact(content),
      weaknesses: identifyEconomicWeaknesses(content),
    })
  }

  // Rights-based argument detection
  if (content.includes("right") || content.includes("freedom") || content.includes("liberty")) {
    args.push({
      type: "rights",
      claim: extractRightsClaim(content, motion),
      mechanism: extractRightsMechanism(content),
      evidence: extractRightsEvidence(content),
      impact: extractRightsImpact(content),
      weaknesses: identifyRightsWeaknesses(content),
    })
  }

  // Social argument detection
  if (content.includes("social") || content.includes("community") || content.includes("society")) {
    args.push({
      type: "social",
      claim: extractSocialClaim(content, motion),
      mechanism: extractSocialMechanism(content),
      evidence: extractSocialEvidence(content),
      impact: extractSocialImpact(content),
      weaknesses: identifySocialWeaknesses(content),
    })
  }

  // Practical argument detection
  if (content.includes("implement") || content.includes("practical") || content.includes("enforce")) {
    args.push({
      type: "practical",
      claim: extractPracticalClaim(content, motion),
      mechanism: extractPracticalMechanism(content),
      evidence: extractPracticalEvidence(content),
      impact: extractPracticalImpact(content),
      weaknesses: identifyPracticalWeaknesses(content),
    })
  }

  console.log(
    `Analyzed ${args.length} arguments from user speech:`,
    args.map((a) => a.type),
  )
  return args
}

function generateStrategicFramework(role: string, context: DebateContext): StrategicFramework {
  const team = roleToTeam[role]
  const isGovernment = team === "OG" || team === "CG"
  const isOpening = role === "PM" || role === "LO"
  const isClosing = role === "MG" || role === "MO"
  const isWhip = role === "GW" || role === "OW"

  switch (role) {
    case "PM": // Added PM case
      return {
        caseTheory: generatePMCaseTheory(context),
        burdens: ["Establish framework", "Present core arguments", "Demonstrate positive impacts"],
        uniqueContributions: generatePMUniqueContributions(context),
        clashPoints: identifyPMClashPoints(context),
        extensions: [],
      }
    case "LO":
      return {
        caseTheory: generateLOCaseTheory(context),
        burdens: ["Challenge government framework", "Present alternative vision", "Establish opposition case"],
        uniqueContributions: generateLOUniqueContributions(context),
        clashPoints: identifyLOClashPoints(context),
        extensions: [],
      }

    case "DPM":
      return {
        caseTheory: generateDPMCaseTheory(context),
        burdens: ["Defend government framework", "Respond to opposition", "Extend government case"],
        uniqueContributions: generateDPMUniqueContributions(context),
        clashPoints: identifyDPMClashPoints(context),
        extensions: [],
      }

    case "DLO":
      return {
        caseTheory: generateDLOCaseTheory(context),
        burdens: ["Systematic rebuttal", "Extend opposition case", "Crystallize clash"],
        uniqueContributions: generateDLOUniqueContributions(context),
        clashPoints: identifyDLOClashPoints(context),
        extensions: [],
      }

    case "MG":
      return {
        caseTheory: generateMGCaseTheory(context),
        burdens: ["Support OG", "Introduce new dimension", "Extend debate scope"],
        uniqueContributions: generateMGUniqueContributions(context),
        clashPoints: identifyMGClashPoints(context),
        extensions: generateMGExtensions(context),
      }

    case "MO":
      return {
        caseTheory: generateMOCaseTheory(context),
        burdens: ["Support OO", "Introduce new opposition angle", "Respond to CG"],
        uniqueContributions: generateMOUniqueContributions(context),
        clashPoints: identifyMOClashPoints(context),
        extensions: generateMOExtensions(context),
      }

    case "GW":
      return {
        caseTheory: generateGWCaseTheory(context),
        burdens: ["Summarize government", "Final rebuttals", "Comparative weighing"],
        uniqueContributions: generateGWUniqueContributions(context),
        clashPoints: identifyGWClashPoints(context),
        extensions: [],
      }

    case "OW":
      return {
        caseTheory: generateOWCaseTheory(context),
        burdens: ["Summarize opposition", "Final clash analysis", "Impact weighing"],
        uniqueContributions: generateOWUniqueContributions(context),
        clashPoints: identifyOWClashPoints(context),
        extensions: [],
      }

    default:
      return {
        caseTheory: "Generic case theory",
        burdens: ["Present arguments"],
        uniqueContributions: ["Generic contribution"],
        clashPoints: ["Generic clash"],
        extensions: [],
      }
  }
}

async function generateAuthenticSpeech(
  role: string,
  context: DebateContext,
  framework: StrategicFramework,
): Promise<string> {
  console.log(`\n--- META-ANALYSIS FOR ${role} ---`)
  console.log(`Case Theory: ${framework.caseTheory}`)
  console.log(`Key Clashes: ${framework.clashPoints.join(", ")}`)
  console.log(`Unique Contributions: ${framework.uniqueContributions.join(", ")}`)

  switch (role) {
    case "PM": // Added PM case
      return generatePMSpeech(context, framework)
    case "LO":
      return generateLOSpeech(context, framework)
    case "DPM":
      return generateDPMSpeech(context, framework)
    case "DLO":
      return generateDLOSpeech(context, framework)
    case "MG":
      return generateMGSpeech(context, framework)
    case "MO":
      return generateMOSpeech(context, framework)
    case "GW":
      return generateGWSpeech(context, framework)
    case "OW":
      return generateOWSpeech(context, framework)
    default:
      return generateGenericSpeech(role, context)
  }
}

function generatePMSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion } = context;

  // Meta-comment: PM must establish the government's framework and present initial arguments
  const definitionAndFramework = generatePMDefinitionAndFramework(motion);
  const governmentArguments = generatePMArguments(motion, context.userArguments, "PM");
  const visionStatement = generatePMVisionStatement(motion);

  return `Thank you, Chair. As Prime Minister, I rise to propose the motion: "${motion}".

We believe that this motion is not just necessary, but profoundly beneficial for a multitude of reasons. Our case today will establish a clear framework for understanding this debate, and present compelling arguments for why you must affirm our proposal.

**DEFINING THE MOTION AND OUR FRAMEWORK**

${definitionAndFramework}

**THE GOVERNMENT'S CASE: THREE CORE ARGUMENTS**

Let me present our foundational arguments for this motion:

${governmentArguments}

**OUR VISION**

${visionStatement}

For these reasons, we proudly propose this motion and urge you to support it.

Thank you.`;
}


function generateLOSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion, userArguments, userSpeech } = context

  // Meta-comment: LO must challenge PM's framework while establishing opposition case theory
  const definitionalChallenge = generateDefinitionalChallenge(motion, userArguments)
  const frameworkCritique = generateFrameworkCritique(userArguments, motion)
  const alternativeFramework = generateAlternativeFramework(motion, userArguments)
  const systematicRebuttals = generateSystematicRebuttals(userArguments, "LO")
  const oppositionArguments = generateOppositionArguments(motion, userArguments, "LO")

  return `Thank you, Chair. As Leader of the Opposition, I rise to fundamentally challenge the motion: "${motion}"

The Prime Minister has presented what appears to be a coherent case, but I'm afraid their analysis contains critical flaws that render their entire framework unsustainable.

**DEFINITIONAL CHALLENGE AND FRAMEWORK CRITIQUE**

${definitionalChallenge}

${frameworkCritique}

Instead, we must understand this motion through the lens of ${alternativeFramework}.

**SYSTEMATIC REBUTTAL OF GOVERNMENT CASE**

Let me address the PM's arguments directly:

${systematicRebuttals}

**OPPOSITION CASE: THE FUNDAMENTAL PROBLEMS**

Beyond merely responding to the government, I present three core reasons why this motion is not just misguided, but actively harmful:

${oppositionArguments}

**WEIGHING AND CONCLUSION**

${generateLOWeighing(context, framework)}

The government asks us to accept their vision based on theoretical benefits, but we have demonstrated concrete, measurable harms that will result from this policy.

For these reasons, we firmly oppose this motion.

Thank you.`
}

function generateDPMSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion, userArguments } = context

  // Meta-comment: DPM must defend PM's framework while extending the government case with new material
  const frameworkDefense = generateFrameworkDefense(userArguments, motion)
  const oppositionRebuttals = generateOppositionRebuttals(userArguments, "DPM")
  const governmentExtensions = generateGovernmentExtensions(motion, userArguments, "DPM")

  return `Thank you, Chair. As Deputy Prime Minister, I rise to reinforce our framework while directly addressing the opposition's challenges and extending our case with crucial additional analysis.

**DEFENDING OUR FRAMEWORK**

The Leader of Opposition attempted to undermine our definitional approach, but their alternative framework fails for several critical reasons:

${frameworkDefense}

**SYSTEMATIC RESPONSE TO OPPOSITION**

Let me address each of the LO's challenges directly:

${oppositionRebuttals}

**EXTENDING THE GOVERNMENT CASE**

Beyond defending our position, I present additional substantive material that strengthens our case:

${governmentExtensions}

**STRATEGIC ANALYSIS**

${generateDPMStrategicAnalysis(context, framework)}

The opposition's strategy relies on theoretical concerns while ignoring the concrete benefits and practical safeguards we've outlined.

Our case demonstrates both the necessity and feasibility of this motion.

Thank you.`
}

function generateDLOSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion, userArguments } = context

  // Meta-comment: DLO must systematically dismantle government responses while extending opposition case
  const governmentFailures = generateGovernmentFailures(userArguments, "DLO")
  const oppositionExtensions = generateOppositionExtensions(motion, userArguments, "DLO")
  const clashCrystallization = generateClashCrystallization(context, framework)

  return `Thank you, Chair. As Deputy Leader of Opposition, I will systematically dismantle the government's responses while extending our opposition case with crucial additional analysis.

**GOVERNMENT RESPONSES FAIL**

The Deputy Prime Minister claimed to address our concerns, but their responses are fundamentally inadequate:

${governmentFailures}

**EXTENDING THE OPPOSITION CASE**

Building upon the Leader of Opposition's foundation, I present additional analysis that strengthens our case:

${oppositionExtensions}

**CRYSTALLIZING THE CLASH**

${clashCrystallization}

**CONCLUSION**

The government's case crumbles under systematic analysis. They have failed to address our core concerns while we have demonstrated why this motion is fundamentally flawed.

Thank you.`
}

function generateMGSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion, userArguments } = context

  // Meta-comment: MG must support OG while introducing genuinely new dimensions that extend the debate
  const ogSupport = generateOGSupport(userArguments, "MG")
  const newDimensions = generateNewDimensions(motion, userArguments, "MG")
  const cgStrategy = generateCGStrategy(context, framework)

  return `Thank you, Chair. As Member of Government, I bring a fresh perspective to this debate while supporting the Opening Government's framework.

**SUPPORTING OPENING GOVERNMENT**

The Opening Government established a solid foundation, and I want to reinforce their analysis by:

${ogSupport}

**NEW DIMENSIONS: EXTENDING THE DEBATE**

However, there are crucial aspects of this motion that the Opening Government couldn't fully explore in their time:

${newDimensions}

**CLOSING GOVERNMENT STRATEGY**

${cgStrategy}

**ENGAGING WITH THE OPPOSITION**

The opposition has raised concerns, but they fail to account for the new dimensions I've introduced and the broader context that makes this motion essential.

**CONCLUSION**

Together with the Opening Government, we present a comprehensive case that addresses both immediate concerns and long-term implications.

Thank you.`
}

function generateMOSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion, userArguments } = context

  // Meta-comment: MO must support OO while introducing new opposition angles and responding to CG
  const ooSupport = generateOOSupport(userArguments, "MO")
  const newOppositionAngles = generateNewOppositionAngles(motion, userArguments, "MO")
  const cgResponse = generateCGResponse(context, framework)

  return `Thank you, Chair. As Member of Opposition, I stand with the Opening Opposition while bringing crucial new analysis that strengthens our case against this motion.

**SUPPORTING OPENING OPPOSITION**

The Opening Opposition correctly identified the fundamental flaws in this motion. I reinforce their analysis by:

${ooSupport}

**NEW OPPOSITION DIMENSIONS**

However, there's a critical angle that hasn't been fully explored:

${newOppositionAngles}

**RESPONDING TO CLOSING GOVERNMENT**

The Member of Government attempted to introduce new dimensions, but:

${cgResponse}

**CLOSING OPPOSITION STRATEGY**

As Closing Opposition, we must demonstrate why even the government's extended case fails to justify this motion.

**CONCLUSION**

The government bench, despite their attempts to shore up their case, has failed to address the fundamental problems we've identified.

Thank you.`
}

function generateGWSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion } = context

  // Meta-comment: GW must summarize government case, provide final rebuttals, and offer comparative weighing
  const caseSummary = generateGovernmentCaseSummary(context, framework)
  const finalRebuttals = generateFinalRebuttals(context, framework, "GW")
  const comparativeWeighing = generateComparativeWeighing(context, framework, "government")

  return `Thank you, Chair. As Government Whip, I have the privilege of summarizing our case and providing final analysis on why this motion must pass.

**GOVERNMENT CASE SUMMARY**

Throughout this debate, the government bench has presented a comprehensive and compelling case:

${caseSummary}

**FINAL REBUTTALS**

Let me address the opposition's arguments systematically:

${finalRebuttals}

**COMPARATIVE WEIGHING**

When we weigh the arguments presented by both sides:

${comparativeWeighing}

**CONCLUSION**

Chair, this debate has demonstrated that ${motion.toLowerCase()} is not just beneficial, but essential. The opposition's concerns are either manageable or outweighed by the significant benefits we've outlined.

The choice is clear. We must support this motion.

Thank you.`
}

function generateOWSpeech(context: DebateContext, framework: StrategicFramework): string {
  const { motion } = context

  // Meta-comment: OW must summarize opposition case, analyze final clashes, and provide impact weighing
  const caseSummary = generateOppositionCaseSummary(context, framework)
  const finalClashAnalysis = generateFinalClashAnalysis(context, framework)
  const impactWeighing = generateImpactWeighing(context, framework, "opposition")

  return `Thank you, Chair. As Opposition Whip, I will summarize our case and demonstrate why this motion must be rejected.

**OPPOSITION CASE SUMMARY**

The opposition bench has presented a devastating critique of this motion:

${caseSummary}

**FINAL CLASH ANALYSIS**

${finalClashAnalysis}

**IMPACT WEIGHING**

When we consider the real-world impacts:

${impactWeighing}

**CONCLUSION**

Chair, this motion is fundamentally flawed. The government has failed to meet their burden of proof while we have demonstrated significant harms.

We urge you to reject this motion.

Thank you.`
}

// Helper functions for argument analysis
function extractEconomicClaim(content: string, motion: string): string {
  if (content.includes("cost")) return "Economic costs outweigh benefits"
  if (content.includes("growth")) return "Policy will stimulate economic growth"
  if (content.includes("inequality")) return "Policy addresses economic inequality"
  return "Economic argument identified"
}

function extractEconomicMechanism(content: string): string {
  if (content.includes("market")) return "Market mechanism effects"
  if (content.includes("incentive")) return "Incentive structure changes"
  return "Economic mechanism"
}

function extractEconomicEvidence(content: string): string {
  if (content.includes("study") || content.includes("research")) return "Referenced economic research"
  return "Economic evidence needed"
}

function extractEconomicImpact(content: string): string {
  if (content.includes("poverty")) return "Poverty reduction impact"
  if (content.includes("prosperity")) return "Increased prosperity"
  return "Economic impact"
}

function identifyEconomicWeaknesses(content: string): string[] {
  const weaknesses = []
  if (!content.includes("data") && !content.includes("evidence")) weaknesses.push("Lacks empirical support")
  if (!content.includes("mechanism")) weaknesses.push("Unclear causal mechanism")
  return weaknesses
}

// Similar functions for other argument types...
function extractRightsClaim(content: string, motion: string): string {
  if (content.includes("freedom")) return "Fundamental freedom at stake"
  if (content.includes("privacy")) return "Privacy rights violation"
  return "Rights-based argument"
}

function extractRightsMechanism(content: string): string {
  return "Rights protection mechanism"
}

function extractRightsEvidence(content: string): string {
  return "Rights-based evidence"
}

function extractRightsImpact(content: string): string {
  return "Rights impact"
}

function identifyRightsWeaknesses(content: string): string[] {
  return ["Rights weakness identified"]
}

// Continue with social, practical argument extractors...
function extractSocialClaim(content: string, motion: string): string {
  return "Social cohesion argument"
}

function extractSocialMechanism(content: string): string {
  return "Social mechanism"
}

function extractSocialEvidence(content: string): string {
  return "Social evidence"
}

function extractSocialImpact(content: string): string {
  return "Social impact"
}

function identifySocialWeaknesses(content: string): string[] {
  return ["Social weakness"]
}

function extractPracticalClaim(content: string, motion: string): string {
  return "Implementation challenge"
}

function extractPracticalMechanism(content: string): string {
  return "Implementation mechanism"
}

function extractPracticalEvidence(content: string): string {
  return "Implementation evidence"
}

function extractPracticalImpact(content: string): string {
  return "Implementation impact"
}

function identifyPracticalWeaknesses(content: string): string[] {
  return ["Implementation weakness"]
}

// Strategic framework generators

// Added PM strategic framework generators
function generatePMCaseTheory(context: DebateContext): string {
  const { motion } = context;
  if (motion.toLowerCase().includes("ban")) {
    return "Establish the necessity of the ban to mitigate a significant societal harm and outline a clear, enforceable mechanism.";
  }
  return "Establish the government's framework, define key terms, and present the core arguments for the motion's positive impact.";
}

function generatePMUniqueContributions(context: DebateContext): string[] {
  return [
    "Clear definition of the motion and its scope",
    "Establishment of the government's core framework",
    "Introduction of primary substantive arguments for the motion",
  ];
}

function identifyPMClashPoints(context: DebateContext): string[] {
  const clashes = ["Motion definition and scope", "Government framework validity", "Primary impacts of the policy"];

  // Add potential clashes based on common argument types if the motion implies them
  if (context.motion.toLowerCase().includes("economic") || context.motion.toLowerCase().includes("tax")) {
    clashes.push("Economic efficiency vs. social equity");
  }
  if (context.motion.toLowerCase().includes("rights") || context.motion.toLowerCase().includes("freedom")) {
    clashes.push("Individual rights vs. collective good");
  }

  return clashes;
}


function generateLOCaseTheory(context: DebateContext): string {
  const { motion, userArguments } = context
  if (motion.toLowerCase().includes("ban")) {
    return "Challenge enforcement feasibility and propose harm reduction alternatives"
  }
  if (motion.toLowerCase().includes("tax")) {
    return "Demonstrate regressive impacts and market distortion effects"
  }
  return "Challenge government framework and present alternative approach"
}

function generateLOUniqueContributions(context: DebateContext): string[] {
  return [
    "Definitional challenge to government framework",
    "Alternative policy framework",
    "Systematic rebuttal of government arguments",
  ]
}

function identifyLOClashPoints(context: DebateContext): string[] {
  const clashes = ["Framework definition", "Policy effectiveness"]

  context.userArguments.forEach((arg) => {
    if (arg.type === "economic") clashes.push("Economic impact analysis")
    if (arg.type === "rights") clashes.push("Rights vs collective benefit")
    if (arg.type === "practical") clashes.push("Implementation feasibility")
  })

  return clashes
}

// Continue with other role-specific generators...
function generateDPMCaseTheory(context: DebateContext): string {
  return "Defend government framework while extending case with new substantive material"
}

function generateDPMUniqueContributions(context: DebateContext): string[] {
  return [
    "Framework defense against opposition challenges",
    "Systematic response to opposition arguments",
    "New substantive extensions to government case",
  ]
}

function identifyDPMClashPoints(context: DebateContext): string[] {
  return ["Framework validity", "Opposition rebuttal responses", "Government case extensions"]
}

function generateDLOCaseTheory(context: DebateContext): string {
  return "Systematically dismantle government responses and extend opposition case with new analysis"
}

function generateDLOUniqueContributions(context: DebateContext): string[] {
  return [
    "Systematic dismantling of government responses",
    "Extension of opposition case with new analysis",
    "Crystallization of key clashes",
  ]
}

function identifyDLOClashPoints(context: DebateContext): string[] {
  return ["Government response inadequacy", "Opposition case extension", "Key clash points"]
}

function generateMGCaseTheory(context: DebateContext): string {
  return "Support OG framework while introducing new dimensions that extend debate scope"
}

function generateMGUniqueContributions(context: DebateContext): string[] {
  return ["Support for OG framework", "Introduction of new dimensions", "Extension of debate scope"]
}

function identifyMGClashPoints(context: DebateContext): string[] {
  return ["OG framework support", "New dimensions introduction", "Debate scope extension"]
}

function generateMGExtensions(context: DebateContext): string[] {
  return ["International competitiveness and global standards", "Intergenerational justice and future sustainability"]
}

function generateMOCaseTheory(context: DebateContext): string {
  return "Support OO framework while introducing new opposition angles and responding to CG"
}

function generateMOUniqueContributions(context: DebateContext): string[] {
  return ["Support for OO framework", "Introduction of new opposition angles", "Response to CG"]
}

function identifyMOClashPoints(context: DebateContext): string[] {
  return ["OO framework support", "New opposition angles introduction", "CG response"]
}

function generateMOExtensions(context: DebateContext): string[] {
  return ["Democratic legitimacy crisis", "Intergenerational justice"]
}

function generateGWCaseTheory(context: DebateContext): string {
  return "Summarize government case, provide final rebuttals, and offer comparative weighing"
}

function generateGWUniqueContributions(context: DebateContext): string[] {
  return ["Government case summary", "Final rebuttals", "Comparative weighing"]
}

function identifyGWClashPoints(context: DebateContext): string[] {
  return ["Government case summary", "Final rebuttals", "Comparative weighing"]
}

function generateOWCaseTheory(context: DebateContext): string {
  return "Summarize opposition case, analyze final clashes, and provide impact weighing"
}

function generateOWUniqueContributions(context: DebateContext): string[] {
  return ["Opposition case summary", "Final clash analysis", "Impact weighing"]
}

function identifyOWClashPoints(context: DebateContext): string[] {
  return ["Opposition case summary", "Final clash analysis", "Impact weighing"]
}

// Content generators for speech sections

// Updated PM helper functions
function generatePMDefinitionAndFramework(motion: string): string {
  if (motion.toLowerCase().includes("ban")) {
    return "Our definition of this motion is clear: we propose a comprehensive prohibition on a specified activity or item. This will be achieved through a multi-pronged approach involving strict regulatory oversight and public awareness campaigns. Our framework prioritizes public safety and long-term societal well-being to ensure effective and equitable implementation.";
  }
  if (motion.toLowerCase().includes("subsidize")) {
    return "This motion proposes a strategic investment in a particular sector through targeted subsidies designed to stimulate growth and foster innovation. Our framework for this debate centers on enhancing economic competitiveness and ensuring equitable access to vital resources through accountable public funding.";
  }
  return "We define this motion as a clear and necessary step towards progress. Our framework for evaluating this debate is based on principles of practical efficacy and positive societal impact, which we believe are essential for a fair and comprehensive assessment of its merits.";
}

function generatePMArguments(motion: string, userArguments: ArgumentAnalysis[], role: string): string {
  let args = "";

  // Argument 1: Economic Benefit
  args += `\n**First Argument: Economic Prosperity and Growth**\n`;
  args += `${generateArgumentMechanism("economic", motion, "government")}\n`;
  args += `${generateArgumentEvidence("economic", motion, "government")}\n`;
  args += `${generateArgumentImpact("economic", motion, "government")}\n`;

  // Argument 2: Social/Rights Benefit (choose one based on motion or common sense)
  const arg2Type = motion.toLowerCase().includes("rights") ? "rights" : "social";
  args += `\n**Second Argument: ${generateArgumentTitle(arg2Type, motion, "government")}**\n`;
  args += `${generateArgumentMechanism(arg2Type, motion, "government")}\n`;
  args += `${generateArgumentEvidence(arg2Type, motion, "government")}\n`;
  args += `${generateArgumentImpact(arg2Type, motion, "government")}\n`;

  // Argument 3: Practicality/Feasibility
  args += `\n**Third Argument: Practicality and Effective Implementation**\n`;
  args += `${generateArgumentMechanism("practical", motion, "government")}\n`;
  args += `${generateArgumentEvidence("practical", motion, "government")}\n`;
  args += `${generateArgumentImpact("practical", motion, "government")}\n`;

  return args;
}

function generatePMVisionStatement(motion: string): string {
  return `Ultimately, our vision for this motion is a future where our communities are stronger, our economy is more dynamic, and individual well-being is enhanced. We believe this policy is a crucial step towards building a more resilient and equitable society.`;
}


function generateDefinitionalChallenge(motion: string, userArguments: ArgumentAnalysis[]): string {
  if (motion.toLowerCase().includes("ban")) {
    return "First, the Prime Minister has failed to clearly define the scope of this ban. What exactly constitutes a violation? How will enforcement work? These definitional gaps create arbitrary implementation that violates rule of law principles."
  }

  if (motion.toLowerCase().includes("should")) {
    return "The Prime Minister's framework assumes a false binary choice. They have not established clear success criteria or considered the spectrum of policy alternatives that could achieve their stated goals more effectively."
  }

  return "The government's definitional framework is fundamentally flawed because it ignores the complexity of real-world implementation and the diverse stakeholder impacts."
}

function generateFrameworkCritique(userArguments: ArgumentAnalysis[], motion: string): string {
  let critique = "The government's framework fails because it "

  const hasEconomicArg = userArguments.some((arg) => arg.type === "economic")
  const hasRightsArg = userArguments.some((arg) => arg.type === "rights")
  const hasPracticalArg = userArguments.some((arg) => arg.type === "practical")

  if (hasEconomicArg && hasRightsArg) {
    critique += "treats economic efficiency as the sole metric while ignoring fundamental rights implications"
  } else if (hasPracticalArg) {
    critique += "assumes perfect implementation conditions that don't exist in the real world"
  } else {
    critique += "oversimplifies complex social dynamics and ignores unintended consequences"
  }

  return critique + "."
}

function generateAlternativeFramework(motion: string, userArguments: ArgumentAnalysis[]): string {
  if (motion.toLowerCase().includes("economic") || userArguments.some((arg) => arg.type === "economic")) {
    return "distributive justice and long-term economic sustainability, not just aggregate efficiency"
  }

  if (motion.toLowerCase().includes("rights") || userArguments.some((arg) => arg.type === "rights")) {
    return "fundamental rights protection with proportionate policy responses"
  }

  return "harm minimization and democratic accountability in policy implementation"
}

function generateSystematicRebuttals(userArguments: ArgumentAnalysis[], role: string): string {
  let rebuttals = ""

  userArguments.forEach((arg, index) => {
    rebuttals += `\n**Rebuttal ${index + 1}: ${arg.type.charAt(0).toUpperCase() + arg.type.slice(1)} Argument**\n`
    rebuttals += `The PM claimed ${arg.claim}, but this analysis is flawed because ${generateSpecificRebuttal(arg)}.\n`
    rebuttals += `${generateCounterEvidence(arg)}\n`
  })

  if (rebuttals === "") {
    rebuttals =
      "The Prime Minister's arguments lack empirical support and ignore crucial counterevidence that undermines their entire case."
  }

  return rebuttals
}

function generateSpecificRebuttal(arg: ArgumentAnalysis): string {
  switch (arg.type) {
    case "economic":
      return "it ignores distributional effects and assumes perfect market conditions"
    case "rights":
      return "it creates a false hierarchy of rights without proper balancing"
    case "practical":
      return "it underestimates implementation costs and administrative burden"
    case "social":
      return "it misunderstands community dynamics and social capital"
    default:
      return "it relies on unsubstantiated assumptions"
  }
}

function generateCounterEvidence(arg: ArgumentAnalysis): string {
  switch (arg.type) {
    case "economic":
      return "Economic research from the IMF shows that similar policies create market distortions that persist for decades."
    case "rights":
      return "Constitutional law scholars have demonstrated that such restrictions fail proportionality tests."
    case "practical":
      return "Implementation studies from comparable jurisdictions show 70% failure rates due to administrative complexity."
    case "social":
      return "Sociological research indicates that top-down policy changes fragment existing social networks."
    default:
      return "Empirical evidence contradicts their theoretical assumptions."
  }
}

function generateOppositionArguments(motion: string, userArguments: ArgumentAnalysis[], role: string): string {
  // Generate 3 distinct opposition arguments that don't repeat user's points
  let args = ""

  // Argument 1: Always focus on a different dimension than user's main argument
  const userMainType = userArguments[0]?.type || "economic"
  const arg1Type = userMainType === "economic" ? "rights" : "economic"

  args += `\n**First Argument: ${generateArgumentTitle(arg1Type, motion, "opposition")}**\n`
  args += `${generateArgumentMechanism(arg1Type, motion, "opposition")}\n`
  args += `${generateArgumentEvidence(arg1Type, motion, "opposition")}\n`
  args += `${generateArgumentImpact(arg1Type, motion, "opposition")}\n`

  // Argument 2: Focus on implementation/practical concerns
  args += `\n**Second Argument: Implementation Failure and Perverse Incentives**\n`
  args += `This policy will fail because enforcement mechanisms create perverse incentives that undermine the stated goals.\n`
  args += `We see this pattern in similar failed policies like Prohibition in the US and the War on Drugs.\n`
  args += `This matters because policy failure erodes public trust and wastes resources that could address real problems.\n`

  // Argument 3: Focus on alternative solutions
  args += `\n**Third Argument: Superior Alternative Solutions**\n`
  args += `Even if we accept the government's problem diagnosis, this motion is the wrong solution.\n`
  args += `Evidence from Nordic countries shows that targeted interventions achieve better outcomes with fewer negative side effects.\n`
  args += `This is crucial because we have limited political capital and resources - we must choose the most effective approach.\n`

  return args
}

function generateArgumentTitle(type: string, motion: string, side: string): string {
  const titles = {
    economic: side === "government" ? "Economic Growth and Efficiency" : "Economic Inequality and Market Failure",
    rights: side === "government" ? "Rights Protection and Empowerment" : "Fundamental Rights Violation",
    practical: side === "government" ? "Effective Implementation Strategy" : "Implementation Impossibility",
    social: side === "government" ? "Social Cohesion and Community Building" : "Social Fragmentation and Division",
  }
  return titles[type as keyof typeof titles] || "Policy Analysis"
}

function generateArgumentMechanism(type: string, motion: string, side: string): string {
  // Generate specific mechanisms based on argument type and side
  const mechanisms = {
    economic:
      side === "government"
        ? "This policy creates positive economic incentives that drive innovation and efficiency."
        : "This policy distorts market mechanisms and creates deadweight losses that harm overall welfare.",
    rights:
      side === "government"
        ? "This policy protects fundamental rights by creating institutional safeguards."
        : "This policy violates fundamental rights through disproportionate state intervention.",
    practical:
      side === "government"
        ? "Implementation leverages existing institutional capacity with clear enforcement mechanisms."
        : "Implementation requires institutional capacity that doesn't exist and creates enforcement gaps.",
    social:
      side === "government"
        ? "This policy strengthens social bonds by addressing collective action problems."
        : "This policy fragments communities by undermining existing social structures.",
  }
  return mechanisms[type as keyof typeof mechanisms] || "The mechanism operates through institutional change."
}

function generateArgumentEvidence(type: string, motion: string, side: string): string {
  // Generate specific evidence based on argument type
  const evidence = {
    economic: "Economic analysis from the World Bank demonstrates measurable impacts on GDP and employment.",
    rights: "Constitutional law precedents from the European Court of Human Rights establish clear standards.",
    practical: "Implementation studies from comparable jurisdictions provide concrete success/failure data.",
    social: "Sociological research from leading universities shows clear patterns in community outcomes.",
  }
  return evidence[type as keyof typeof evidence] || "Research evidence supports this analysis."
}

function generateArgumentImpact(type: string, motion: string, side: string): string {
  const impacts = {
    economic:
      side === "government"
        ? "This creates sustainable prosperity that benefits all income levels."
        : "This perpetuates economic inequality and reduces overall social welfare.",
    rights:
      side === "government"
        ? "This protects vulnerable populations and strengthens democratic institutions."
        : "This erodes civil liberties and sets dangerous precedents for state overreach.",
    practical:
      side === "government"
        ? "This achieves policy goals efficiently with minimal administrative burden."
        : "This wastes resources and creates bureaucratic dysfunction that harms other programs.",
    social:
      side === "government"
        ? "This builds stronger communities and increases social capital."
        : "This fragments society and reduces trust between different groups.",
  }
  return impacts[type as keyof typeof impacts] || "This has significant long-term consequences."
}

function generateLOWeighing(context: DebateContext, framework: StrategicFramework): string {
  return `The fundamental question is whether we accept the government's theoretical benefits despite concrete, measurable harms. Their case relies on optimistic assumptions about implementation while ignoring the documented failures of similar policies. Our case demonstrates that the risks are not just probable, but inevitable given the structural problems we've identified.`
}

// Additional helper functions for other roles...
function generateFrameworkDefense(userArguments: ArgumentAnalysis[], motion: string): string {
  return "The opposition's alternative framework is internally inconsistent and would create arbitrary implementation standards that violate rule of law principles."
}

function generateOppositionRebuttals(userArguments: ArgumentAnalysis[], role: string): string {
  return "Their definitional challenges ignore practical realities. Their alternative framework lacks enforcement mechanisms. Their systematic rebuttals rely on cherry-picked evidence that ignores broader empirical patterns."
}

function generateGovernmentExtensions(motion: string, userArguments: ArgumentAnalysis[], role: string): string {
  return `**New Argument: International Competitiveness and Global Standards**

This policy positions us as a global leader in addressing shared challenges. The mechanism operates through international coordination that creates positive spillover effects. Evidence from OECD countries shows that early adopters gain competitive advantages in emerging markets.

This matters because global challenges require coordinated responses, and leadership positions create long-term strategic benefits.`
}

function generateDPMStrategicAnalysis(context: DebateContext, framework: StrategicFramework): string {
  return "The opposition's strategy relies on fear-mongering about implementation challenges while offering no viable alternatives to address the underlying problems that necessitate this policy."
}

// Continue with remaining helper functions for other roles...
function generateGovernmentFailures(userArguments: ArgumentAnalysis[], role: string): string {
  return "First, their framework defense ignores the practical implementation problems we identified. Second, their rebuttals to our arguments are superficial and don't address the underlying mechanisms. Third, their extensions actually strengthen our case by highlighting additional areas of concern."
}

function generateOppositionExtensions(motion: string, userArguments: ArgumentAnalysis[], role: string): string {
  return `**Extension 1: Democratic Legitimacy Crisis**

This policy undermines democratic legitimacy by excluding affected stakeholders from meaningful participation in policy design.

**Extension 2: Intergenerational Justice**

The long-term consequences disproportionately burden future generations who have no voice in current policy decisions.`
}

function generateClashCrystallization(context: DebateContext, framework: StrategicFramework): string {
  return "The fundamental clash is between the government's technocratic faith in policy solutions and our evidence-based analysis of implementation realities. They want us to accept theoretical benefits while ignoring documented patterns of policy failure."
}

// Placeholder implementations for remaining functions
function generateOGSupport(userArguments: ArgumentAnalysis[], role: string): string {
  return "reinforcing their framework with additional evidence and extending their impact analysis to previously unconsidered stakeholder groups."
}

function generateNewDimensions(motion: string, userArguments: ArgumentAnalysis[], role: string): string {
  return `**New Dimension: Intergenerational Justice and Future Sustainability**

The Opening Government focused on immediate impacts, but we must consider how this policy affects future generations and long-term institutional development.`
}

function generateCGStrategy(context: DebateContext, framework: StrategicFramework): string {
  return "As Closing Government, we can see both the Opening Government's framework and the Opposition's concerns, allowing us to present a more nuanced analysis that addresses legitimate concerns while maintaining our core position."
}

function generateOOSupport(userArguments: ArgumentAnalysis[], role: string): string {
  return "providing additional evidence for their core arguments and extending their analysis to new contexts that strengthen the opposition case."
}

function generateNewOppositionAngles(motion: string, userArguments: ArgumentAnalysis[]): string {
  return `**New Opposition Angle: Cultural and Community Impact**

This policy disrupts existing cultural practices and community structures that have evolved organically over generations, creating social fragmentation that cannot be easily repaired.`
}

function generateCGResponse(context: DebateContext, framework: StrategicFramework): string {
  return "their new dimensions actually strengthen our case by highlighting additional areas where this policy will cause harm that they hadn't previously considered."
}

function generateGovernmentCaseSummary(context: DebateContext, framework: StrategicFramework): string {
  return "The Prime Minister established our framework and core arguments. The Deputy Prime Minister defended against opposition challenges and extended our case. The Member of Government introduced crucial new dimensions that broaden our analysis."
}

function generateFinalRebuttals(context: DebateContext, framework: StrategicFramework, role: string): string {
  return "Their enforcement concerns are based on outdated assumptions. Their rights objections ignore the rights of those harmed by the status quo. Their alternative solutions are either inadequate or politically impossible."
}

function generateComparativeWeighing(context: DebateContext, framework: StrategicFramework, side: string): string {
  if (side === "government") {
    return "The government has provided concrete evidence and clear mechanisms, while the opposition relies on speculative harms and ignores status quo problems."
  } else {
    return "The opposition has demonstrated concrete, measurable harms, while the government relies on theoretical benefits and optimistic implementation assumptions."
  }
}

function generateOppositionCaseSummary(context: DebateContext, framework: StrategicFramework): string {
  return "The Leader of Opposition challenged the government framework and established our case. The Deputy Leader systematically dismantled government responses. The Member of Opposition introduced crucial new dimensions that expose additional problems."
}

function generateFinalClashAnalysis(context: DebateContext, framework: StrategicFramework): string {
  return "The fundamental clash is between the government's faith in technocratic solutions and our evidence-based analysis of implementation realities and democratic accountability."
}

function generateImpactWeighing(context: DebateContext, framework: StrategicFramework, side: string): string {
  return "The harms we've identified are concrete and immediate, while the government's benefits are speculative and distant. The magnitude of potential harm far exceeds any theoretical benefits."
}

function generateGenericSpeech(role: string, context: DebateContext): string {
  return `Thank you, Chair. As ${roleNames[role]}, I present my analysis of this motion.

[This would be a fallback generic speech - the specific role functions above should handle all cases]

Thank you.`
}
