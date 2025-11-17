export interface ESPNTeam {
  rank: number
  name: string
  abbreviation: string
  logo: string
  id: string
  recordSummary?: string
}

export async function fetchCFPRankings(): Promise<ESPNTeam[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings?_=${timestamp}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rankings: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('ESPN API Response:', data)
    
    let rankings = []
    const allRankings = data.rankings || []
    
    console.log('Available rankings:', allRankings.map((r: any) => ({ 
      name: r.name, 
      shortName: r.shortName,
      type: r.type,
      ranksCount: r.ranks?.length || 0 
    })))
    
    for (const ranking of allRankings) {
      const rankingName = (ranking.name || ranking.shortName || '').toLowerCase()
      console.log('Checking ranking:', rankingName)
      
      if (rankingName.includes('playoff') || rankingName.includes('cfp')) {
        rankings = ranking.ranks || []
        console.log('Found CFP rankings with', rankings.length, 'teams')
        break
      }
    }
    
    if (rankings.length === 0 && allRankings.length > 0) {
      console.log('No CFP rankings found, using AP Poll as fallback')
      for (const ranking of allRankings) {
        const rankingName = (ranking.name || ranking.shortName || '').toLowerCase()
        if (rankingName.includes('ap') || rankingName.includes('associated press')) {
          rankings = ranking.ranks || []
          console.log('Found AP Poll with', rankings.length, 'teams')
          break
        }
      }
    }
    
    if (rankings.length === 0 && allRankings.length > 0) {
      rankings = allRankings[0]?.ranks || []
      console.log('Using first available ranking with', rankings.length, 'teams')
    }
    
    if (rankings.length === 0) {
      throw new Error('No rankings data available from ESPN API')
    }
    
    console.log('Raw rankings data (first 3):', rankings.slice(0, 3))
    
    const teams: ESPNTeam[] = rankings.slice(0, 20).map((rank: any) => {
      const team = rank.team || {}
      const teamName = team.displayName || team.name || team.location || 'Unknown Team'
      const teamAbbr = team.abbreviation || team.shortDisplayName || ''
      
      let logoUrl = ''
      if (team.logos && Array.isArray(team.logos) && team.logos.length > 0) {
        logoUrl = team.logos[0].href || team.logos[0].url || ''
      } else if (team.logo) {
        logoUrl = team.logo
      }
      
      return {
        rank: rank.current || rank.rank || 0,
        name: teamName,
        abbreviation: teamAbbr,
        logo: logoUrl,
        id: team.id?.toString() || team.uid || rank.current?.toString() || '',
        recordSummary: rank.recordSummary || team.record || ''
      }
    })
    
    console.log('Processed teams (first 3):', teams.slice(0, 3))
    
    const validTeams = teams.filter(t => t.rank > 0 && t.name !== 'Unknown Team')
    
    if (validTeams.length < 12) {
      throw new Error(`Insufficient valid teams found. Got ${validTeams.length}, need at least 12`)
    }
    
    return validTeams
  } catch (error) {
    console.error('Error fetching CFP rankings:', error)
    throw error
  }
}

export function getLastUpdateTime(): number {
  return Date.now()
}

export function shouldUpdate(lastUpdate: number, intervalHours: number = 8): boolean {
  const now = Date.now()
  const hoursSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60)
  return hoursSinceUpdate >= intervalHours
}
