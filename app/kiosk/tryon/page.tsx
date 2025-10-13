'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useKioskJourney } from '@/components/KioskJourneyProvider';
import type { JewelryItem, VirtualTryOnResponse } from '@/lib/types';

type TryOnStatus = 'idle' | 'loading' | 'success' | 'error' | 'missing-face';

export default function TryOnResultsPage() {
  const router = useRouter();
  const {
    selectedJewelry,
    faceImage,
    sessionId,
    lastTryOn,
    setLastTryOn,
    hydrateComplete,
  } = useKioskJourney();

  const [status, setStatus] = useState<TryOnStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState(0);
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
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            faceImageUrl: faceImage,
            selectedJewelry,
            generate3D: false,
            sessionId,
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

  const handleRetry = () => {
    setLastTryOn(null);
    setRefreshToken(token => token + 1);
  };

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

      <main className="flex-1 p-6 lg:p-12 flex flex-col gap-6">
        <div className="flex items-center gap-2 justify-center">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
          <div className="card-luxury">
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Original Photo
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center overflow-hidden">
              {faceImage ? (
                <img src={faceImage} alt="Uploaded face" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-muted-foreground">Awaiting photo</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-luxury border-primary" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
            <h2 className="text-lg font-semibold text-gold text-center mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              AI Try-On Result
            </h2>
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-gray-900/10 to-gray-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
              {status === 'loading' && (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Generating your look...</p>
                </div>
              )}
              {status === 'error' && (
                <div className="text-center px-6">
                  <h3 className="text-lg font-semibold text-warning mb-2">We hit a snag</h3>
                  <p className="text-sm text-muted-foreground mb-4">{errorMessage}</p>
                  <button onClick={handleRetry} className="btn-luxury btn-gold inline-flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                </div>
              )}
              {status === 'success' && currentResult?.tryOnImage && (
                <img src={currentResult.tryOnImage} alt="AI try-on preview" className="w-full h-full object-cover" />
              )}
              {status === 'success' && !currentResult?.tryOnImage && (
                <div className="text-center px-6">
                  <h3 className="text-lg font-semibold mb-2">Result unavailable</h3>
                  <p className="text-sm text-muted-foreground">We generated your look but did not receive an image. Please retry.</p>
                  <button onClick={handleRetry} className="btn-luxury btn-gold inline-flex items-center gap-2 mt-4">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card-luxury max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Selected Jewelry
          </h2>
          <div className="space-y-3 mb-6">
            {selectedJewelry.map((item: JewelryItem) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-input">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <span className="text-lg font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  ${item.price ?? 0}
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

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/kiosk/jewelry" className="btn-luxury btn-silver text-lg px-8">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Different
          </Link>
          <Link
            href="/kiosk/celebrity"
            onClick={(event) => {
              if (status === 'loading' || showMissingFaceNotice) {
                event.preventDefault();
              }
            }}
            className={`btn-luxury btn-gold text-lg px-8 ${status === 'loading' || showMissingFaceNotice ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-disabled={status === 'loading' || showMissingFaceNotice}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {status === 'loading' ? 'Generating...' : 'Add to Cart'}
          </Link>
        </div>
      </main>
    </div>
  );
}



