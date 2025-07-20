"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Play } from "lucide-react"

type Role = "PM" | "LO" | "DPM" | "DLO" | "MG" | "MO" | "GW" | "OW"
type Team = "OG" | "OO" | "CG" | "CO"

interface RoleAssignmentProps {
  onRoleAssigned: (role: Role) => void
  motion: string
  isMotionLocked: boolean
  onStartPrep: () => void
}

const roles: Role[] = ["PM", "LO", "DPM", "DLO", "MG", "MO", "GW", "OW"]

const roleNames: Record<Role, string> = {
  PM: "Prime Minister",
  LO: "Leader of Opposition",
  DPM: "Deputy Prime Minister",
  DLO: "Deputy Leader of Opposition",
  MG: "Member of Government",
  MO: "Member of Opposition",
  GW: "Government Whip",
  OW: "Opposition Whip",
}

const roleToTeam: Record<Role, Team> = {
  PM: "OG",
  DPM: "OG",
  LO: "OO",
  DLO: "OO",
  MG: "CG",
  GW: "CG",
  MO: "CO",
  OW: "CO",
}

const teamColors: Record<Team, string> = {
  OG: "bg-blue-100 text-blue-800",
  OO: "bg-red-100 text-red-800",
  CG: "bg-green-100 text-green-800",
  CO: "bg-purple-100 text-purple-800",
}

export default function RoleAssignment({ onRoleAssigned, motion, isMotionLocked, onStartPrep }: RoleAssignmentProps) {
  const [assignedRole, setAssignedRole] = useState<Role | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  const assignRandomRole = () => {
    if (!isMotionLocked) return

    setIsAssigning(true)

    setTimeout(() => {
      const randomRole = roles[Math.floor(Math.random() * roles.length)]
      setAssignedRole(randomRole)
      onRoleAssigned(randomRole)
      setIsAssigning(false)
    }, 1000)
  }

  const startPreparation = () => {
    if (assignedRole) {
      onStartPrep()
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Role Assignment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isMotionLocked && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">Please lock a motion first before role assignment.</p>
          </div>
        )}

        <div className="min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {assignedRole ? (
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Your Role:</h3>
                <div className="space-y-2">
                  <Badge className={`text-lg px-4 py-2 ${teamColors[roleToTeam[assignedRole]]}`}>
                    {roleNames[assignedRole]}
                  </Badge>
                  <div className="text-sm text-gray-600">Team: {roleToTeam[assignedRole]}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              {isMotionLocked ? 'Click "Assign Role" to get your position' : "Waiting for motion lock..."}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            onClick={assignRandomRole}
            disabled={!isMotionLocked || isAssigning || !!assignedRole}
            className="w-full"
          >
            {isAssigning ? (
              <>
                <Users className="h-4 w-4 mr-2 animate-pulse" />
                Assigning Role...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Assign Role
              </>
            )}
          </Button>

          {assignedRole && (
            <Button onClick={startPreparation} className="w-full" variant="default">
              <Play className="h-4 w-4 mr-2" />
              Start Preparation (15 min)
            </Button>
          )}
        </div>

        {assignedRole && (
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <strong>Your Position:</strong>{" "}
              {roleToTeam[assignedRole] === "OG" || roleToTeam[assignedRole] === "CG" ? "Government" : "Opposition"}
            </p>
            <p>
              <strong>Speaking Order:</strong> {roles.indexOf(assignedRole) + 1} of 8
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
