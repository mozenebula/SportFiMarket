'use client'

import { useState } from 'react'

interface Event {
  id: number
  title: string
  status: string
  time: string
  pool: string
  outcomes: string[]
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState('')

  const selectOutcome = (index: number) => {
    setSelectedOutcome(index)
  }

  const handlePlaceBet = () => {
    if (!selectedOutcome && selectedOutcome !== 0) {
      alert('Please select an outcome')
      return
    }
    if (!betAmount || parseFloat(betAmount) <= 0) {
      alert('Please enter a valid bet amount')
      return
    }
    alert(`Placing encrypted bet: ${event.outcomes[selectedOutcome]} - ${betAmount} sfUSD`)
  }

  return (
    <div className="event-card">
      <div className="event-header">
        <div className="event-title">{event.title}</div>
        <div className="event-status">
          <span className="live-indicator"></span>
          {event.status}
        </div>
      </div>
      <div className="event-time">{event.time}</div>
      <div className="pool-info">
        <div className="pool-label">Total Pool (Public)</div>
        <div className="pool-amount">{event.pool}</div>
      </div>
      <div className="outcomes">
        {event.outcomes.map((outcome, index) => (
          <div
            key={index}
            className={`outcome-btn ${selectedOutcome === index ? 'selected' : ''}`}
            onClick={() => selectOutcome(index)}
          >
            <div className="outcome-label">{outcome}</div>
            <div className="outcome-value">🔒</div>
          </div>
        ))}
      </div>
      <input
        type="number"
        className="bet-input"
        placeholder="Enter amount (sfUSD)"
        min="1"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
      />
      <button
        className="place-bet-btn"
        onClick={handlePlaceBet}
        disabled={selectedOutcome === null || !betAmount}
      >
        Place Encrypted Bet
      </button>
      <div className="privacy-badge">
        <span className="lock-icon">🔐</span>
        Your bet is encrypted with FHE technology
      </div>
    </div>
  )
}

