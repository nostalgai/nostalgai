function ImagePreview({ originalImage, enhancedImage }) {
    return (
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Original Photo</h3>
            {originalImage && (
              <img
                src={originalImage}
                alt="Original"
                className="w-full rounded-lg shadow"
              />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Enhanced Photo</h3>
            {enhancedImage && (
              <img
                src={enhancedImage}
                alt="Enhanced"
                className="w-full rounded-lg shadow"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
  
  export default ImagePreview;