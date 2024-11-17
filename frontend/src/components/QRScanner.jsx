import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScan, type }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Create instance of scanner
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    // Start scanning
    scanner.render(
      (decodedText) => {
        // Success callback
        console.log('Scan result:', decodedText);
        onScan(decodedText);
        scanner.clear();
      },
      (errorMessage) => {
        // Error callback
        if (errorMessage?.includes('Camera access denied')) {
          setError('Please allow camera access to scan');
        }
      }
    );

    // Cleanup
    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="bg-dark-200 p-4 rounded-xl">
      <h3 className="text-white text-xl font-semibold mb-4">
        {type === 'cash' ? 'Scan Vendor QR Code' : 'Scan Check'}
      </h3>
      
      <div id="reader" className="max-w-sm mx-auto"></div>
      
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
      
      <p className="text-gray-400 text-sm mt-4">
        {type === 'cash' 
          ? 'Scan the QR code provided by the vendor to deposit cash'
          : 'Position the check within the frame to deposit'
        }
      </p>
    </div>
  );
}

export default QRScanner; 