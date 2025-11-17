import { useKV } from "@github/spark/hooks"
import { TeamCard } from "@/components/TeamCard"
import { BracketConnector } from "@/components/BracketConnector"
import { EditBracketDialog } from "@/components/EditBracketDialog"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trophy } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface Team {
  rank: number
  name: string
}

const DEFAULT_TEAMS: Team[] = [
  { rank: 1, name: "Oregon" },
  { rank: 2, name: "Georgia" },
  { rank: 3, name: "Texas" },
  { rank: 4, name: "Penn State" },
  { rank: 5, name: "Notre Dame" },
  { rank: 6, name: "Ohio State" },
  { rank: 7, name: "Tennessee" },
  { rank: 8, name: "Indiana" },
  { rank: 9, name: "Boise State" },
  { rank: 10, name: "SMU" },
  { rank: 11, name: "Alabama" },
  { rank: 12, name: "Arizona State" },
  { rank: 13, name: "Miami" },
  { rank: 14, name: "South Carolina" },
]

function App() {
  const [teams, setTeams] = useKV<Team[]>("cfp-teams", DEFAULT_TEAMS)

  const playoffTeams = teams?.slice(0, 12) || []
  const leftOutTeams = teams?.slice(12, 14) || []

  const firstRoundMatchups = [
    [playoffTeams[4], playoffTeams[11]],
    [playoffTeams[5], playoffTeams[10]],
    [playoffTeams[6], playoffTeams[9]],
    [playoffTeams[7], playoffTeams[8]],
  ]

  const quarterfinalsSeeds = [
    playoffTeams[0],
    null,
    playoffTeams[1],
    null,
    playoffTeams[2],
    null,
    playoffTeams[3],
    null,
  ]

  if (!teams || playoffTeams.length < 12) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Trophy size={64} weight="fill" className="text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading bracket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
              College Football Playoff
            </h1>
            <p className="text-muted-foreground text-sm">12-Team Bracket</p>
          </div>
          <EditBracketDialog teams={teams} onSave={setTeams} />
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[0][0].rank} name={firstRoundMatchups[0][0].name} delay={0.1} />
                <TeamCard rank={firstRoundMatchups[0][1].rank} name={firstRoundMatchups[0][1].name} delay={0.15} />
              </div>
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[1][0].rank} name={firstRoundMatchups[1][0].name} delay={0.2} />
                <TeamCard rank={firstRoundMatchups[1][1].rank} name={firstRoundMatchups[1][1].name} delay={0.25} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <BracketConnector orientation="right" height={120} />
              <BracketConnector orientation="right" height={120} />
            </div>

            <div className="flex flex-col gap-16">
              {quarterfinalsSeeds[0] && <TeamCard rank={quarterfinalsSeeds[0].rank} name={quarterfinalsSeeds[0].name} delay={0.3} />}
              {quarterfinalsSeeds[2] && <TeamCard rank={quarterfinalsSeeds[2].rank} name={quarterfinalsSeeds[2].name} delay={0.35} />}
            </div>

            <div className="flex flex-col justify-center">
              <BracketConnector orientation="right" height={240} />
            </div>

            <motion.div 
              className="flex flex-col items-center justify-center px-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full"></div>
                <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary rounded-full p-8">
                  <Trophy size={80} weight="fill" className="text-primary" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-primary uppercase tracking-wider">National</div>
                <div className="text-xs text-muted-foreground uppercase">Championship</div>
              </div>
            </motion.div>

            <div className="flex flex-col justify-center">
              <BracketConnector orientation="left" height={240} />
            </div>

            <div className="flex flex-col gap-16">
              {quarterfinalsSeeds[4] && <TeamCard rank={quarterfinalsSeeds[4].rank} name={quarterfinalsSeeds[4].name} delay={0.5} />}
              {quarterfinalsSeeds[6] && <TeamCard rank={quarterfinalsSeeds[6].rank} name={quarterfinalsSeeds[6].name} delay={0.55} />}
            </div>

            <div className="flex flex-col gap-8">
              <BracketConnector orientation="left" height={120} />
              <BracketConnector orientation="left" height={120} />
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[2][0].rank} name={firstRoundMatchups[2][0].name} delay={0.6} />
                <TeamCard rank={firstRoundMatchups[2][1].rank} name={firstRoundMatchups[2][1].name} delay={0.65} />
              </div>
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[3][0].rank} name={firstRoundMatchups[3][0].name} delay={0.7} />
                <TeamCard rank={firstRoundMatchups[3][1].rank} name={firstRoundMatchups[3][1].name} delay={0.75} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-6">
          <div className="text-center mb-8">
            <motion.div 
              className="flex flex-col items-center justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full"></div>
                <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary rounded-full p-6">
                  <Trophy size={60} weight="fill" className="text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm font-bold text-primary uppercase tracking-wider">National Championship</div>
              </div>
            </motion.div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary uppercase">Quarterfinals</h3>
            <div className="space-y-3">
              {quarterfinalsSeeds[0] && <TeamCard rank={quarterfinalsSeeds[0].rank} name={quarterfinalsSeeds[0].name} />}
              {quarterfinalsSeeds[2] && <TeamCard rank={quarterfinalsSeeds[2].rank} name={quarterfinalsSeeds[2].name} />}
              {quarterfinalsSeeds[4] && <TeamCard rank={quarterfinalsSeeds[4].rank} name={quarterfinalsSeeds[4].name} />}
              {quarterfinalsSeeds[6] && <TeamCard rank={quarterfinalsSeeds[6].rank} name={quarterfinalsSeeds[6].name} />}
            </div>
          </div>

          <Separator className="bg-border" />

          <div>
            <h3 className="text-lg font-bold mb-3 text-primary uppercase">First Round</h3>
            <div className="space-y-4">
              {firstRoundMatchups.map((matchup, idx) => (
                <Card key={idx} className="bg-secondary/50 border-border p-3">
                  <div className="space-y-2">
                    <TeamCard rank={matchup[0].rank} name={matchup[0].name} />
                    <TeamCard rank={matchup[1].rank} name={matchup[1].name} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {leftOutTeams.length > 0 && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Separator className="bg-border mb-6" />
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold uppercase tracking-wide text-muted-foreground">
                Left Out
              </h2>
              <p className="text-sm text-muted-foreground/70 mt-1">Just Missed the Playoff</p>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {leftOutTeams.map((team) => (
                <div key={team.rank} className="opacity-60">
                  <TeamCard rank={team.rank} name={team.name} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App