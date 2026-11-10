import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Main from '../components/Main'
import bgImage from '../assets/uber.jpg';

export default function Dashboard() {
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat bg-black/60 bg-blend-multiply flex flex-col font-sans"
      style={{ backgroundImage: `url(${bgImage})`}}
    >
        <Header/>
        
        <div className="flex-1 w-full flex flex-col">
          <Main/>
        </div>
        
        <Footer/>
    </div>
  )
}
