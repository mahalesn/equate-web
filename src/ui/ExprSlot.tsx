import React from 'react'
export function ExprSlot({ selected, placeholder, text, onClick }:{ selected:boolean, placeholder:string, text:string, onClick:()=>void }){
  return (
    <div className={"slot" + (selected ? ' selected' : '')} onClick={onClick} tabIndex={0}>
      {text ? text : <span className="placeholder">{placeholder}</span>}
    </div>
  )
}