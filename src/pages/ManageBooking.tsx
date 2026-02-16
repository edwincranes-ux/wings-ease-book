import { useState } from 'react';
import { Search, Edit, Trash2, Printer, Eye } from 'lucide-react';
import { useBookingStore, CLASS_LABELS, CLASS_PRICES, FlightClass } from '@/store/bookingStore';
import { toast } from 'sonner';

const ManageBooking = () => {
  const { bookings, updateBooking, deleteBooking } = useBookingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editClass, setEditClass] = useState<FlightClass>('C');
  const [viewId, setViewId] = useState<string | null>(null);

  const filtered = bookings.filter(
    (b) =>
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passenger.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.passenger.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteBooking(id);
    toast.success('Booking deleted successfully');
  };

  const handleUpdate = (id: string) => {
    updateBooking(id, { flightClass: editClass });
    setEditingId(null);
    toast.success('Booking updated successfully');
  };

  const handlePrint = (id: string) => {
    const booking = bookings.find((b) => b.id === id);
    if (!booking) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Ticket - ${booking.id}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:auto}
      h1{color:#b91c1c}table{width:100%;border-collapse:collapse;margin-top:20px}
      td{padding:8px;border-bottom:1px solid #eee}td:first-child{font-weight:bold;width:40%}</style></head>
      <body><h1>Kenya Airways — E-Ticket</h1>
      <table>
      <tr><td>Booking Ref</td><td>${booking.id}</td></tr>
      <tr><td>Passenger</td><td>${booking.passenger.firstName} ${booking.passenger.lastName}</td></tr>
      <tr><td>Passport</td><td>${booking.passenger.passport}</td></tr>
      <tr><td>Route</td><td>${booking.from} → ${booking.to}</td></tr>
      <tr><td>Date & Time</td><td>${booking.date} at ${booking.time}</td></tr>
      <tr><td>Class</td><td>${CLASS_LABELS[booking.flightClass]}</td></tr>
      <tr><td>Seat</td><td>${booking.seatNumber}</td></tr>
      <tr><td>Price</td><td>KES ${CLASS_PRICES[booking.flightClass].toLocaleString()}</td></tr>
      <tr><td>Status</td><td>${booking.status.toUpperCase()}</td></tr>
      </table>
      <p style="margin-top:30px;font-size:12px;color:#888">This is your electronic ticket. Please present it at check-in.</p>
      </body></html>
    `);
    w.document.close();
    w.print();
  };

  const viewedBooking = viewId ? bookings.find((b) => b.id === viewId) : null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by booking reference or passenger name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground"
          maxLength={100}
        />
      </div>

      {bookings.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center text-muted-foreground shadow-card">
          <p className="text-lg font-medium">No bookings yet</p>
          <p className="text-sm">Start by booking a flight from the Book Flight page.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center text-muted-foreground">No bookings match your search.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="bg-card rounded-xl p-5 shadow-card border border-transparent hover:border-primary/20 transition-colors">
              {editingId === b.id ? (
                <div className="space-y-3">
                  <p className="font-bold">{b.id} — Change Class</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['A', 'B', 'C'] as const).map((cls) => (
                      <button
                        key={cls}
                        onClick={() => setEditClass(cls)}
                        className={`border rounded-lg py-2 text-sm font-medium ${editClass === cls ? 'border-primary bg-primary/10 text-primary' : 'border-input'}`}
                      >
                        {CLASS_LABELS[cls]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(b.id)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                    <button onClick={() => setEditingId(null)} className="bg-muted px-4 py-2 rounded-lg text-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold">{b.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.passenger.firstName} {b.passenger.lastName} — {b.from} → {b.to}
                    </p>
                    <p className="text-xs text-muted-foreground">{b.date} at {b.time} | {CLASS_LABELS[b.flightClass]} | Seat {b.seatNumber}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                      b.status === 'confirmed' ? 'bg-kq-green/10 text-kq-green' : b.status === 'cancelled' ? 'bg-destructive/10 text-destructive' : 'bg-accent/20 text-accent-foreground'
                    }`}>
                      {b.status.toUpperCase()}
                    </span>
                    <button onClick={() => setViewId(b.id)} className="p-2 hover:bg-muted rounded-lg" title="View details"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => { setEditingId(b.id); setEditClass(b.flightClass); }} className="p-2 hover:bg-muted rounded-lg" title="Edit"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handlePrint(b.id)} className="p-2 hover:bg-muted rounded-lg" title="Print ticket"><Printer className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewedBooking && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setViewId(null)}>
          <div className="bg-card rounded-xl p-6 shadow-elevated max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Reference', viewedBooking.id],
                  ['Passenger', `${viewedBooking.passenger.firstName} ${viewedBooking.passenger.lastName}`],
                  ['Email', viewedBooking.passenger.email],
                  ['Passport', viewedBooking.passenger.passport],
                  ['Route', `${viewedBooking.from} → ${viewedBooking.to}`],
                  ['Date', `${viewedBooking.date} at ${viewedBooking.time}`],
                  ['Class', CLASS_LABELS[viewedBooking.flightClass]],
                  ['Seat', viewedBooking.seatNumber],
                  ['Price', `KES ${CLASS_PRICES[viewedBooking.flightClass].toLocaleString()}`],
                  ['Status', viewedBooking.status.toUpperCase()],
                ].map(([k, v]) => (
                  <tr key={k} className="border-b border-border">
                    <td className="py-2 font-medium text-muted-foreground">{k}</td>
                    <td className="py-2">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => setViewId(null)} className="mt-4 w-full bg-muted py-2 rounded-lg text-sm font-medium">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooking;
