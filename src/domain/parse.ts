import type { Node, BinOp, UnaryOp } from './ast'

type Tok =
  | { t: 'num'; v: string }
  | { t: 'op'; v: BinOp }
  | { t: 'unary'; v: UnaryOp }
  | { t: 'lp' }
  | { t: 'rp' }
  | { t: 'pow'; v: '^2' | '^3' }
const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^2': 3, '^3': 3, 'sqrt': 4, 'cbrt': 4 }

export function parse(src: string): Node {
  const toks = mergeUnary(tokenize(src))
  const output: (Tok | Node)[] = []
  const ops: Tok[] = []

  function popOp() {
    const op = ops.pop()!
    if (op.t === 'op') {
      const r = output.pop() as Node
      const l = output.pop() as Node
      output.push({ type: 'bin', op: op.v, left: l, right: r } as Node)
    } else if (op.t === 'unary') {
      const operand = output.pop() as Node
      output.push({ type: 'unary', op: op.v, operand })
    }
  }

  for (let i = 0; i < toks.length; i++) {
    const t = toks[i]
    if (t.t === 'num') {
      output.push({ type: 'num', n: t.v } as Node)
    } else if (t.t === 'op') {
      while (ops.length) {
        const top = ops[ops.length - 1]
        if (top.t === 'op' && prec[top.v] >= prec[t.v]) popOp()
        else break
      }
      ops.push(t)
    } else if (t.t === 'unary') {
      // For prefix unary operators, we need to look ahead to get the operand
      const nextTok = toks[i + 1]
      if (!nextTok) throw new Error('unary operator needs operand')
      
      if (nextTok.t === 'num') {
        // Apply unary directly to number
        const operand = { type: 'num', n: nextTok.v } as Node
        output.push({ type: 'unary', op: t.v, operand })
        i++ // Skip the number token
      } else if (nextTok.t === 'lp') {
        // Handle √(expression) or ∛(expression)
        ops.push(t)
      } else {
        throw new Error('invalid unary operator usage')
      }
    } else if (t.t === 'pow') {
      // Power operators are postfix, apply immediately to last operand
      const operand = output.pop() as Node
      const op = t.v === '^2' ? 'sq' : 'cb'
      output.push({ type: 'unary', op: op as UnaryOp, operand })
    } else if (t.t === 'lp') {
      ops.push(t)
    } else if (t.t === 'rp') {
      while (ops.length && ops[ops.length - 1].t !== 'lp') {
        popOp()
      }
      if (!ops.length) throw new Error('mismatched )')
      ops.pop()
    }
  }
  // Handle any remaining operators
  while (ops.length) {
    const t = ops.pop()!
    if (t.t === 'lp') throw new Error('mismatched (')
    // Put the operator back and use popOp to handle it properly
    ops.push(t)
    popOp()
  }
  if (output.length !== 1) throw new Error('invalid expression')
  return output[0] as Node
}

function tokenize(src: string): Tok[] {
  const toks: Tok[] = []
  let i = 0
  const isDigit = (c: string) => c >= '0' && c <= '9'
  const isOp = (c: string) => c === '+' || c === '-' || c === '*' || c === '/'

  while (i < src.length) {
    const c = src[i]
    if (c === ' ') {
      i++
      continue
    }
    if (isDigit(c)) {
      let j = i + 1
      while (j < src.length && isDigit(src[j])) j++
      toks.push({ t: 'num', v: src.slice(i, j) })
      i = j
      continue
    }
    // Handle √ and ∛ as prefix operators
    if (src[i] === '√') {
      toks.push({ t: 'unary', v: 'sqrt' })
      i++
      continue
    }
    if (src[i] === '∛') {
      toks.push({ t: 'unary', v: 'cbrt' })
      i++
      continue
    }
    // Handle ^2 and ^3
    if (src.slice(i, i + 2) === '^2') {
      toks.push({ t: 'pow', v: '^2' })
      i += 2
      continue
    }
    if (src.slice(i, i + 2) === '^3') {
      toks.push({ t: 'pow', v: '^3' })
      i += 2
      continue
    }
    if (isOp(c)) {
      toks.push({ t: 'op', v: c as any })
      i++
      continue
    }
    if (c === '(') {
      toks.push({ t: 'lp' })
      i++
      continue
    }
    if (c === ')') {
      toks.push({ t: 'rp' })
      i++
      continue
    }
    throw new Error('bad char: ' + c)
  }
  return toks
}

function mergeUnary(toks: Tok[]): Tok[] {
  const merged: Tok[] = []
  for (let k = 0; k < toks.length; k++) {
    const t = toks[k]
    const prev = merged[merged.length - 1]
    if (
      t.t === 'op' &&
      t.v === '-' &&
      (merged.length === 0 || (prev.t !== 'num' && prev.t !== 'rp'))
    ) {
      const next = toks[k + 1]
      if (next && next.t === 'num') {
        merged.push({ t: 'num', v: '-' + next.v })
        k++
        continue
      }
    }
    merged.push(t)
  }
  return merged
}
