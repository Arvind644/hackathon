'use client';

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';

function ModelContent({ url }: { url: string }) {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
}

function ModelPreview({ url }: { url: string }) {
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

export default function ViewerPage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.toLowerCase().endsWith('.glb')) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb']
    },
    multiple: false
  });

  const handleUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;
    if (url) {
      setModelUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">3D Model Viewer</h1>
          <p className="text-gray-600">Upload a GLB file or paste a URL to view 3D models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Upload GLB File</h2>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <input {...getInputProps()} />
                <div className="text-4xl mb-2">📁</div>
                {isDragActive ? (
                  <p className="text-blue-600">Drop the GLB file here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop a GLB file here, or click to select
                    </p>
                    <p className="text-sm text-gray-400">Supports .glb files only</p>
                  </div>
                )}
              </div>
            </div>

            {/* URL Input */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Load from URL</h2>
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <input
                  type="url"
                  name="url"
                  placeholder="https://example.com/model.glb"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Load Model
                </button>
              </form>
            </div>

            {/* Sample Models */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sample Models</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setModelUrl('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf')}
                  className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Damaged Helmet
                </button>
                <button
                  onClick={() => setModelUrl('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf')}
                  className="w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Duck
                </button>
              </div>
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 h-[600px]">
              <h2 className="text-xl font-semibold mb-4">3D Preview</h2>
              <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                {modelUrl ? (
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

                    <React.Suspense fallback={<LoadingSpinner />}>
                      <ModelPreview url={modelUrl} />
                    </React.Suspense>

                    <OrbitControls
                      enableZoom={true}
                      enablePan={true}
                      enableRotate={true}
                      autoRotate={true}
                      autoRotateSpeed={2}
                      maxDistance={10}
                      minDistance={0.5}
                    />
                  </Canvas>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-gray-500">
                    <div>
                      <div className="text-6xl mb-4">🔮</div>
                      <p className="text-lg">No model loaded</p>
                      <p className="text-sm">Upload a GLB file or paste a URL to start</p>
                    </div>
                  </div>
                )}

                {/* Controls Info */}
                {modelUrl && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Drag to rotate • Scroll to zoom • Right-click to pan
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}