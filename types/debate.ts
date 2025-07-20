export type SkillLevel = "beginner" | "intermediate" | "advanced"
export type Role = "PM" | "LO" | "DPM" | "DLO" | "MG" | "MO" | "GW" | "OW"
export type Team = "OG" | "OO" | "CG" | "CO"
export type DebatePhase = "setup" | "prep" | "speech" | "feedback"

export interface Speech {
  role: Role
  content: string
  transcript?: string
  isAI: boolean
  skillLevel?: SkillLevel
  timeSpoken?: number
}

export interface DebateState {
  motion: string
  userRole: Role
  userTeam: Team
  userSkillLevel: SkillLevel
  currentSpeaker: Role
  phase: DebatePhase
  speeches: Speech[]
  prepNotes: string
  currentTranscript: string
}

export interface POI {
  id: string
  content: string
  context: string
  targetRole: Role
  timestamp: number
  isAccepted?: boolean
}
