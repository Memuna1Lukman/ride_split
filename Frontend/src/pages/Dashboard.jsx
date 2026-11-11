import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Main from '../components/Main'

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white flex flex-col font-sans selection:bg-lime-200 selection:text-neutral-900">
      <Header />
      
      <div className="flex-1 w-full flex flex-col">
        <Main />
      </div>
      
      <Footer />
    </div>
  )
}
