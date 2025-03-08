import React from 'react';

function ImagePreview({ originalImage, enhancedImage }) {
  if (!originalImage && !enhancedImage) return null;
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {originalImage && (
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="font-medium">Original Image</h3>
            </div>
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-auto object-contain"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}
        
        {enhancedImage && (
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="p-3 bg-gray-50 border-b">
              <h3 className="font-medium">Enhanced Image</h3>
            </div>
            <img 
              src={enhancedImage} 
              alt="Enhanced" 
              className="w-full h-auto object-contain"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImagePreview;