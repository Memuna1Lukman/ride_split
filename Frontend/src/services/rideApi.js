const apiBaseUrl = (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '')

export const isApiConfigured = Boolean(apiBaseUrl)

async function request(path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Request failed')
  return response.status === 204 ? null : response.json()
}

export function createRide({ pickup, dropoff, rideType, idempotencyKey }) {
  return request('/rides/', {
    method: 'POST',
    body: JSON.stringify({
      pickup_location: { latitude: pickup.latitude, longitude: pickup.longitude },
      dropoff_location: { latitude: dropoff.latitude, longitude: dropoff.longitude },
      capacity: rideType === 'solo' ? 1 : 4,
      currency: 'GHS',
      idempotency_key: idempotencyKey,
    }),
  })
}

export function createInvitation(rideId, inviteeId) {
  return request(`/rides/${rideId}/invitations`, { method: 'POST', body: JSON.stringify({ invitee_id: inviteeId }) })
}
