import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Main from '../components/Main'
import bgImage from '../assets/uber.jpg';

export default function Dashboard() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-black/50 bg-blend-multiply flex flex-col font-sans select-none"
      style={{ backgroundImage: `url(${bgImage})`}}
    >
        <Header/>
        
        <div className="grow flex items-center">
          <Main/>
        </div>
        <Footer/>
    </div>
  )
}
