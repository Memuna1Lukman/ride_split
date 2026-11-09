import React from 'react'
import logo from '../assets/black.png';
import Button from './ui/Button';
import { Link } from 'react-router';

export default function Header() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between font-sans">
      <section className="flex items-center cursor-pointer transition-opacity hover:opacity-90">
        {/* Scaled down the image height to keep the header compact and clean */}
        <img src={logo} alt="black logo" className="h-28 w-auto object-contain" />
      </section>
      
      
      <section className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-gray-600">
        <Link to="/" className="hover:text-blue-600 transition-colors duration-200">
          Home
        </Link>
        <Link to="/about" className="hover:text-blue-600 transition-colors duration-200">
          About Us
        </Link>
      </section>
      
      <section className="flex items-center gap-3 sm:gap-4 text-sm font-semibold">
        {/* Cleaned up the outlined look to use standard Tailwind outline conventions */}
        <Button 
          button="Log In" 
          className="bg-transparent text-blue-600 outline outline-1 outline-blue-600/30 hover:outline-blue-600 hover:bg-blue-50/50 shadow-none" 
        />
        <Button button="Sign Up" />
      </section>
    </nav>
  )
}
