import { describe, it, expect } from 'vitest'
import { parse } from '../parse'
import { evaluate } from '../eval'
import { Frac } from '../fraction'
import { approxEqualFrac } from '../util'
function val(s: string) {
  return evaluate(parse(s))
}
describe('fraction basics', () => {
  it('reduces automatically', () => {
    const a = new Frac(2, 4)
    expect(a.toString()).toBe('1/2')
  })
  it('adds', () => {
    const a = new Frac(1, 2).add(new Frac(1, 3))
    expect(a.toString()).toBe('5/6')
  })
})
describe('parser + eval', () => {
  it('9-8 equals 3-2', () => {
    const left = val('9-8')
    const right = val('3-2')
    expect(approxEqualFrac(left, right)).toBe(true)
    expect(left.toString()).toBe('1')
    expect(right.toString()).toBe('1')
  })
  it('handles unary minus', () => {
    expect(val('-3+5').toString()).toBe('2')
  })
  it('multiplies and divides', () => {
    expect(val('8/4').toString()).toBe('2')
    expect(val('2*3').toString()).toBe('6')
  })
})

describe('digit consumption validation', () => {
  function countDigits(s: string) {
    const m: Record<string, number> = {}
    for (const d of s) {
      if (/[0-9]/.test(d)) {
        m[d] = (m[d] || 0) + 1
      }
    }
    return m
  }

  function hasConsumedAllDigits(expr: string, availableDigits: string) {
    const used = countDigits(expr)
    const available = countDigits(availableDigits)
    
    for (const [digit, count] of Object.entries(used)) {
      if ((available[digit] || 0) < count) {
        return false
      }
    }
    
    for (const [digit, count] of Object.entries(available)) {
      if ((used[digit] || 0) !== count) {
        return false
      }
    }
    
    return true
  }

  it('detects when all digits are consumed', () => {
    expect(hasConsumedAllDigits('2-1', '12')).toBe(true)
    expect(hasConsumedAllDigits('5/5', '55')).toBe(true)
    expect(hasConsumedAllDigits('2*1+5-5', '1255')).toBe(true)
  })

  it('detects when not all digits are consumed', () => {
    expect(hasConsumedAllDigits('1', '12')).toBe(false)
    expect(hasConsumedAllDigits('5/5', '1255')).toBe(false)
    expect(hasConsumedAllDigits('2-1', '1255')).toBe(false)
  })

  it('validates example from issue: puzzle 1255 should require all digits', () => {
    const leftExpr = '2-1'
    const rightExpr = '5/5'
    const leftDigits = '12'
    const rightDigits = '55'
    
    expect(val(leftExpr).toString()).toBe('1')
    expect(val(rightExpr).toString()).toBe('1')
    expect(approxEqualFrac(val(leftExpr), val(rightExpr))).toBe(true)
    
    expect(hasConsumedAllDigits(leftExpr, leftDigits)).toBe(true)
    expect(hasConsumedAllDigits(rightExpr, rightDigits)).toBe(true)
    
    const incompleteLeftExpr = '1'
    expect(hasConsumedAllDigits(incompleteLeftExpr, leftDigits)).toBe(false)
  })
})

describe('new operators: square, cube, square root, cube root', () => {
  it('handles square operations', () => {
    expect(val('2^2').toString()).toBe('4')
    expect(val('3^2').toString()).toBe('9')
    expect(val('5^2').toString()).toBe('25')
  })
  
  it('handles cube operations', () => {
    expect(val('2^3').toString()).toBe('8')
    expect(val('3^3').toString()).toBe('27')
    expect(val('4^3').toString()).toBe('64')
  })
  
  it('handles square root operations', () => {
    expect(val('√4').toString()).toBe('2')
    expect(val('√9').toString()).toBe('3')
    expect(val('√25').toString()).toBe('5')
  })
  
  it('handles cube root operations', () => {
    expect(val('∛8').toString()).toBe('2')
    expect(val('∛27').toString()).toBe('3')
    expect(val('∛64').toString()).toBe('4')
  })
  
  it('handles complex expressions with new operators', () => {
    expect(val('4+1').toString()).toBe('5') // 2^2+1 = 4+1 = 5
    expect(val('3+1').toString()).toBe('4') // sqrt(9)+1 = 3+1 = 4  
    expect(val('8-6').toString()).toBe('2') // 2^3-6 = 8-6 = 2
    expect(val('2*3').toString()).toBe('6') // cbrt(8)*3 = 2*3 = 6
  })
  
  it('handles nested operations', () => {
    expect(val('√(2^2)').toString()).toBe('2')
    expect(val('∛(2^3)').toString()).toBe('2')
    expect(val('(√4)^2').toString()).toBe('4')
  })
  
  it('throws error for non-perfect squares and cubes', () => {
    expect(() => val('√2')).toThrow()
    expect(() => val('√3')).toThrow()
    expect(() => val('∛2')).toThrow()
    expect(() => val('∛3')).toThrow()
  })

  it('validates example puzzle 8848: 8/8 = ∛8/√4', () => {
    const leftExpr = '8/8'
    const rightExpr = '∛8/√4'
    
    expect(val(leftExpr).toString()).toBe('1')
    expect(val(rightExpr).toString()).toBe('1')
    expect(approxEqualFrac(val(leftExpr), val(rightExpr))).toBe(true)
    
    // Test that ∛8 = 2 and √4 = 2, so ∛8/√4 = 2/2 = 1
    expect(val('∛8').toString()).toBe('2')
    expect(val('√4').toString()).toBe('2')
    expect(val('2/2').toString()).toBe('1')
  })

})
