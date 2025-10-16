'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';
import type { JewelryItem, VirtualTryOnResponse } from '@/lib/types';
import { jewelryCollection } from '@/lib/jewelry-data';

type TryOnStatus = 'idle' | 'cleaning' | 'loading' | 'success' | 'error' | 'missing-face';
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
  matchPercentage?: number;
  styleMatches?: number;
  occasionMatches?: number;
}

const CELEBRITIES: Celebrity[] = [
  // Female Celebrities
  {
    id: 'madhuridixit',
    name: 'Madhuri Dixit',
    image: '/celebrity/female/madhuridixit.jpg',
    gender: 'female',
    styleMatch: 95,
    description: 'Timeless elegance with traditional and modern fusion',
    styles: ['Elegant'],
    occasions: ['Formal', 'Wedding']
  },
  {
    id: 'ananyapandey',
    name: 'Ananya Pandey',
    image: '/celebrity/female/ananyapandey.jfif',
    gender: 'female',
    styleMatch: 90,
    description: 'Contemporary chic with minimalist sophistication',
    styles: ['Modern'],
    occasions: ['Party', 'Casual']
  },
  {
    id: 'diamirza',
    name: 'Dia Mirza',
    image: '/celebrity/female/diamirza.jfif',
    gender: 'female',
    styleMatch: 88,
    description: 'Bold and confident with statement pieces',
    styles: ['Bold'],
    occasions: ['Party', 'Formal']
  },
  {
    id: 'dishis',
    name: 'Disha Patani',
    image: '/celebrity/female/dishis.jpg',
    gender: 'female',
    styleMatch: 92,
    description: 'Confident and sophisticated style',
    styles: ['Confident'],
    occasions: ['Wedding', 'Formal']
  },
  // Male Celebrities
  {
    id: 'apdhillon',
    name: 'AP Dhillon',
    image: '/celebrity/male/apdhillon.jpg',
    gender: 'male',
    styleMatch: 88,
    description: 'Urban cool with statement accessories',
    styles: ['Modern'],
    occasions: ['Party', 'Casual']
  },
  {
    id: 'badshah',
    name: 'Badshah',
    image: '/celebrity/male/badshah.png',
    gender: 'male',
    styleMatch: 92,
    description: 'Bold luxury with street-style edge',
    styles: ['Bold'],
    occasions: ['Party', 'Casual']
  },
  {
    id: 'ranbeersingh',
    name: 'Ranveer Singh',
    image: '/celebrity/male/ranbeersingh.jpg',
    gender: 'male',
    styleMatch: 85,
    description: 'Elegant and refined with classic appeal',
    styles: ['Elegant'],
    occasions: ['Formal', 'Wedding']
  },
  {
    id: 'ranbirkapoor',
    name: 'Ranbir Kapoor',
    image: '/celebrity/male/ranbirkapoor.jfif',
    gender: 'male',
    styleMatch: 90,
    description: 'Confident and charismatic style',
    styles: ['Confident'],
    occasions: ['Formal', 'Party']
  }
];

const STYLE_TAGS: StyleTag[] = ['Bold', 'Confident', 'Elegant', 'Modern'];
const OCCASION_TAGS: OccasionTag[] = ['Formal', 'Party', 'Casual', 'Wedding'];

export default function TryOnResultsPage() {
  const router = useRouter();
  const {
    selectedJewelry,
    faceImage,
    sessionId,
    lastTryOn,
    setLastTryOn,
    toggleJewelry,
    recommendedJewelry,
    toggleRecommendedJewelry,
    savedLooks,
    addSavedLook,
    hydrateComplete,
  } = useKioskJourney();

  const [status, setStatus] = useState<TryOnStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [userGender, setUserGender] = useState<'male' | 'female' | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<StyleTag[]>(['Bold']);
  const [selectedOccasions, setSelectedOccasions] = useState<OccasionTag[]>(['Formal']);
  const [showComparison, setShowComparison] = useState(false);
  const lastSuccessfulSignature = useRef<string | null>(null);

  const baseSignature = useMemo(() => {
    if (!faceImage || selectedJewelry.length === 0) {
      return null;
    }
    const ids = selectedJewelry.map(item => item.id).sort().join('|');
    return `${ids}:${faceImage}`;
  }, [faceImage, selectedJewelry]);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }
    if (selectedJewelry.length === 0) {
      router.replace('/kiosk/jewelry');
    }
  }, [hydrateComplete, selectedJewelry, router]);

  useEffect(() => {
    if (!hydrateComplete) {
      return;
    }
    if (selectedJewelry.length === 0) {
      return;
    }
    if (!faceImage) {
      setStatus('missing-face');
      return;
    }

    if (refreshToken === 0 && lastSuccessfulSignature.current === baseSignature && lastTryOn) {
      setStatus('success');
      return;
    }

    const controller = new AbortController();
    setStatus('loading');
    setErrorMessage(null);

    const run = async () => {
      try {
        // Use only the last selected jewelry item for AI generation
        const lastJewelry = selectedJewelry[selectedJewelry.length - 1];

        // First, clean the image
        setStatus('cleaning');
        console.log('Starting image cleaning process...');

        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            faceImageUrl: faceImage,
            selectedJewelry: [lastJewelry], // Only send the last jewelry item
            generate3D: false,
            sessionId,
            skipCleaning: false, // Enable image cleaning
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let message = 'Virtual try-on failed';
          try {
            const errorBody = await response.json();
            if (errorBody?.error) {
              message = errorBody.error;
            }
          } catch {
            // ignore parse errors
          }
          throw new Error(message);
        }

        const data = (await response.json()) as VirtualTryOnResponse;
        lastSuccessfulSignature.current = baseSignature;
        setLastTryOn(data);
        setStatus('success');
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }
        console.error('Virtual try-on request failed', error);
        setStatus('error');
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Unable to complete try-on. Please try again.');
        }
      }
    };

    run();

    return () => {
      controller.abort();
    };
  }, [hydrateComplete, selectedJewelry, faceImage, sessionId, baseSignature, refreshToken, setLastTryOn, lastTryOn]);

  const total = useMemo(() => {
    return selectedJewelry.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }, [selectedJewelry]);

  // Match celebrities based on selected styles - one celebrity per style
  const matchedCelebrities = useMemo(() => {
    if (!userGender) return [];
    
    const genderFilteredCelebrities = CELEBRITIES.filter(c => c.gender === userGender);
    
    // For each selected style, find the celebrity that matches that style
    const styleMatches = selectedStyles.map(style => {
      const celebrity = genderFilteredCelebrities.find(c => c.styles.includes(style));
      return celebrity ? {
        ...celebrity,
        matchedStyle: style,
        matchPercentage: celebrity.styleMatch
      } : null;
    }).filter(Boolean);

    return styleMatches;
  }, [selectedStyles, userGender]);

  const topCelebrity = matchedCelebrities[0];

  // Jewelry recommendations - different for each style
  const jewelryRecommendations = useMemo(() => {
    if (selectedStyles.length === 0) return [];
    
    const selectedStyle = selectedStyles[0];
    
    // Map StyleTag to jewelry style
    const styleMapping: Record<StyleTag, string[]> = {
      'Bold': ['modern', 'vintage'], // Bold styles prefer modern and vintage jewelry
      'Confident': ['modern', 'classic'], // Confident styles prefer modern and classic jewelry
      'Elegant': ['classic', 'vintage'], // Elegant styles prefer classic and vintage jewelry
      'Modern': ['modern', 'classic'] // Modern styles prefer modern and classic jewelry
    };
    
    const preferredStyles = styleMapping[selectedStyle];
    
    // Filter jewelry by preferred styles
    const filteredJewelry = jewelryCollection.filter(item => 
      item.style && preferredStyles.includes(item.style)
    );
    
    // If we don't have enough items with preferred styles, fall back to all jewelry
    if (filteredJewelry.length < 4) {
      const necklaces = jewelryCollection.filter(item => item.category === 'necklace').slice(0, 2);
      const earrings = jewelryCollection.filter(item => item.category === 'earrings').slice(0, 2);
      return [...necklaces, ...earrings];
    }
    
    // Return 2 necklaces and 2 earrings from filtered jewelry
    const necklaces = filteredJewelry.filter(item => item.category === 'necklace').slice(0, 2);
    const earrings = filteredJewelry.filter(item => item.category === 'earrings').slice(0, 2);
    
    return [...necklaces, ...earrings];
  }, [selectedStyles]);

  const toggleStyle = (style: StyleTag) => {
    setSelectedStyles([style]); // Only allow one style at a time
  };

  const toggleOccasion = (occasion: OccasionTag) => {
    setSelectedOccasions(prev => (prev.includes(occasion) ? prev.filter(o => o !== occasion) : [...prev, occasion]));
  };

  const handleRetry = () => {
    setLastTryOn(null);
    setRefreshToken(token => token + 1);
  };

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showImageModal) setShowImageModal(false);
        if (showComparison) setShowComparison(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showImageModal, showComparison]);

  const currentResult = lastTryOn;

  const showMissingFaceNotice = status === 'missing-face';

  return (
    <div className="min-h-screen gradient-background flex flex-col">
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
          <span className="text-sm text-muted-foreground">Step 3 of 5</span>
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

      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Gender Selection
        <div className="card-luxury max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Select Your Gender
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setUserGender('female')}
              className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                userGender === 'female'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              Female
            </button>
            <button
              onClick={() => setUserGender('male')}
              className={`px-6 py-3 border-2 rounded-lg font-medium transition-all ${
                userGender === 'male'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary'
              }`}
            >
              Male
            </button>
          </div>
        </div> */}

        {showMissingFaceNotice && (
          <div className="card-luxury border-warning text-center max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold mb-2">Upload a Photo to Continue</h2>
            <p className="text-sm text-muted-foreground">
              We need a face photo to generate the AI try-on result. Please go back and capture or upload a photo before proceeding.
            </p>
            <Link href="/kiosk/photo" className="btn-luxury btn-gold mt-4 inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l-7-7 7-7" />
              </svg>
              Return to Photo Step
            </Link>
          </div>
        )}

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

        <div className={`grid grid-cols-1 ${status === 'success' && currentResult?.tryOnImage ? 'lg:grid-cols-2' : ''} gap-6 max-w-6xl mx-auto w-full`}>
          <div className="card-luxury border-primary" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Your AI Try-On Result
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
              {(status === 'idle' || status === 'loading' || status === 'cleaning') && (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">
                    {status === 'idle' ? 'Preparing...' : 
                     status === 'cleaning' ? 'Cleaning your photo...' : 
                     'Generating your look...'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {status === 'cleaning' ? 'Removing background and enhancing image...' : 
                     'This may take 10-30 seconds'}
                  </p>
                </div>
              )}
              {status === 'error' && (
                <div className="text-center px-6">
                  <svg className="w-16 h-16 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-destructive mb-2">Generation Failed</h3>
                  <p className="text-sm text-muted-foreground mb-4">{errorMessage || 'Unable to generate try-on result'}</p>
                  <button onClick={handleRetry} className="btn-luxury btn-gold inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              )}
              {status === 'success' && currentResult?.tryOnImage && (
                <>
                  <img src={currentResult.tryOnImage} alt="AI try-on preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setShowImageModal(true)}
                    className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm border-2 border-border rounded-lg hover:border-primary hover:bg-primary/10 transition-all shadow-lg group"
                    title="View fullscreen"
                  >
                    <svg className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </>
              )}
              {status === 'success' && !currentResult?.tryOnImage && (
                <div className="text-center px-6">
                  <svg className="w-16 h-16 text-warning mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Result Unavailable</h3>
                  <p className="text-sm text-muted-foreground mb-4">Generation completed but no image was received. Please try again.</p>
                  <button onClick={handleRetry} className="btn-luxury btn-gold inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Celebrity Match - Only show when AI image is generated */}
          {status === 'success' && currentResult?.tryOnImage && (
            <div className="card-luxury">
              <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Celebrity Match
              </h2>
              <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden relative">
                {topCelebrity && userGender ? (
                  <>
                    <img src={topCelebrity.image} alt={topCelebrity.name} className="w-full h-full object-contain" />
                    <button
                      onClick={() => setShowComparison(true)}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-all shadow-lg font-semibold text-sm"
                    >
                      Compare Looks
                    </button>
                  </>
                ) : (
                  <div className="text-center px-6">
                    <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <p className="text-muted-foreground">Select your gender above to see celebrity matches</p>
                  </div>
                )}
              </div>
              {topCelebrity && userGender && (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">{topCelebrity.description}</p>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                    <div className="h-full gradient-gold animate-shimmer relative" style={{ width: `${topCelebrity.matchPercentage}%` }}></div>
                  </div>
                  <p className="text-sm text-gold font-semibold">{topCelebrity.matchPercentage}% Style Match</p>
                </div>
              )}
            </div>
          )}
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

        {/* Jewelry Recommendations */}
        {selectedStyles.length > 0 && (
          <div className="card-luxury max-w-5xl mx-auto w-full">
            <h2 className="text-xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Recommended Jewelry for {selectedStyles[0]} Style
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jewelryRecommendations.map((item) => {
                const isSelected = recommendedJewelry.find(selected => selected.id === item.id);
                return (
                  <div 
                    key={item.id} 
                    className={`text-center cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => toggleRecommendedJewelry(item)}
                  >
                    <div className={`aspect-square bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl mb-3 overflow-hidden relative ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}>
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{item.description}</p>
                    <p className="text-sm font-semibold text-gold">${item.price}</p>
                    <button 
                      className={`mt-2 px-3 py-1 text-xs rounded-full transition-colors ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-border text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Jewelry - Hidden as requested */}
        {/* 
        <div className="card-luxury max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Selected Jewelry
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            AI try-on shows the last selected item. Click X to remove items you don&apos;t want to buy.
          </p>
          <div className="space-y-3 mb-6">
            {selectedJewelry.map((item: JewelryItem, index) => {
              const isLastItem = index === selectedJewelry.length - 1;
              return (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-lg border-2 transition-colors group relative ${
                isLastItem ? 'bg-primary/10 border-primary' : 'bg-accent/50 border-border hover:border-destructive'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-input">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                    ${item.price ?? 0}
                  </span>
                  <button
                    onClick={() => toggleJewelry(item)}
                    className="p-2 rounded-lg border-2 border-border hover:border-destructive hover:bg-destructive/10 transition-colors"
                    title="Remove from cart"
                  >
                    <svg className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {isLastItem && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">
                    In Try-On
                  </div>
                )}
              </div>
            );
            })}
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
        */}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/kiosk/jewelry" className="btn-luxury btn-silver text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Different Jewelry
          </Link>
          <button
            onClick={() => {
              if (recommendedJewelry.length > 0) {
                addSavedLook(recommendedJewelry);
                console.log('Look saved with recommended jewelry:', recommendedJewelry);
              } else {
                console.log('No recommended jewelry selected to save');
              }
            }}
            disabled={status === 'loading' || status === 'cleaning' || showMissingFaceNotice}
            className={`btn-luxury btn-gold text-lg px-8 ${status === 'loading' || status === 'cleaning' || showMissingFaceNotice ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={status === 'loading' || status === 'cleaning' || showMissingFaceNotice}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {status === 'loading' || status === 'cleaning' ? 'Processing...' : 'Save Look'}
          </button>
          <Link
            href="/kiosk/purchase"
            onClick={(event) => {
              if (status === 'loading' || status === 'cleaning' || showMissingFaceNotice) {
                event.preventDefault();
              }
            }}
            className={`btn-luxury btn-silver text-lg px-8 ${status === 'loading' || status === 'cleaning' || showMissingFaceNotice ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={status === 'loading' || status === 'cleaning' || showMissingFaceNotice}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Next Page
          </Link>
        </div>
      </main>

      {/* Fullscreen Image Modal */}
      {showImageModal && currentResult?.tryOnImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-3 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all shadow-lg z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Download Button */}
            <a
              href={currentResult.tryOnImage}
              download="evol-jewels-tryon.jpg"
              className="absolute top-4 left-4 p-3 bg-card/90 backdrop-blur-sm border-2 border-border rounded-full hover:border-primary hover:bg-primary/10 transition-all shadow-lg z-10"
              title="Download image"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>

            {/* Image */}
            <img
              src={currentResult.tryOnImage}
              alt="AI try-on result fullscreen"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm border-2 border-border rounded-xl px-6 py-3 shadow-lg">
              <p className="text-sm text-muted-foreground text-center">
                Click outside or press close to exit fullscreen
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Celebrity Comparison Modal */}
      {showComparison && topCelebrity && currentResult?.tryOnImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowComparison(false)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
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
                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">Your Look</h3>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-primary shadow-lg">
                    <img src={currentResult.tryOnImage} alt="Your look" className="w-full h-full object-cover" />
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

                <div>
                  <h3 className="text-lg font-semibold text-center mb-4">{topCelebrity.name}</h3>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-gold shadow-lg">
                    <img src={topCelebrity.image} alt={topCelebrity.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Celebrity Style</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full font-semibold">
                        {topCelebrity.matchedStyle}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/50 border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center flex-1">
                    <p className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      {topCelebrity.matchPercentage}%
                    </p>
                    <p className="text-sm text-muted-foreground">Style Match</p>
                  </div>
                  <div className="h-16 w-px bg-border mx-6"></div>
                  <div className="text-center flex-1">
                    <p className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                      1
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



