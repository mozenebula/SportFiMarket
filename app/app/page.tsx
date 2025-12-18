'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import StatsGrid from '@/components/StatsGrid'
import EventsSection from '@/components/EventsSection'

export default function Home() {
  return (
    <>
      <div className="grid-bg"></div>
      <div className="container">
        <Header />
        <StatsGrid />
        <EventsSection />
      </div>
    </>
  )
}

