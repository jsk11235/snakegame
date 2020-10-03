import React from "react";

export function Piece({value, onClick}) {
  const styles = {
    styles: {
      height: '10px',
      width: '10px',
      backgroundColor: value === 2 ? '#FF0000' : value === 1 ? '#00FF00' : '#000000'
    }
  }
  return (
    <div style={styles.styles} onClick={onClick}>

    </div>
  )
}