import React from 'react'

export default function Button({button,className=''}) {
  return (
    <div className={`shadow-xl border-none cursor-pointer rounded-sm bg-blue-600 flex items-center justify-center px-4 py-2 ${className}`}>
       {button}
    </div>
  )
}
