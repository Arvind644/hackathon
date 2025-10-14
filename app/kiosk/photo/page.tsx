'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useKioskJourney } from '@/components/KioskJourneyProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function PhotoCapturePage() {
  const router = useRouter();
  const { budget, setBudget, setFaceImage, clearSelection, setLastTryOn, hydrateComplete } = useKioskJourney();
  const [showTips, setShowTips] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hydrateComplete) {
      setLastTryOn(null);
    }
  }, [hydrateComplete, setLastTryOn]);

  // Start camera when component mounts
  useEffect(() => {
    setCameraActive(true);
  }, []);

  const handleCameraError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
    setCameraError('Unable to access camera. Please check permissions or use file upload.');
    setCameraActive(false);
    setCameraReady(false);
  }, []);

  const handleCameraReady = useCallback(() => {
    console.log('Camera stream ready');
    setCameraReady(true);
    setCameraError(null);
  }, []);

  const handleCapture = useCallback(() => {
    if (!webcamRef.current) {
      console.error('Webcam ref not available');
      setCameraError('Camera not initialized. Please try again.');
      return;
    }

    if (!cameraReady) {
      console.error('Camera not ready yet');
      setCameraError('Camera is still loading. Please wait a moment and try again.');
      return;
    }

    setIsCapturing(true);

    // Small delay to ensure video frame is ready
    setTimeout(() => {
      try {
        if (!webcamRef.current) {
          throw new Error('Webcam ref lost');
        }

        // Capture image from webcam
        const imageSrc = webcamRef.current.getScreenshot({
          width: 1280,
          height: 960,
        });

        if (!imageSrc) {
          console.error('Failed to capture image from webcam - getScreenshot returned null');
          setCameraError('Failed to capture photo. Please ensure your camera is working and try again.');
          setIsCapturing(false);
          return;
        }

        // Store the captured image
        clearSelection();
        setFaceImage(imageSrc);
        setCapturedImage(imageSrc);
        setCameraActive(false);

        // Navigate to next step after brief delay
        setTimeout(() => {
          router.push('/kiosk/jewelry');
        }, 800);
      } catch (error) {
        console.error('Capture error:', error);
        setCameraError('Failed to capture photo. Please try again.');
        setIsCapturing(false);
      }
    }, 100);
  }, [clearSelection, setFaceImage, router, cameraReady]);

  const handleRetake = useCallback(() => {
    setCapturedImage(null);
    setCameraActive(true);
    setCameraReady(false);
    setIsCapturing(false);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setCameraError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setCameraError('Image file is too large. Please select a file under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string | undefined;
      if (!dataUrl) {
        return;
      }
      clearSelection();
      setFaceImage(dataUrl);
      setCapturedImage(dataUrl);
      setCameraActive(false);
      setTimeout(() => {
        router.push('/kiosk/jewelry');
      }, 500);
    };
    reader.onerror = () => {
      console.error('Failed to read uploaded photo');
      setCameraError('Failed to read the uploaded file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen gradient-background flex flex-col">
      {/* Header */}
      <header className="p-4 lg:p-6 bg-card border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <h1 className="text-xl lg:text-2xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Step 1 of 6</span>
          <button onClick={() => setShowTips(true)} className="p-2 border-2 border-border rounded-lg hover:border-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 flex flex-col items-center gap-8">
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary shadow-lg" style={{ boxShadow: '0 0 10px oklch(0.75 0.15 85 / 0.5)' }}></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <div className="w-3 h-3 rounded-full bg-muted"></div>
        </div>

        {/* Camera Container */}
        <div className="w-full max-w-lg aspect-[4/3] bg-card border-[3px] border-border rounded-2xl relative overflow-hidden shadow-xl">
          {capturedImage ? (
            <div className="w-full h-full relative">
              <img src={capturedImage} alt="Captured photo" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center">
                <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-semibold text-success">Photo Captured!</p>
                  <p className="text-sm text-muted-foreground mt-2">Redirecting to jewelry selection...</p>
                </div>
              </div>
            </div>
          ) : cameraError ? (
            <div className="w-full h-full bg-gradient-to-br from-red-500/10 to-red-600/10 flex items-center justify-center p-6">
              <div className="text-center">
                <svg className="w-16 h-16 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-lg font-semibold text-destructive mb-2">Camera Error</p>
                <p className="text-sm text-muted-foreground mb-4">{cameraError}</p>
                <button
                  onClick={() => {
                    setCameraError(null);
                    setCameraActive(true);
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            <div className="w-full h-full relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.95}
                videoConstraints={{
                  width: 1280,
                  height: 960,
                  facingMode: 'user',
                }}
                onUserMedia={handleCameraReady}
                onUserMediaError={handleCameraError}
                className="w-full h-full object-cover"
              />

              {/* Face Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 border-2 border-primary rounded-[50%_50%_50%_50%/60%_60%_40%_40%] opacity-70" style={{ animation: 'pulse 2s infinite' }}></div>
              </div>

              {/* Camera Ready Indicator */}
              {cameraReady && (
                <div className="absolute top-4 right-4 bg-success text-success-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 bg-success-foreground rounded-full animate-pulse"></span>
                  Camera Ready
                </div>
              )}

              {/* Instructions Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-sm font-medium">Position your face within the oval guide</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900/10 to-gray-900/20 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-semibold">Starting Camera...</p>
                <p className="text-sm text-muted-foreground mt-2">Please allow camera access</p>
              </div>
            </div>
          )}
        </div>

        {/* Capture Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          {capturedImage ? (
            <>
              <button onClick={handleRetake} className="btn-luxury btn-silver text-base px-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake Photo
              </button>
              <button onClick={() => router.push('/kiosk/jewelry')} className="btn-luxury btn-gold text-base px-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                Continue
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCapture}
                className="btn-luxury btn-gold text-base px-6"
                disabled={!cameraReady || isCapturing}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                {isCapturing ? 'Capturing...' : cameraReady ? 'Take Photo' : 'Camera Loading...'}
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-luxury btn-silver text-base px-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload Photo
              </button>
              <button onClick={() => setShowTips(true)} className="px-6 py-3 border-2 border-border rounded-xl font-semibold hover:border-primary transition-all">
                <svg className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Tips
              </button>
            </>
          )}
        </div>

        {/* Error Alert */}
        {cameraError && !capturedImage && (
          <div className="w-full max-w-lg bg-destructive/10 border-2 border-destructive rounded-xl p-4 flex items-start gap-3">
            <svg className="w-6 h-6 text-destructive flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-semibold text-destructive">Camera Access Issue</p>
              <p className="text-sm text-muted-foreground mt-1">{cameraError}</p>
            </div>
            <button
              onClick={() => setCameraError(null)}
              className="ml-auto p-1 hover:bg-accent rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Budget Section */}
        <div className="w-full max-w-lg bg-card border-2 border-primary rounded-2xl p-6 shadow-lg" style={{ boxShadow: '0 0 20px oklch(0.75 0.15 85 / 0.3)' }}>
          <h3 className="text-lg font-semibold text-gold text-center mb-6" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Set Your Budget
          </h3>
          <div className="space-y-4">
            <input
              type="range"
              min="100"
              max="3000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">$100</span>
              <span className="text-xl font-bold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                ${budget}
              </span>
              <span className="text-muted-foreground">$3000+</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setBudget(500)} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${budget === 500 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>
                Under $500
              </button>
              <button onClick={() => setBudget(1000)} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${budget === 1000 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>
                Under $1000
              </button>
              <button onClick={() => setBudget(2000)} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${budget === 2000 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>
                Under $2000
              </button>
              <button onClick={() => setBudget(3000)} className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${budget === 3000 ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary'}`}>
                All Prices
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-center text-muted-foreground max-w-lg">
          Position your face within the guides for the best AI try-on results.
          Ensure good lighting and a clear view of your face and neck area.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </main>

      {/* Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowTips(false)}>
          <div className="bg-card rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gold" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                Photo Tips
              </h2>
              <button onClick={() => setShowTips(false)} className="p-2 hover:bg-accent rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { icon: '\u2600\uFE0F', text: 'Use good lighting - natural light or bright indoor lighting works best' },
                { icon: '\u{1F464}', text: 'Position your face within the oval guide for optimal jewelry placement' },
                { icon: '\u{1F441}\uFE0F', text: 'Look directly at the camera with a neutral expression' },
                { icon: '\u{1F4F7}', text: 'Keep your head straight and avoid tilting or turning' },
                { icon: '\u2705', text: 'Ensure your face and neck area are clearly visible' }
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg border border-border">
                  <span className="text-2xl">{tip.icon}</span>
                  <p className="text-sm">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}


