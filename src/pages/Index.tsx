import { Link } from 'react-router-dom';
import { Plane, Shield, Clock, Users } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';
import { CLASS_LABELS, CLASS_PRICES } from '@/store/bookingStore';

const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center overflow-hidden">
        <img
          src={heroBanner}
          alt="Kenya Airways aircraft over African savanna"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/60 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-xl animate-fade-in">
            <p className="text-kq-gold font-semibold text-sm tracking-widest uppercase mb-2">
              The Pride of Africa
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-4">
              Fly Kenya <span className="text-primary">Airways</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Book your next journey across Africa and beyond. Executive, Business, and Economy class tickets available online.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-glow"
              >
                <Plane className="h-5 w-5" /> Book a Flight
              </Link>
              <Link
                to="/manage"
                className="inline-flex items-center gap-2 bg-card/10 backdrop-blur border border-primary-foreground/20 text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-card/20 transition-colors"
              >
                Manage Booking
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Classes */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">Choose Your Class</h2>
          <p className="text-muted-foreground text-center mb-10">Three tiers of comfort for every traveller</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['A', 'B', 'C'] as const).map((cls, i) => (
              <div
                key={cls}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-elevated ${
                  cls === 'A' ? 'border-kq-gold bg-gradient-to-b from-card to-accent/5' : 'bg-card'
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {cls === 'A' && (
                  <span className="inline-block bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded mb-3">
                    PREMIUM
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">Class {cls} — {CLASS_LABELS[cls]}</h3>
                <p className="text-2xl font-extrabold text-primary mb-3">
                  KES {CLASS_PRICES[cls].toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground"> /one-way</span>
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 mb-5">
                  {cls === 'A' && (
                    <>
                      <li>✓ Lie-flat seats, priority boarding</li>
                      <li>✓ Gourmet dining & lounge access</li>
                      <li>✓ 12 seats per flight</li>
                    </>
                  )}
                  {cls === 'B' && (
                    <>
                      <li>✓ Extra legroom, recline seats</li>
                      <li>✓ Premium meals & amenity kit</li>
                      <li>✓ 30 seats per flight</li>
                    </>
                  )}
                  {cls === 'C' && (
                    <>
                      <li>✓ Comfortable seating</li>
                      <li>✓ Complimentary meals</li>
                      <li>✓ 120 seats per flight</li>
                    </>
                  )}
                </ul>
                <Link
                  to="/booking"
                  className="block text-center bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Plane, title: '50+ Destinations', desc: 'Fly across Africa, Europe, Asia & beyond' },
              { icon: Shield, title: 'Secure Booking', desc: 'Safe and encrypted online transactions' },
              { icon: Clock, title: '24/7 Support', desc: 'Round-the-clock assistance for travellers' },
              { icon: Users, title: 'Easy Management', desc: 'Add, change or cancel bookings online' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 bg-card rounded-lg p-5 shadow-card">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{title}</h4>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
