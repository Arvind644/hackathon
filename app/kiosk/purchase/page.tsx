'use client';
/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';
import { jewelryCollection } from '@/lib/jewelry-data';

const SHIPPING_FEE = 25;

export default function PurchaseJourneyPage() {
  const router = useRouter();
  const { selectedJewelry, hydrateComplete, lastTryOn, sessionId, faceImage } = useKioskJourney();
  const [showQR, setShowQR] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }
    if (selectedJewelry.length === 0) {
      router.replace('/kiosk/jewelry');
    }
  }, [hydrateComplete, selectedJewelry, router]);

  const subtotal = useMemo(
    () => selectedJewelry.reduce((sum, item) => sum + (item.price ?? 0), 0),
    [selectedJewelry]
  );
  const shipping = selectedJewelry.length ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(subtotal);
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(total);

  const handlePurchaseNow = () => {
    router.push('/kiosk/complete');
  };

  const handleOpenEmailModal = () => {
    setEmailAddress('');
    setEmailStatus('idle');
    setEmailError(null);
    setShowEmail(true);
  };

  const handleCloseEmailModal = () => {
    setShowEmail(false);
    setEmailStatus('idle');
    setEmailError(null);
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedJewelry.length) {
      setEmailError('Select jewelry before emailing your cart.');
      return;
    }

    const trimmed = emailAddress.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setEmailStatus('sending');
    setEmailError(null);

    try {
      const response = await fetch('/api/order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          subtotal,
          shipping,
          total,
          selectedJewelry,
          tryOnImage: lastTryOn?.tryOnImage,
          faceImage,
          sessionId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to send email');
      }

      setEmailStatus('success');
      setTimeout(() => {
        handleCloseEmailModal();
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send email';
      setEmailStatus('error');
      setEmailError(message);
    }
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link
          href="/kiosk/celebrity"
          className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1
          className="text-xl lg:text-2xl font-semibold text-gold"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
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

      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2
            className="text-2xl font-semibold text-gold text-center mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Your Saved Looks
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(selectedJewelry.length ? selectedJewelry : jewelryCollection.slice(0, 4)).map((item) => (
              <div
                key={item.id}
                className="bg-accent/50 border-2 border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 relative"
              >
                <div className="w-full h-32 bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-lg flex items-center justify-center overflow-hidden mb-3">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold mb-1">{item.name}</h4>
                {typeof item.price === 'number' && (
                  <p
                    className="text-lg font-bold text-gold"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    ${item.price}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2
            className="text-2xl font-semibold text-gold text-center mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Continue Your Journey
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Save to Mobile</h3>
              <p className="text-sm text-muted-foreground mb-6">Continue browsing on your phone with synced cart and try-on history.</p>
              <button onClick={() => setShowQR(true)} className="btn-luxury btn-gold inline-flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />
                </svg>
                Generate QR
              </button>
            </div>
            <div className="bg-accent/50 border-2 border-border rounded-xl p-8 text-center hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
              <div className="absolute inset-0 gradient-gold opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <svg className="w-16 h-16 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
              </svg>
              <h3 className="text-xl font-semibold mb-2">Email My Lookbook</h3>
              <p className="text-sm text-muted-foreground mb-6">Receive links to your try-on results and selected pieces.</p>
              <button
                onClick={handleOpenEmailModal}
                className="btn-luxury btn-gold inline-flex items-center gap-2"
                disabled={!selectedJewelry.length}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8" />
                </svg>
                Share via Email
              </button>
            </div>
          </div>
        </div>

        <div className="card-luxury max-w-3xl mx-auto w-full">
          <h2
            className="text-xl font-semibold text-gold text-center mb-6"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Checkout Summary
          </h2>
          <div className="space-y-3 mb-6">
            {selectedJewelry.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-input">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.category}</p>
                  </div>
                </div>
                <span
                  className="text-lg font-bold text-gold"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  ${item.price ?? 0}
                </span>
              </div>
            ))}
            {selectedJewelry.length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                Add jewelry to your cart to see pricing details.
              </div>
            )}
          </div>
          {selectedJewelry.length > 0 && (
            <div className="space-y-2 border-t-2 border-border pt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formattedSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>${SHIPPING_FEE}</span>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  Total Due Today
                </span>
                <span className="text-3xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {formattedTotal}
                </span>
              </div>
              <button onClick={handlePurchaseNow} className="btn-luxury btn-gold w-full mt-4 text-lg">
                Complete Purchase
              </button>
            </div>
          )}
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2
            className="text-2xl font-semibold text-gold text-center mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Share or Download
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <button className="bg-accent/50 border-2 border-border rounded-xl p-6 text-left hover:border-primary transition-colors">
              <svg className="w-6 h-6 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-5l-2-2h-5a2 2 0 00-2 2z" />
              </svg>
              <h4 className="font-semibold mb-1">Download Lookbook</h4>
              <p className="text-sm text-muted-foreground">Save a branded PDF with your selected pieces and pricing summary.</p>
            </button>
            <button className="bg-accent/50 border-2 border-border rounded-xl p-6 text-left hover:border-primary transition-colors">
              <svg className="w-6 h-6 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <h4 className="font-semibold mb-1">Reserve In Store</h4>
              <p className="text-sm text-muted-foreground">Book a showroom appointment with this cart reserved for 24 hours.</p>
            </button>
            <button className="bg-accent/50 border-2 border-border rounded-xl p-6 text-left hover:border-primary transition-colors">
              <svg className="w-6 h-6 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m2-2l1.586-1.586a2 2 0 012.828 0L22 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="font-semibold mb-1">Share to Social</h4>
              <p className="text-sm text-muted-foreground">Generate a story-ready collage with your AI try-on and cart picks.</p>
            </button>
          </div>
        </div>

        {showQR && (
          <div className="card-luxury max-w-md mx-auto w-full text-center">
            <h3
              className="text-xl font-semibold text-gold mb-6"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
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

        {showEmail && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={handleCloseEmailModal}>
            <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h3
                className="text-2xl font-semibold text-gold mb-6"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Email Your Results
              </h3>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(event) => setEmailAddress(event.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border-2 border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                {emailStatus === 'success' && !emailError && <p className="text-sm text-green-500">Email sent! Check your inbox for your curated look.</p>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseEmailModal}
                    className="flex-1 px-6 py-3 border-2 border-border rounded-lg hover:border-primary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={emailStatus === 'sending' || !selectedJewelry.length}
                    className={`flex-1 btn-luxury btn-gold ${emailStatus === 'sending' || !selectedJewelry.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {emailStatus === 'sending' ? 'Sending...' : emailStatus === 'success' ? 'Sent!' : 'Send'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
