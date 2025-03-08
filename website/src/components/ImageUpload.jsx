import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUpload({ onUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  return (
    <div 
      {...getRootProps()} 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Drop the image here...</p>
      ) : (
        <div>
          <p className="text-gray-500">Drag and drop an image here, or click to select a file</p>
          <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, PNG</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;