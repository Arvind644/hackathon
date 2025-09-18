'use client';

import { useState } from 'react';
import ImageCapture from '../components/ImageCapture';
import JewelrySelector from '../components/JewelrySelector';
import ResultDisplay from '../components/ResultDisplay';
import { ImageData, JewelryItem, VirtualTryOnResponse } from '../lib/types';

type AppState = 'photo' | 'jewelry' | 'processing' | 'result';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('photo');
  const [capturedImage, setCapturedImage] = useState<ImageData | null>(null);
  const [selectedJewelry, setSelectedJewelry] = useState<JewelryItem[]>([]);
  const [result, setResult] = useState<VirtualTryOnResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enable3D, setEnable3D] = useState(false);

  const handleImageCapture = (imageData: ImageData) => {
    setCapturedImage(imageData);
    setAppState('jewelry');
    setResult(null);
    setError(null);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleJewelrySelection = async (jewelry: JewelryItem[]) => {
    setSelectedJewelry(jewelry);
    setAppState('processing');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faceImageUrl: capturedImage?.dataUrl,
          selectedJewelry: jewelry,
          generate3D: enable3D
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Virtual try-on failed');
      }

      const result = await response.json();
      setResult(result);
      setAppState('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setAppState('result');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setCapturedImage(null);
    setSelectedJewelry([]);
    setResult(null);
    setError(null);
    setAppState('photo');
  };

  const handleBackToPhoto = () => {
    setAppState('photo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Virtual Jewelry Try-On
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your face photo, select jewelry from our collection, and see yourself wearing it with AI magic
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-2 ${appState === 'photo' ? 'text-blue-600' : appState !== 'photo' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appState === 'photo' ? 'bg-blue-600 text-white' : appState !== 'photo' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                {appState !== 'photo' ? '✓' : '1'}
              </div>
              <span className="font-medium">Upload Photo</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${appState !== 'photo' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${appState === 'jewelry' ? 'text-blue-600' : ['processing', 'result'].includes(appState) ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appState === 'jewelry' ? 'bg-blue-600 text-white' : ['processing', 'result'].includes(appState) ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                {['processing', 'result'].includes(appState) ? '✓' : '2'}
              </div>
              <span className="font-medium">Select Jewelry</span>
            </div>
            <div className={`flex-1 h-1 mx-4 ${['processing', 'result'].includes(appState) ? 'bg-green-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center space-x-2 ${['processing', 'result'].includes(appState) ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${appState === 'result' ? 'bg-green-600 text-white' : appState === 'processing' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {appState === 'result' ? '✓' : '3'}
              </div>
              <span className="font-medium">Try On</span>
            </div>
          </div>
        </div>

        {/* 3D Toggle */}
        <div className="max-w-md mx-auto mb-8">
          <label className="flex items-center justify-center space-x-3 bg-white rounded-lg p-4 shadow-sm">
            <input
              type="checkbox"
              checked={enable3D}
              onChange={(e) => setEnable3D(e.target.checked)}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700">Enable 3D Model Generation (slower but more immersive)</span>
          </label>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {appState === 'photo' && (
            <ImageCapture
              onImageCapture={handleImageCapture}
              onError={handleError}
            />
          )}

          {appState === 'jewelry' && (
            <JewelrySelector
              onSelectionComplete={handleJewelrySelection}
              onBack={handleBackToPhoto}
            />
          )}

          {(appState === 'processing' || appState === 'result') && (
            <ResultDisplay
              result={result}
              isLoading={isLoading}
              error={error}
              selectedJewelry={selectedJewelry}
              onTryAgain={handleTryAgain}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 text-gray-500">
          <p>Powered by fal.ai FLUX + Trellis 3D • Built for Evol Jewels Hackathon</p>
        </footer>
      </div>
    </div>
  );
}
