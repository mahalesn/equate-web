import type { Node } from './ast'
import { Frac } from './fraction'

export function evaluate(node: Node): Frac {
  if(node.type === 'num'){ return new Frac(BigInt(node.n), 1n) }
  if(node.type === 'bin'){
    const l = evaluate(node.left); const r = evaluate(node.right)
    switch(node.op){
      case '+': return l.add(r)
      case '-': return l.sub(r)
      case '*': return l.mul(r)
      case '/': return l.div(r)
    }
  }
  throw new Error('bad node')
}