'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const savedLooks = [
  { id: 1, name: "Elegant Evening", price: 498, emoji: "✨" },
  { id: 2, name: "Classic Pearl", price: 299, emoji: "💎" },
  { id: 3, name: "Celebrity Style", price: 799, emoji: "⭐" },
  { id: 4, name: "Romantic Gold", price: 399, emoji: "💛" }
];

export default function PurchaseJourneyPage() {
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const handlePurchaseNow = () => {
    router.push('/kiosk/complete');
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link href="/kiosk/celebrity" className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step 5 of 6</span>
          <button className="px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Gallery
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Saved Looks Section */}
        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Your Saved Looks
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {savedLooks.map(look => (
              <div
                key={look.id}
                className="bg-accent/50 border-2 border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 relative"
              >
                <div className="absolute top-2 right-2 w-6 h-6 bg-success text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <div className="w-full h-32 bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-lg flex items-center justify-center text-4xl mb-3">
                  {look.emoji}
                </div>
                <h4 className="font-semibold mb-1">{look.name}</h4>
                <p className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  ${look.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Journey Options */}
        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Continue Your Journey
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mobile Continue */}
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Mobile Continue
              </h3>
              <p className="text-muted-foreground mb-6">
                Scan the QR code to continue your shopping experience on your mobile device
              </p>
              <button
                onClick={() => setShowQR(true)}
                className="btn-luxury btn-gold w-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan QR Code
              </button>
            </div>

            {/* Purchase Now */}
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Purchase Now
              </h3>
              <p className="text-muted-foreground mb-6">
                Complete your purchase directly at the kiosk with our secure payment system
              </p>
              <button
                onClick={handlePurchaseNow}
                className="btn-luxury btn-gold w-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Buy Now
              </button>
            </div>

            {/* Email Results */}
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Email Results
              </h3>
              <p className="text-muted-foreground mb-6">
                Send your saved looks and selections to your email for later review
              </p>
              <button
                onClick={() => setShowEmail(true)}
                className="btn-luxury btn-gold w-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Email
              </button>
            </div>

            {/* Share */}
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Share with Friends
              </h3>
              <p className="text-muted-foreground mb-6">
                Share your favorite looks with friends and family via social media
              </p>
              <button className="btn-luxury btn-gold w-full">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Share Now
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div className="card-luxury max-w-md mx-auto w-full text-center">
            <h3 className="text-xl font-semibold text-gold mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Mobile Continuation
            </h3>
            <div className="w-48 h-48 bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl mx-auto mb-6 flex items-center justify-center">
              <svg className="w-24 h-24 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <p className="text-muted-foreground mb-4">
              Scan this QR code with your mobile device to continue your jewelry shopping experience.
              Your saved looks and preferences will be synced automatically.
            </p>
            <button onClick={() => setShowQR(false)} className="px-6 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
              Close
            </button>
          </div>
        )}

        {/* Thank You Section */}
        <div className="card-luxury max-w-3xl mx-auto w-full text-center">
          <h2 className="text-3xl font-bold text-gold mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Thank You for Visiting Evol Jewels!
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We hope you enjoyed your AI-powered jewelry try-on experience.
            Your personalized looks have been saved and you can continue shopping anytime.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Follow Us
            </button>
            <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Newsletter
            </button>
            <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Visit Store
            </button>
          </div>
        </div>
      </main>

      {/* Email Modal */}
      {showEmail && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowEmail(false)}>
          <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-semibold text-gold mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Email Your Results
            </h3>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowEmail(false)} className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:border-primary transition-colors">
                Cancel
              </button>
              <button className="flex-1 btn-luxury btn-gold">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
