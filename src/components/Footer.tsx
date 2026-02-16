import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-secondary text-secondary-foreground mt-auto">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Plane className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Kenya Airways</span>
          </div>
          <p className="text-sm text-muted-foreground">
            The Pride of Africa. Fly with us to over 50 destinations worldwide.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-1 text-sm">
            <Link to="/booking" className="hover:text-primary transition-colors">Book a Flight</Link>
            <Link to="/manage" className="hover:text-primary transition-colors">Manage Booking</Link>
            <Link to="/help" className="hover:text-primary transition-colors">Online Help</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">
            Call Centre: +254 20 327 4747<br />
            Email: callcentre@kenya-airways.com<br />
            JKIA, Nairobi, Kenya
          </p>
        </div>
      </div>
      <div className="border-t border-sidebar-border mt-8 pt-4 text-center text-xs text-muted-foreground">
        © 2026 Kenya Airways. All rights reserved. | Online Booking System
      </div>
    </div>
  </footer>
);

export default Footer;
