'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';
import { jewelryCollection } from '@/lib/jewelry-data';
import type { JewelryItem } from '@/lib/types';

type StyleTag = 'Bold' | 'Confident' | 'Elegant' | 'Modern';
type OccasionTag = 'Formal' | 'Party' | 'Casual' | 'Wedding';

const STYLE_TAGS: StyleTag[] = ['Bold', 'Confident', 'Elegant', 'Modern'];
const OCCASION_TAGS: OccasionTag[] = ['Formal', 'Party', 'Casual', 'Wedding'];

export default function CelebrityMatchingPage() {
  const router = useRouter();
  const { selectedJewelry, lastTryOn, hydrateComplete } = useKioskJourney();
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>(['Bold']);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionTag[]>(['Formal']);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }
    if (selectedJewelry.length === 0) {
      router.replace('/kiosk/jewelry');
    }
  }, [hydrateComplete, selectedJewelry, router]);

  const selectedIds = useMemo(() => new Set(selectedJewelry.map(item => item.id)), [selectedJewelry]);
  const primaryCategory = (selectedJewelry[0]?.category ?? 'earrings') as JewelryItem['category'];

  const recommendations = useMemo<JewelryItem[]>(() => {
    const pool = jewelryCollection.filter(item => !selectedIds.has(item.id));
    if (pool.length === 0) {
      return [];
    }
    const prioritized = pool.filter(item => item.category === primaryCategory);
    const remainder = pool.filter(item => item.category !== primaryCategory);
    return [...prioritized, ...remainder].slice(0, 4);
  }, [primaryCategory, selectedIds]);

  const celebrityHighlight = recommendations[0] ?? selectedJewelry[0] ?? null;
  const totalSelectedValue = useMemo(() => selectedJewelry.reduce((sum, item) => sum + (item.price ?? 0), 0), [selectedJewelry]);
  const styleMatchScore = selectedJewelry.length ? Math.min(95, 70 + selectedJewelry.length * 5) : 0;

  const toggleStyle = (style: StyleTag) => {
    setSelectedStyles(prev => (prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]));
  };

  const toggleOccasion = (occasion: OccasionTag) => {
    setSelectedOccasions(prev => (prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]));
  };

  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalSelectedValue);

  return (
    <div className="min-h-screen gradient-background flex flex-col">
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

      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
          <div className="card-luxury">
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your Look
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
              {lastTryOn?.tryOnImage ? (
                <img src={lastTryOn.tryOnImage} alt="AI try-on result" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-muted-foreground">Run a try-on to preview your style</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Personalized Style Summary</h3>
              <p className="text-sm text-muted-foreground mb-3">{selectedJewelry.length} curated item{selectedJewelry.length === 1 ? '' : 's'}</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full gradient-gold animate-shimmer relative" style={{ width: `${styleMatchScore}%` }}></div>
              </div>
              <p className="text-sm text-muted-foreground">{styleMatchScore}% Celebrity Style Alignment</p>
              <p className="text-sm text-gold font-semibold mt-2">Cart Value: {formattedValue}</p>
            </div>
          </div>

          <div className="card-luxury border-primary" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Celebrity Match
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
              {celebrityHighlight ? (
                <img src={celebrityHighlight.imageUrl} alt={celebrityHighlight.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-muted-foreground">Add jewelry to discover matching icons</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{celebrityHighlight?.name ?? 'Awaiting Selection'}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {celebrityHighlight ? celebrityHighlight.description : 'Choose pieces to unlock celebrity-inspired styling tips.'}
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full gradient-gold animate-shimmer relative" style={{ width: `${styleMatchScore}%` }}></div>
              </div>
              <p className="text-sm text-gold font-semibold">
                {celebrityHighlight ? `Perfect for ${celebrityHighlight.category}` : 'Mix & match to personalize'}
              </p>
            </div>
          </div>
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Celebrity Picks for You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(recommendations.length ? recommendations : selectedJewelry).slice(0, 4).map(item => (
              <div key={item.id} className="bg-accent/50 border border-border rounded-xl p-4 text-center hover:border-primary hover:shadow-gold transition-all">
                <div className="w-full h-28 rounded-lg overflow-hidden mb-3 bg-input">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-semibold mb-1">{item.name}</h4>
                {typeof item.price === 'number' && (
                  <p className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    ${item.price}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            ))}
            {recommendations.length === 0 && selectedJewelry.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-6">
                Select jewelry to unlock personalized recommendations.
              </div>
            )}
          </div>
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Style Preferences
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Style Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {STYLE_TAGS.map(style => (
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
                {OCCASION_TAGS.map(occasion => (
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
