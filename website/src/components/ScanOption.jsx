import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

function ScanOption({ onScanComplete }) {
  const [sessionId, setSessionId] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, waiting, complete

  const generateQRCode = () => {
    try {
      // For testing without a backend, generate a random session ID
      const tempSessionId = 'test-' + Math.random().toString(36).substring(2, 15);
      setSessionId(tempSessionId);
      
      // Generate mobile scanner URL with session ID
      const scanUrl = `https://nostalgai.vercel.app/mobile-scanner?sessionId=${tempSessionId}`;
      console.log('Generated QR code URL:', scanUrl);
      
      setQrCodeValue(scanUrl);
      setShowQRCode(true);
      setScanStatus('waiting');
    } catch (error) {
      console.error('Failed to create scan session:', error);
      alert('Failed to create scan session. Please try again.');
    }
  };

  // Just for testing - will be removed in production
  const simulateSuccessfulScan = () => {
    if (sessionId) {
      // Create a mock data object that matches what your server would send
      const mockData = {
        sessionId: sessionId,
        imageUrl: 'https://example.com/placeholder-image.jpg',
        timestamp: new Date().toISOString()
      };
      
      // Directly call the handler as if we received the socket event
      console.log('Simulating scan with data:', mockData);
      setScanStatus('complete');
      onScanComplete(mockData.imageUrl);
    } else {
      alert('No active session. Generate a QR code first.');
    }
  };

  return (
    <div className="text-center p-4 border rounded shadow-sm bg-white">
      <p className="mb-4">Use your mobile device to scan your physical photo.</p>
      
      <button
        onClick={generateQRCode}
        disabled={scanStatus === 'waiting'}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {scanStatus === 'waiting' ? 'Scan Waiting...' : 'Generate QR Code'}
      </button>
      
      {showQRCode && (
        <div className="mt-6 flex flex-col items-center">
          <div className="border p-4 inline-block bg-white">
            <QRCodeSVG value={qrCodeValue} size={200} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Scan this code with your mobile device
          </p>
          <p className="mt-1 text-xs text-gray-500">
            QR code URL: {qrCodeValue}
          </p>
          {scanStatus === 'waiting' && (
            <>
              <p className="mt-2 text-blue-600 animate-pulse">
                Waiting for scan...
              </p>
              <button 
                onClick={simulateSuccessfulScan}
                className="mt-4 text-xs bg-gray-200 px-3 py-1 rounded"
              >
                [TEST] Simulate successful scan
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanOption;