import { useKV } from "@github/spark/hooks"
import { useEffect, useState } from "react"
import { TeamCard } from "@/components/TeamCard"
import { BracketConnector } from "@/components/BracketConnector"
import { MobileBracketConnector } from "@/components/MobileBracketConnector"
import { EditBracketDialog } from "@/components/EditBracketDialog"
import { ShareButtons } from "@/components/ShareButtons"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ArrowsClockwise, Clock } from "@phosphor-icons/react"
import trophyBlack from "@/assets/images/trophy_black.jpg"
import { motion } from "framer-motion"
import { fetchCFPRankings, ESPNTeam, shouldUpdate } from "@/lib/espn-api"
import { toast } from "sonner"

function App() {
  const [teams, setTeams] = useKV<ESPNTeam[]>("cfp-teams", [])
  const [lastUpdate, setLastUpdate] = useKV<number>("cfp-last-update", 0)
  const [isLoading, setIsLoading] = useState(false)
  const [nextUpdateIn, setNextUpdateIn] = useState("")

  const updateRankings = async (showToast = true) => {
    setIsLoading(true)
    try {
      const rankings = await fetchCFPRankings()
      console.log('Fetched rankings:', rankings)
      setTeams(() => rankings)
      setLastUpdate(() => Date.now())
      if (showToast) {
        toast.success(`Rankings updated! Top ${rankings.length} teams loaded.`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch rankings"
      toast.error(`Update failed: ${errorMessage}`)
      console.error("Error updating rankings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if ((teams?.length || 0) === 0 || shouldUpdate(lastUpdate || 0, 0.1)) {
      updateRankings(false)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceUpdate = now - (lastUpdate || 0)
      const eightHours = 8 * 60 * 60 * 1000
      const timeRemaining = eightHours - timeSinceUpdate

      if (timeRemaining <= 0) {
        updateRankings(false)
      } else {
        const hours = Math.floor(timeRemaining / (60 * 60 * 1000))
        const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
        setNextUpdateIn(`${hours}h ${minutes}m`)
      }
    }, 60000)

    return () => clearInterval(interval)
  }, [lastUpdate])

  const formatLastUpdate = () => {
    if (!lastUpdate) return "Never"
    const date = new Date(lastUpdate)
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const playoffTeams = teams?.slice(0, 12) || []
  const leftOutTeams = teams?.slice(12, 20) || []

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
          <ArrowsClockwise size={64} weight="bold" className="text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading bracket from ESPN...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-3 sm:p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-2">
              College Football Playoff
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Next update in: {nextUpdateIn || "Calculating..."}</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">Last updated: {formatLastUpdate()}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="flex gap-2">
              <Button 
                onClick={() => updateRankings(true)} 
                disabled={isLoading}
                variant="outline"
                className="gap-2"
              >
                <ArrowsClockwise size={18} weight="bold" className={isLoading ? "animate-spin" : ""} />
                Refresh Now
              </Button>
              <EditBracketDialog teams={teams || []} onSave={(updatedTeams) => setTeams(() => updatedTeams)} />
            </div>
            <ShareButtons />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[0][0].rank} name={firstRoundMatchups[0][0].name} logo={firstRoundMatchups[0][0].logo} delay={0.1} />
                <TeamCard rank={firstRoundMatchups[0][1].rank} name={firstRoundMatchups[0][1].name} logo={firstRoundMatchups[0][1].logo} delay={0.15} />
              </div>
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[1][0].rank} name={firstRoundMatchups[1][0].name} logo={firstRoundMatchups[1][0].logo} delay={0.2} />
                <TeamCard rank={firstRoundMatchups[1][1].rank} name={firstRoundMatchups[1][1].name} logo={firstRoundMatchups[1][1].logo} delay={0.25} />
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <BracketConnector orientation="right" height={120} />
              <BracketConnector orientation="right" height={120} />
            </div>

            <div className="flex flex-col gap-16">
              {quarterfinalsSeeds[0] && <TeamCard rank={quarterfinalsSeeds[0].rank} name={quarterfinalsSeeds[0].name} logo={quarterfinalsSeeds[0].logo} delay={0.3} />}
              {quarterfinalsSeeds[2] && <TeamCard rank={quarterfinalsSeeds[2].rank} name={quarterfinalsSeeds[2].name} logo={quarterfinalsSeeds[2].logo} delay={0.35} />}
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
                <img src={trophyBlack} alt="Trophy" className="w-[240px] h-[240px] object-contain" />
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-bold text-primary uppercase tracking-wider">NATIONAL</div>
                <div className="text-xs text-muted-foreground uppercase">Championship</div>
              </div>
            </motion.div>

            <div className="flex flex-col justify-center">
              <BracketConnector orientation="left" height={240} />
            </div>

            <div className="flex flex-col gap-16">
              {quarterfinalsSeeds[4] && <TeamCard rank={quarterfinalsSeeds[4].rank} name={quarterfinalsSeeds[4].name} logo={quarterfinalsSeeds[4].logo} delay={0.5} />}
              {quarterfinalsSeeds[6] && <TeamCard rank={quarterfinalsSeeds[6].rank} name={quarterfinalsSeeds[6].name} logo={quarterfinalsSeeds[6].logo} delay={0.55} />}
            </div>

            <div className="flex flex-col gap-8">
              <BracketConnector orientation="left" height={120} />
              <BracketConnector orientation="left" height={120} />
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[2][0].rank} name={firstRoundMatchups[2][0].name} logo={firstRoundMatchups[2][0].logo} delay={0.6} />
                <TeamCard rank={firstRoundMatchups[2][1].rank} name={firstRoundMatchups[2][1].name} logo={firstRoundMatchups[2][1].logo} delay={0.65} />
              </div>
              <div className="flex flex-col gap-4">
                <TeamCard rank={firstRoundMatchups[3][0].rank} name={firstRoundMatchups[3][0].name} logo={firstRoundMatchups[3][0].logo} delay={0.7} />
                <TeamCard rank={firstRoundMatchups[3][1].rank} name={firstRoundMatchups[3][1].name} logo={firstRoundMatchups[3][1].logo} delay={0.75} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          {/* Trophy at top - championship goal */}
          <motion.div 
            className="flex flex-col items-center justify-center mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full"></div>
              <div className="relative bg-card/50 backdrop-blur-sm border-2 border-primary rounded-full p-4 sm:p-6">
                <img src={trophyBlack} alt="Trophy" className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-contain" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wider">National Championship</div>
            </div>
          </motion.div>

          {/* Semifinals section - showing bracket structure */}
          <div className="mb-6">
            <h3 className="text-center text-sm font-bold mb-3 text-muted-foreground uppercase tracking-wide">Semifinals</h3>
            
            <div className="flex justify-center gap-4 mb-2">
              <div className="flex-1 max-w-[160px]">
                <div className="h-1 bg-border mx-auto"></div>
              </div>
              <div className="flex-1 max-w-[160px]">
                <div className="h-1 bg-border mx-auto"></div>
              </div>
            </div>
            
            {/* Connector from semifinals to championship */}
            <div className="flex justify-center">
              <MobileBracketConnector height={40} type="quarterfinal" />
            </div>
          </div>

          {/* Quarterfinals - 4 teams competing */}
          <div className="mb-6">
            <h3 className="text-center text-base sm:text-lg font-bold mb-4 text-primary uppercase">Quarterfinals</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="space-y-2">
                {quarterfinalsSeeds[0] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <TeamCard rank={quarterfinalsSeeds[0].rank} name={quarterfinalsSeeds[0].name} logo={quarterfinalsSeeds[0].logo} />
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                {quarterfinalsSeeds[2] && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                  >
                    <TeamCard rank={quarterfinalsSeeds[2].rank} name={quarterfinalsSeeds[2].name} logo={quarterfinalsSeeds[2].logo} />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Visual connector showing progression */}
            <div className="flex justify-center gap-4 mb-3">
              <div className="flex-1 max-w-[160px]">
                <div className="h-8 border-l-2 border-r-2 border-b-2 border-border rounded-bl-lg rounded-br-lg"></div>
              </div>
              <div className="flex-1 max-w-[160px]">
                <div className="h-8 border-l-2 border-r-2 border-b-2 border-border rounded-bl-lg rounded-br-lg"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                {quarterfinalsSeeds[4] && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <TeamCard rank={quarterfinalsSeeds[4].rank} name={quarterfinalsSeeds[4].name} logo={quarterfinalsSeeds[4].logo} />
                  </motion.div>
                )}
              </div>
              <div className="space-y-2">
                {quarterfinalsSeeds[6] && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    <TeamCard rank={quarterfinalsSeeds[6].rank} name={quarterfinalsSeeds[6].name} logo={quarterfinalsSeeds[6].logo} />
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Visual separator */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-border"></div>
            <div className="px-4 text-xs font-semibold text-muted-foreground uppercase">Round 1</div>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* First Round matchups with connections to quarterfinals */}
          <div className="space-y-6">
            <h3 className="text-center text-base sm:text-lg font-bold text-primary uppercase">First Round</h3>
            
            {/* Top half - feeds into top 2 quarterfinal spots */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="bg-secondary/50 border-border p-2">
                  <div className="space-y-1.5">
                    <TeamCard rank={firstRoundMatchups[0][0].rank} name={firstRoundMatchups[0][0].name} logo={firstRoundMatchups[0][0].logo} />
                    <div className="flex justify-center">
                      <div className="text-xs text-muted-foreground font-semibold">VS</div>
                    </div>
                    <TeamCard rank={firstRoundMatchups[0][1].rank} name={firstRoundMatchups[0][1].name} logo={firstRoundMatchups[0][1].logo} />
                  </div>
                  {/* Connector showing winner advances */}
                  <div className="flex justify-center mt-2">
                    <div className="h-8 w-px bg-border"></div>
                  </div>
                  <div className="text-center text-[10px] text-muted-foreground uppercase mt-1">Winner vs #{quarterfinalsSeeds[0]?.rank}</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <Card className="bg-secondary/50 border-border p-2">
                  <div className="space-y-1.5">
                    <TeamCard rank={firstRoundMatchups[1][0].rank} name={firstRoundMatchups[1][0].name} logo={firstRoundMatchups[1][0].logo} />
                    <div className="flex justify-center">
                      <div className="text-xs text-muted-foreground font-semibold">VS</div>
                    </div>
                    <TeamCard rank={firstRoundMatchups[1][1].rank} name={firstRoundMatchups[1][1].name} logo={firstRoundMatchups[1][1].logo} />
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="h-8 w-px bg-border"></div>
                  </div>
                  <div className="text-center text-[10px] text-muted-foreground uppercase mt-1">Winner vs #{quarterfinalsSeeds[2]?.rank}</div>
                </Card>
              </motion.div>
            </div>

            {/* Bottom half - feeds into bottom 2 quarterfinal spots */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <Card className="bg-secondary/50 border-border p-2">
                  <div className="space-y-1.5">
                    <TeamCard rank={firstRoundMatchups[2][0].rank} name={firstRoundMatchups[2][0].name} logo={firstRoundMatchups[2][0].logo} />
                    <div className="flex justify-center">
                      <div className="text-xs text-muted-foreground font-semibold">VS</div>
                    </div>
                    <TeamCard rank={firstRoundMatchups[2][1].rank} name={firstRoundMatchups[2][1].name} logo={firstRoundMatchups[2][1].logo} />
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="h-8 w-px bg-border"></div>
                  </div>
                  <div className="text-center text-[10px] text-muted-foreground uppercase mt-1">Winner vs #{quarterfinalsSeeds[4]?.rank}</div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <Card className="bg-secondary/50 border-border p-2">
                  <div className="space-y-1.5">
                    <TeamCard rank={firstRoundMatchups[3][0].rank} name={firstRoundMatchups[3][0].name} logo={firstRoundMatchups[3][0].logo} />
                    <div className="flex justify-center">
                      <div className="text-xs text-muted-foreground font-semibold">VS</div>
                    </div>
                    <TeamCard rank={firstRoundMatchups[3][1].rank} name={firstRoundMatchups[3][1].name} logo={firstRoundMatchups[3][1].logo} />
                  </div>
                  <div className="flex justify-center mt-2">
                    <div className="h-8 w-px bg-border"></div>
                  </div>
                  <div className="text-center text-[10px] text-muted-foreground uppercase mt-1">Winner vs #{quarterfinalsSeeds[6]?.rank}</div>
                </Card>
              </motion.div>
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
                  <TeamCard rank={team.rank} name={team.name} logo={team.logo} />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App
