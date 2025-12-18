'use client'

import { useState } from 'react'
import EventCard from './EventCard'

const events = [
  {
    id: 1,
    title: '⚽ Manchester United vs Liverpool',
    status: 'LIVE',
    time: '⏰ Ends in 2h 34m',
    pool: '$45,280 sfUSD',
    outcomes: ['HOME', 'DRAW', 'AWAY'],
  },
  {
    id: 2,
    title: '🏀 Lakers vs Warriors',
    status: 'LIVE',
    time: '⏰ Ends in 3h 12m',
    pool: '$38,920 sfUSD',
    outcomes: ['HOME', 'DRAW', 'AWAY'],
  },
  {
    id: 3,
    title: '🎾 Nadal vs Djokovic',
    status: 'LIVE',
    time: '⏰ Ends in 1h 48m',
    pool: '$52,100 sfUSD',
    outcomes: ['HOME', 'DRAW', 'AWAY'],
  },
]

const tabs = ['All', 'Football', 'Basketball', 'Tennis']

export default function EventsSection() {
  const [activeTab, setActiveTab] = useState('All')

  return (
    <div className="events-section">
      <div className="section-header">
        <h2 className="section-title">Live Events</h2>
        <div className="filter-tabs">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </div>
      <div className="events-grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

