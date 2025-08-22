import { describe, it, expect } from 'vitest'
import { parse } from '../parse'
import { evaluate } from '../eval'
import { Frac } from '../fraction'
import { approxEqualFrac } from '../util'
function val(s: string){ return evaluate(parse(s)) }
describe('fraction basics', () => {
  it('reduces automatically', () => {
    const a = new Frac(2,4); expect(a.toString()).toBe('1/2')
  })
  it('adds', () => {
    const a = new Frac(1,2).add(new Frac(1,3)); expect(a.toString()).toBe('5/6')
  })
})
describe('parser + eval', () => {
  it('9-8 equals 3-2', () => {
    const left = val('9-8'); const right = val('3-2')
    expect(approxEqualFrac(left, right)).toBe(true)
    expect(left.toString()).toBe('1'); expect(right.toString()).toBe('1')
  })
  it('handles unary minus', () => { expect(val('-3+5').toString()).toBe('2') })
  it('multiplies and divides', () => {
    expect(val('8/4').toString()).toBe('2')
    expect(val('2*3').toString()).toBe('6')
  })
})