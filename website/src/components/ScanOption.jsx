import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Fixed import to use named export

function ScanOption({ onScanComplete }) {
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  
  const generateQRCode = () => {
    // Generate a unique session ID or use a timestamp
    const sessionId = `scan-session-${Date.now()}`;
    // This would typically be your application's URL plus the session ID
    const scanUrl = `https://your-app-url.com/scan/${sessionId}`;
    
    setQrCodeValue(scanUrl);
    setShowQRCode(true);
    
    // In a real implementation, you would set up a listener for when
    // the mobile device completes the scan and uploads an image
    // For now, we'll simulate this with a timeout
    
    // You might want to remove this simulation in production
    /* 
    setTimeout(() => {
      // Simulating receiving an image URL after scan
      const mockImageUrl = 'https://example.com/mock-scanned-image.jpg';
      onScanComplete(mockImageUrl);
    }, 5000);
    */
  };

  return (
    <div className="text-center">
      <p className="mb-4">Use your mobile device to scan a photo and enhance it instantly.</p>
      
      <button
        onClick={generateQRCode}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Generate QR Code
      </button>
      
      {showQRCode && (
        <div className="mt-6 flex flex-col items-center">
          <div className="border p-4 inline-block bg-white">
            <QRCodeSVG value={qrCodeValue} size={200} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Scan this code with your mobile device
          </p>
        </div>
      )}
    </div>
  );
}

export default ScanOption;