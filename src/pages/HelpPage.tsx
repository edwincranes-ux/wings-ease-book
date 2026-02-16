import { HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ_ITEMS = [
  {
    q: 'How do I book a flight?',
    a: 'Navigate to "Book Flight" from the menu. Select your departure and arrival cities, choose your preferred class (Executive, Business, or Economy), then search for available flights. Select a flight, enter your passenger details, and confirm the booking.',
  },
  {
    q: 'What are the different classes available?',
    a: 'Kenya Airways offers three classes:\n• Class A (Executive): Premium lie-flat seats, gourmet dining, lounge access. 12 seats per flight.\n• Class B (Business): Extra legroom, recline seats, premium meals. 30 seats per flight.\n• Class C (Economy): Comfortable seating with complimentary meals. 120 seats per flight.',
  },
  {
    q: 'What happens when a class is full?',
    a: 'When all seats in your chosen class are booked, the system will automatically suggest the next available date and time for the same route and class.',
  },
  {
    q: 'How do I change or cancel a booking?',
    a: 'Go to "Manage Booking" from the menu. Search for your booking using the reference number or passenger name. Click the edit icon to change the class, or the delete icon to cancel the booking.',
  },
  {
    q: 'How do I print my ticket?',
    a: 'In the "Manage Booking" page, find your booking and click the printer icon. This will open a printable e-ticket in a new window.',
  },
  {
    q: 'How do I add or manage passengers?',
    a: 'Navigate to the "Passengers" page. You can add new passengers with their details (name, email, phone, passport number), edit existing passenger information, or remove passengers.',
  },
  {
    q: 'How do I search for a specific booking?',
    a: 'In the "Manage Booking" page, use the search bar at the top. You can search by booking reference number (e.g., KQ-BK1001) or by passenger name.',
  },
  {
    q: 'Where can I view reports?',
    a: 'The "Reports" page shows a summary of all bookings including total confirmed bookings, revenue, and a breakdown by class. You can also print the full ticket report.',
  },
  {
    q: 'What accessibility features are available?',
    a: 'The system is designed with HCI best practices: clear navigation, high contrast text, keyboard-accessible controls, readable fonts, and responsive layout for all screen sizes. All buttons have descriptive labels for screen readers.',
  },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <HelpCircle className="h-7 w-7 text-primary" /> Online Help
      </h1>
      <p className="text-muted-foreground mb-8">
        Learn how to use the Kenya Airways Online Booking System
      </p>

      {/* Step-by-step guide */}
      <div className="bg-card rounded-xl p-6 shadow-card mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Start Guide</h2>
        <ol className="space-y-3 text-sm">
          {[
            'Click "Book Flight" from the navigation menu',
            'Select your departure city, arrival city, and preferred class',
            'Click "Search Flights" to see available options',
            'Select a flight with available seats in your class',
            'Fill in passenger details (name, email, passport)',
            'Click "Confirm Booking" to complete your reservation',
            'View, edit, print, or cancel your booking from "Manage Booking"',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-card rounded-xl shadow-card overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-sm">{item.q}</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4 text-sm text-muted-foreground whitespace-pre-line">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
        <h3 className="font-bold mb-2">Need More Help?</h3>
        <p className="text-sm text-muted-foreground">
          Contact our 24/7 support team:<br />
          📞 +254 20 327 4747<br />
          ✉️ callcentre@kenya-airways.com
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
