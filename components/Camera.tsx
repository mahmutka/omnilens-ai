import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { CameraHandle } from '../types';

interface CameraProps {
  onCameraReady?: () => void;
}

const Camera = forwardRef<CameraHandle, CameraProps>(({ onCameraReady }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!videoRef.current || !canvasRef.current) return null;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // OPTIMIZATION: Resize image to reduce Token Usage and Cost
      // Gemini doesn't need 4K images. 800px is sufficient for high accuracy.
      const MAX_WIDTH = 800;
      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
      
      const targetWidth = video.videoWidth * scale;
      const targetHeight = video.videoHeight * scale;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      // Draw resized image
      ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
      
      // Compress slightly (0.7 quality is good enough for AI)
      return canvas.toDataURL('image/jpeg', 0.7);
    }
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (onCameraReady) onCameraReady();
          };
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-900 text-white p-6 text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      {/* Overlay gradient for better text readability at top */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
    </div>
  );
});

export default Camera;