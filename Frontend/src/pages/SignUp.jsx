import { useState } from 'react';
import { Link } from 'react-router';
import logo from '../assets/white.png';
import bgImage from '../assets/uber.jpg';

export default function SignUp() {
  const [role, setRole] = useState('passenger');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cityName: '',
    password: '',
    agreedToTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration submission logic
    console.log('Registering user:', { ...formData, role });
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed bg-no-repeat bg-black/75 bg-blend-multiply flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 size-80 rounded-full bg-lime-200/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 size-80 rounded-full bg-lime-200/10 blur-3xl pointer-events-none" />

      {/* Navigation back to home */}
      <div className="w-full max-w-xl mb-6 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Main Glassmorphic Sign Up Card */}
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-neutral-900/80 p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block focus:outline-none mb-3">
            <img
              src={logo}
              alt="Ride Split"
              className="h-10 sm:h-12 w-auto mx-auto object-contain brightness-200"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Join Ride Split to start sharing rides and splitting costs.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-white/10 bg-neutral-950/70 p-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('passenger')}
            className={`rounded-xl py-2.5 transition-all cursor-pointer ${
              role === 'passenger'
                ? 'bg-lime-200 text-neutral-900 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            I'm a Passenger
          </button>
          <button
            type="button"
            onClick={() => setRole('driver')}
            className={`rounded-xl py-2.5 transition-all cursor-pointer ${
              role === 'driver'
                ? 'bg-lime-200 text-neutral-900 shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            I'm a Driver
          </button>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200"
              />
            </div>
          </div>

          {/* City & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                City Name
              </label>
              <input
                type="text"
                name="cityName"
                required
                value={formData.cityName}
                onChange={handleChange}
                placeholder="San Francisco"
                className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-neutral-950/70 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-all focus:border-lime-200 focus:outline-none focus:ring-1 focus:ring-lime-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="agreedToTerms"
              name="agreedToTerms"
              required
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-1 size-4 rounded border-white/20 bg-neutral-950 text-lime-200 accent-lime-200 focus:ring-lime-200 cursor-pointer"
            />
            <label htmlFor="agreedToTerms" className="text-xs text-neutral-400 leading-relaxed cursor-pointer">
              By signing up, you agree to our{' '}
              <a href="#" className="text-lime-200 hover:underline">
                Terms &amp; Conditions
              </a>{' '}
              and{' '}
              <a href="#" className="text-lime-200 hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-lime-200 hover:bg-lime-300 text-neutral-900 font-bold py-3.5 px-6 text-sm sm:text-base transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-lime-200/20 cursor-pointer mt-4"
          >
            Create Account
          </button>
        </form>

        {/* Existing account link */}
        <p className="mt-8 text-center text-xs sm:text-sm text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-lime-200 hover:underline transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
