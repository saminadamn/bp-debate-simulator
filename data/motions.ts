export const motions = [
  // AI & Technology
  "This House would ban artificial intelligence from artistic competitions",
  "This House believes social media platforms should be legally responsible for political misinformation",
  "This House would require social media algorithms to filter political content",
  "This House would use blockchain to manage elections",
  "This House believes universal surveillance is justified for safety",
  "This House would ban targeted advertising on social media platforms",
  "This House believes artificial intelligence poses a greater threat than benefit to humanity",
  "This House would criminalize deepfake technology",
  "This House would require AI systems to be explainable by law",
  "This House believes automation will create more jobs than it destroys",

  // Economics & Governance
  "This House supports universal basic income",
  "This House would make voting mandatory",
  "This House would criminalize political donations from corporations",
  "This House would ban inheritance beyond a fixed limit",
  "This House would nationalize major industries during crisis",
  "This House would implement a global wealth tax",
  "This House would abolish corporate lobbying",
  "This House would ban lobbying by multinational corporations",
  "This House believes global reparations are due for colonial pasts",
  "This House would implement a maximum income cap",

  // Education & Society
  "This House would abolish elite private schools",
  "This House would introduce quotas for women in parliament",
  "This House believes cancel culture does more harm than good",
  "This House would make all graduates serve a year of public service",
  "This House believes literacy includes digital citizenship skills",
  "This House would require public schools to teach religion objectively",
  "This House opposes cancel culture in the arts",
  "This House believes remote work harms community cohesion",
  "This House would ban beauty pageants",
  "This House would criminalize Holocaust denial",

  // Environment & Climate
  "This House would prioritize climate adaptation over mitigation in developing countries",
  "This House would ban factory farming",
  "This House supports mandatory recycling quotas for households",
  "This House supports taxing carbon footprints of flights",
  "This House would implement a universal carbon tax",
  "This House believes developed nations should accept unlimited climate refugees",
  "This House would grant legal personhood to rivers",
  "This House would ban the development of lethal autonomous weapons",
  "This House believes space exploration is a waste of resources",
  "This House would invest in a space race",

  // Healthcare & Ethics
  "This House believes health care should be entirely private",
  "This House would allow genetic enhancement of children",
  "This House would allow euthanasia for non-terminal patients",
  "This House would ban the use of animals in scientific research",
  "This House would allow the sale of human organs",
  "This House would ban private healthcare",
  "This House supports the use of performance-enhancing drugs in sports",
  "This House would force religious institutions to pay taxes",
  "This House believes prisoners should be allowed to vote",
  "This House would legalize all drugs",

  // Justice & Law
  "This House would disallow plea bargaining in criminal justice",
  "This House would abolish prisons",
  "This House would ban the death penalty worldwide",
  "This House would allow soldiers to opt out of individual conflict zones on ethical grounds",
  "This House would criminalize the payment of ransom to terrorists",
  "This House would provide amnesty for all undocumented immigrants currently in the country",
  "This House believes public figures should have fewer privacy rights",
  "This House would outlaw hate speech on social media",
  "This House believes the media should show the full horrors of war",
  "This House would require politicians to pass a fact-checking audit before election",

  // International Relations
  "This House believes nuclear weapons make the world safer",
  "This House believes the United Nations has failed",
  "This House believes economic sanctions do more harm than good",
  "This House believes nationalism has no place in the modern world",
  "This House believes the IMF and World Bank have done more harm than good",
  "This House would support a global wealth tax",
  "This House believes that developing nations should implement a one-child policy",
  "This House would require all citizens to perform mandatory national service",
  "This House supports the rise of citizen journalism over professional journalism",
  "This House believes that feminism should not align itself with capitalism",

  // Culture & Arts
  "This House believes art should be publicly funded regardless of content",
  "This House believes private companies should not run cultural heritage sites",
  "This House believes the state should not fund the arts",
  "This House would ban religious schools",
  "This House believes that social movements should prioritize pragmatism over radicalism",
  "This House opposes subscription-based business models",
  "This House would ban political advertising targeting minors",
  "This House believes internet access should be a basic human right",
  "This House would implement a four-day working week",
  "This House believes democracy is incompatible with effective climate action",

  // Additional Contemporary Issues
  "This House would ban cryptocurrency mining",
  "This House believes influencer marketing should be regulated like traditional advertising",
  "This House would require parental licenses for having children",
  "This House believes gig economy workers should be classified as employees",
  "This House would ban single-use plastics globally",
  "This House believes mental health days should be mandatory in schools",
  "This House would implement ranked choice voting",
  "This House believes social media age verification should be mandatory",
  "This House would ban political parties from using personal data for targeting",
  "This House believes streaming platforms should be required to promote local content",

  // Philosophy & Ethics
  "This House believes that moral relativism is superior to moral absolutism",
  "This House would prioritize collective welfare over individual rights",
  "This House believes that progress requires inequality",
  "This House would choose security over privacy",
  "This House believes that tradition should guide policy more than innovation",
  "This House would sacrifice economic growth for environmental protection",
  "This House believes that meritocracy is a myth",
  "This House would prioritize happiness over freedom",
  "This House believes that cultural appropriation is always harmful",
  "This House would choose equality of outcome over equality of opportunity",
]

export function getRandomMotion(): string {
  const idx = Math.floor(Math.random() * motions.length)
  return motions[idx]
}

export function getMotionsByCategory(category: string): string[] {
  // Simple categorization based on keywords
  const categoryKeywords: Record<string, string[]> = {
    technology: ["artificial intelligence", "AI", "social media", "blockchain", "surveillance", "algorithm"],
    economics: ["income", "tax", "wealth", "economic", "corporate", "business"],
    environment: ["climate", "environment", "carbon", "factory farming", "recycling"],
    social: ["education", "culture", "society", "community", "family"],
    politics: ["voting", "government", "democracy", "political", "election"],
  }

  const keywords = categoryKeywords[category.toLowerCase()] || []
  return motions.filter((motion) => keywords.some((keyword) => motion.toLowerCase().includes(keyword)))
}
