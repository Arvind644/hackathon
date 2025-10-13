'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PhotoCapturePage() {
  const router = useRouter();
  const [budget, setBudget] = useState(1000);
  const [showTips, setShowTips] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    // Simulate photo capture
    setTimeout(() => {
      router.push('/kiosk/jewelry');
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setTimeout(() => {
          router.push('/kiosk/jewelry');
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
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
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-600/20">
              <div className="text-center">
                <svg className="w-16 h-16 text-success mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-semibold text-success">Photo Captured!</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-900/10 to-gray-900/20 flex items-center justify-center relative cursor-pointer" onClick={handleCapture}>
              {/* Face Guide */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-60 border-2 border-primary rounded-[50%_50%_50%_50%/60%_60%_40%_40%] opacity-70" style={{ animation: 'pulse 2s infinite' }}></div>

              {/* Camera Overlay */}
              <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Capture Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={handleCapture} className="btn-luxury btn-gold text-base px-6">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            Take Photo
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
        </div>

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
                { icon: '☀️', text: 'Use good lighting - natural light or bright indoor lighting works best' },
                { icon: '👤', text: 'Position your face within the oval guide for optimal jewelry placement' },
                { icon: '👁️', text: 'Look directly at the camera with a neutral expression' },
                { icon: '📷', text: 'Keep your head straight and avoid tilting or turning' },
                { icon: '✅', text: 'Ensure your face and neck area are clearly visible' }
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
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
