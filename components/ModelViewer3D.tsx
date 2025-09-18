'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';

interface ModelViewer3DProps {
  modelUrl?: string;
  className?: string;
}

function ModelContent({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
}

function Model({ url }: { url: string }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [url]);

  if (hasError) {
    return (
      <Html center>
        <div className="text-red-500 p-4 bg-white rounded text-center max-w-sm">
          <div className="text-lg mb-2">⚠️</div>
          <div className="font-medium mb-2">Failed to load 3D model</div>
          <div className="text-xs text-gray-600 mb-3">
            Failed to load GLB file. Check if the URL is accessible and the file is a valid GLB format.
          </div>
          <div className="text-xs space-y-1">
            <div>• Check if URL is accessible</div>
            <div>• Ensure file is valid GLB format</div>
          </div>
          <div className="mt-3">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-xs"
            >
              Open GLB URL directly
            </a>
          </div>
        </div>
      </Html>
    );
  }

  return (
    <React.Suspense
      fallback={
        <Html center>
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="text-gray-600">Loading 3D model...</div>
          </div>
        </Html>
      }
    >
      <ModelContent url={url} />
    </React.Suspense>
  );
}

function LoadingSpinner() {
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="text-gray-600">Loading 3D model...</div>
      </div>
    </Html>
  );
}

export default function ModelViewer3D({ modelUrl, className = '' }: ModelViewer3DProps) {
  if (!modelUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 p-8">
          <div className="text-4xl mb-2">🔮</div>
          <p>3D model not available</p>
          <p className="text-sm">Enable 3D generation for immersive try-on</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />

        <Suspense fallback={<LoadingSpinner />}>
          <Model url={modelUrl} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={2}
          maxDistance={5}
          minDistance={1}
        />
      </Canvas>

      {/* Controls Info */}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}