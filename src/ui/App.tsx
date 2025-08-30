import React, { useState } from 'react'
import { LandingPage } from './LandingPage'
import { Equator } from './Equator'

type AppState = 'landing' | 'equator'

export default function App() {
  const [currentView, setCurrentView] = useState<AppState>('landing')

  const navigateToEquator = () => {
    setCurrentView('equator')
  }

  if (currentView === 'equator') {
    return <Equator />
  }

  return <LandingPage onPlayAsGuest={navigateToEquator} />
}
