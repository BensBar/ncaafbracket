interface MobileBracketConnectorProps {
  height?: number
  type?: 'matchup' | 'quarterfinal'
}

export function MobileBracketConnector({ height = 60, type = 'matchup' }: MobileBracketConnectorProps) {
  if (type === 'matchup') {
    // For connecting two teams in a matchup to their output
    return (
      <svg 
        width="40" 
        height={height} 
        className="mx-auto"
        style={{ overflow: 'visible' }}
      >
        <path
          d={`M 20 0 L 20 ${height / 2} L 30 ${height / 2}`}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-border"
        />
        <path
          d={`M 20 ${height} L 20 ${height / 2}`}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-border"
        />
      </svg>
    )
  }
  
  // For connecting quarterfinals to championship
  return (
    <svg 
      width="40" 
      height={height} 
      className="mx-auto"
      style={{ overflow: 'visible' }}
    >
      <path
        d={`M 20 0 L 20 ${height}`}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-border"
      />
    </svg>
  )
}
