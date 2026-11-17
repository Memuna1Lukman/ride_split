export function calculateShares(total, passengerCount, riders = []) {
  const share = Math.round((total / passengerCount) * 100) / 100
  return { total, share, riders: [{ id: 'you', name: 'You', paid: true, amount: share }, ...riders.map((rider) => ({ ...rider, amount: share }))] }
}
