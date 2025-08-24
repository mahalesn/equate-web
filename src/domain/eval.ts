import type { Node } from './ast'
import { Frac } from './fraction'

export function evaluate(node: Node): Frac {
  if (node.type === 'num') {
    return new Frac(BigInt(node.n), 1n)
  }
  if (node.type === 'bin') {
    const l = evaluate(node.left)
    const r = evaluate(node.right)
    switch (node.op) {
      case '+':
        return l.add(r)
      case '-':
        return l.sub(r)
      case '*':
        return l.mul(r)
      case '/':
        return l.div(r)
    }
  }
  if (node.type === 'unary') {
    const operand = evaluate(node.operand)
    switch (node.op) {
      case 'sq':
        return operand.pow(2)
      case 'cb':
        return operand.pow(3)
      case 'sqrt':
        return operand.sqrt()
      case 'cbrt':
        return operand.cbrt()
    }
  }
  throw new Error('bad node')
}
