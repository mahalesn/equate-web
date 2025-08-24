export type Num = { type: 'num'; n: string }
export type BinOp = '+' | '-' | '*' | '/'
export type UnaryOp = 'sqrt' | 'cbrt' | 'sq' | 'cb'
export type Op = { type: 'op'; op: BinOp | UnaryOp }
export type Node = 
  | Num 
  | { type: 'bin'; op: BinOp; left: Node; right: Node }
  | { type: 'unary'; op: UnaryOp; operand: Node }
