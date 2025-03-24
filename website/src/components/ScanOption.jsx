import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';

function ScanOption({ onScanComplete }) {
  const [sessionId, setSessionId] = useState('');
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [scanStatus, setScanStatus] = useState('idle'); // idle, waiting, complete
  
  useEffect(() => {
    if (!sessionId) return;
    
    // Connect to socket server
    const socket = io('http://localhost:3001');
    
    // Listen for scan completion
    socket.on(`scan:${sessionId}`, (data) => {
      console.log('Scan completed:', data);
      setScanStatus('complete');
      if (data.imageUrl) {
        onScanComplete(data.imageUrl);
      }
    });
    
    return () => {
      socket.disconnect();
    };
  }, [sessionId, onScanComplete]);
  
  const generateQRCode = async () => {
    try {
      // Create a new scan session
      const response = await fetch('http://localhost:3001/api/create-scan-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      const newSessionId = data.sessionId;
      setSessionId(newSessionId);
      
      // Generate mobile scanner URL with session ID
      const scanUrl = `${window.location.origin}/mobile-scanner?sessionId=${newSessionId}`;
      
      setQrCodeValue(scanUrl);
      setShowQRCode(true);
      setScanStatus('waiting');
    } catch (error) {
      console.error('Failed to create scan session:', error);
      alert('Tarama oturumu oluşturulamadı. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="text-center">
      <p className="mb-4">Fiziksel fotoğrafınızı taramak için mobil cihazınızı kullanın.</p>
      
      <button
        onClick={generateQRCode}
        disabled={scanStatus === 'waiting'}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {scanStatus === 'waiting' ? 'Tarama Bekleniyor...' : 'QR Kod Oluştur'}
      </button>
      
      {showQRCode && (
        <div className="mt-6 flex flex-col items-center">
          <div className="border p-4 inline-block bg-white">
            <QRCodeSVG value={qrCodeValue} size={200} />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Bu kodu mobil cihazınızla tarayın
          </p>
          {scanStatus === 'waiting' && (
            <p className="mt-2 text-blue-600 animate-pulse">
              Tarama bekleniyor...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default ScanOption;