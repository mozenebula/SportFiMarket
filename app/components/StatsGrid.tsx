export default function StatsGrid() {
  const stats = [
    { label: 'Total Volume', value: '$2,458,392' },
    { label: 'Active Events', value: '12' },
    { label: 'Total Bets', value: '8,734' },
    { label: 'Your Balance', value: '1,500', unit: 'sfUSD' },
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-label">{stat.label}</div>
          <div className="stat-value">
            {stat.value} {stat.unit && <span style={{ fontSize: '16px' }}>{stat.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

