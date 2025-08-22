export type Num = { type:'num', n: string }
export type Op = { type:'op', op:'+'|'-'|'*'|'/' }
export type Node = Num | { type:'bin', op: Op['op'], left: Node, right: Node }