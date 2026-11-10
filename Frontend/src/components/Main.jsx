import React from 'react'
import orderRide from '../assets/location.jpg';
import invitation from '../assets/people.jpg';
import splitRide from '../assets/images.png';

export default function Main() {
  return (
    <main className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-6rem)] w-full flex items-center justify-start px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="max-w-7xl w-full mx-auto space-y-8">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white">
            Sustainable &amp; <br />
            Budget-Friendly <br />
            <span className="text-lime-200">Smart Rides</span>
          </h1>

          {/* Description & Action Bar */}
          <div className="w-full space-y-6">
            <p className="max-w-lg text-base sm:text-lg font-medium leading-relaxed text-white/80">
              Split the fare, share the ride, and travel smarter with people headed your way.
            </p>

            <div className="w-full flex items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm font-medium text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lime-200" />
                  Save money
                </span>
                <span aria-hidden="true" className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lime-200" />
                  Reduce emissions
                </span>
                <span aria-hidden="true" className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-lime-200" />
                  Share your route
                </span>
              </div>

              <button
                type="button"
                className="size-20 sm:size-24 rounded-full bg-lime-200 hover:bg-lime-300 text-neutral-900 font-bold text-sm sm:text-base flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-lime-200/20 shrink-0 cursor-pointer ml-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Two: How It Works / Steps */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-20 sm:py-28 bg-neutral-950/75 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase text-lime-200">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Ride Sharing Made Simple
            </h2>
            <p className="text-sm sm:text-base text-neutral-300">
              Connect with commuters on your route, share the journey, and split the cost in three easy steps.
            </p>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Step 1: Order Ride */}
            <div className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/50 hover:bg-neutral-900/80 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lime-200/5 flex flex-col justify-between">
              <div>
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-neutral-950/60 mb-6 border border-white/5">
                  <img
                    src={orderRide}
                    alt="Order ride"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-neutral-900/85 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-lime-200">
                    Step 01
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-200 transition-colors">
                  Order Your Ride
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Enter your pickup and destination to discover available drivers and rides going in your direction.
                </p>
              </div>
            </div>

            {/* Step 2: Invite Friends */}
            <div className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/50 hover:bg-neutral-900/80 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lime-200/5 flex flex-col justify-between">
              <div>
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-neutral-950/60 mb-6 border border-white/5">
                  <img
                    src={invitation}
                    alt="Invite friends"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-neutral-900/85 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-lime-200">
                    Step 02
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-200 transition-colors">
                  Match &amp; Invite
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Carpool with matched riders heading along your route or invite your friends to share the vehicle.
                </p>
              </div>
            </div>

            {/* Step 3: Split Ride */}
            <div className="group rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/50 hover:bg-neutral-900/80 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lime-200/5 flex flex-col justify-between">
              <div>
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-2xl bg-neutral-950/60 mb-6 border border-white/5">
                  <img
                    src={splitRide}
                    alt="Split the ride"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-neutral-900/85 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-bold text-lime-200">
                    Step 03
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-200 transition-colors">
                  Split the Fare
                </h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Automatic fare division ensures transparent pricing, allowing everyone to travel affordably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
