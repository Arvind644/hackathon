'use client';

import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { useDropzone } from 'react-dropzone';
import { ImageData } from '../lib/types';

interface ImageCaptureProps {
  onImageCapture: (imageData: ImageData) => void;
  onError: (error: string) => void;
}

export default function ImageCapture({ onImageCapture, onError }: ImageCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      onImageCapture({ dataUrl: imageSrc });
      setShowCamera(false);
    } else {
      onError('Failed to capture image');
    }
  }, [onImageCapture, onError]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        onImageCapture({ dataUrl, file });
      };
      reader.onerror = () => onError('Failed to read file');
      reader.readAsDataURL(file);
    }
  }, [onImageCapture, onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  const startCamera = () => {
    setShowCamera(true);
  };

  const retake = () => {
    setCapturedImage(null);
    setShowCamera(false);
  };

  if (capturedImage) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <img
            src={capturedImage}
            alt="Captured"
            className="max-w-md max-h-96 rounded-lg shadow-lg object-cover"
          />
        </div>
        <button
          onClick={retake}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Retake Photo
        </button>
      </div>
    );
  }

  if (showCamera) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="max-w-md rounded-lg shadow-lg"
            onUserMediaError={() => onError('Camera access denied or unavailable')}
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={capture}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            📸 Capture Photo
          </button>
          <button
            onClick={() => setShowCamera(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Upload Your Face Photo</h2>
      <p className="text-gray-600 text-center">Take or upload a clear photo of your face for virtual jewelry try-on</p>

      <button
        onClick={startCamera}
        className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
      >
        📷 Use Camera
      </button>

      <div className="w-full text-center text-gray-500">or</div>

      <div
        {...getRootProps()}
        className={`w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          {isDragActive ? (
            <p className="text-blue-600">Drop your image here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">Drag & drop an image here</p>
              <p className="text-sm text-gray-500">or click to select a file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}