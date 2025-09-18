'use client';

import React, { useState, useEffect } from 'react';
import ModelViewer3D from './ModelViewer3D';

interface SavedTryOn {
  id: string;
  createdAt: string;
  faceImageUrl: string;
  tryOnImageUrl: string;
  threeDModelUrl?: string;
  jewelryItems: { id?: string; name: string; category: string; description: string }[];
  modelUsed: string;
  processingTime: number;
}

interface TryOnGalleryProps {
  sessionId?: string;
}

export default function TryOnGallery({ sessionId }: TryOnGalleryProps) {
  const [tryOns, setTryOns] = useState<SavedTryOn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTryOn, setSelectedTryOn] = useState<SavedTryOn | null>(null);

  useEffect(() => {
    fetchTryOns();
  }, [sessionId]);

  const fetchTryOns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sessionId) params.append('sessionId', sessionId);
      params.append('limit', '20');

      const response = await fetch(`/api/tryons?${params}`);

      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Database not set up yet. Please run: npx prisma generate && npx prisma db push');
      }

      const data = await response.json();

      if (data.success) {
        setTryOns(data.data);
      } else {
        setError(data.error || 'Failed to fetch try-ons');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch try-ons';
      setError(errorMessage);
      console.error('Fetch try-ons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTryOn = async (id: string) => {
    try {
      const response = await fetch(`/api/tryons?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        setTryOns(tryOns.filter(t => t.id !== id));
        if (selectedTryOn?.id === id) {
          setSelectedTryOn(null);
        }
      } else {
        alert(data.error || 'Failed to delete try-on');
      }
    } catch (err) {
      alert('Failed to delete try-on');
      console.error('Delete try-on error:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Try-Ons</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Try-Ons</h2>
        <div className="text-center text-red-600 py-8">
          <p>{error}</p>
          <button
            onClick={fetchTryOns}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Saved Try-Ons ({tryOns.length})</h2>
        <button
          onClick={fetchTryOns}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
        >
          Refresh
        </button>
      </div>

      {tryOns.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-2">💎</div>
          <p>No saved try-ons yet</p>
          <p className="text-sm">Generate some virtual try-ons to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tryOns.map((tryOn) => (
            <div
              key={tryOn.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedTryOn(selectedTryOn?.id === tryOn.id ? null : tryOn)}
            >
              <div className="flex items-center space-x-4">
                <img
                  src={tryOn.tryOnImageUrl}
                  alt="Try-on result"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {new Date(tryOn.createdAt).toLocaleDateString()} at{' '}
                    {new Date(tryOn.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Array.isArray(tryOn.jewelryItems) && tryOn.jewelryItems.length > 0
                      ? tryOn.jewelryItems.map(j => j.name).join(', ')
                      : 'Unknown jewelry'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Model: {tryOn.modelUsed} • {tryOn.processingTime}ms
                    {tryOn.threeDModelUrl && ' • 3D Available'}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(tryOn.tryOnImageUrl, '_blank');
                    }}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    View
                  </button>
                  {tryOn.threeDModelUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/viewer?url=${encodeURIComponent(tryOn.threeDModelUrl || '')}`, '_blank');
                      }}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded hover:bg-purple-200"
                    >
                      3D
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this try-on?')) {
                        deleteTryOn(tryOn.id);
                      }
                    }}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {selectedTryOn?.id === tryOn.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Try-On Result</h4>
                      <img
                        src={tryOn.tryOnImageUrl}
                        alt="Try-on result"
                        className="w-full rounded-lg"
                      />
                    </div>
                    {tryOn.threeDModelUrl && (
                      <div>
                        <h4 className="font-medium mb-2">3D Model</h4>
                        <div className="h-64">
                          <ModelViewer3D modelUrl={tryOn.threeDModelUrl} className="w-full h-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}