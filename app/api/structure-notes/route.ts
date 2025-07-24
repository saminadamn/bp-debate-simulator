
import { type NextRequest, NextResponse } from "next/server";

// --- Configuration Data (Centralized for Easy Management) ---

// Keywords for motion analysis. A motion can match multiple types.
const MOTION_KEYWORDS = {
  prohibition: ["ban", "prohibit", "outlaw", "forbid", "restrict"],
  economic: ["tax", "subsidize", "incentivize", "tariff", "spend", "funding", "market", "trade"],
  regulation: ["regulate", "mandate", "require", "control", "licence", "oversight"],
  liberalization: ["allow", "legalize", "deregulate", "permit", "free", "expand"],
  environmental: ["environment", "climate", "pollution", "sustainability", "ecological", "conservation"],
  social: ["society", "community", "public", "welfare", "justice", "equality", "human rights"],
  education: ["school", "student", "teacher", "curriculum", "university", "education", "learning"],
  health: ["health", "medical", "patient", "healthcare", "disease", "public health"],
  technology: ["ai", "artificial intelligence", "tech", "internet", "social media", "data", "cyber"],
  international: ["international", "global", "un", "nato", "foreign policy", "diplomacy"],
};

// Strategies, burdens, and opportunities for each debate role.
const ROLE_STRATEGIES = {
  PM: {
    position: "Framework Setter and Case Establisher",
    burdens: ["Define motion scope", "Establish case theory", "Present core arguments for the policy's necessity and benefits"],
    opportunities: ["Set favorable definitions", "Frame key tensions", "Establish burden of proof for the Government", "Highlight the urgent need for change"],
    clashes: ["Definitional disputes", "Framework challenges", "Core case attacks on problem identification or solution effectiveness"],
  },
  LO: {
    position: "Framework Challenger and Opposition Establisher",
    burdens: ["Challenge government framework (if unfair)", "Present an alternative vision (e.g., status quo or counter-proposal)", "Establish core arguments against the policy"],
    opportunities: ["Redefine motion scope (if necessary)", "Challenge underlying assumptions of the motion or Government's case", "Present a counter-framework or alternative perspective"],
    clashes: ["Definitional challenges", "Framework critique", "Alternative approaches vs. the proposed policy", "Critique of problem identification and solution viability"],
  },
  DPM: {
    position: "Framework Defender and Case Extender",
    burdens: ["Defend government framework and definitions", "Respond systematically to opposition's arguments", "Extend government case with new, substantive arguments or deeper analysis"],
    opportunities: ["Reinforce key definitions and principles established by PM", "Address opposition concerns directly and rebuild attacked arguments", "Add new layers of analysis or impacts to the government's case"],
    clashes: ["Framework defense", "Opposition rebuttals on government's core arguments", "Case extensions and their comparative importance"],
  },
  DLO: {
    position: "Systematic Rebuttal and Opposition Extension",
    burdens: ["Deliver comprehensive, systematic rebuttal of government's entire case (PM & DPM)", "Extend opposition case with new arguments or deeper analysis", "Crystallize key clashes and explain why Opposition is winning them"],
    opportunities: ["Dismantle government responses to LO's attacks", "Strengthen opposition arguments by adding new impacts or examples", "Identify government contradictions or unfulfilled burdens"],
    clashes: ["Government response failures", "Opposition extensions", "Clash crystallization and comparative analysis"],
  },
  MG: {
    position: "New Dimension Introducer and OG Supporter",
    burdens: ["Support Opening Government's core principles without repetition", "Introduce new, distinct dimensions of analysis or argument", "Extend the debate's scope with fresh perspectives"],
    opportunities: ["Bring genuinely fresh perspectives or unique impacts (e.g., specific stakeholders, long-term effects)", "Address unexplored angles or neglected aspects of the motion", "Strengthen the government bench by providing additional layers of advocacy"],
    clashes: ["New dimensional analysis vs. opposition's responses", "Bench coordination and coherence", "Addressing points OG might have missed"],
  },
  MO: {
    position: "Opposition Supporter and New Angle Provider",
    burdens: ["Support Opening Opposition's core principles without repetition", "Introduce new, distinct opposition angles of critique or impact", "Respond directly to Closing Government's extensions and arguments"],
    opportunities: ["Strengthen the opposition bench coordination and synergy", "Counter CG extensions with specific rebuttals and alternative analyses", "Add fresh critique or identify systemic flaws not yet explored"],
    clashes: ["CG response and new arguments", "Opposition coordination and unique contributions", "New angle development and its impact on the round"],
  },
  GW: {
    position: "Government Summarizer and Final Weigher",
    burdens: ["Summarize the entire government case coherently, integrating OG and CG contributions", "Deliver final, strategic rebuttals to the most important opposition arguments", "Provide comparative weighing of the round, explaining why government wins"],
    opportunities: ["Synthesize government arguments into a compelling narrative", "Identify and refute the opposition's 'best case' arguments", "Offer clear impact weighing (e.g., magnitude, scope, probability, reversibility)", "Frame the round through government's lens"],
    clashes: ["Case summary and coherent narrative", "Final rebuttals and refutations", "Comparative analysis and impact weighing"],
  },
  OW: {
    position: "Opposition Summarizer and Final Analyst",
    burdens: ["Summarize the entire opposition case coherently, integrating OO and MO contributions", "Analyze final clashes systematically, highlighting government's failures", "Provide impact weighing, explaining why opposition wins"],
    opportunities: ["Synthesize opposition arguments into a powerful counter-narrative", "Deliver definitive critique of the government's entire model and case", "Offer clear comparative impact weighing from the opposition's perspective", "Frame the round through opposition's lens"],
    clashes: ["Case summary and coherent critique", "Final clash analysis and government's failures", "Impact comparison and why opposition's harms/principles outweigh"],
  },
};

// Mapping of role codes to full role names.
const ROLE_NAMES: { [key: string]: string } = {
  PM: "Prime Minister", LO: "Leader of Opposition", DPM: "Deputy Prime Minister", DLO: "Deputy Leader of Opposition",
  MG: "Member of Government", MO: "Member of Opposition", GW: "Government Whip", OW: "Opposition Whip",
};

// Mapping of role codes to team names.
const TEAM_NAMES: { [key: string]: string } = {
  PM: "Opening Government", DPM: "Opening Government", LO: "Opening Opposition", DLO: "Opening Opposition",
  MG: "Closing Government", GW: "Closing Government", MO: "Closing Opposition", OW: "Closing Opposition",
};

// Descriptions of implementation contexts for different motion types.
const IMPLEMENTATION_CONTEXTS: { [key: string]: string } = {
  prohibition: "Requires robust enforcement mechanisms and addresses black market concerns, considering potential for unintended social consequences.",
  economic: "Operates within existing fiscal and monetary policy frameworks, requiring careful consideration of market reactions and distributional effects.",
  regulation: "Builds on current regulatory infrastructure and compliance systems, often involving bureaucratic processes and industry adaptation.",
  liberalization: "Removes existing restrictions while maintaining necessary safeguards, potentially challenging societal norms and requiring public education.",
  environmental: "Involves complex scientific considerations and often requires international cooperation, with long-term and often irreversible impacts.",
  social: "Deals with sensitive issues of human behavior and societal structures, requiring broad public buy-in and addressing potential cultural resistance.",
  technology: "Operates in a rapidly evolving landscape, demanding flexible regulatory approaches and consideration of ethical implications and future advancements.",
  policy: "Requires institutional capacity, multi-stakeholder coordination, and robust public administration for effective delivery.", // Default/General
};

// --- Helper Functions ---

function getRoleName(role: string): string {
  return ROLE_NAMES[role] || role;
}

function getTeamName(role: string): string {
  return TEAM_NAMES[role] || "Unknown Team";
}

// --- Main Logic Functions ---

export async function POST(request: NextRequest) {
  try {
    const { motion, role, notes } = await request.json();

    // Input validation for robustness
    if (typeof motion !== 'string' || !motion.trim()) {
      return NextResponse.json({ error: "Motion is required and must be a non-empty string." }, { status: 400 });
    }
    if (typeof role !== 'string' || !Object.keys(ROLE_STRATEGIES).includes(role)) {
      return NextResponse.json({ error: `Invalid role provided. Accepted roles are: ${Object.keys(ROLE_STRATEGIES).join(', ')}.` }, { status: 400 });
    }
    if (typeof notes !== 'string') { // Notes can be empty but must be a string
      return NextResponse.json({ error: "Notes must be a string." }, { status: 400 });
    }

    console.log(`\n=== STRUCTURING NOTES FOR ${role} ===`);
    console.log(`Motion: ${motion}`);
    console.log(`Notes preview: ${notes.substring(0, Math.min(notes.length, 100))}${notes.length > 100 ? '...' : ''}`);

    const structuredNotes = generateMotionSpecificNotes(motion, role, notes);

    return NextResponse.json({ structuredNotes });
  } catch (error: any) {
    console.error("Error structuring notes:", error);
    // Provide a more user-friendly error message, masking internal details
    return NextResponse.json({ error: `Failed to structure notes. Please try again or check your input.` }, { status: 500 });
  }
}

/**
 * Generates comprehensive, structured debate preparation notes based on motion, role, and raw notes.
 * @param motion The debate motion.
 * @param role The debater's role (e.g., PM, LO).
 * @param notes Raw preparation notes from the user.
 * @returns A string containing the structured notes.
 */
function generateMotionSpecificNotes(motion: string, role: string, notes: string): string {
  const motionAnalysis = analyzeMotionContext(motion);
  const roleStrategy = getRoleSpecificStrategy(role);
  const argumentFramework = generateArgumentFramework(motion, role, notes, motionAnalysis);

  return `STRATEGIC PREPARATION NOTES
---
### Motion: ${motion}
### Role: ${getRoleName(role)} (${getTeamName(role)})
### Strategic Position: ${roleStrategy.position}

---
### MOTION ANALYSIS
* **Type(s)**: ${motionAnalysis.types.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
* **Key Stakeholders**: ${motionAnalysis.stakeholders.join(", ")}
* **Core Tensions**: ${motionAnalysis.tensions.join(", ")}
* **Implementation Context**: ${motionAnalysis.context}

---
### ROLE-SPECIFIC STRATEGY
* **Primary Burdens**: ${roleStrategy.burdens.join(", ")}
* **Strategic Opportunities**: ${roleStrategy.opportunities.join(", ")}
* **Key Clashes to Engage**: ${roleStrategy.clashes.join(", ")}

---
### ARGUMENT FRAMEWORK
${argumentFramework}

---
### ANTICIPATED OPPOSITION
${generateAnticipatedOpposition(role)}

---
### EVIDENCE AND EXAMPLES
${generateRelevantEvidence(motion, motionAnalysis)}

---
### STRATEGIC REMINDERS
${generateStrategicReminders(role)}

---
### YOUR ORIGINAL NOTES
${notes}

---
### QUALITY CHECK
✓ Motion-specific arguments that cannot be transplanted to other debates
✓ Role-appropriate strategic positioning and burden fulfillment
✓ Concrete, contextual examples tied directly to motion subject matter
✓ Proactive engagement with likely opposition arguments
✓ Clear prioritization of strongest arguments for this specific round
`;
}

/**
 * Analyzes the motion to determine its type(s), key stakeholders, core tensions, and implementation context.
 * Uses a more robust keyword matching for motion types.
 * @param motion The debate motion string.
 * @returns An object containing analysis results.
 */
function analyzeMotionContext(motion: string) {
  const motionLower = motion.toLowerCase();
  const types: string[] = [];

  // Identify all matching motion types
  for (const type in MOTION_KEYWORDS) {
    const keywords = MOTION_KEYWORDS[type as keyof typeof MOTION_KEYWORDS];
    if (keywords.some(keyword => motionLower.includes(keyword))) {
      types.push(type);
    }
  }

  // Ensure 'policy' is always present if no more specific type is found, or if it's a general policy motion
  if (types.length === 0 || motionLower.includes("this house would") || motionLower.includes("thw")) {
    if (!types.includes("policy")) { // Avoid adding 'policy' twice if already inferred
      types.push("policy");
    }
  }

  const stakeholders = identifyStakeholders(motion);
  const tensions = identifyCoreTensions(motion, types);
  const context = generateImplementationContext(types); // Pass all identified types

  return { types, stakeholders, tensions, context };
}

/**
 * Identifies key stakeholders based on keywords in the motion.
 * @param motion The debate motion string.
 * @returns An array of stakeholder names.
 */
function identifyStakeholders(motion: string): string[] {
  const stakeholders = new Set<string>(); // Use a Set to avoid duplicates and maintain uniqueness
  const motionLower = motion.toLowerCase();

  // Universal stakeholders
  stakeholders.add("Government/State");
  stakeholders.add("Citizens/Public");

  // General categories
  if (motionLower.includes("student") || motionLower.includes("school") || motionLower.includes("education")) {
    stakeholders.add("Students"); stakeholders.add("Parents"); stakeholders.add("Teachers"); stakeholders.add("Educational Institutions");
  }
  if (motionLower.includes("business") || motionLower.includes("corporate") || motionLower.includes("company") || motionLower.includes("worker") || motionLower.includes("consumer") || motionLower.includes("economy")) {
    stakeholders.add("Businesses"); stakeholders.add("Workers"); stakeholders.add("Consumers"); stakeholders.add("Shareholders");
  }
  if (motionLower.includes("health") || motionLower.includes("medical") || motionLower.includes("patient")) {
    stakeholders.add("Patients"); stakeholders.add("Healthcare Providers"); stakeholders.add("Medical Professionals");
  }
  if (motionLower.includes("environment") || motionLower.includes("climate") || motionLower.includes("ecological")) {
    stakeholders.add("Environmental Groups"); stakeholders.add("Future Generations"); stakeholders.add("Affected Communities");
  }
  if (motionLower.includes("media") || motionLower.includes("social media") || motionLower.includes("platform")) {
    stakeholders.add("Media Companies"); stakeholders.add("Content Creators"); stakeholders.add("Platform Users");
  }
  if (motionLower.includes("artificial intelligence") || motionLower.includes("ai")) {
    stakeholders.add("AI Developers"); stakeholders.add("AI Users"); stakeholders.add("Researchers");
  }
  if (motionLower.includes("criminal justice") || motionLower.includes("crime") || motionLower.includes("prison") || motionLower.includes("police")) {
    stakeholders.add("Law Enforcement"); stakeholders.add("Offenders"); stakeholders.add("Victims"); stakeholders.add("Judicial System");
  }
  if (motionLower.includes("developing world") || motionLower.includes("global south") || motionLower.includes("aid")) {
    stakeholders.add("Developing Nations"); stakeholders.add("International Aid Organizations");
  }
  if (motionLower.includes("arts") || motionLower.includes("culture") || motionLower.includes("creative")) {
    stakeholders.add("Artists"); stakeholders.add("Cultural Institutions"); stakeholders.add("Audience/Public");
  }

  return Array.from(stakeholders);
}

/**
 * Identifies core tensions inherent in the motion, based on motion types and keywords.
 * @param motion The debate motion string.
 * @param types An array of identified motion types.
 * @returns An array of core tensions.
 */
function identifyCoreTensions(motion: string, types: string[]): string[] {
  const tensions = new Set<string>();
  const motionLower = motion.toLowerCase();

  // Type-specific tensions
  if (types.includes("prohibition")) {
    tensions.add("Individual Liberty vs Collective Harm Prevention");
    tensions.add("Enforcement Feasibility vs Policy Goals");
    tensions.add("Intended Effects vs Unintended Consequences");
  }
  if (types.includes("economic")) {
    tensions.add("Economic Efficiency vs Distributional Justice");
    tensions.add("Market Freedom vs Government Intervention");
    tensions.add("Short-term Costs vs Long-term Benefits");
  }
  if (types.includes("regulation")) {
    tensions.add("Regulatory Compliance vs Innovation");
    tensions.add("Consumer Protection vs Market Competition");
    tensions.add("Standardization vs Flexibility");
  }
  if (types.includes("liberalization")) {
    tensions.add("Expanded Freedom vs Potential Harm");
    tensions.add("Individual Choice vs Social Consequences");
    tensions.add("Progressive Values vs Traditional Concerns");
  }
  if (types.includes("environmental")) {
    tensions.add("Economic Growth vs Environmental Protection");
    tensions.add("Short-term Gains vs Long-term Sustainability");
    tensions.add("Global Cooperation vs National Sovereignty");
  }
  if (types.includes("social")) {
    tensions.add("Individual Rights vs Collective Welfare");
    tensions.add("Social Cohesion vs Diversity/Pluralism");
    tensions.add("Moral Imperative vs Practicality");
  }
  if (types.includes("technology")) {
    tensions.add("Technological Progress vs Human Agency/Control");
    tensions.add("Efficiency Gains vs Job Displacement");
    tensions.add("Privacy vs Security/Surveillance");
    tensions.add("Innovation vs Ethical Concerns");
  }
  if (types.includes("international")) {
    tensions.add("National Interest vs International Cooperation");
    tensions.add("Sovereignty vs Humanitarian Intervention");
    tensions.add("Global Stability vs Regional Conflicts");
  }

  // General or fallback tensions if few specific ones are identified
  if (tensions.size < 2 || types.includes("policy")) {
    tensions.add("Practical Implementation vs Theoretical Benefits");
    tensions.add("Status Quo Problems vs Policy Risks");
  }

  // Add more specific tensions based on direct keywords, potentially overriding or reinforcing
  if (motionLower.includes("capitalism") || motionLower.includes("socialism")) {
    tensions.add("Free Markets vs State Control");
  }
  if (motionLower.includes("democracy") || motionLower.includes("authoritarianism")) {
    tensions.add("Democratic Values vs Efficiency/Order");
  }

  return Array.from(tensions);
}

/**
 * Generates a description of the implementation context based on motion types.
 * @param types An array of identified motion types.
 * @returns A string describing the implementation context.
 */
function generateImplementationContext(types: string[]): string {
  // Prioritize more specific contexts
  for (const type of types) {
    if (IMPLEMENTATION_CONTEXTS[type]) {
      return IMPLEMENTATION_CONTEXTS[type];
    }
  }
  return IMPLEMENTATION_CONTEXTS.policy; // Default to general policy context
}

/**
 * Retrieves the strategic guidelines for a specific debate role.
 * @param role The debater's role.
 * @returns An object containing role-specific strategies.
 */
function getRoleSpecificStrategy(role: string) {
  return ROLE_STRATEGIES[role as keyof typeof ROLE_STRATEGIES] || ROLE_STRATEGIES.PM; // Default to PM if role is unknown
}

/**
 * Generates the core argument framework (case theory and 3 arguments) for the role and motion.
 * It provides a structured template for arguments.
 * @param motion The debate motion.
 * @param role The debater's role.
 * @param notes Raw preparation notes (currently appended, could be parsed for advanced use).
 * @param motionAnalysis The result of motion analysis.
 * @returns A formatted string containing the argument framework.
 */
function generateArgumentFramework(motion: string, role: string, notes: string, motionAnalysis: any): string {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role);
  let framework = `**Case Theory**: ${generateCaseTheory(role, motionAnalysis)}\n\n`;

  // Generate 3 motion-specific arguments based on role and motion analysis
  const motionArguments = generateMotionSpecificArguments(role, motionAnalysis);

  motionArguments.forEach((arg, index) => {
    framework += `**Argument ${index + 1}: ${arg.title}**\n`;
    framework += `* **Claim**: ${arg.claim}\n`;
    framework += `* **Mechanism/Reasoning**: ${arg.mechanism}\n`;
    framework += `* **Evidence/Examples**: ${arg.evidence}\n`;
    framework += `* **Impact**: ${arg.impact}\n`;
    framework += `* **Weighing**: ${arg.weighing}\n\n`;
  });

  // Small note on how original notes could be integrated (for user awareness)
  if (notes.trim().length > 50) {
    framework += `*Consider how specific points from your "Original Notes" below can enrich these arguments with concrete details and examples.*`;
  }

  return framework;
}

/**
 * Generates the core case theory for Government or Opposition based on motion types.
 * @param role The debater's role.
 * @param motionAnalysis The result of motion analysis.
 * @returns A string representing the case theory.
 */
function generateCaseTheory(role: string, motionAnalysis: any): string {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role);
  const types = motionAnalysis.types;

  // Prioritize specific theories based on motion types
  if (types.includes("prohibition")) {
    return isGovernment
      ? `This prohibition is necessary because the harms of the prohibited activity (e.g., crime, public health crisis) definitively outweigh any individual liberty concerns, and effective, enforceable mechanisms exist to implement it.`
      : `This prohibition infringes on fundamental liberties, will create more severe unintended consequences (e.g., black markets, social unrest), and fails to address underlying issues through less restrictive means.`;
  }
  if (types.includes("economic")) {
    return isGovernment
      ? `This economic intervention corrects clear market failures, promotes both efficiency and equitable distribution of resources, and will lead to sustainable long-term economic growth for all stakeholders.`
      : `This economic intervention distorts natural markets, creates significant unintended consequences (e.g., inflation, job loss), and fails to achieve its stated goals while imposing unacceptable costs on businesses and consumers.`;
  }
  if (types.includes("regulation")) {
    return isGovernment
      ? `This regulation addresses critical market/societal failures, protects vulnerable stakeholders (e.g., consumers, environment), and fosters a fairer, safer environment without stifling necessary innovation.`
      : `This regulation stifles innovation, imposes excessive compliance costs that disproportionately harm small entities, and will fail to deliver the promised benefits while creating significant bureaucratic burdens.`;
  }
  if (types.includes("liberalization")) {
    return isGovernment
      ? `This liberalization expands essential freedoms, fosters innovation, and promotes societal progress by removing outdated or unjust restrictions, with manageable and outweighed risks.`
      : `This liberalization introduces unacceptable harms and systemic risks to society (e.g., public safety, moral decline), disproportionately affecting vulnerable groups, and outweighing any perceived individual benefits.`;
  }
  if (types.includes("environmental")) {
    return isGovernment
      ? `This policy critically addresses urgent environmental degradation and ensures long-term ecological sustainability, which is paramount for current and future generations, even if it entails short-term economic adjustments.`
      : `This environmental policy is economically unfeasible, unfairly burdens specific industries or demographics, and offers insufficient tangible benefits to justify its immense costs or infringements on economic freedom.`;
  }
  if (types.includes("technology")) {
    return isGovernment
      ? `This policy ensures that technological advancement proceeds ethically and safely, maximizing its benefits for society while proactively mitigating risks like bias, surveillance, or job displacement.`
      : `This policy unduly stifles innovation and technological progress, is based on an insufficient understanding of the tech landscape, and will lead to unforeseen negative consequences for economic competitiveness and individual freedoms.`;
  }

  // Default general case theories
  return isGovernment
    ? `This policy addresses significant, demonstrable problems through effective and pragmatic mechanisms that will create net positive outcomes for society as a whole.`
    : `This policy fails to genuinely solve underlying problems, while creating new and substantial harms that outweigh any theoretical benefits, leading to a worse status quo.`;
}

/**
 * Generates 3 motion-specific arguments (Claim, Mechanism, Evidence, Impact, Weighing) based on role and motion analysis.
 * This function provides templates; actual 'parsing' of user notes for argument content would require NLP.
 * @param role The debater's role.
 * @param motionAnalysis The result of motion analysis.
 * @returns An array of argument objects.
 */
function generateMotionSpecificArguments(role: string, motionAnalysis: any) {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role);
  const types = motionAnalysis.types;
  const stakeholders = motionAnalysis.stakeholders;
  const tensions = motionAnalysis.tensions;
  const args = [];

  // Argument 1: Addressing the Core Problem / Policy Failure
  if (isGovernment) {
    args.push({
      title: `Addressing the Root Cause of [Core Problem/Tension]`,
      claim: `This policy directly and effectively mitigates the significant underlying problem identified by ${tensions[0] || 'the core tension'}.`,
      mechanism: `The proposed mechanisms (e.g., funding, regulation, ban) are specifically designed to target the systemic failures that create this problem, ensuring a durable solution.`,
      evidence: `[Cite studies, expert consensus, or successful comparable policies from your notes] that demonstrate the severity of the problem and the effectiveness of this type of solution.`,
      impact: `This leads to measurable improvements in [e.g., public health, economic stability, environmental quality], improving the welfare of countless individuals and preventing future crises.`,
      weighing: `The sheer **magnitude** and **irreversibility** of the problem necessitate this direct intervention; inaction guarantees continued harm.`,
    });
  } else {
    args.push({
      title: `Fundamental Flaws: Ineffectiveness & Unintended Consequences`,
      claim: `This policy is fundamentally flawed in its design and implementation, destined to fail its stated goals and create significant, unforeseen negative consequences.`,
      mechanism: `The proposed mechanisms are either impractical, insufficient to address the scale of the problem, or will be circumvented by market/social forces, leading to adverse reactions.`,
      evidence: `[Cite historical precedents or expert analyses from your notes] demonstrating how similar top-down approaches have failed, leading to black markets, resource waste, or public discontent.`,
      impact: `This will worsen the initial problem, divert crucial resources, erode public trust, and create new social/economic harms that did not exist before.`,
      weighing: `The **high probability of failure** and the **severity of unintended harms** mean this policy is actively counterproductive, making it worse than the status quo.`,
    });
  }

  // Argument 2: Stakeholder Impact / Value Trade-off
  const primaryStakeholder = stakeholders.length > 2 ? stakeholders[1] : "key populations"; // Pick a specific stakeholder if available
  const coreValueTension = tensions.length > 0 ? tensions[0].split(' vs ')[0] : "Individual Rights"; // Pick one side of a tension
  if (isGovernment) {
    args.push({
      title: `Delivering Tangible Benefits for ${primaryStakeholder}`,
      claim: `This policy will bring substantial and equitable benefits to ${primaryStakeholder.toLowerCase()}, directly improving their well-being and opportunities.`,
      mechanism: `Specific provisions within the policy (e.g., funding streams, protective regulations, access initiatives) are precisely designed to uplift, protect, or empower this group.`,
      evidence: generateStakeholderEvidence(primaryStakeholder, true),
      impact: `This translates into improved quality of life, greater economic opportunity, enhanced safety, or strengthened fundamental rights for a crucial segment of society.`,
      weighing: `The **direct and significant benefits** to ${primaryStakeholder.toLowerCase()} are morally compelling and justify the policy's implementation, showing its **scope** of positive reach.`,
    });
  } else {
    args.push({
      title: `Disproportionate Harms & Erosion of ${coreValueTension}`,
      claim: `This policy will disproportionately burden and actively harm ${primaryStakeholder.toLowerCase()}, while simultaneously eroding core values like ${coreValueTension}.`,
      mechanism: `The policy's implementation ignores the specific circumstances of ${primaryStakeholder.toLowerCase()} and actively undermines principles of ${coreValueTension} through overreach or unintended side effects.`,
      evidence: generateStakeholderEvidence(primaryStakeholder, false),
      impact: `This leads to reduced welfare, diminished autonomy, increased vulnerability, and sets a dangerous precedent for future infringements on fundamental liberties/economic freedoms.`,
      weighing: `The **severity of harm** to vulnerable populations combined with the **erosion of critical principles** means the policy is fundamentally unjust and indefensible, regardless of theoretical benefits.`,
    });
  }

  // Argument 3: Systemic/Long-term Implications / Alternative Solutions
  if (isGovernment) {
    args.push({
      title: `Fostering Long-Term Stability & Systemic Progress`,
      claim: `Beyond immediate effects, this policy fosters long-term stability, systemic progress, and sets a positive precedent for future governance.`,
      mechanism: `The policy addresses systemic issues, promotes institutional reform, or incentivizes innovation that will yield compounding benefits over time.`,
      evidence: `[Cite long-term trend analysis, historical examples of successful systemic reforms, or future projections from your notes] demonstrating the enduring positive impact.`,
      impact: `This creates a more resilient society/economy/environment, enhances international standing, or fundamentally shifts the paradigm towards a more desirable future.`,
      weighing: `The **long-term transformational benefits** and the **precedential value** of this policy are crucial for shaping a better future and outweigh short-term adjustments.`,
    });
  } else {
    args.push({
      title: `Viable & Superior Alternatives / Slippery Slope`,
      claim: `Not only is this policy flawed, but viable and superior alternative solutions exist that address the problem more effectively and without the associated harms, or this policy represents a dangerous slippery slope.`,
      mechanism: `Alternatives (e.g., market-based solutions, targeted social programs, public awareness campaigns) could achieve the desired goals through less intrusive, more efficient, or ethically superior means.`,
      evidence: `[Cite examples of successful alternatives from other jurisdictions or historical contexts, or expert critiques] that propose better ways to solve the problem without the policy's drawbacks.`,
      impact: `Adopting this policy closes off more effective paths, wastes resources on a failing endeavor, and risks incrementally eroding freedoms or stability that society values.`,
      weighing: `The **availability of superior alternatives** (or the **danger of the slippery slope**) makes this policy unnecessary and ultimately harmful, demonstrating its **redundancy and risk**.`,
    });
  }

  return args;
}

/**
 * Provides tailored evidence suggestions for specific stakeholders.
 * @param stakeholder The stakeholder name.
 * @param isGovernment True if generating for Government, false for Opposition.
 * @returns A string of evidence examples.
 */
function generateStakeholderEvidence(stakeholder: string, isGovernment: boolean): string {
  const evidenceMap: { [key: string]: { gov: string, opp: string } } = {
    "Students": {
      gov: "Educational research consistently shows improved learning outcomes, reduced stress, and increased engagement in contexts where similar policies were implemented.",
      opp: "Student surveys and anecdotal evidence highlight increased anxiety, reduced autonomy, and a stifling of creativity under comparable policy frameworks.",
    },
    "Businesses": {
      gov: "Economic analyses project long-term competitiveness gains, increased market stability, and innovation benefits resulting from this policy's environment, citing specific industry reports.",
      opp: "Industry impact studies forecast significant compliance costs, reduced operational flexibility, and a dampening effect on investment and job creation, leading to job losses.",
    },
    "Healthcare Providers": {
      gov: "Medical association reports and pilot program results indicate improved patient outcomes, enhanced service delivery efficiency, and greater job satisfaction for providers.",
      opp: "Surveys among healthcare professionals reveal increased administrative burdens, potential for burnout, and concerns about compromised patient care quality due to new regulations.",
    },
    "Environmental Groups": {
      gov: "Independent environmental impact assessments and ecological models predict measurable improvements in air/water quality, biodiversity, and ecosystem health, citing specific scientific studies.",
      opp: "Environmental justice studies and expert critiques point to disproportionate negative impacts on vulnerable communities or highlight the policy's insufficient scope to address the real crisis, leading to greenwashing.",
    },
    "Workers": {
      gov: "Labor market analyses suggest new job creation, improved working conditions, enhanced worker protections, and increased wage growth in sectors affected by this policy.",
      opp: "Union reports and economic forecasts warn of job displacement, wage stagnation, or reduced worker rights due to automation or increased regulatory burden.",
    },
    "Consumers": {
      gov: "Consumer protection agencies and market research indicate increased product safety, better service quality, fairer pricing, and greater market transparency benefiting consumers.",
      opp: "Consumer advocacy groups raise concerns about reduced choice, higher prices, or barriers to access for essential goods/services, leading to consumer detriment.",
    },
    "Future Generations": {
      gov: "Long-term projections and sustainability reports illustrate how this policy secures resources, mitigates future risks, and preserves opportunities for future generations.",
      opp: "Debt accumulation, resource depletion, or irreversible environmental damage resulting from this policy will disproportionately burden future generations.",
    },
    "Developing Nations": {
      gov: "Case studies of successful development initiatives show how similar policies have fostered economic growth, improved social indicators, and reduced poverty in developing contexts.",
      opp: "Critiques from development economists highlight how this policy could lead to dependency, resource exploitation, or undermine local industries in developing nations.",
    }
  };

  const genericGov = "Research shows positive outcomes for affected populations, demonstrating clear benefits and successful implementation in similar contexts.";
  const genericOpp = "Studies consistently show negative impacts on affected populations, leading to demonstrable harms and unintended consequences, drawing from real-world examples.";

  const specificEvidence = evidenceMap[stakeholder];
  return specificEvidence ? (isGovernment ? specificEvidence.gov : specificEvidence.opp) : (isGovernment ? genericGov : genericOpp);
}


/**
 * Generates anticipated opposition arguments and preemptive responses based on the role.
 * @param role The debater's role.
 * @returns A formatted string of anticipated opposition and responses.
 */
function generateAnticipatedOpposition(role: string): string {
  const isGovernment = ["PM", "DPM", "MG", "GW"].includes(role);

  const commonOppositionPoints = [
    "**Implementation challenges and enforcement problems**: The policy is impractical or impossible to execute effectively, leading to failure or unintended side effects.",
    "**Disproportionate impacts**: The policy will harm specific vulnerable populations, industries, or regions unequally.",
    "**Superior alternative solutions**: Other, better ways exist to address the problem that are less intrusive, more efficient, or ethically preferable.",
    "**Violation of fundamental rights/principles**: The policy infringes on individual liberties, economic freedoms, or democratic processes.",
    "**High economic costs/administrative burdens**: The financial or bureaucratic burden of the policy outweighs its purported benefits.",
    "**Problem misidentification/exaggeration**: The problem is not as severe as claimed, or the government misunderstands its root causes.",
    "**Unintended negative consequences**: The policy will create new, unforeseen problems (e.g., black markets, brain drain, social unrest).",
    "**Moral hazard/Dependency**: The policy creates perverse incentives or fosters dependency.",
  ];

  const commonGovernmentPoints = [
    "**Significant problems require intervention**: The status quo is demonstrably harmful and necessitates urgent action.",
    "**Feasible implementation**: The policy's mechanisms are robust, practical, and can be effectively implemented.",
    "**Benefits outweigh costs**: The positive impacts (social, economic, environmental) are substantial and justify any associated costs or trade-offs.",
    "**Status quo is unacceptable**: Inaction leads to continued or worsening harm.",
    "**Alignment with values**: The policy aligns with progressive values, justice, or long-term societal progress.",
    "**Mitigation of harms**: Safeguards and provisions are in place to address potential negative impacts on specific groups.",
    "**Successful precedents**: Similar policies have succeeded in comparable jurisdictions or historical contexts.",
    "**Addresses root causes**: The policy targets the fundamental issues, not just symptoms."
  ];

  let opposition = "";

  if (isGovernment) {
    opposition += "**Opposition will likely argue:**\n" + commonOppositionPoints.map(p => `* ${p}`).join("\n");
    opposition += "\n\n**Preemptive responses (how to refute them):**\n";
    opposition += `* Our implementation mechanisms are robust, have been successfully tested in pilot programs/similar contexts, and account for potential challenges.
* Safeguards are explicitly designed to protect vulnerable populations, and any disproportionate impact is minimal compared to the overarching benefits delivered.
* We've thoroughly considered alternatives; they either address symptoms, have failed in practice, or are insufficient in scale and urgency.
* Any perceived limitation on rights is proportionate and justified by the magnitude of the collective welfare gains and addresses a clear, demonstrable societal harm.
* The long-term societal and economic benefits far outweigh the initial investment or administrative adjustments, which are manageable and yield high returns.
* The problem's severity is evidenced by [mention specific stats/trends/examples]; denying its scale is to ignore reality.
* Our policy design anticipates and provides concrete mitigations for potential unintended consequences, ensuring net positive outcomes.
* This policy fosters responsibility and empowers individuals/entities, rather than creating dependency.
`;
  } else {
    opposition += "**Government will likely argue:**\n" + commonGovernmentPoints.map(p => `* ${p}`).join("\n");
    opposition += "\n\n**Counter-responses (how to refute them):**\n";
    opposition += `* The problems cited are either overstated, can be addressed through less intrusive means, or are not causally linked to the status quo.
* Their proposed implementation lacks crucial specific details, ignores practical realities, or relies on untested assumptions, making success highly improbable.
* The costs, both direct (financial) and indirect (e.g., stifled innovation, erosion of liberty), are severely underestimated and will far outweigh any theoretical benefits.
* While the status quo has issues, this specific solution is a disproportionate, harmful, or ineffective response that exacerbates existing problems or creates new ones.
* The policy fundamentally misinterprets or undermines societal values, leading to a path that degrades rather than strengthens long-term societal well-being.
* Their "safeguards" are insufficient, unenforceable, or merely token gestures, leaving vulnerable populations exposed to significant harm.
* Comparative examples often fail to account for critical contextual differences, making their claimed successes irrelevant or misleading for our specific situation.
* The policy focuses on symptoms or creates new problems, rather than addressing the true root causes, leading to a temporary or false solution.
`;
  }

  return opposition;
}

/**
 * Suggests relevant types of evidence and specific examples for the motion.
 * @param motion The debate motion.
 * @param motionAnalysis The result of motion analysis, including types.
 * @returns A formatted string of evidence suggestions.
 */
function generateRelevantEvidence(motion: string, motionAnalysis: any): string {
  const motionLower = motion.toLowerCase();
  const types = motionAnalysis.types;
  let evidence = "**Key Evidence Sources & Types (General):**\n";

  evidence += "* Empirical studies, academic research, and peer-reviewed journals on policy effectiveness.\n";
  evidence += "* Comparative policy analysis from similar jurisdictions, historical precedents, and case studies (successes and failures).\n";
  evidence += "* Economic impact assessments, cost-benefit analyses, market data, and financial reports.\n";
  evidence += "* Stakeholder impact assessments, public opinion surveys, anecdotal evidence (used carefully for illustration).\n";
  evidence += "* Expert opinions, reports from relevant NGOs, think tanks, and government statistics.\n";
  evidence += "* Ethical frameworks, philosophical arguments, and legal precedents (for value-based or legal motions).\n";
  evidence += "* Scientific consensus reports, climate models, and epidemiological data (for environmental/health motions).\n";
  evidence += "* International treaties, conventions, and practices (for international relations motions).\n";

  evidence += "\n**Specific Examples/Areas to Research:**\n";
  let specificExamples = [];

  if (types.includes("prohibition")) {
    specificExamples.push("Successful bans: Asbestos, lead paint, CFCs and their environmental impact.");
    specificExamples.push("Failed prohibitions: Alcohol Prohibition (US), certain aspects of the 'War on Drugs' and their social/economic consequences.");
    specificExamples.push("Partial bans/restrictions: Smoking restrictions in public places, plastic bag bans in various cities/countries.");
  }
  if (types.includes("economic")) {
    specificExamples.push("Carbon taxes (e.g., British Columbia, Nordic countries) and their environmental/economic effects.");
    specificExamples.push("Sin taxes (e.g., tobacco, alcohol, sugar) and their public health impacts.");
    specificExamples.push("Universal Basic Income (UBI) trials (e.g., Finland, Stockton, California) and their social/economic outcomes.");
    specificExamples.push("Wealth taxes (e.g., France, Switzerland) and their effects on inequality and capital flight.");
  }
  if (types.includes("regulation")) {
    specificExamples.push("GDPR implementation in the EU and its impact on data privacy and tech companies.");
    specificExamples.push("Automotive safety regulations (e.g., seatbelts, airbags) and their effect on fatality rates.");
    specificExamples.push("Financial regulations (e.g., Dodd-Frank Act) and their role in preventing crises.");
  }
  if (types.includes("liberalization")) {
    specificExamples.push("Cannabis legalization in Canada or certain US states: economic, social, and public health impacts.");
    specificExamples.push("Deregulation of industries (e.g., airlines, telecommunications) and effects on competition/consumer prices.");
    specificExamples.push("Expanded free speech rights vs. hate speech laws in different jurisdictions.");
  }
  if (types.includes("technology")) {
    specificExamples.push("Section 230 in the US and platform liability debates.");
    specificExamples.push("Australia's News Media Bargaining Code and its impact on tech giants and local news.");
    specificExamples.push("Germany's NetzDG law on online hate speech.");
    specificExamples.push("Concerns about AI bias in facial recognition or hiring algorithms (e.g., Amazon's HR tool).");
    specificExamples.push("The development and regulation of autonomous vehicles.");
  }
  if (types.includes("environmental")) {
    specificExamples.push("Paris Agreement targets and national climate action plans.");
    specificExamples.push("Renewable energy transitions in Germany (Energiewende) or Denmark.");
    specificExamples.push("Conservation efforts (e.g., rewilding projects, marine protected areas) and their ecological/economic impact.");
    specificExamples.push("Impact of specific industries (e.g., fossil fuels, fashion) on the environment.");
  }
  if (types.includes("education")) {
    specificExamples.push("PISA/TIMSS scores, graduation rates, and other educational outcome metrics for different systems.");
    specificExamples.push("Pedagogical research on teaching methods and learning environments (e.g., blended learning, Montessori).");
    specificExamples.push("Funding models and their impact on educational equity and access.");
    specificExamples.push("Case studies of education reforms in different countries or regions (e.g., Finland's system, Singapore's emphasis on STEM).");
  }
  if (types.includes("international")) {
    specificExamples.push("UN peacekeeping missions (successes and failures).");
    specificExamples.push("Economic sanctions (e.g., against Russia, Iran) and their effectiveness/impact.");
    specificExamples.push("International aid programs (e.g., WHO, World Bank) and their long-term effects.");
    specificExamples.push("Case studies of diplomatic negotiations or international conflicts.");
  }
  if (motionLower.includes("housing") || motionLower.includes("homelessness")) {
    specificExamples.push("Rent control policies and their effect on housing supply/affordability (e.g., Berlin, NYC).");
    specificExamples.push("Homelessness solutions: 'Housing First' initiatives (e.g., Utah) vs. traditional shelter models.");
    specificExamples.push("Zoning laws and their impact on urban development and housing costs.");
  }

  // Fallback for very general motions or if specific examples are not generated
  if (specificExamples.length === 0) {
    specificExamples.push("General policy implementations in comparable jurisdictions (identify both successes and failures).");
    specificExamples.push("Case studies of similar social movements or reforms from history.");
    specificExamples.push("Examples illustrating stakeholder impact (positive and negative) from related policies or events.");
  }

  return specificExamples.map((example) => `* ${example}`).join("\n");
}


/**
 * Generates strategic reminders tailored to the specific debate role.
 * @param role The debater's role.
 * @returns A formatted string of strategic reminders.
 */
function generateStrategicReminders(role: string): string {
  const roleReminders = ROLE_STRATEGIES[role as keyof typeof ROLE_STRATEGIES]?.opportunities || [
    "Focus on core burdens.",
    "Engage key clashes directly.",
    "Prioritize your strongest arguments.",
    "Maintain strong signposting and structure throughout your speech.",
    "Listen actively and adapt to the unfolding debate.",
  ];

  // Add general reminders that apply to all roles, if not already covered
  const generalReminders = [
    "Stay calm and confident under pressure.",
    "Speak clearly and at a moderate pace.",
    "Make eye contact with the judge and opposition.",
    "Manage your time effectively.",
    "Be concise and avoid jargon.",
    "Use rhetorical devices to make your points memorable.",
  ];

  const combinedReminders = new Set<string>();
  roleReminders.forEach(r => combinedReminders.add(r));
  generalReminders.forEach(r => combinedReminders.add(r));

  return Array.from(combinedReminders).map((reminder) => `* ${reminder}`).join("\n");
}