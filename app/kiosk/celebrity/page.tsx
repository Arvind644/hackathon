'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const recommendations = [
  { id: 1, name: "Diamond Chandeliers", price: 599, material: "Platinum", emoji: "💎" },
  { id: 2, name: "Pearl Statement", price: 799, material: "Sterling Silver", emoji: "🦪" },
  { id: 3, name: "Emerald Cluster", price: 399, material: "Rose Gold", emoji: "💚" },
  { id: 4, name: "Sapphire Lariat", price: 899, material: "White Gold", emoji: "💙" }
];

export default function CelebrityMatchingPage() {
  const router = useRouter();
  const [selectedStyles, setSelectedStyles] = useState(['Bold']);
  const [selectedOccasions, setSelectedOccasions] = useState(['Formal']);

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]
    );
  };

  const toggleOccasion = (occasion: string) => {
    setSelectedOccasions(prev =>
      prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]
    );
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link href="/kiosk/tryon" className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step 4 of 6</span>
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Match Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
          {/* Your Look */}
          <div className="card-luxury">
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your Look
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-muted-foreground">Your Style</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Your Personal Style</h3>
              <p className="text-sm text-muted-foreground mb-3">AI Try-On Result</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full gradient-gold animate-shimmer relative" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-muted-foreground">85% Style Match</p>
            </div>
          </div>

          {/* Celebrity Match */}
          <div className="card-luxury border-primary" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Celebrity Match
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-gold font-semibold">Ranveer Singh</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Ranveer Singh</h3>
              <p className="text-sm text-muted-foreground mb-3">Bollywood Style Icon</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full gradient-gold animate-shimmer relative" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gold font-semibold">"Bold & Confident"</p>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            More Like This
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map(item => (
              <div
                key={item.id}
                className="bg-accent/50 border-2 border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary hover:shadow-gold transition-all hover:-translate-y-1"
              >
                <div className="text-5xl mb-3">{item.emoji}</div>
                <h4 className="font-semibold mb-1">{item.name}</h4>
                <p className="text-lg font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  ${item.price}
                </p>
                <p className="text-xs text-muted-foreground">{item.material}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Style Preferences */}
        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Style Preferences
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Style Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {['Bold', 'Confident', 'Elegant', 'Modern'].map(style => (
                  <button
                    key={style}
                    onClick={() => toggleStyle(style)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedStyles.includes(style)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Occasion</h3>
              <div className="flex flex-wrap gap-2">
                {['Formal', 'Party', 'Casual', 'Wedding'].map(occasion => (
                  <button
                    key={occasion}
                    onClick={() => toggleOccasion(occasion)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedOccasions.includes(occasion)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/kiosk/jewelry" className="btn-luxury btn-silver text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Explore More
          </Link>
          <Link href="/kiosk/purchase" className="btn-luxury btn-gold text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Continue to Purchase
          </Link>
        </div>
      </main>
    </div>
  );
}
