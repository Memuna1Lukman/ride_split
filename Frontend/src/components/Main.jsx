import React from 'react'
import orderRide from '../assets/location.jpg';
import invitation from '../assets/people.jpg';
import splitRide from '../assets/images.png';
import mapPreview from '../assets/map.png';
import bgImage from '../assets/uber.jpg';

export default function Main() {
  return (
    <main className="w-full flex flex-col">
      {/* 1. Hero Section */}
      <section 
        className="relative -mt-16 min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-start px-4 pt-16 pb-16 sm:-mt-[6.5rem] sm:px-8 sm:pt-[6.5rem] sm:pb-24 lg:px-16 overflow-hidden"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark overlay for contrast and legibility */}
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />

        {/* Smooth gradient fade into the subsequent dark sections */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-neutral-950 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl w-full mx-auto space-y-8">
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

      {/* 2. Section Two: How It Works / Steps */}
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

      {/* 3. Section Three: Live Map & Dispatch Preview */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-20 sm:py-28 bg-neutral-900/40 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase text-lime-200">
              Live Map &amp; Dispatch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Real-Time Matching on Live Maps
            </h2>
            <p className="text-sm sm:text-base text-neutral-300">
              PostGIS geospatial queries and live WebSockets match you with nearby drivers instantly with zero double-booking.
            </p>
          </div>

          {/* Interactive Map Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Map Mockup (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl border border-white/15 bg-neutral-900/80 p-3 sm:p-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
              {/* Window Bar Header */}
              <div className="flex items-center justify-between pb-3 px-2 border-b border-white/10 mb-3 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="size-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="size-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-neutral-400 hidden sm:inline">live-dispatch-route.map</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-lime-200">
                  <span className="size-2 rounded-full bg-lime-300 animate-pulse" />
                  <span>STREAMING WEBSOCKETS</span>
                </div>
              </div>

              {/* Map Image Container with Badges */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-950">
                <img
                  src={mapPreview}
                  alt="Live Dispatch Route Map"
                  className="w-full h-72 sm:h-96 lg:h-105 object-cover filter brightness-95"
                />

                {/* Overlay Badge 1: Driver En Route */}
                <div className="absolute top-4 left-4 rounded-2xl border border-white/15 bg-neutral-950/85 backdrop-blur-md p-3.5 shadow-xl max-w-xs flex items-center gap-3">
                  <div className="size-10 rounded-full bg-lime-200 flex items-center justify-center font-black text-neutral-900 text-sm shrink-0">
                    MK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm">Marcus K.</span>
                      <span className="text-[10px] font-bold text-neutral-900 bg-lime-200 px-1.5 py-0.5 rounded-full">4.9 ★</span>
                    </div>
                    <p className="text-[11px] text-lime-200 font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="size-1.5 rounded-full bg-lime-300 animate-pulse" />
                      Toyota Camry • 3 min away
                    </p>
                  </div>
                </div>

                {/* Overlay Badge 2: Split Fare & Seats status */}
                <div className="absolute bottom-4 right-4 rounded-2xl border border-white/15 bg-neutral-950/85 backdrop-blur-md p-3.5 shadow-xl text-left hidden sm:block">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 block">Carpool Route</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-lime-200 font-black text-lg sm:text-xl">$7.50</span>
                    <span className="text-xs text-neutral-400 line-through">$24.00</span>
                    <span className="text-[11px] text-lime-200/80 font-semibold">(Save 68%)</span>
                  </div>
                  <span className="text-[11px] text-neutral-300 block mt-1">2 of 3 Seats Claimed</span>
                </div>
              </div>
            </div>

            {/* Feature Highlights (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md transition-all hover:border-lime-200/40">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center shrink-0">
                    <svg className="size-5 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Sub-Second Spatial Search</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      PostGIS finds the closest available drivers along your exact commuting path within milliseconds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md transition-all hover:border-lime-200/40">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center shrink-0">
                    <svg className="size-5 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Zero Double-Booking</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      Database-level concurrency locks ensure a driver is atomically assigned to one request at a time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 backdrop-blur-md transition-all hover:border-lime-200/40">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center shrink-0">
                    <svg className="size-5 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Live Coordinates Streaming</h3>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      Native WebSockets deliver smooth real-time driver coordinates and ETAs right to your screen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section Four: Safety & Trust Pillars */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-20 sm:py-28 bg-neutral-950/80 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase text-lime-200">
              Safety &amp; Trust
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Built for Safety, Backed by Trust
            </h2>
            <p className="text-sm sm:text-base text-neutral-300">
              Your comfort and security come first. Every ride on Ride Split is monitored and verified.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/40 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center mb-5">
                  <svg className="size-6 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Verified Profiles</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Rigorous government ID verification and driver history checks prior to accessing the platform.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/40 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center mb-5">
                  <svg className="size-6 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live Trip Sharing</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Share your live vehicle coordinates and trip progress with loved ones in a single tap.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/40 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center mb-5">
                  <svg className="size-6 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Cashless Payments</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  No awkward cash calculations. Fares are securely divided and processed automatically via app.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6 backdrop-blur-md transition-all duration-300 hover:border-lime-200/40 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="size-12 rounded-2xl bg-lime-200/10 border border-lime-200/20 flex items-center justify-center mb-5">
                  <svg className="size-6 text-lime-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Two-Way Ratings</h3>
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  Mutual rider and driver reviews ensure an accountability-first community with high standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section Five: Final CTA Banner */}
      <section className="w-full px-4 sm:px-8 lg:px-16 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-lime-200/30 bg-gradient-to-br from-neutral-900/90 via-neutral-900/75 to-neutral-950/90 p-8 sm:p-14 lg:p-16 backdrop-blur-xl shadow-2xl">
            {/* Ambient Background Glows */}
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-lime-200/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 size-80 rounded-full bg-lime-200/5 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <span className="inline-block text-xs sm:text-sm font-bold tracking-widest uppercase text-lime-200">
                  Ready to Ride?
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Start Splitting Your Daily Commute Today
                </h2>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  Save hundreds on transportation every month while reducing carbon emissions and traffic congestion.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  className="rounded-full bg-lime-200 hover:bg-lime-300 text-neutral-900 font-bold px-8 py-4 text-sm sm:text-base transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-lime-200/20 cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
                >
                  Book a Shared Ride
                </button>
                <button
                  type="button"
                  className="rounded-full border border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 text-sm sm:text-base transition-all duration-300 hover:bg-white/10 active:scale-95 cursor-pointer text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-200"
                >
                  Drive &amp; Earn
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sponsors sections */}
      <section
        aria-labelledby="sponsors-heading"
        className="w-full overflow-hidden border-t border-white/10 bg-neutral-950/90 px-4 py-16 sm:px-8 sm:py-20 lg:px-16"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.24em] text-lime-200 sm:text-sm">
              Our Sponsors
            </span>
            <h2 id="sponsors-heading" className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Moving cities forward together
            </h2>
            <p className="text-sm leading-relaxed text-neutral-400 sm:text-base">
              Trusted mobility and sustainability partners help us make every shared ride count.
            </p>
          </div>

          <div
            className="relative overflow-hidden"
            aria-label="Ride Split sponsors"
            role="region"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-neutral-950/90 to-transparent sm:w-28" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-neutral-950/90 to-transparent sm:w-28" />

            <div className="animate-marquee flex w-max items-center gap-4 py-2 sm:gap-6">
              {[...['Northstar Mobility', 'Greenline Energy', 'MetroLoop', 'UrbanKind', 'Wayfinder', 'Common Ground'], ...['Northstar Mobility', 'Greenline Energy', 'MetroLoop', 'UrbanKind', 'Wayfinder', 'Common Ground']].map((sponsor, index) => (
                <div
                  key={`${sponsor}-${index}`}
                  aria-hidden={index >= 6}
                  className="flex h-20 min-w-48 items-center justify-center rounded-2xl border border-white/10 bg-neutral-900/70 px-6 text-center text-sm font-bold tracking-wide text-neutral-300 backdrop-blur-md transition-colors hover:border-lime-200/40 hover:text-lime-200 sm:min-w-56 sm:text-base"
                >
                  {sponsor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
