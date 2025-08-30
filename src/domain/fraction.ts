export class Frac {
  readonly n: bigint
  readonly d: bigint
  constructor(n: bigint | number, d: bigint | number = 1) {
    let nb = BigInt(n),
      db = BigInt(d)
    if (db === 0n) throw new Error('division by zero')
    if (db < 0n) {
      nb = -nb
      db = -db
    }
    const g = gcd(abs(nb), db)
    this.n = nb / g
    this.d = db / g
  }
  add(o: Frac) {
    return new Frac(this.n * o.d + o.n * this.d, this.d * o.d)
  }
  sub(o: Frac) {
    return new Frac(this.n * o.d - o.n * this.d, this.d * o.d)
  }
  mul(o: Frac) {
    return new Frac(this.n * o.n, this.d * o.d)
  }
  div(o: Frac) {
    if (o.n === 0n) throw new Error('division by zero')
    return new Frac(this.n * o.d, this.d * o.n)
  }
  pow(exp: number) {
    if (exp === 2) {
      return new Frac(this.n * this.n, this.d * this.d)
    }
    if (exp === 3) {
      return new Frac(this.n * this.n * this.n, this.d * this.d * this.d)
    }
    throw new Error('unsupported power: ' + exp)
  }
  sqrt() {
    // For exact square roots, both numerator and denominator must be perfect squares
    const nSqrt = perfectSquareRoot(abs(this.n))
    const dSqrt = perfectSquareRoot(this.d)
    if (nSqrt !== null && dSqrt !== null && this.n >= 0n) {
      return new Frac(nSqrt, dSqrt)
    }
    throw new Error('not a perfect square: ' + this.toString())
  }
  cbrt() {
    // For exact cube roots, both numerator and denominator must be perfect cubes
    const nCbrt = perfectCubeRoot(this.n)
    const dCbrt = perfectCubeRoot(this.d)
    if (nCbrt !== null && dCbrt !== null) {
      return new Frac(nCbrt, dCbrt)
    }
    throw new Error('not a perfect cube: ' + this.toString())
  }
  toString() {
    return this.d === 1n ? this.n.toString() : `${this.n}/${this.d}`
  }
  isInteger() {
    return this.d === 1n
  }
}
function gcd(a: bigint, b: bigint) {
  while (b) {
    const t = a % b
    a = b
    b = t
  }
  return a
}
function abs(x: bigint) {
  return x < 0n ? -x : x
}

function perfectSquareRoot(n: bigint): bigint | null {
  if (n < 0n) return null
  if (n === 0n || n === 1n) return n
  
  let low = 1n
  let high = n / 2n + 1n
  
  while (low <= high) {
    const mid = (low + high) / 2n
    const square = mid * mid
    if (square === n) return mid
    if (square < n) low = mid + 1n
    else high = mid - 1n
  }
  return null
}

function perfectCubeRoot(n: bigint): bigint | null {
  if (n === 0n || n === 1n || n === -1n) return n
  
  const isNeg = n < 0n
  const absN = isNeg ? -n : n
  
  let low = 1n
  let high = absN / 3n + 1n
  
  while (low <= high) {
    const mid = (low + high) / 2n
    const cube = mid * mid * mid
    if (cube === absN) return isNeg ? -mid : mid
    if (cube < absN) low = mid + 1n
    else high = mid - 1n
  }
  return null
}
