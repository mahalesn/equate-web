import React from 'react'
export function Keypad(props: {
  active: 'left' | 'right'
  isDigitAllowed: (d: string) => boolean
  onDigit: (d: string) => void
  onOp: (op: string) => void
  onBack: () => void
  onClear: () => void
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
      {Digit('7')}
      {Digit('8')}
      {Digit('9')}
      {Op('÷')}
      {Digit('4')}
      {Digit('5')}
      {Digit('6')}
      {Op('×', '*')}
      {Digit('1')}
      {Digit('2')}
      {Digit('3')}
      {Op('−')}
      {Digit('0')}
      <button className="btn util" onClick={props.onBack}>
        ⌫
      </button>
      <button className="btn util" onClick={props.onClear}>
        C
      </button>
      {Op('+')}
      {Op('²', '𝑥²')}
      {Op('³', '𝑥³')}
      {Op('√', '√𝑥')}
      {Op('∛', '∛𝑥')}
    </div>
  )
}
