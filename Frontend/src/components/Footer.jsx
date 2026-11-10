import React from 'react'
import logo from '../assets/white.png';

export default function Footer() {
  return (
    /* bg-neutral-950/90 ensures it cuts the background cleanly and stays readable at the bottom */
    <footer className="w-full bg-neutral-950/90 border-t border-white/5 pt-12 pb-8 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-8">
        
        <img src={logo} alt="white logo" className="h-12 w-36 object-cover object-center brightness-200 sm:h-16 sm:w-48 mb-4" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-neutral-400">
          <section className="flex flex-col gap-3">
              <h1 className="font-bold text-white text-sm">Company</h1>
              <ul className="flex flex-col gap-2 text-xs font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Our Offering</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Newsroom</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Investors</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Career</li>
              </ul>
          </section>

          <section className="flex flex-col gap-3">
              <h1 className="font-bold text-white text-sm">Product</h1>
              <ul className="flex flex-col gap-2 text-xs font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Ride</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Drive</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Eat</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Business</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Freight</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Gift Cards</li>
              </ul>
          </section>

          <section className="flex flex-col gap-3">
              <h1 className="font-bold text-white text-sm">Global Citizenship</h1>
              <ul className="flex flex-col gap-2 text-xs font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Safety</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Sustainability</li>
              </ul>
          </section>

          <section className="flex flex-col gap-3">
              <h1 className="font-bold text-white text-sm">Travel</h1>
              <ul className="flex flex-col gap-2 text-xs font-medium">
                  <li className="hover:text-white cursor-pointer transition-colors">Reserve</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Airports</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Hostels</li>
                  <li className="hover:text-white cursor-pointer transition-colors">Cities</li>
              </ul>
          </section>
        </div>

      </div>
    </footer>
  )
}
