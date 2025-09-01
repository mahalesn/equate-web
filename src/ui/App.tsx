import React, { useState, useEffect } from 'react'
import { LandingPage } from './LandingPage'
import { Equator } from './Equator'

type AppState = 'landing' | 'equator'

export default function App() {
  const [currentView, setCurrentView] = useState<AppState>('landing')

  const navigateToEquator = () => {
    setCurrentView('equator')
  }

  useEffect(() => {
    // Update body class based on current view
    document.body.className = currentView
  }, [currentView])

  if (currentView === 'equator') {
    return <Equator />
  }

  return <LandingPage onPlayAsGuest={navigateToEquator} />
}
