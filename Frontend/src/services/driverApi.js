import { getRide } from './rideApi'

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...options.headers }, ...options })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Request failed')
  return response.status === 204 ? null : response.json()
}
export function getDriverProfile() { return request('/drivers/me') }
export function applyAsDriver(details) { return request('/drivers/apply', { method: 'POST', body: JSON.stringify(details) }) }
export function getDriverOffers() { return request('/drivers/me/offers') }
export function getDriverActiveRides() { return request('/drivers/me/rides') }
export function updateDriverStatus(status) { return request('/drivers/me/status', { method: 'PATCH', body: JSON.stringify({ status }) }) }
export function updateDriverLocation(latitude, longitude) { return request('/drivers/me/location', { method: 'PATCH', body: JSON.stringify({ latitude, longitude }) }) }
export function respondToDriverOffer(offerId, status) { return request(`/drivers/offers/${offerId}/respond`, { method: 'POST', body: JSON.stringify({ status }) }) }
export function startDriverRide(rideId) { return request(`/drivers/rides/${rideId}/start`, { method: 'POST' }) }
export function completeDriverRide(rideId) { return request(`/drivers/rides/${rideId}/complete`, { method: 'POST' }) }
export { getRide }
