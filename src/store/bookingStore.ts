import { create } from 'zustand';

export type FlightClass = 'A' | 'B' | 'C';

export const CLASS_LABELS: Record<FlightClass, string> = {
  A: 'Executive Class',
  B: 'Business Class',
  C: 'Economy Class',
};

export const CLASS_CAPACITY: Record<FlightClass, number> = {
  A: 12,
  B: 30,
  C: 120,
};

export const CLASS_PRICES: Record<FlightClass, number> = {
  A: 85000,
  B: 45000,
  C: 18000,
};

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passport: string;
}

export interface Booking {
  id: string;
  passenger: Passenger;
  flightClass: FlightClass;
  from: string;
  to: string;
  date: string;
  time: string;
  seatNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface Flight {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seatsAvailable: Record<FlightClass, number>;
}

const SAMPLE_FLIGHTS: Flight[] = [
  { id: 'KQ100', from: 'Nairobi (NBO)', to: 'London (LHR)', date: '2026-02-20', time: '23:30', seatsAvailable: { A: 10, B: 25, C: 100 } },
  { id: 'KQ102', from: 'Nairobi (NBO)', to: 'London (LHR)', date: '2026-02-21', time: '23:30', seatsAvailable: { A: 0, B: 5, C: 80 } },
  { id: 'KQ200', from: 'Nairobi (NBO)', to: 'Dubai (DXB)', date: '2026-02-20', time: '08:15', seatsAvailable: { A: 8, B: 20, C: 110 } },
  { id: 'KQ310', from: 'Nairobi (NBO)', to: 'Johannesburg (JNB)', date: '2026-02-22', time: '06:00', seatsAvailable: { A: 12, B: 28, C: 115 } },
  { id: 'KQ410', from: 'Nairobi (NBO)', to: 'Mumbai (BOM)', date: '2026-02-23', time: '14:45', seatsAvailable: { A: 5, B: 15, C: 90 } },
  { id: 'KQ510', from: 'Nairobi (NBO)', to: 'Amsterdam (AMS)', date: '2026-02-24', time: '22:00', seatsAvailable: { A: 12, B: 30, C: 120 } },
  { id: 'KQ600', from: 'Mombasa (MBA)', to: 'Nairobi (NBO)', date: '2026-02-20', time: '07:00', seatsAvailable: { A: 6, B: 18, C: 95 } },
  { id: 'KQ700', from: 'Nairobi (NBO)', to: 'Paris (CDG)', date: '2026-02-25', time: '21:15', seatsAvailable: { A: 3, B: 10, C: 60 } },
];

interface BookingStore {
  bookings: Booking[];
  passengers: Passenger[];
  flights: Flight[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBooking: (id: string) => Booking | undefined;
  addPassenger: (p: Passenger) => void;
  updatePassenger: (id: string, data: Partial<Passenger>) => void;
  deletePassenger: (id: string) => void;
  getNextAvailable: (from: string, to: string, flightClass: FlightClass) => Flight | undefined;
}

let bookingCounter = 1000;

export const generateBookingId = () => `KQ-BK${++bookingCounter}`;
export const generatePassengerId = () => `PAX-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
export const generateSeatNumber = (flightClass: FlightClass, index: number) => {
  const prefix = flightClass === 'A' ? '1' : flightClass === 'B' ? '2' : '3';
  const letter = String.fromCharCode(65 + (index % 6));
  return `${prefix}${Math.floor(index / 6) + 1}${letter}`;
};

export const useBookingStore = create<BookingStore>((set, get) => ({
  bookings: [],
  passengers: [],
  flights: SAMPLE_FLIGHTS,

  addBooking: (booking) => {
    set((state) => {
      const flights = state.flights.map((f) => {
        if (f.id === booking.id.split('-')[0] || (f.from === booking.from && f.to === booking.to && f.date === booking.date && f.time === booking.time)) {
          return {
            ...f,
            seatsAvailable: {
              ...f.seatsAvailable,
              [booking.flightClass]: f.seatsAvailable[booking.flightClass] - 1,
            },
          };
        }
        return f;
      });
      return { bookings: [...state.bookings, booking], flights };
    });
  },

  updateBooking: (id, data) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...data } : b)),
    })),

  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  getBooking: (id) => get().bookings.find((b) => b.id === id),

  addPassenger: (p) => set((state) => ({ passengers: [...state.passengers, p] })),

  updatePassenger: (id, data) =>
    set((state) => ({
      passengers: state.passengers.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),

  deletePassenger: (id) =>
    set((state) => ({
      passengers: state.passengers.filter((p) => p.id !== id),
    })),

  getNextAvailable: (from, to, flightClass) => {
    return get().flights.find(
      (f) => f.from === from && f.to === to && f.seatsAvailable[flightClass] > 0
    );
  },
}));
