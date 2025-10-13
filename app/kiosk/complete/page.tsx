'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useKioskJourney } from '@/components/KioskJourneyProvider';

const SHIPPING_FEE = 25;

export default function CompletionPage() {
  const { selectedJewelry, clearSelection } = useKioskJourney();
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 2 + 2}s`
    }));
    setConfetti(confettiPieces);

    const timer = setTimeout(() => {
      if (confirm('Would you like to start a new jewelry try-on experience?')) {
        clearSelection();
        window.location.href = '/';
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [clearSelection]);

  const subtotal = useMemo(() => selectedJewelry.reduce((sum, item) => sum + (item.price ?? 0), 0), [selectedJewelry]);
  const total = subtotal + (selectedJewelry.length ? SHIPPING_FEE : 0);
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total);

  return (
    <div className="min-h-screen gradient-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: ['oklch(0.65 0.12 85)', 'oklch(0.60 0.02 240)', 'oklch(0.60 0.15 140)', 'oklch(0.65 0.12 85)'][Math.floor(Math.random() * 4)]
          }}
        />
      ))}

      <div className="mb-8 animate-success-bounce">
        <svg className="w-24 h-24 text-success mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="text-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-4xl lg:text-5xl font-bold text-gold mb-4 animate-pulse-glow" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Purchase Complete!
        </h1>
        <p className="text-xl text-muted-foreground">
          Thank you for choosing Evol Jewels
        </p>
      </div>

      <div className="card-luxury max-w-2xl w-full mb-8 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-2xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Order Summary
        </h2>
        <div className="space-y-3 mb-6">
          {selectedJewelry.map(item => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-input">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="font-medium block">{item.name}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{item.category}</span>
                </div>
              </div>
              <span className="text-gold font-semibold">${item.price ?? 0}</span>
            </div>
          ))}
          {selectedJewelry.length > 0 && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="font-medium">Shipping & Handling</span>
              <span className="text-gold font-semibold">${SHIPPING_FEE}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-6 border-t-2 border-primary">
          <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Total
          </span>
          <span className="text-3xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            {formattedTotal}
          </span>
        </div>
      </div>

      <div className="card-luxury max-w-2xl w-full mb-8 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <h2 className="text-2xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          What&apos;s Next??
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg border border-border">
            <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <h4 className="font-semibold mb-1">Order confirmation sent to your email</h4>
              <p className="text-sm text-muted-foreground">Check your inbox for order details and tracking information</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg border border-border">
            <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <div>
              <h4 className="font-semibold mb-1">Your jewelry will be crafted within 5-7 business days</h4>
              <p className="text-sm text-muted-foreground">Expert artisans will create your pieces with care</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg border border-border">
            <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <div>
              <h4 className="font-semibold mb-1">Free insured shipping with tracking updates</h4>
              <p className="text-sm text-muted-foreground">Your order will be securely packaged and delivered</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-accent/50 rounded-lg border border-border">
            <svg className="w-6 h-6 text-primary flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <div>
              <h4 className="font-semibold mb-1">30-day return policy for your peace of mind</h4>
              <p className="text-sm text-muted-foreground">Not satisfied? Return within 30 days for a full refund</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
        <Link href="/" className="btn-luxury btn-silver text-lg px-8">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another Look
        </Link>
        <button className="btn-luxury btn-gold text-lg px-8">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          View Order Details
        </button>
      </div>

      <p className="text-center text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
        We appreciate your trust in Evol Jewels. Your satisfaction is our priority, and we look forward to serving you again soon.
      </p>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes success-bounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 20px oklch(0.75 0.15 85 / 0.4); }
          50% { text-shadow: 0 0 30px oklch(0.75 0.15 85 / 0.6), 0 0 40px oklch(0.75 0.15 85 / 0.3); }
        }

        .animate-confetti-fall {
          animation: confetti-fall linear infinite;
        }

        .animate-success-bounce {
          animation: success-bounce 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
