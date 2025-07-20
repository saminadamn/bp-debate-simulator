import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gavel, Users, Clock, Mic, Brain, Trophy } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Debate Simulator</h1>
          <p className="text-xl text-gray-600 mb-8">
            Practice British Parliamentary debates with AI opponents and get expert adjudication
          </p>
          <Link href="/debate">
            <Button size="lg" className="text-lg px-8 py-3">
              Start New Debate Round
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Role Assignment
              </CardTitle>
              <CardDescription>Automatic BP format role allocation (OG, OO, CG, CO)</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Prep Timer
              </CardTitle>
              <CardDescription>15-minute preparation with pause/resume controls</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Speech Recording
              </CardTitle>
              <CardDescription>Real-time transcription and AI speech generation</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Opponents
              </CardTitle>
              <CardDescription>Intelligent AI debaters with adjustable skill levels</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                Expert Adjudication
              </CardTitle>
              <CardDescription>Detailed feedback on Matter, Manner, and Method</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Skill Development
              </CardTitle>
              <CardDescription>Clash analysis and comparative weighing feedback</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold mb-1">Motion & Roles</h3>
                <p className="text-sm text-gray-600">Get assigned a random motion and your debate role</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold mb-1">Preparation</h3>
                <p className="text-sm text-gray-600">15 minutes to prepare your case with AI assistance</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold mb-1">Debate</h3>
                <p className="text-sm text-gray-600">Deliver speeches and respond to AI opponents</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-600">4</span>
                </div>
                <h3 className="font-semibold mb-1">Feedback</h3>
                <p className="text-sm text-gray-600">Receive detailed adjudication and improvement tips</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
