'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';

type StyleTag = 'Bold' | 'Confident' | 'Elegant' | 'Modern';
type OccasionTag = 'Formal' | 'Party' | 'Casual' | 'Wedding';

interface Celebrity {
  id: string;
  name: string;
  image: string;
  gender: 'male' | 'female';
  styleMatch: number;
  description: string;
  styles: StyleTag[];
  occasions: OccasionTag[];
}

interface MatchedCelebrity extends Celebrity {
  matchPercentage: number;
  styleMatches: number;
  occasionMatches: number;
}

const CELEBRITIES: Celebrity[] = [
  {
    id: 'madhuridixit',
    name: 'Madhuri Dixit',
    image: '/celebrity/female/madhuridixit.jpg',
    gender: 'female',
    styleMatch: 95,
    description: 'Timeless elegance with traditional and modern fusion',
    styles: ['Elegant', 'Confident'],
    occasions: ['Formal', 'Wedding']
  },
  {
    id: 'ananyapandey',
    name: 'Ananya Pandey',
    image: '/celebrity/female/ananyapandey.jfif',
    gender: 'female',
    styleMatch: 90,
    description: 'Contemporary chic with minimalist sophistication',
    styles: ['Modern', 'Bold'],
    occasions: ['Party', 'Casual']
  },
  {
    id: 'apdhillon',
    name: 'AP Dhillon',
    image: '/celebrity/male/apdhillon.jpg',
    gender: 'male',
    styleMatch: 88,
    description: 'Urban cool with statement accessories',
    styles: ['Bold', 'Modern'],
    occasions: ['Party', 'Casual']
  },
  {
    id: 'badshah',
    name: 'Badshah',
    image: '/celebrity/male/badshah.png',
    gender: 'male',
    styleMatch: 92,
    description: 'Bold luxury with street-style edge',
    styles: ['Bold', 'Confident'],
    occasions: ['Party', 'Casual']
  }
];

const STYLE_TAGS: StyleTag[] = ['Bold', 'Confident', 'Elegant', 'Modern'];
const OCCASION_TAGS: OccasionTag[] = ['Formal', 'Party', 'Casual', 'Wedding'];

export default function CelebrityMatchingPage() {
  const router = useRouter();
  const { selectedJewelry, lastTryOn, hydrateComplete } = useKioskJourney();
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>(['Bold']);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionTag[]>(['Formal']);
  const [selectedCelebrity, setSelectedCelebrity] = useState<MatchedCelebrity | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }
    if (selectedJewelry.length === 0) {
      router.replace('/kiosk/jewelry');
    }
  }, [hydrateComplete, selectedJewelry, router]);

  // Match celebrities based on selected styles, occasions, and gender
  const matchedCelebrities = useMemo(() => {
    // Filter by gender first if user gender is set
    const genderFilteredCelebrities = userGender
      ? CELEBRITIES.filter(c => c.gender === userGender)
      : CELEBRITIES;

    return genderFilteredCelebrities.map(celebrity => {
      const styleMatches = selectedStyles.filter(style => celebrity.styles.includes(style)).length;
      const occasionMatches = selectedOccasions.filter(occ => celebrity.occasions.includes(occ)).length;
      const totalMatches = styleMatches + occasionMatches;
      const maxMatches = selectedStyles.length + selectedOccasions.length;

      // Calculate match percentage with 50% minimum
      const calculatedPercentage = maxMatches > 0 ? (totalMatches / maxMatches) * 100 : celebrity.styleMatch;
      const matchPercentage = Math.max(50, Math.round(calculatedPercentage));

      return {
        ...celebrity,
        matchPercentage,
        styleMatches,
        occasionMatches
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, [selectedStyles, selectedOccasions, userGender]);

  const topCelebrity = selectedCelebrity || matchedCelebrities[0];

  const totalSelectedValue = useMemo(() => selectedJewelry.reduce((sum, item) => sum + (item.price ?? 0), 0), [selectedJewelry]);
  const styleMatchScore = topCelebrity?.matchPercentage || (selectedJewelry.length ? Math.min(95, 70 + selectedJewelry.length * 5) : 0);

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

        {/* Gender Selection */}
        <div className="card-luxury max-w-md mx-auto w-full">
          <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Select Your Gender
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Choose your gender to see matching celebrity styles
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setUserGender('male')}
              className={`flex-1 px-6 py-4 border-2 rounded-xl font-semibold transition-all ${
                userGender === 'male'
                  ? 'bg-primary text-primary-foreground border-primary shadow-gold'
                  : 'border-border hover:border-primary'
              }`}
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Male
            </button>
            <button
              onClick={() => setUserGender('female')}
              className={`flex-1 px-6 py-4 border-2 rounded-xl font-semibold transition-all ${
                userGender === 'female'
                  ? 'bg-primary text-primary-foreground border-primary shadow-gold'
                  : 'border-border hover:border-primary'
              }`}
            >
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Female
            </button>
          </div>
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
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative">
              {topCelebrity ? (
                <>
                  <img src={topCelebrity.image} alt={topCelebrity.name} className="w-full h-full object-cover" />
                  {lastTryOn?.tryOnImage && (
                    <button
                      onClick={() => setShowComparison(true)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-all shadow-lg font-semibold text-sm"
                    >
                      Compare Looks
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p className="text-muted-foreground">Select style preferences to discover matching celebrities</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">{topCelebrity?.name ?? 'Awaiting Selection'}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {topCelebrity ? topCelebrity.description : 'Choose style preferences to unlock celebrity-inspired styling tips.'}
              </p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                <div className="h-full gradient-gold animate-shimmer relative" style={{ width: `${styleMatchScore}%` }}></div>
              </div>
              <p className="text-sm text-gold font-semibold">
                {styleMatchScore}% Style Match
              </p>
            </div>
          </div>
        </div>

        <div className="card-luxury max-w-5xl mx-auto w-full">
          <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            All Celebrity Matches
          </h2>
          {!userGender ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-lg font-semibold mb-2">Select Your Gender</p>
              <p className="text-sm text-muted-foreground">
                Please select your gender above to see celebrity matches
              </p>
            </div>
          ) : matchedCelebrities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No celebrities match your selected preferences</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {matchedCelebrities.map(celebrity => (
              <div
                key={celebrity.id}
                onClick={() => setSelectedCelebrity(celebrity)}
                className={`bg-accent/50 border-2 rounded-xl p-4 text-center cursor-pointer hover:shadow-gold transition-all ${
                  selectedCelebrity?.id === celebrity.id ? 'border-primary shadow-gold' : 'border-border hover:border-primary'
                }`}
              >
                <div className="w-full h-40 rounded-lg overflow-hidden mb-3 bg-input relative">
                  <img src={celebrity.image} alt={celebrity.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    {celebrity.matchPercentage}%
                  </div>
                </div>
                <h4 className="font-semibold mb-1">{celebrity.name}</h4>
                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {celebrity.styles.slice(0, 2).map(style => (
                    <span key={style} className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                      {style}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{celebrity.description}</p>
              </div>
            ))}
            </div>
          )}
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

      {/* Celebrity Comparison Modal */}
      {showComparison && topCelebrity && lastTryOn?.tryOnImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowComparison(false)}
        >
          <div className="relative max-w-6xl w-full">
            {/* Close Button */}
            <button
              onClick={() => setShowComparison(false)}
              className="absolute -top-2 -right-2 p-3 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all shadow-lg z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="card-luxury">
              <h2 className="text-2xl font-semibold text-gold text-center mb-8" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Style Comparison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Your Look */}
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Your Look</h3>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary shadow-lg">
                    <img src={lastTryOn.tryOnImage} alt="Your look" className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Selected Jewelry</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedJewelry.slice(0, 3).map(item => (
                        <span key={item.id} className="text-xs px-3 py-1 bg-accent border border-border rounded-full">
                          {item.name}
                        </span>
                      ))}
                      {selectedJewelry.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-accent border border-border rounded-full">
                          +{selectedJewelry.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Celebrity Look */}
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">{topCelebrity.name}</h3>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-gold shadow-lg">
                    <img src={topCelebrity.image} alt={topCelebrity.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Celebrity Style</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {topCelebrity.styles.map(style => (
                        <span key={style} className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Analysis */}
              <div className="bg-accent/50 border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <p className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      {styleMatchScore}%
                    </p>
                    <p className="text-sm text-muted-foreground">Style Match</p>
                  </div>
                  <div className="h-16 w-px bg-border mx-6"></div>
                  <div className="text-center flex-1">
                    <p className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      {topCelebrity.styleMatches + topCelebrity.occasionMatches}
                    </p>
                    <p className="text-sm text-muted-foreground">Common Preferences</p>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  {topCelebrity.description}
                </p>
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={() => setShowComparison(false)}
                  className="btn-luxury btn-silver px-6"
                >
                  Close
                </button>
                <Link
                  href="/kiosk/purchase"
                  className="btn-luxury btn-gold px-6"
                >
                  Continue to Purchase
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
