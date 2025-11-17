interface BracketConnectorProps {
  orientation?: 'left' | 'right'
  height?: number
}

export function BracketConnector({ orientation = 'right', height = 80 }: BracketConnectorProps) {
  const isLeft = orientation === 'left'
  
  return (
    <svg 
      width="40" 
      height={height} 
      className="shrink-0"
      style={{ overflow: 'visible' }}
    >
      <path
        d={isLeft 
          ? `M 40 ${height / 4} L 20 ${height / 4} L 20 ${(height * 3) / 4} L 40 ${(height * 3) / 4}`
          : `M 0 ${height / 4} L 20 ${height / 4} L 20 ${(height * 3) / 4} L 0 ${(height * 3) / 4}`
        }
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-border"
      />
      <path
        d={isLeft
          ? `M 20 ${height / 2} L 0 ${height / 2}`
          : `M 20 ${height / 2} L 40 ${height / 2}`
        }
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        className="text-border"
      />
    </svg>
  )
}
