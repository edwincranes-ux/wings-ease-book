import { useBookingStore, CLASS_LABELS, CLASS_PRICES } from '@/store/bookingStore';
import { Printer, BarChart3 } from 'lucide-react';

const ReportsPage = () => {
  const { bookings } = useBookingStore();

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + CLASS_PRICES[b.flightClass], 0);

  const classCounts = { A: 0, B: 0, C: 0 };
  confirmedBookings.forEach((b) => { classCounts[b.flightClass]++; });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> Reports
        </h1>
        <button
          onClick={handlePrintReport}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90"
        >
          <Printer className="h-4 w-4" /> Print Report
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <p className="text-3xl font-extrabold text-primary">{confirmedBookings.length}</p>
          <p className="text-sm text-muted-foreground">Confirmed Bookings</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <p className="text-3xl font-extrabold text-kq-green">KES {totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>
        <div className="bg-card rounded-xl p-5 shadow-card text-center">
          <p className="text-3xl font-extrabold text-kq-gold">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">Total Bookings</p>
        </div>
      </div>

      {/* By class */}
      <div className="bg-card rounded-xl p-6 shadow-card mb-8">
        <h2 className="text-lg font-bold mb-4">Bookings by Class</h2>
        <div className="space-y-3">
          {(['A', 'B', 'C'] as const).map((cls) => (
            <div key={cls} className="flex items-center gap-3">
              <span className="text-sm font-medium w-32">{CLASS_LABELS[cls]}</span>
              <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${confirmedBookings.length ? (classCounts[cls] / confirmedBookings.length) * 100 : 0}%`, minWidth: classCounts[cls] > 0 ? '30px' : '0' }}
                >
                  <span className="text-xs text-primary-foreground font-bold">{classCounts[cls]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket report table */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h2 className="text-lg font-bold mb-4">Ticket Report</h2>
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No bookings to display.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 px-2 font-semibold">Ref</th>
                  <th className="py-2 px-2 font-semibold">Passenger</th>
                  <th className="py-2 px-2 font-semibold">Route</th>
                  <th className="py-2 px-2 font-semibold">Class</th>
                  <th className="py-2 px-2 font-semibold">Seat</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="py-2 px-2 font-mono text-xs">{b.id}</td>
                    <td className="py-2 px-2">{b.passenger.firstName} {b.passenger.lastName}</td>
                    <td className="py-2 px-2 text-xs">{b.from} → {b.to}</td>
                    <td className="py-2 px-2">{CLASS_LABELS[b.flightClass]}</td>
                    <td className="py-2 px-2">{b.seatNumber}</td>
                    <td className="py-2 px-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        b.status === 'confirmed' ? 'bg-kq-green/10 text-kq-green' : 'bg-destructive/10 text-destructive'
                      }`}>{b.status.toUpperCase()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
