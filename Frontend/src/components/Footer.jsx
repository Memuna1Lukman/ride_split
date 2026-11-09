import React from 'react'
import logo from '../assets/white.png';
export default function Footer() {
  return (
   <footer>
    <section>
        <img src={logo} alt="white logo" className='h-40 w-auto object-contain' />
        <div className='grid grid-cols-4 gap-4 justify-center pl-7'>
            <section className='px-4 flex flex-col gap-3'>
                <h1  className='font-bold'>Company</h1>
                <ul className="flex flex-col gap-3 text-sm">
                    <li>About Us</li>
                    <li>Our Offering</li>
                    <li>Newsroom</li>
                    <li>Investors</li>
                    <li>Blog</li>
                    <li>Career</li>
                </ul>
            </section>
            <section className='px-4 flex flex-col gap-3'>
                <h1 className='font-bold'>Product</h1>
                <ul className="flex flex-col gap-3 text-sm">
                    <li>Ride</li>
                    <li>Drive</li>
                    <li>Eat</li>
                    <li>SplitMotion for Business</li>
                    <li>SplitMotion Freight</li>
                    <li>Gift Cards</li>
                </ul>
            </section>
            <section className='px-4 flex flex-col gap-3'>
                <h1 className='font-bold'>Global Citizenship</h1>
                <ul className="flex flex-col gap-3 text-sm">
                    <li>Safety</li>
                    <li>Sustainability</li>
                </ul>
            </section>
            <section className='px-4 flex flex-col gap-3'>
                <h1 className='font-bold'>Travel</h1>
                <ul className="flex flex-col gap-3 text-sm">
                    <li>Reserve</li>
                    <li>Airpots</li>
                    <li>Hostels</li>
                    <li>Cities</li>
                </ul>
            </section>
        </div>
    </section>
   </footer>
  )
}
