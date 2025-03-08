import React from "react";
import React, { useState } from 'react';

const QRCodeGenerator = ({ photoId, baseUrl = window.location.origin }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQRCode = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create the URL for viewing this photo
      const photoUrl = `${baseUrl}/view-photo/${photoId}`;
      
      // Make request to our QR code server
      const response = await fetch(`http://localhost:3001/api/qrcode?url=${encodeURIComponent(photoUrl)}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate QR code');
      }
      
      const data = await response.json();
      setQrCode(data.qrcode);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-code-container">
      <button 
        onClick={generateQRCode} 
        disabled={loading}
        className="qr-code-button"
      >
        {loading ? 'Generating...' : 'Generate QR Code'}
      </button>
      
      {error && <p className="error-message">{error}</p>}
      
      {qrCode && (
        <div className="qr-code-display">
          <img src={qrCode} alt="QR Code for this photo" />
          <p>Scan this code to view the photo on your phone</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
