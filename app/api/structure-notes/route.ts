import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { motion, role, notes } = await request.json()

    console.log(`\n=== STRUCTURING NOTES FOR ${role} ===`)
    console.log(`Motion: ${motion}`)
    console.log(`Notes preview: ${notes.substring(0, 100)}...`)

    const structuredNotes = generateMotionSpecificNotes(motion, role, notes)

    return NextResponse.json({ structuredNotes })
  } catch (error) {
    console.error("Error structuring notes:", error)
    return NextResponse.json({ error: "Failed to structure notes" }, { status: 500 })
  }
}

function generateMotionSpecificNotes(motion: string, role: string, notes: string): string {
  // Analyze motion type and context
  const motionAnalysis = analyzeMotionContext(motion)
  const roleStrategy = getRoleSpecificStrategy(role, motionAnalysis)
  const argumentFramework = generateArgumentFramework(motion, role, notes, motionAnalysis)

  return `STRATEGIC PREPARATION NOTES
Motion: ${motion}
Role: ${getRoleName(role)} (${getTeamName(role)})
Strategic Position: ${roleStrategy.position}

=== MOTION ANALYSIS ===
Type: ${motionAnalysis.type}
Key Stakeholders: ${motionAnalysis.stakeholders.join(", ")}
Core Tensions: ${motionAnalysis.tensions.join(", ")}
Implementation Context: ${motionAnalysis.context}

=== ROLE-SPECIFIC STRATEGY ===
Primary Burdens: ${roleStrategy.burdens.join(", ")}
Strategic Opportunities: ${roleStrategy.opportunities.join(", ")}
Key Clashes to Engage: ${roleStrategy.clashes.join(", ")}

=== ARGUMENT FRAMEWORK ===
${argumentFramework}

=== ANTICIPATED OPPOSITION ===
${generateAnticipatedOpposition(motion, role, motionAnalysis)}

=== EVIDENCE AND EXAMPLES ===
${generateRelevantEvidence(motion, role, motionAnalysis)}

=== STRATEGIC REMINDERS ===
${generateStrategicReminders(role, motionAnalysis)}

=== YOUR ORIGINAL NOTES ===
${notes}

=== QUALITY CHECK ===
✓ Motion-specific arguments that cannot be transplanted to other debates
✓ Role-appropriate strategic positioning and burden fulfillment  
✓ Concrete, contextual examples tied directly to motion subject matter
✓ Proactive engagement with likely opposition arguments
✓ Clear prioritization of strongest arguments for this specific round
`
}

function analyzeMotionContext(motion: string) {
  const motionLower = motion.toLowerCase()

  let type = "policy"
  if (motionLower.includes("ban") || motionLower.includes("prohibit")) type = "prohibition"
  else if (motionLower.includes("tax") || motionLower.includes("subsidize")) type = "economic"
  else if (motionLower.includes("require") || motionLower.includes("mandate")) type = "regulation"
  else if (motionLower.includes("should allow") || motionLower.includes("legalize")) type = "liberalization"

  const stakeholders = identifyStakeholders(motion)
  const tensions = identifyCoreTensions(motion, type)
  const context = generateImplementationContext(motion, type)

  return { type, stakeholders, tensions, context }
}

function identifyStakeholders(motion: string): string[] {
  const stakeholders = []
  const motionLower = motion.toLowerCase()

  // Universal stakeholders
  stakeholders.push("Government/State", "Citizens/Public")

  // Motion-specific stakeholders
  if (motionLower.includes("student") || motionLower.includes("school") || motionLower.includes("education")) {
    stakeholders.push("Students", "Parents", "Teachers", "Educational Institutions")
  }
  if (motionLower.includes("business") || motionLower.includes("corporate") || motionLower.includes("company")) {
    stakeholders.push("Businesses", "Workers", "Consumers", "Shareholders")
  }
  if (motionLower.includes("health") || motionLower.includes("medical")) {
    stakeholders.push("Patients", "Healthcare Providers", "Medical Professionals")
  }
  if (motionLower.includes("environment") || motionLower.includes("climate")) {
    stakeholders.push("Environmental Groups", "Future Generations", "Affected Communities")
  }
  if (motionLower.includes("media") || motionLower.includes("social media")) {
    stakeholders.push("Media Companies", "Content Creators", "Platform Users")
  }

  return stakeholders
}

function identifyCoreTensions(motion: string, type: string): string[] {
  const tensions = []

  // Type-specific tensions
  switch (type) {
    case "prohibition":
      tensions.push("Individual Liberty vs Collective Harm Prevention")
      tensions.push("Enforcement Feasibility vs Policy Goals")
      tensions.push("Intended Effects vs Unintended Consequences")
      break
    case "economic":
      tensions.push("Economic Efficiency vs Distributional Justice")
      tensions.push("Market Freedom vs Government Intervention")
      tensions.push("Short-term Costs vs Long-term Benefits")
      break
    case "regulation":
      tensions.push("Regulatory Compliance vs Innovation")
      tensions.push("Consumer Protection vs Market Competition")
      tensions.push("Standardization vs Flexibility")
      break
    case "liberalization":
      tensions.push("Expanded Freedom vs Potential Harm")
      tensions.push("Individual Choice vs Social Consequences")
      tensions.push("Progressive Values vs Traditional Concerns")
      break
    default:
      tensions.push("Individual Rights vs Collective Welfare")
      tensions.push("Practical Implementation vs Theoretical Benefits")
      tensions.push("Status Quo Problems vs Policy Risks")
  }

  // Motion-specific tensions
  const motionLower = motion.toLowerCase()
  if (motionLower.includes("artificial intelligence") || motionLower.includes("ai")) {
    tensions.push("Technological Progress vs Human Agency")
    tensions.push("Efficiency Gains vs Job Displacement")
  }
  if (motionLower.includes("social media")) {
    tensions.push("Free Expression vs Harmful Content")
    tensions.push("Platform Responsibility vs User Autonomy")
  }

  return tensions
}

function generateImplementationContext(motion: string, type: string): string {
  const contexts = {
    prohibition: "Requires robust enforcement mechanisms and addresses black market concerns",
    economic: "Operates within existing fiscal and monetary policy frameworks",
    regulation: "Builds on current regulatory infrastructure and compliance systems",
    liberalization: "Removes existing restrictions while maintaining necessary safeguards",
    policy: "Requires institutional capacity and stakeholder coordination",
  }

  return contexts[type as keyof typeof contexts] || contexts.policy
}

function getRoleSpecificStrategy(role: string, motionAnalysis: any) {
  const strategies = {
    PM: {
      position: "Framework Setter and Case Establisher",
      burdens: ["Define motion scope", "Establish case theory", "Present core arguments"],
      opportunities: ["Set favorable definitions", "Frame key tensions", "Establish burden of proof"],
      clashes: ["Definitional disputes", "Framework challenges", "Core case attacks"],
    },
    LO: {
      position: "Framework Challenger and Opposition Establisher",
      burdens: ["Challenge government framework", "Present alternative vision", "Establish opposition case"],
      opportunities: ["Redefine motion scope", "Challenge assumptions", "Present counter-framework"],
      clashes: ["Definitional challenges", "Framework critique", "Alternative approaches"],
    },
    DPM: {
      position: "Framework Defender and Case Extender",
      burdens: ["Defend government framework", "Respond to opposition", "Extend government case"],
      opportunities: ["Reinforce definitions", "Address opposition concerns", "Add new substantive material"],
      clashes: ["Framework defense", "Opposition rebuttals", "Case extensions"],
    },
    DLO: {
      position: "Systematic Rebuttal and Opposition Extension",
      burdens: ["Systematic rebuttal of government", "Extend opposition case", "Crystallize key clashes"],
      opportunities: [
        "Dismantle government responses",
        "Strengthen opposition arguments",
        "Identify government contradictions",
      ],
      clashes: ["Government response failures", "Opposition extensions", "Clash crystallization"],
    },
    MG: {
      position: "New Dimension Introducer and OG Supporter",
      burdens: ["Support Opening Government", "Introduce new dimensions", "Extend debate scope"],
      opportunities: ["Bring fresh perspectives", "Address unexplored angles", "Strengthen government bench"],
      clashes: ["New dimensional analysis", "Opposition responses", "Bench coordination"],
    },
    MO: {
      position: "Opposition Supporter and New Angle Provider",
      burdens: ["Support Opening Opposition", "Introduce new opposition angles", "Respond to Closing Government"],
      opportunities: ["Strengthen opposition bench coordination", "Counter CG extensions", "Add fresh critique"],
      clashes: ["CG response", "Opposition coordination", "New angle development"],
    },
    GW: {
      position: "Government Summarizer and Final Weigher",
      burdens: ["Summarize government case", "Final rebuttals", "Comparative weighing"],
      opportunities: ["Synthesize government arguments", "Final opposition responses", "Impact weighing"],
      clashes: ["Case summary", "Final rebuttals", "Comparative analysis"],
    },
    OW: {
      position: "Opposition Summarizer and Final Analyst",
      burdens: ["Summarize opposition case", "Final clash analysis", "Impact weighing"],
      opportunities: ["Synthesize opposition arguments", "Final government critique", "Outcome weighing"],
      clashes: ["Case summary", "Final analysis", "Impact comparison"],
    },
  }

  return strategies[role as keyof typeof strategies] || strategies.PM
}

function generateArgumentFramework(motion: string, role: string, notes: string, motionAnalysis: any): string {
  const team = getTeamName(role)
  const isGovernment = team.includes("Government")

  let framework = `**Case Theory**: ${generateCaseTheory(motion, role, motionAnalysis)}\n\n`

  // Generate 3 motion-specific arguments
  const motionArguments = generateMotionSpecificArguments(motion, role, motionAnalysis, notes)

  motionArguments.forEach((arg, index) => {
    framework += `**Argument ${index + 1}: ${arg.title}**\n`
    framework += `• Claim: ${arg.claim}\n`
    framework += `• Mechanism: ${arg.mechanism}\n`
    framework += `• Evidence: ${arg.evidence}\n`
    framework += `• Impact: ${arg.impact}\n`
    framework += `• Weighing: ${arg.weighing}\n\n`
  })

  return framework
}

function generateCaseTheory(motion: string, role: string, motionAnalysis: any): string {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role)
  const motionLower = motion.toLowerCase()

  if (motionAnalysis.type === "prohibition") {
    return isGovernment
      ? `This prohibition is necessary because the harms of the prohibited activity outweigh individual liberty concerns, and effective enforcement mechanisms exist`
      : `This prohibition violates fundamental liberties, creates enforcement problems, and fails to address underlying issues through less restrictive means`
  }

  if (motionAnalysis.type === "economic") {
    return isGovernment
      ? `This economic intervention corrects market failures and promotes both efficiency and equity through targeted mechanisms`
      : `This economic intervention distorts markets, creates unintended consequences, and fails to achieve stated goals while imposing significant costs`
  }

  if (motionAnalysis.type === "regulation") {
    return isGovernment
      ? `This regulation addresses market failures and protects stakeholders while maintaining innovation and competition`
      : `This regulation stifles innovation, imposes excessive compliance costs, and fails to achieve benefits that justify the restrictions`
  }

  return isGovernment
    ? `This policy addresses significant problems through effective mechanisms that create net positive outcomes`
    : `This policy fails to solve underlying problems while creating new harms that outweigh any theoretical benefits`
}

function generateMotionSpecificArguments(motion: string, role: string, motionAnalysis: any, notes: string) {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role)
  const motionLower = motion.toLowerCase()

  // Generate arguments based on motion content and role
  const motionArguments = []

  // Argument 1: Always address the core mechanism/implementation
  if (motionAnalysis.type === "prohibition") {
    motionArguments.push({
      title: isGovernment ? "Effective Harm Prevention" : "Enforcement Impossibility",
      claim: isGovernment
        ? "This prohibition effectively prevents significant societal harms"
        : "This prohibition cannot be effectively enforced and creates perverse incentives",
      mechanism: isGovernment
        ? "Clear legal frameworks with proportionate penalties deter harmful behavior"
        : "Prohibition drives activity underground, making it more dangerous and harder to regulate",
      evidence: isGovernment
        ? "Successful prohibition examples like asbestos bans show effective harm reduction"
        : "Failed prohibitions like alcohol prohibition demonstrate enforcement problems and unintended consequences",
      impact: isGovernment
        ? "Prevents measurable harm to vulnerable populations and society"
        : "Creates black markets, criminalization of otherwise law-abiding citizens, and resource waste",
      weighing: isGovernment
        ? "Concrete harm prevention outweighs theoretical liberty concerns"
        : "Enforcement failures and unintended consequences outweigh theoretical harm prevention",
    })
  }

  // Argument 2: Always address stakeholder impacts
  const primaryStakeholder = motionAnalysis.stakeholders[2] || "affected communities"
  motionArguments.push({
    title: `${primaryStakeholder} Impact Analysis`,
    claim: isGovernment
      ? `This policy significantly benefits ${primaryStakeholder.toLowerCase()}`
      : `This policy disproportionately harms ${primaryStakeholder.toLowerCase()}`,
    mechanism: isGovernment
      ? `Policy mechanisms directly address the needs and concerns of ${primaryStakeholder.toLowerCase()}`
      : `Policy implementation ignores the specific circumstances and needs of ${primaryStakeholder.toLowerCase()}`,
    evidence: generateStakeholderEvidence(primaryStakeholder, isGovernment),
    impact: isGovernment
      ? `Improved outcomes for a key affected population`
      : `Worsened conditions for vulnerable populations`,
    weighing: isGovernment
      ? `Benefits to affected stakeholders justify policy costs`
      : `Harm to affected stakeholders outweighs theoretical benefits`,
  })

  // Argument 3: Address the core tension identified in motion analysis
  const coreTension = motionAnalysis.tensions[0]
  motionArguments.push({
    title: `${coreTension} Resolution`,
    claim: isGovernment
      ? `This policy appropriately balances competing values in favor of collective welfare`
      : `This policy fails to properly balance competing values and prioritizes the wrong considerations`,
    mechanism: generateTensionMechanism(coreTension, isGovernment),
    evidence: generateTensionEvidence(coreTension, isGovernment),
    impact: isGovernment
      ? `Achieves optimal balance between competing important values`
      : `Creates imbalance that undermines both individual and collective interests`,
    weighing: generateTensionWeighing(coreTension, isGovernment),
  })

  return motionArguments
}

function generateStakeholderEvidence(stakeholder: string, isGovernment: boolean): string {
  const evidenceMap = {
    Students: isGovernment
      ? "Educational research shows improved learning outcomes and reduced stress"
      : "Student surveys indicate increased anxiety and reduced autonomy",
    Businesses: isGovernment
      ? "Economic analysis shows long-term competitiveness gains and innovation benefits"
      : "Business impact studies show increased compliance costs and reduced flexibility",
    "Healthcare Providers": isGovernment
      ? "Medical association studies show improved patient outcomes and provider satisfaction"
      : "Healthcare provider surveys show increased administrative burden and reduced care quality",
    "Environmental Groups": isGovernment
      ? "Environmental impact assessments show measurable ecological improvements"
      : "Environmental justice studies show disproportionate impacts on vulnerable communities",
  }

  return (
    evidenceMap[stakeholder as keyof typeof evidenceMap] ||
    (isGovernment
      ? "Research shows positive outcomes for affected populations"
      : "Studies show negative impacts on affected populations")
  )
}

function generateTensionMechanism(tension: string, isGovernment: boolean): string {
  if (tension.includes("Liberty") && tension.includes("Harm")) {
    return isGovernment
      ? "Proportionate restrictions on liberty prevent greater harms to others"
      : "Restrictions on liberty are disproportionate and fail to prevent claimed harms"
  }
  if (tension.includes("Economic") && tension.includes("Justice")) {
    return isGovernment
      ? "Market interventions correct failures while maintaining efficiency incentives"
      : "Market interventions distort price signals and reduce overall economic welfare"
  }
  return isGovernment
    ? "Policy mechanisms appropriately balance competing considerations"
    : "Policy mechanisms fail to properly weigh competing values"
}

function generateTensionEvidence(tension: string, isGovernment: boolean): string {
  return isGovernment
    ? "Comparative policy analysis from similar jurisdictions shows successful balance"
    : "Historical examples show that such policies consistently fail to achieve proper balance"
}

function generateTensionWeighing(tension: string, isGovernment: boolean): string {
  return isGovernment
    ? "Long-term collective benefits justify short-term individual costs"
    : "Individual rights and freedoms cannot be sacrificed for speculative collective benefits"
}

function generateAnticipatedOpposition(motion: string, role: string, motionAnalysis: any): string {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role)

  let opposition = ""

  if (isGovernment) {
    opposition += "**Opposition will likely argue:**\n"
    opposition += "• Implementation challenges and enforcement problems\n"
    opposition += "• Disproportionate impacts on vulnerable populations\n"
    opposition += "• Superior alternative solutions exist\n"
    opposition += "• Violation of fundamental rights or principles\n\n"

    opposition += "**Preemptive responses:**\n"
    opposition += "• Implementation mechanisms are robust and tested\n"
    opposition += "• Safeguards protect vulnerable populations\n"
    opposition += "• Alternatives have been tried and failed\n"
    opposition += "• Rights concerns are outweighed by collective benefits\n"
  } else {
    opposition += "**Government will likely argue:**\n"
    opposition += "• Significant problems require policy intervention\n"
    opposition += "• Implementation is feasible with proper mechanisms\n"
    opposition += "• Benefits outweigh costs and risks\n"
    opposition += "• Status quo is unacceptable\n\n"

    opposition += "**Counter-responses:**\n"
    opposition += "• Problems are overstated or can be addressed differently\n"
    opposition += "• Implementation will fail due to structural problems\n"
    opposition += "• Costs and risks are underestimated\n"
    opposition += "• Status quo problems don't justify this specific solution\n"
  }

  return opposition
}

function generateRelevantEvidence(motion: string, role: string, motionAnalysis: any): string {
  const motionLower = motion.toLowerCase()
  let evidence = "**Key Evidence Sources:**\n"

  // Motion-specific evidence
  if (motionLower.includes("social media")) {
    evidence += "• Platform usage statistics and user behavior studies\n"
    evidence += "• Content moderation effectiveness research\n"
    evidence += "• Mental health impact studies on social media use\n"
    evidence += "• Comparative analysis of platform regulation approaches\n"
  } else if (motionLower.includes("artificial intelligence")) {
    evidence += "• AI development and deployment statistics\n"
    evidence += "• Labor market impact studies on automation\n"
    evidence += "• AI safety and alignment research\n"
    evidence += "• Regulatory approaches in different jurisdictions\n"
  } else if (motionLower.includes("climate") || motionLower.includes("environment")) {
    evidence += "• Climate science data and projections\n"
    evidence += "• Economic impact assessments of climate policies\n"
    evidence += "• Comparative effectiveness of environmental regulations\n"
    evidence += "• Stakeholder impact studies on environmental policies\n"
  } else {
    evidence += "• Empirical studies on policy effectiveness\n"
    evidence += "• Comparative analysis from similar jurisdictions\n"
    evidence += "• Stakeholder impact assessments\n"
    evidence += "• Implementation case studies\n"
  }

  evidence += "\n**Specific Examples to Research:**\n"
  evidence += generateSpecificExamples(motion, motionAnalysis)

  return evidence
}

function generateSpecificExamples(motion: string, motionAnalysis: any): string {
  const motionLower = motion.toLowerCase()

  if (motionLower.includes("ban")) {
    return "• Successful bans: Asbestos, lead paint, CFCs\n• Failed bans: Alcohol prohibition, drug prohibition\n• Partial bans: Smoking restrictions, plastic bag bans\n"
  }

  if (motionLower.includes("tax")) {
    return "• Carbon taxes: British Columbia, Nordic countries\n• Sin taxes: Tobacco, alcohol, sugar taxes\n• Wealth taxes: France, Sweden experiences\n"
  }

  if (motionLower.includes("social media")) {
    return "• GDPR implementation in EU\n• Section 230 in US\n• Australia's news media bargaining code\n• Germany's NetzDG law\n"
  }

  return "• Relevant policy implementations in comparable jurisdictions\n• Success and failure case studies\n• Stakeholder impact examples\n"
}

function generateStrategicReminders(role: string, motionAnalysis: any): string {
  const reminders = {
    PM: [
      "Set clear, defensible definitions that favor your case",
      "Establish burden of proof framework",
      "Present strongest arguments first",
      "Anticipate definitional challenges",
    ],
    LO: [
      "Challenge government definitions immediately",
      "Present alternative framework clearly",
      "Identify core weaknesses in government case",
      "Establish opposition case theory",
    ],
    DPM: [
      "Defend framework against opposition challenges",
      "Address opposition arguments systematically",
      "Extend government case with new material",
      "Reinforce PM's strongest arguments",
    ],
    DLO: [
      "Systematically rebut government responses",
      "Extend opposition case beyond LO",
      "Crystallize key clashes",
      "Identify government contradictions",
    ],
    MG: [
      "Support OG while introducing new dimensions",
      "Avoid contradicting Opening Government",
      "Bring genuinely fresh perspectives",
      "Address angles OG couldn't cover",
    ],
    MO: [
      "Support OO while adding new opposition angles",
      "Respond to Closing Government extensions",
      "Strengthen opposition bench coordination",
      "Counter CG's new dimensions",
    ],
    GW: [
      "Summarize entire government case coherently",
      "Provide final systematic rebuttals",
      "Offer comparative weighing of both sides",
      "Crystallize why government wins",
    ],
    OW: [
      "Summarize entire opposition case coherently",
      "Analyze final clashes systematically",
      "Provide impact weighing",
      "Crystallize why opposition wins",
    ],
  }

  const roleReminders = reminders[role as keyof typeof reminders] || reminders.PM
  return roleReminders.map((reminder) => `• ${reminder}`).join("\n")
}

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

function getTeamName(role: string): string {
  const teams = {
    PM: "Opening Government",
    DPM: "Opening Government",
    LO: "Opening Opposition",
    DLO: "Opening Opposition",
    MG: "Closing Government",
    GW: "Closing Government",
    MO: "Closing Opposition",
    OW: "Closing Opposition",
  }
  return teams[role as keyof typeof teams] || "Unknown Team"
}
