import type { Node } from './ast'

type Tok = { t:'num', v:string } | { t:'op', v:'+'|'-'|'*'|'/' } | { t:'lp' } | { t:'rp' }
const prec: Record<string, number> = { '+':1, '-':1, '*':2, '/':2 }

export function parse(src: string): Node {
  const toks = mergeUnary(tokenize(src))
  const output: (Tok|Node)[] = []
  const ops: Tok[] = []

  function popOp(){
    const op = ops.pop()!
    const r = output.pop() as Node
    const l = output.pop() as Node
    output.push({ type:'bin', op: op.v as any, left:l, right:r } as Node)
  }

  for(const t of toks){
    if(t.t === 'num'){
      output.push({ type:'num', n: t.v } as Node)
    }else if(t.t === 'op'){
      while(ops.length){
        const top = ops[ops.length-1]
        if(top.t==='op' && prec[top.v] >= prec[t.v]) popOp(); else break
      }
      ops.push(t)
    }else if(t.t === 'lp'){
      ops.push(t)
    }else if(t.t === 'rp'){
      while(ops.length && ops[ops.length-1].t !== 'lp') popOp()
      if(!ops.length) throw new Error('mismatched )')
      ops.pop()
    }
  }
  while(ops.length){
    const t = ops.pop()!
    if(t.t==='lp') throw new Error('mismatched (')
    if(t.t==='op'){ const r = output.pop() as Node; const l = output.pop() as Node; output.push({ type:'bin', op:t.v as any, left:l, right:r } as Node) }
  }
  if(output.length !== 1) throw new Error('invalid expression')
  return output[0] as Node
}

function tokenize(src: string): Tok[]{
  const toks: Tok[] = []
  let i = 0
  const isDigit = (c:string)=> c >= '0' && c <= '9'
  const isOp = (c:string)=> c==='+' || c==='-' || c==='*' || c==='/'

  while(i < src.length){
    const c = src[i]
    if(c === ' '){ i++; continue }
    if(isDigit(c)){
      let j = i+1; while(j < src.length && isDigit(src[j])) j++
      toks.push({ t:'num', v: src.slice(i,j) })
      i = j; continue
    }
    if(isOp(c)){ toks.push({ t:'op', v: c as any }); i++; continue }
    if(c === '('){ toks.push({ t:'lp' }); i++; continue }
    if(c === ')'){ toks.push({ t:'rp' }); i++; continue }
    throw new Error('bad char: '+c)
  }
  return toks
}

function mergeUnary(toks: Tok[]): Tok[]{
  const merged: Tok[] = []
  for(let k=0; k<toks.length; k++){
    const t = toks[k]
    const prev = merged[merged.length-1]
    if(t.t==='op' && t.v==='-' && (merged.length===0 || (prev.t!=='num' && prev.t!=='rp'))){
      const next = toks[k+1]
      if(next && next.t==='num'){ merged.push({ t:'num', v: '-'+next.v }); k++; continue }
    }
    merged.push(t)
  }
  return merged
}