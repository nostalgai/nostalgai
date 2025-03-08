// This code can be used in a separate project for the mobile scanner
// MobileScanApp.jsx

import { useState, useRef, useEffect } from 'react';

function MobileScanApp() {
  const [sessionId, setSessionId] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get session ID from URL
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('sessionId');
    if (sid) {
      setSessionId(sid);
    }
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Could not access camera. Please check camera permissions.");
    }
  };

  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    // Adjust canvas to video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the image on canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get the image from canvas as blob
    canvas.toBlob(uploadImage, 'image/jpeg', 0.8);
  };

  const uploadImage = async (blob) => {
    if (!blob || !sessionId) return;
    
    setIsUploading(true);
    
    // Create FormData
    const formData = new FormData();
    formData.append('image', blob, 'scanned-photo.jpg');
    formData.append('sessionId', sessionId);
    
    try {
      // In a real application, this would be an API endpoint
      // const response = await fetch('https://yourapp.com/api/upload-scan', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulate for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("Scanned image uploaded, session:", sessionId);
      
      // Close camera
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      setIsCameraActive(false);
      setIsUploading(false);
      setScanComplete(true);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      alert("An error occurred during upload. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-center mb-4">Scan Photo</h1>
      
      {!sessionId ? (
        <div className="text-center p-4 bg-red-100 rounded-lg">
          <p>Invalid session. Please scan the QR code again.</p>
        </div>
      ) : !isCameraActive && !scanComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="mb-6 text-center">
            Place your physical photo on a flat surface and use your camera to scan it.
          </p>
          <button
            onClick={startCamera}
            className="py-3 px-6 bg-blue-600 text-white rounded-lg shadow"
          >
            Open Camera
          </button>
        </div>
      ) : isCameraActive ? (
        <div className="flex-1 flex flex-col">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-auto"
            />
            
            <div className="absolute inset-0 pointer-events-none border-2 border-white opacity-70">
              {/* Guide lines */}
              <div className="absolute top-1/3 w-full border-t border-white"></div>
              <div className="absolute bottom-1/3 w-full border-t border-white"></div>
              <div className="absolute left-1/3 h-full border-l border-white"></div>
              <div className="absolute right-1/3 h-full border-l border-white"></div>
            </div>
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="mt-auto flex justify-center">
            <button
              onClick={capturePhoto}
              disabled={isUploading}
              className={`rounded-full h-16 w-16 flex items-center justify-center ${
                isUploading ? 'bg-gray-400' : 'bg-white border-4 border-blue-600'
              }`}
            >
              {isUploading ? (
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>
      ) : scanComplete ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="bg-green-100 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Scan Complete!</h2>
            <p>Your photo has been successfully scanned and sent to the Nostalgia Digital app on your computer.</p>
          </div>
          <p>You can close this page now.</p>
        </div>
      ) : null}
    </div>
  );
}

export default MobileScanApp;