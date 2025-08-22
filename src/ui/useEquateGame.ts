import { useCallback, useEffect, useMemo, useState } from 'react'
import { Frac } from '../domain/fraction'
import { parse } from '../domain/parse'
import { evaluate } from '../domain/eval'
import { approxEqualFrac } from '../domain/util'

function randomPuzzle(len=4){
  let s = ''; for(let i=0;i<len;i++){ const d = (i===0) ? (1+Math.floor(Math.random()*9)) : Math.floor(Math.random()*10); s += String(d); }
  return s
}
type Side = 'left'|'right'
export function useEquateGame(){
  const [puzzle, setPuzzle] = useState('9823')
  const half = Math.floor(puzzle.length/2)
  const leftSet = useMemo(()=>puzzle.slice(0,half).split(''), [puzzle])
  const rightSet = useMemo(()=>puzzle.slice(half).split(''), [puzzle])
  const [active, setActive] = useState<Side>('left')
  const [leftExpr, setLeftExpr] = useState('')
  const [rightExpr, setRightExpr] = useState('')
  const [leftRemain, setLeftRemain] = useState<Record<string, number>>(()=>countDigits(leftSet))
  const [rightRemain, setRightRemain] = useState<Record<string, number>>(()=>countDigits(rightSet))
  useEffect(()=>{
    setLeftRemain(countDigits(leftSet)); setRightRemain(countDigits(rightSet))
    setLeftExpr(''); setRightExpr(''); setActive('left'); setWinTick(false)
  }, [leftSet.toString(), rightSet.toString()])
  function countDigits(arr:string[]){ const m:Record<string, number> = {}; arr.forEach(d => { m[d] = (m[d]||0)+1 }); return m }
  const getExpr = useCallback(() => active==='left' ? leftExpr : rightExpr, [active, leftExpr, rightExpr])
  const setExpr = useCallback((v:string) => (active==='left' ? setLeftExpr : setRightExpr)(v), [active])
  const isDigitAllowed = useCallback((d:string)=>{ const pool = active==='left' ? leftRemain : rightRemain; return (pool[d] ?? 0) > 0 }, [active, leftRemain, rightRemain])
  function lastChar(s:string){ return s.slice(-1) } function isDigit(ch:string){ return /[0-9]/.test(ch) } function isOp(ch:string){ return /[+\-*/]/.test(ch) }
  function canAppendDigit(s:string){ const lc = lastChar(s); return !lc || !isDigit(lc) }
  function canAppendOp(s:string, op:string){ if(!s) return op === '-'; const lc = lastChar(s); if(isOp(lc)) return false; return true }
  const onDigit = useCallback((d:string)=>{
    const s = getExpr(); if(!canAppendDigit(s)) return
    setExpr(s + d)
    if(active==='left'){ setLeftRemain(prev=>{ const next={...prev}; next[d]=(next[d]??0)-1; if(next[d]<=0) delete next[d]; return next }) }
    else { setRightRemain(prev=>{ const next={...prev}; next[d]=(next[d]??0)-1; if(next[d]<=0) delete next[d]; return next }) }
  }, [active, getExpr, setExpr])
  const onOp = useCallback((pretty:string)=>{ const m:Record<string,string>={'×':'*','÷':'/','−':'-','+':'+'}; const op=m[pretty]??pretty; const s=getExpr(); if(!canAppendOp(s,op)) return; setExpr(s+op) }, [getExpr, setExpr])
  const onBack = useCallback(()=>{
    const s = getExpr(); if(!s) return
    const removed = s.slice(-1); setExpr(s.slice(0,-1))
    if(isDigit(removed)){ if(active==='left'){ setLeftRemain(p=>({ ...p, [removed]:(p[removed] ?? 0) + 1 })) } else { setRightRemain(p=>({ ...p, [removed]:(p[removed] ?? 0) + 1 })) } }
  }, [active, getExpr, setExpr])
  const onClear = useCallback(()=>{
    const s = getExpr()
    for(const ch of s){ if(isDigit(ch)){ if(active==='left'){ setLeftRemain(p=>({ ...p, [ch]:(p[ch] ?? 0) + 1 })) } else { setRightRemain(p=>({ ...p, [ch]:(p[ch] ?? 0) + 1 })) } } }
    setExpr('')
  }, [active, getExpr, setExpr])
  const leftExprPretty = useMemo(()=>leftExpr.replaceAll('*','×').replaceAll('/','÷'), [leftExpr])
  const rightExprPretty = useMemo(()=>rightExpr.replaceAll('*','×').replaceAll('/','÷'), [rightExpr])
  function safeEval(s:string): Frac | null { if(!s) return null; if(isOp(lastChar(s))) return null; try{ const ast = parse(s); return evaluate(ast) }catch{ return null } }
  const leftVal = useMemo(()=>safeEval(leftExpr), [leftExpr]); const rightVal = useMemo(()=>safeEval(rightExpr), [rightExpr])
  const leftValueStr = leftVal ? leftVal.toString() : (leftExpr ? '?' : ''); const rightValueStr = rightVal ? rightVal.toString() : (rightExpr ? '?' : '')
  const leftReady = !!leftVal; const rightReady = !!rightVal
  const equal = leftReady && rightReady && approxEqualFrac(leftVal!, rightVal!)
  const win = equal && !!leftExpr && !!rightExpr
  const [winTick, setWinTick] = useState(false); useEffect(()=>{ if(win){ setWinTick(false); requestAnimationFrame(()=> setWinTick(true)) } }, [win])
  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      if(e.key >= '0' && e.key <= '9'){ if(isDigitAllowed(e.key)) onDigit(e.key); e.preventDefault(); return }
      if(['+','-','*','/'].includes(e.key)){ onOp(e.key); e.preventDefault(); return }
      if(e.key === 'Backspace'){ onBack(); e.preventDefault(); return }
      if(e.key.toLowerCase() === 'c'){ onClear(); e.preventDefault(); return }
      if(e.key === 'Tab' || e.key === 'Enter'){ setActive(a => a==='left' ? 'right' : 'left'); e.preventDefault(); return }
      if(e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'n'){ nextPuzzle(); return }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [onDigit, onOp, onBack, onClear, isDigitAllowed])
  const nextPuzzle = useCallback(()=>{ setPuzzle(randomPuzzle(4)) }, [])
  return { active, setActive, leftSet, rightSet,
    leftExpr, rightExpr, leftExprPretty, rightExprPretty,
    leftValueStr, rightValueStr, leftReady, rightReady, equal, win, winTick,
    isDigitAllowed, onDigit, onOp, onBack, onClear, nextPuzzle }
}