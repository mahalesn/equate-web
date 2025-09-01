import React from 'react'
import logoImage from '../assets/equate-logo.png'

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
    <main className="wrap" aria-labelledby="title">
      <img src={logoImage} alt="Equate Logo" className="logo-image" />
      
      <h1 id="title">Equate</h1>
      <p className="subtitle">Your daily math duels!</p>

      <section className="card" aria-labelledby="howto">
        <h2 id="howto">How to play</h2>
        <p>Make left side digits equal to right side digits through expressions</p>
        <ul>
          <li>Can use each of the puzzle digits only once</li>
          <li>Can't join digits, 1 &amp; 2 ≠ 12</li>
          <li>And yes, whole integers only; roots must be perfect.</li>
        </ul>

        <div className="examples">
          <p>E.g. You can equate <b>1 2 3</b> with <b>4 5 6</b> using:</p>

          <p className="eq">
            <b>1 + (2 ÷ 3) = (5 − 4) + 6</b>
            → This will equate both sides to <b>7</b>
          </p>
          <p className="eq">
            <b>3 − 2 + 1 = 6 ÷ √(4 + 5)</b>
            → This will equate both sides to <b>2</b>
          </p>
        </div>
      </section>

      <div className="actions" role="group" aria-label="Actions">
        <button 
          className="btn btn-outline" 
          type="button"
          onClick={handlePlayAsYourself}
          disabled
          title="Coming soon"
        >
          Play as you
        </button>
        <button 
          className="btn btn-primary" 
          type="button"
          onClick={handlePlayAsGuest}
        >
          Play as guest
        </button>
      </div>
    </main>
  )
}