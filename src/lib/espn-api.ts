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
    const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/college-football/rankings/4?_=${timestamp}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch rankings: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    const rankings = data.rankings?.[0]?.ranks || []
    
    if (rankings.length === 0) {
      throw new Error('No rankings data available')
    }
    
    const teams: ESPNTeam[] = rankings.slice(0, 14).map((rank: any) => ({
      rank: rank.current,
      name: rank.team?.displayName || rank.team?.name || 'Unknown',
      abbreviation: rank.team?.abbreviation || '',
      logo: rank.team?.logos?.[0]?.href || rank.team?.logo || '',
      id: rank.team?.id?.toString() || '',
      recordSummary: rank.recordSummary || ''
    }))
    
    return teams
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
