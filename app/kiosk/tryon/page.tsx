'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TryOnResultsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const selectedJewelry = [
    { id: 1, name: "Diamond Studs", price: 299, material: "14K Gold", emoji: "💎" },
    { id: 7, name: "Pearl Strand", price: 799, material: "Sterling Silver", emoji: "🦪" },
    { id: 13, name: "Ruby Bangle", price: 599, material: "18K Gold", emoji: "🔴" }
  ];

  const total = selectedJewelry.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link href="/kiosk/jewelry" className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step 3 of 6</span>
          <button className="p-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
          <button className="p-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Results Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
          {/* Original Photo */}
          <div className="card-luxury">
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Original Photo
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-muted-foreground">Your Photo</p>
              </div>
            </div>
          </div>

          {/* AI Try-On Result */}
          <div className="card-luxury border-primary" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              AI Try-On Result
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center relative">
              {loading ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-primary">Processing...</p>
                  <p className="text-sm text-muted-foreground mt-2">AI is creating your personalized try-on</p>
                </div>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <p className="text-gold font-semibold">With Jewelry</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Zoom
          </button>
          <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Rotate
          </button>
          <button className="px-6 py-3 border-2 border-primary bg-primary/10 rounded-xl font-semibold text-primary transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Compare
          </button>
          <button className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Share
          </button>
        </div>

        {/* Jewelry Summary */}
        <div className="card-luxury max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Selected Jewelry
          </h2>
          <div className="space-y-3 mb-6">
            {selectedJewelry.map(item => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.material}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  ${item.price}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-6 border-t-2 border-border">
            <span className="text-xl font-semibold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Total
            </span>
            <span className="text-3xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              ${total}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/kiosk/jewelry" className="btn-luxury btn-silver text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Different
          </Link>
          <Link href="/kiosk/celebrity" className="btn-luxury btn-gold text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </Link>
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-12 text-center max-w-md">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-gold mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Processing Your Look
            </h3>
            <p className="text-muted-foreground">AI is creating your personalized try-on experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}
