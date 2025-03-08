import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import LoadingSpinner from './components/LoadingSpinner';
import ScanOption from './components/ScanOption';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState('upload'); // 'upload' or 'scan'

  const handleImageUpload = async (file) => {
    setOriginalImage(URL.createObjectURL(file));
    setIsLoading(true);
    
    // Real AI API integration will be implemented here
    // For now, we're simulating the process
    setTimeout(() => {
      setEnhancedImage(URL.createObjectURL(file));
      setIsLoading(false);
    }, 2000);
  };

  const handleScanComplete = (imageUrl) => {
    console.log("Scan completed:", imageUrl);
    setOriginalImage(imageUrl);
    setIsLoading(true);
    
    // In a real application, this would be an API call
    setTimeout(() => {
      setEnhancedImage(imageUrl);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">NostalgAI</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 mb-8">
            Enhance and digitize your old photos with AI technology
          </p>
          
          <div className="bg-white rounded-lg shadow p-6">
            {/* Method selection */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveMethod('upload')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeMethod === 'upload' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveMethod('scan')}
                className={`flex-1 py-2 px-4 rounded-md ${
                  activeMethod === 'scan' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                Scan Photo
              </button>
            </div>
            
            {activeMethod === 'upload' && (
              <ImageUpload onUpload={handleImageUpload} />
            )}
            
            {activeMethod === 'scan' && (
              <ScanOption onScanComplete={handleScanComplete} />
            )}
            
            {isLoading && (
              <div className="mt-6">
                <LoadingSpinner />
              </div>
            )}

            {(originalImage || enhancedImage) && (
              <ImagePreview 
                originalImage={originalImage}
                enhancedImage={enhancedImage}
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;