import React from 'react'
import logoImage from '../assets/equate-logo.svg'

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
        <p>Make left side digits equal to right side digits through expressions using <span className="examples"> <b> + −  *  ÷  </b> </span> </p>

        <div className="examples">
          <p>E.g. You can equate <b>1 2 3</b> with <b>4 5 6</b> using:</p>
          <ul className="eq">
            <b> 1 + (2 ÷ 3) = (5 − 4) + 6</b>
            → This will equate both sides to <b>7</b>
            </ul>
          <ul className="eq">
            <b>3 − 2 + 1 = 6 ÷ √(4 + 5)</b>
            → This will equate both sides to <b>2</b>
          </ul>
          <p> Please note, you can use each of the puzzle digits only once, you can't join digits (so 1 &amp; 2 ≠ 12),
            and yes, whole integers only; roots must be perfect.</p>
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