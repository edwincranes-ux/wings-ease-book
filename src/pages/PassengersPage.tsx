import { useState } from 'react';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { useBookingStore, generatePassengerId } from '@/store/bookingStore';
import { toast } from 'sonner';

const PassengersPage = () => {
  const { passengers, addPassenger, updatePassenger, deletePassenger } = useBookingStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', passport: '' });

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', phone: '', passport: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim() || !form.passport.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    if (editingId) {
      updatePassenger(editingId, form);
      toast.success('Passenger updated');
    } else {
      addPassenger({ id: generatePassengerId(), ...form });
      toast.success('Passenger added');
    }
    resetForm();
  };

  const startEdit = (id: string) => {
    const p = passengers.find((px) => px.id === id);
    if (!p) return;
    setForm({ firstName: p.firstName, lastName: p.lastName, email: p.email, phone: p.phone, passport: p.passport });
    setEditingId(id);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Passengers</h1>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <UserPlus className="h-4 w-4" /> Add Passenger
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <h2 className="text-lg font-bold">{editingId ? 'Edit' : 'Add'} Passenger</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'First Name *', key: 'firstName' as const },
              { label: 'Last Name *', key: 'lastName' as const },
              { label: 'Email', key: 'email' as const },
              { label: 'Phone', key: 'phone' as const },
              { label: 'Passport No. *', key: 'passport' as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <input
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full border border-input rounded-lg px-3 py-2 bg-background text-foreground"
                  maxLength={100}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold">
              {editingId ? 'Update' : 'Add'}
            </button>
            <button onClick={resetForm} className="bg-muted px-5 py-2 rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      {passengers.length === 0 ? (
        <div className="bg-card rounded-xl p-12 text-center text-muted-foreground shadow-card">
          <p className="text-lg font-medium">No passengers registered</p>
          <p className="text-sm">Add passengers or book a flight to register them automatically.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {passengers.map((p) => (
            <div key={p.id} className="bg-card rounded-xl p-4 shadow-card flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.firstName} {p.lastName}</p>
                <p className="text-xs text-muted-foreground">{p.passport} | {p.email || 'No email'}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(p.id)} className="p-2 hover:bg-muted rounded-lg"><Edit className="h-4 w-4" /></button>
                <button onClick={() => { deletePassenger(p.id); toast.success('Passenger deleted'); }} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PassengersPage;
