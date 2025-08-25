import React from 'react'
export function Keypad(props: {
  active: 'left' | 'right'
  isDigitAllowed: (d: string) => boolean
  onDigit: (d: string) => void
  onOp: (op: string) => void
}) {
  const Digit = (d: string) => {
    const allowed = props.isDigitAllowed(d)
    return (
      <button
        className={'btn num' + (allowed ? ' allowed' : '')}
        disabled={!allowed}
        onClick={() => props.onDigit(d)}
      >
        {d}
      </button>
    )
  }
  const Op = (op: string, label?: string) => (
    <button className="btn op" onClick={() => props.onOp(op)}>
      {label ?? op}
    </button>
  )
  return (
    <div className="pad">
      {/* Row 1: Digits 1-4 */}
      {Digit('1')}
      {Digit('2')}
      {Digit('3')}
      {Digit('4')}
      
      {/* Row 2: Digits 5-8 */}
      {Digit('5')}
      {Digit('6')}
      {Digit('7')}
      {Digit('8')}
      
      {/* Row 3: Digits 9, 0, and parentheses */}
      {Digit('9')}
      {Digit('0')}
      {Op('(')}
      {Op(')')}
      
      {/* Row 4: Primitive operators */}
      {Op('+')}
      {Op('−')}
      {Op('*')}
      {Op('÷')}
      
      {/* Row 5: Advanced operators */}
      {Op('²', '𝑥²')}
      {Op('³', '𝑥³')}
      {Op('√', '√𝑥')}
      {Op('∛', '∛𝑥')}
    </div>
  )
}
