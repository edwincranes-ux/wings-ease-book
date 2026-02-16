import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, AlertCircle } from 'lucide-react';
import {
  useBookingStore,
  FlightClass,
  CLASS_LABELS,
  CLASS_PRICES,
  CLASS_CAPACITY,
  generateBookingId,
  generatePassengerId,
  generateSeatNumber,
} from '@/store/bookingStore';
import { toast } from 'sonner';

const DESTINATIONS = [
  'Nairobi (NBO)', 'London (LHR)', 'Dubai (DXB)', 'Johannesburg (JNB)',
  'Mumbai (BOM)', 'Amsterdam (AMS)', 'Mombasa (MBA)', 'Paris (CDG)',
];

const BookingPage = () => {
  const navigate = useNavigate();
  const { flights, addBooking, addPassenger, getNextAvailable } = useBookingStore();

  const [step, setStep] = useState(1);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [flightClass, setFlightClass] = useState<FlightClass>('C');
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passport, setPassport] = useState('');

  const filteredFlights = flights.filter(
    (f) => (!from || f.from === from) && (!to || f.to === to)
  );

  const handleSearch = () => {
    if (!from || !to) {
      toast.error('Please select departure and arrival cities');
      return;
    }
    if (from === to) {
      toast.error('Departure and arrival cities must be different');
      return;
    }
    setStep(2);
  };

  const handleSelectFlight = (flightId: string) => {
    const flight = flights.find((f) => f.id === flightId);
    if (!flight) return;

    if (flight.seatsAvailable[flightClass] <= 0) {
      const next = getNextAvailable(from, to, flightClass);
      if (next) {
        toast.error(
          `Class ${flightClass} is full on this flight. Next available: ${next.date} at ${next.time} (Flight ${next.id})`
        );
      } else {
        toast.error(`No seats available in ${CLASS_LABELS[flightClass]} for this route.`);
      }
      return;
    }

    setSelectedFlight(flightId);
    setStep(3);
  };

  const handleBook = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !passport.trim()) {
      toast.error('Please fill in all required passenger details');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const flight = flights.find((f) => f.id === selectedFlight);
    if (!flight) return;

    const passengerId = generatePassengerId();
    const passenger = { id: passengerId, firstName, lastName, email, phone, passport };
    addPassenger(passenger);

    const seatIndex = CLASS_CAPACITY[flightClass] - flight.seatsAvailable[flightClass];
    const booking = {
      id: generateBookingId(),
      passenger,
      flightClass,
      from: flight.from,
      to: flight.to,
      date: flight.date,
      time: flight.time,
      seatNumber: generateSeatNumber(flightClass, seatIndex),
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    addBooking(booking);
    toast.success(`Booking confirmed! Reference: ${booking.id}`);
    navigate('/manage');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Plane className="h-7 w-7 text-primary" /> Book a Flight
      </h1>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        {['Search', 'Select Flight', 'Passenger Details'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-kq-green text-primary-foreground' : step === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {i + 1}
            </div>
            <span className={step === i + 1 ? 'font-semibold' : 'text-muted-foreground'}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {/* Step 1 - Search */}
      {step === 1 && (
        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 bg-background text-foreground">
                <option value="">Select departure</option>
                {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-input rounded-lg px-3 py-2 bg-background text-foreground">
                <option value="">Select arrival</option>
                {DESTINATIONS.filter((d) => d !== from).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class</label>
            <div className="grid grid-cols-3 gap-2">
              {(['A', 'B', 'C'] as const).map((cls) => (
                <button
                  key={cls}
                  onClick={() => setFlightClass(cls)}
                  className={`border rounded-lg py-2 px-3 text-sm font-medium transition-colors ${
                    flightClass === cls
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input hover:border-primary/50'
                  }`}
                >
                  {CLASS_LABELS[cls]}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSearch} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Search Flights
          </button>
        </div>
      )}

      {/* Step 2 - Select Flight */}
      {step === 2 && (
        <div className="space-y-3">
          <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline">← Back to search</button>
          {filteredFlights.length === 0 ? (
            <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">No flights found for this route.</div>
          ) : (
            filteredFlights.map((f) => {
              const full = f.seatsAvailable[flightClass] <= 0;
              return (
                <div key={f.id} className={`bg-card rounded-xl p-5 shadow-card border ${full ? 'opacity-60 border-destructive/30' : 'border-transparent hover:border-primary/30'} transition-colors`}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="font-bold text-lg">{f.id}</p>
                      <p className="text-sm text-muted-foreground">{f.from} → {f.to}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{f.date} at {f.time}</p>
                      <p className="text-sm">
                        {full ? (
                          <span className="text-destructive flex items-center gap-1 justify-end">
                            <AlertCircle className="h-3 w-3" /> FULL
                          </span>
                        ) : (
                          <span className="text-kq-green">{f.seatsAvailable[flightClass]} seats left</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-primary">KES {CLASS_PRICES[flightClass].toLocaleString()}</p>
                      <button
                        onClick={() => handleSelectFlight(f.id)}
                        className={`mt-1 px-4 py-1.5 rounded-lg text-sm font-semibold transition-opacity ${
                          full ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:opacity-90'
                        }`}
                      >
                        {full ? 'Full' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Step 3 - Passenger */}
      {step === 3 && (
        <div className="bg-card rounded-xl p-6 shadow-card space-y-4">
          <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline">← Back to flights</button>
          <h2 className="text-xl font-bold">Passenger Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name *', value: firstName, set: setFirstName },
              { label: 'Last Name *', value: lastName, set: setLastName },
              { label: 'Email *', value: email, set: setEmail, type: 'email' },
              { label: 'Phone', value: phone, set: setPhone, type: 'tel' },
              { label: 'Passport No. *', value: passport, set: setPassport },
            ].map(({ label, value, set, type }) => (
              <div key={label}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  type={type || 'text'}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                  maxLength={100}
                />
              </div>
            ))}
          </div>
          <div className="bg-muted rounded-lg p-4 text-sm">
            <p><strong>Flight:</strong> {selectedFlight} | <strong>Class:</strong> {CLASS_LABELS[flightClass]} | <strong>Price:</strong> KES {CLASS_PRICES[flightClass].toLocaleString()}</p>
          </div>
          <button onClick={handleBook} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
