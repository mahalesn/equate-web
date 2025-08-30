import React from 'react'
import { Logo } from './Logo'

interface LandingPageProps {
  onPlayAsGuest?: () => void
}

export function LandingPage({ onPlayAsGuest }: LandingPageProps) {
  const handlePlayAsYourself = () => {
    // Coming soon - do nothing for now
  }

  const handlePlayAsGuest = () => {
    onPlayAsGuest?.()
  }

  return (
    <div className="landing-page">
      <main className="landing-wrap" role="main">
        <Logo />
        
        <h1 className="landing-title">Equate</h1>
        <p className="landing-tag">Your daily math duels!</p>

        <div className="landing-desc">
          <strong>How to play</strong>
          Make the left three digits equal the right three digits by creating expressions.
          <ul>
            <li>Use each of the puzzle digits only once.</li>
            <li>Don't join digits (1 & 2 ≠ 12).</li>
            <li><strong>Whole integers only</strong> (roots must be perfect).</li>
          </ul>
          <div className="landing-example">
            <div className="example-step step-1">1. Equate 1,2,3 with 4,5,6</div>
            <div className="example-step step-2">2. 1 + (2 × 3) = (5 − 4) + 6 = 7</div>
            <div className="example-step step-3">3. 3 − 2 + 1 = 6 ÷ √(4 + 5) = 1</div>
          </div>
        </div>

        <div className="landing-btnrow" role="group" aria-label="Primary actions">
          <button 
            className="landing-btn outline" 
            onClick={handlePlayAsYourself}
            disabled
            title="Coming soon"
          >
            Play as you
          </button>
          <button 
            className="landing-btn fill" 
            onClick={handlePlayAsGuest}
          >
            Play as guest
          </button>
        </div>

        <p className="landing-meta landing-mono">Today's digits update daily at midnight.</p>
      </main>
    </div>
  )
}