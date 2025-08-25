import React from 'react'
import { useEquateGame } from './useEquateGame'
import { Keypad } from './Keypad'
import { ExprSlot } from './ExprSlot'

export default function App() {
  const g = useEquateGame()
  const leftClass = 'resVal' + (g.equal ? ' ok' : g.leftReady && g.rightReady ? ' err' : '')
  const rightClass = 'resVal' + (g.equal ? ' ok' : g.leftReady && g.rightReady ? ' err' : '')

  return (
    <>
      <header>
        <div className="brand">Equate</div>
        <div className="puzzle" id="digitsLine">
          <div className="puzzle-center">
            <span id="leftDigits">{g.leftSet.join(' ')}</span>
            <span className="with">with</span>
            <span id="rightDigits">{g.rightSet.join(' ')}</span>
          </div>
          <button
            className="refresh"
            onClick={g.nextPuzzle}
            title="New puzzle"
            aria-label="New puzzle"
          >
            ↻
          </button>
        </div>
      </header>
      <main>
        {/* Results row (plain text values, no boxes) */}
        <div className="results" aria-label="Live results">
          <div className={leftClass}>{g.leftValueStr || ' '}</div>
          <div className={rightClass}>{g.rightValueStr || ' '}</div>
        </div>
        {/* Expression row with '=' in between and refresh aligned to right slot edge */}
        <div className={'slots' + (g.equal && g.leftExpr && g.rightExpr ? ' matched' : '')}>
          <ExprSlot
            selected={g.active === 'left'}
            placeholder="Left Expr"
            text={g.leftExprPretty}
            onClick={() => g.setActive('left')}
          />
          <ExprSlot
            selected={g.active === 'right'}
            placeholder="Right Expr"
            text={g.rightExprPretty}
            onClick={() => g.setActive('right')}
          />
          <div className={
            'exprEq ' + 
            (g.equal && g.leftExpr && g.rightExpr ? 'equal' : 
             g.leftExpr || g.rightExpr ? 'not-equal' : 'neutral')
          } aria-hidden="true">
            {g.equal && g.leftExpr && g.rightExpr ? '=' : 
             g.leftExpr || g.rightExpr ? '≠' : '='}
          </div>
        </div>
        <Keypad
          active={g.active}
          isDigitAllowed={g.isDigitAllowed}
          onDigit={g.onDigit}
          onOp={g.onOp}
        />
      </main>
    </>
  )
}
