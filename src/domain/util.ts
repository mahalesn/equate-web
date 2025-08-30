import { Frac } from './fraction'

export function approxEqualFrac(a: Frac, b: Frac): boolean {
  return a.n === b.n && a.d === b.d
}

export function equalIntegersOnly(a: Frac, b: Frac): boolean {
  return a.isInteger() && b.isInteger() && approxEqualFrac(a, b)
}
