'use client';

import { useState } from 'react';
import { VirtualTryOnResponse, JewelryItem } from '@/lib/types';
import ModelViewer3D from './ModelViewer3D';

interface ResultDisplayProps {
  result: VirtualTryOnResponse | null;
  isLoading: boolean;
  error: string | null;
  selectedJewelry: JewelryItem[];
  onTryAgain: () => void;
}

export default function ResultDisplay({ result, isLoading, error, selectedJewelry, onTryAgain }: ResultDisplayProps) {
  const [view3D, setView3D] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <h3 className="text-xl font-semibold">Creating your virtual try-on...</h3>
        <p className="text-gray-600 text-center">
          Our AI is placing your selected jewelry on your photo with realistic positioning and lighting.
        </p>
        <div className="text-center text-sm text-gray-500">
          <p>Selected items: {selectedJewelry.map(item => item.name).join(', ')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h3 className="text-xl font-semibold text-red-600">Virtual Try-On Failed</h3>
        <p className="text-gray-600 text-center max-w-md">
          {error}
        </p>
        <button
          onClick={onTryAgain}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-2">✨ Your Virtual Try-On</h3>
        <p className="text-gray-600">
          Generated using {result.model_used}
          {result.processing_time > 0 && ` in ${(result.processing_time / 1000).toFixed(1)}s`}
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setView3D(false)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !view3D
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📸 2D Photo View
        </button>
        <button
          onClick={() => setView3D(true)}
          disabled={!result.threeDModel}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            view3D
              ? 'bg-blue-600 text-white'
              : result.threeDModel
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          🔮 3D Model View
        </button>
      </div>

      {/* Main Display */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Try-On Result */}
        <div className="lg:col-span-2">
          {!view3D ? (
            // 2D Photo View
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={result.tryOnImage}
                  alt="Virtual try-on result"
                  className="w-full max-h-[600px] object-contain rounded-lg shadow-xl"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                  Virtual Try-On Result
                </div>
              </div>
              <div className="text-center">
                <a
                  href={result.tryOnImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  📱 View Full Size
                </a>
              </div>
            </div>
          ) : (
            // 3D Model View
            <div className="h-[600px] relative">
              <ModelViewer3D modelUrl={result.threeDModel} className="w-full h-full" />
            </div>
          )}
        </div>

        {/* Selected Jewelry Info */}
        <div className="space-y-4">
          <h4 className="text-xl font-semibold">Selected Jewelry</h4>
          <div className="space-y-3">
            {selectedJewelry.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-start space-x-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-800">{item.name}</h5>
                    <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    {item.price && (
                      <p className="text-lg font-bold text-blue-600 mt-1">${item.price}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total Price */}
          {selectedJewelry.some(item => item.price) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Value:</span>
                <span className="text-xl font-bold text-blue-600">
                  ${selectedJewelry.reduce((total, item) => total + (item.price || 0), 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <button
          onClick={onTryAgain}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          🔄 Try Different Jewelry
        </button>
        <button
          onClick={() => window.open(result.tryOnImage, '_blank')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          💾 Save Result
        </button>
      </div>

      {/* Demo Notice */}
      {result.model_used === 'mock' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Demo Mode:</strong> This is a sample result. To get AI-generated virtual try-on,
            add your fal.ai API key to the environment variables.
          </p>
        </div>
      )}
    </div>
  );
}