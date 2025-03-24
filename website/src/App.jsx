import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import LoadingSpinner from './components/LoadingSpinner';
import ScanOption from './components/ScanOption';
import ErrorBoundary from './components/ErrorBoundary';
import { enhancementOptions } from './services/aiService';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMethod, setActiveMethod] = useState('upload'); // 'upload' or 'scan'
  const [selectedOptions, setSelectedOptions] = useState(['basic']);

  const handleImageUpload = async (file) => {
    setOriginalImage(URL.createObjectURL(file));
    setIsLoading(true);
    
    try {
      // Real API integration will be done here
      const formData = new FormData();
      formData.append('image', file);
      formData.append('options', JSON.stringify(selectedOptions));
      
      // Using setTimeout for simulation
      setTimeout(() => {
        setEnhancedImage(URL.createObjectURL(file));
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error("Enhancement error:", error);
      setIsLoading(false);
      alert("An error occurred while enhancing the photo. Please try again.");
    }
  };

  const handleScanComplete = (imageUrl) => {
    setOriginalImage(imageUrl);
    setIsLoading(true);
    
    // In the real application, there will be an API call
    setTimeout(() => {
      setEnhancedImage(imageUrl);
      setIsLoading(false);
    }, 2000);
  };

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center">NostalgAI</h1>
        <p className="text-center text-gray-600 mb-8">
          Digitize your old photos with AI and enhance their quality
        </p>
        
        <div className="max-w-4xl mx-auto">
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
            
            {/* AI enhancement options */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Enhancement Options:</h3>
              <div className="flex flex-wrap gap-2">
                {enhancementOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`px-3 py-1 rounded text-sm ${
                      selectedOptions.includes(option.id)
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}
                    title={option.description}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
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