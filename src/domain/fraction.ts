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
  toString() {
    return this.d === 1n ? this.n.toString() : `${this.n}/${this.d}`
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
