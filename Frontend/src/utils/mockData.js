export const initialRiders = [
  { id: 'kojo', name: 'Kojo Mensah', initials: 'KM', color: 'bg-sky-500', stop: 'Osu Oxford Street', status: 'accepted', paid: true },
  { id: 'ama', name: 'Ama Serwaa', initials: 'AS', color: 'bg-violet-500', stop: 'Labone Crescent', status: 'pending', paid: false },
  { id: 'esi', name: 'Esi Agyeman', initials: 'EA', color: 'bg-amber-500', stop: 'Airport Residential', status: 'accepted', paid: true },
]

export const driverBids = [
  { id: 'yaw', name: 'Yaw Asante', rating: '4.9', car: 'Toyota Corolla', plate: 'GR 3421-24', eta: '3 min', price: 64, avatar: 'YA' },
  { id: 'efua', name: 'Efua Owusu', rating: '4.8', car: 'Hyundai Elantra', plate: 'GT 8012-23', eta: '5 min', price: 61, avatar: 'EO' },
  { id: 'kwame', name: 'Kwame Boakye', rating: '4.7', car: 'Kia Rio', plate: 'GW 4490-22', eta: '6 min', price: 58, avatar: 'KB' },
]

export const stops = [
  { id: 'pickup', label: 'Pickup', name: 'Accra Mall, Spintex Road', coordinates: [-0.183, 5.605], type: 'pickup' },
  { id: 'kojo', label: 'Kojo', name: 'Osu Oxford Street', coordinates: [-0.187, 5.557], type: 'rider' },
  { id: 'esi', label: 'Esi', name: 'Airport Residential', coordinates: [-0.194, 5.594], type: 'rider' },
  { id: 'dropoff', label: 'Drop-off', name: 'Independence Square', coordinates: [-0.187, 5.544], type: 'dropoff' },
]
