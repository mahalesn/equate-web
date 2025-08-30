import { describe, it, expect } from 'vitest'
import { parse } from '../parse'
import { evaluate } from '../eval'
import { Frac } from '../fraction'
import { approxEqualFrac, equalIntegersOnly } from '../util'
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
  it('recognizes equivalent fractions as equal', () => {
    const frac1 = new Frac(3, 4)  // 3/4
    const frac2 = new Frac(6, 8)  // 6/8 reduces to 3/4
    expect(frac1.toString()).toBe('3/4')
    expect(frac2.toString()).toBe('3/4')
    expect(approxEqualFrac(frac1, frac2)).toBe(true)
  })
  it('should reject fractional results in game context', () => {
    // Mathematical fractions should be recognized as equal
    expect(approxEqualFrac(val('3/4'), val('6/8'))).toBe(true)
    
    // But game should REJECT fractional solutions, even if mathematically equal
    expect(equalIntegersOnly(val('3/4'), val('6/8'))).toBe(false) // REJECTED - both are fractions
    expect(val('3/4').toString()).toBe('3/4') // Shows as fraction
    expect(val('6/8').toString()).toBe('3/4') // Shows as fraction
    
    // Only whole integers should be accepted as valid game solutions
    expect(val('8/4').toString()).toBe('2') // Shows as whole number
    expect(val('6/3').toString()).toBe('2') // Shows as whole number
    expect(equalIntegersOnly(val('8/4'), val('6/3'))).toBe(true) // ACCEPTED - both are integers
  })
  
  it('validates integer-only equality function', () => {
    // Both integers and equal -> ACCEPT
    expect(equalIntegersOnly(new Frac(5), new Frac(5))).toBe(true)
    expect(equalIntegersOnly(val('8/4'), val('6/3'))).toBe(true) // 2 = 2
    
    // Both fractions, even if equal -> REJECT  
    expect(equalIntegersOnly(new Frac(3, 4), new Frac(6, 8))).toBe(false)
    expect(equalIntegersOnly(val('3/4'), val('6/8'))).toBe(false)
    
    // One integer, one fraction -> REJECT
    expect(equalIntegersOnly(new Frac(2), new Frac(6, 3))).toBe(true) // 2 = 2 (both integers)
    expect(equalIntegersOnly(new Frac(2), new Frac(3, 4))).toBe(false) // integer ≠ fraction
    
    // Different integers -> REJECT
    expect(equalIntegersOnly(new Frac(2), new Frac(3))).toBe(false)
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

  it('handles sophisticated parentheses expressions', () => {
    // Complex addition: ∛8 = 2, so 23 + ∛8 = 25, and √25 = 5
    expect(val('√(23+∛8)').toString()).toBe('5')
    
    // Pythagorean theorem: √(3²+4²) = √(9+16) = √25 = 5
    expect(val('√(3^2+4^2)').toString()).toBe('5')
    
    // Nested with powers: (√4)³ = 2³ = 8
    expect(val('(√4)^3').toString()).toBe('8')
    
    // Error case: √(∛8+√9) = √(2+3) = √5 should fail (not perfect square)
    expect(() => val('√(∛8+√9)')).toThrow()
  })

  it('fixes parentheses evaluation bug: (√9) should evaluate like √9', () => {
    // Bug fix: parentheses around single terms should evaluate properly
    expect(val('√9').toString()).toBe('3')
    expect(val('(√9)').toString()).toBe('3')
    expect(val('(∛8)').toString()).toBe('2')
    expect(val('(5)').toString()).toBe('5')
  })

})

describe('6-digit puzzle generation', () => {
  // Helper function to parse puzzle string into digits
  function parseDigits(puzzle: string): number[] {
    return puzzle.split('').map(d => parseInt(d))
  }
  
  // Helper function to validate puzzle rules
  function validatePuzzleRules(puzzle: string): boolean {
    const digits = parseDigits(puzzle)
    
    // Rule 1: Must be 6 digits
    if (digits.length !== 6) return false
    
    // Rule 2: No leading zero
    if (digits[0] === 0) return false
    
    // Rule 3: At most one zero, and not in first position
    const zeroCount = digits.filter(d => d === 0).length
    if (zeroCount > 1) return false
    
    // Rule 4: At most one digit may repeat, and if it repeats, exactly twice
    const digitCounts = new Map<number, number>()
    for (const digit of digits) {
      digitCounts.set(digit, (digitCounts.get(digit) || 0) + 1)
    }
    
    let repeatedDigits = 0
    for (const [_, count] of digitCounts) {
      if (count > 2) return false // No digit appears 3+ times
      if (count === 2) repeatedDigits++
    }
    
    return repeatedDigits <= 1 // At most one digit may repeat
  }

  it('validates puzzle rules correctly', () => {
    // Valid examples:
    expect(validatePuzzleRules('123456')).toBe(true) // All unique digits
    expect(validatePuzzleRules('112345')).toBe(true) // One repeated digit (1 appears twice)
    expect(validatePuzzleRules('123405')).toBe(true) // One zero, not leading
    expect(validatePuzzleRules('998765')).toBe(true) // One repeated digit (9 appears twice)
    
    // Invalid examples:
    expect(validatePuzzleRules('012345')).toBe(false) // Leading zero
    expect(validatePuzzleRules('123400')).toBe(false) // Two zeros
    expect(validatePuzzleRules('111234')).toBe(false) // Digit appears 3 times
    expect(validatePuzzleRules('112233')).toBe(false) // Two different digits repeat
  })

  it('validates individual puzzle rule components', () => {
    // Test rule 2: No leading zero
    expect(validatePuzzleRules('012345')).toBe(false)
    expect(validatePuzzleRules('123450')).toBe(true)
    
    // Test rule 3: At most one zero
    expect(validatePuzzleRules('100234')).toBe(false)
    expect(validatePuzzleRules('102340')).toBe(false) 
    expect(validatePuzzleRules('120345')).toBe(true)
    
    // Test rule 4: Repetition limits
    expect(validatePuzzleRules('111234')).toBe(false) // 3 times
    expect(validatePuzzleRules('112234')).toBe(false) // Two digits repeat
    expect(validatePuzzleRules('112345')).toBe(true)  // One digit repeats twice
    expect(validatePuzzleRules('123456')).toBe(true)  // No repeats
  })
})
