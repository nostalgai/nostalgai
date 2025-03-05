import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Nostalgia Digital
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enhance and digitize your old photos with AI technology
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <ImageUpload onUpload={handleImageUpload} />
          
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
  );
}

export default App;