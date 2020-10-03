import React from "react";
export function Butt({text,onClick,color}) {
  const styles1={
    width:150,
    height:30,
    borderRadius:4,
    backgroundColor:color,
    textAlign:'center'
  }
  return(
  <div style={styles1} onClick={onClick}>
    {text}
  </div>
  )
}