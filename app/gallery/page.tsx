'use client';

import Link from 'next/link';
import TryOnGallery from '@/components/TryOnGallery';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Try-On Gallery</h1>
          <p className="text-gray-600">View all your saved virtual try-on results</p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              ← Back to Try-On
            </Link>
            <Link
              href="/viewer"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔮 3D Viewer
            </Link>
          </div>
        </div>

        <TryOnGallery />
      </div>
    </div>
  );
}