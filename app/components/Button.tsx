import React from 'react'

interface props {
    name:string,
    paddingX:number,
    paddingY:number,
    color:string,
    bgColor:string,
    icon:string
}

const Button = ({name,paddingY,paddingX,color,bgColor,icon}:props) => {
  return (
     <button className={`px-${paddingX} py-${paddingY} text-${color} bg-${bgColor} `}>{icon ? icon : ""}{name}</button>
  )
}

export default Button
