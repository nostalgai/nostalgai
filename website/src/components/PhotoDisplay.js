import React from 'react';
import QRCodeGenerator from './QRCodeGenerator';

const PhotoDisplay = ({ photo }) => {
  return (
    <div className="photo-display">
      <img 
        src={photo.url} 
        alt={photo.description || 'Photo'} 
        className="photo-image"
      />
      
      <div className="photo-details">
        <h3>{photo.title}</h3>
        {photo.description && <p>{photo.description}</p>}
        
        {/* QR Code generator for this photo */}
        <QRCodeGenerator photoId={photo.id} />
      </div>
    </div>
  );
};

export default PhotoDisplay;
