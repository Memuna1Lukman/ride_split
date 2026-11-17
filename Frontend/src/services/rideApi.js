const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')

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

export function createRide({ offer, capacity }) {
  return request('/rides/', {
    method: 'POST',
    body: JSON.stringify({
      pickup_location: { latitude: 5.605, longitude: -0.183 },
      dropoff_location: { latitude: 5.544, longitude: -0.187 },
      capacity,
      estimated_fare_pesewas: Math.round(offer * 100),
      currency: 'GHS',
      idempotency_key: crypto.randomUUID(),
    }),
  })
}

export function createInvitation(rideId, inviteeId) {
  return request(`/rides/${rideId}/invitations`, { method: 'POST', body: JSON.stringify({ invitee_id: inviteeId }) })
}
