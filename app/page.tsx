'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen gradient-background flex flex-col relative overflow-hidden">
      {/* Sparkle Effects */}
      <div className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-[30%] right-[20%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-[25%] left-[25%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-[35%] right-[15%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-[50%] left-[10%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[60%] right-[10%] w-1 h-1 rounded-full bg-primary opacity-0 animate-sparkle" style={{ animationDelay: '2.5s' }}></div>

      {/* Header */}
      <header className="p-8 lg:p-12 text-center relative z-10">
        <h1 className="text-4xl lg:text-6xl font-bold text-gold animate-logo-glow mb-3" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          EVOL JEWELS
        </h1>
        <p className="text-base lg:text-xl text-muted-foreground font-light tracking-wide">
          Luxury Redefined Through Innovation
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 relative z-10">
        {/* Mirror Container */}
        <div className="w-full max-w-2xl aspect-[4/3] bg-card border-[3px] border-border rounded-3xl relative overflow-hidden shadow-2xl mb-12 animate-mirror-float">
          <div className="w-full h-full bg-gradient-to-br from-gray-900/10 to-gray-900/20 flex items-center justify-center relative">
            <div className="w-4/5 h-4/5 bg-gradient-radial from-gray-800/20 to-gray-900/10 rounded-full flex items-center justify-center relative">
              {/* Camera Icon */}
              <svg
                className="w-16 h-16 text-primary opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  animation: 'spin 8s linear infinite',
                  transformOrigin: 'center'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Link href="/kiosk/photo" className="btn-luxury btn-gold text-xl lg:text-2xl px-12 py-6 animate-button-pulse">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          TAP TO START
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </Link>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 mt-12">
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>8-Second AI Processing</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span>High-Quality Try-On</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <span>Celebrity Style Matching</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Mobile Continuation</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-muted-foreground text-sm">
        <p>Experience luxury jewelry virtually • Powered by AI Technology</p>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}
