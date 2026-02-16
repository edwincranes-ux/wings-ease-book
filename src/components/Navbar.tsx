import { Link, useLocation } from 'react-router-dom';
import { Plane, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Book Flight', path: '/booking' },
  { label: 'Manage Booking', path: '/manage' },
  { label: 'Passengers', path: '/passengers' },
  { label: 'Reports', path: '/reports' },
  { label: 'Help', path: '/help' },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-secondary text-secondary-foreground shadow-elevated">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Plane className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">
            Kenya <span className="text-primary">Airways</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-sidebar-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-sidebar-border px-4 pb-4 bg-secondary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-sidebar-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
