import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// Demo QR code mapping
const DEMO_QR_CODES = {
  'VENDOR20': 20.00,
  'VENDOR50': 50.00,
  'VENDOR100': 100.00,
  'VENDOR200': 200.00
};

function QRScanner({ onScan, type }) {
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scanner.render(
      (decodedText) => {
        // Debug logging
        setDebugInfo(`Scanned: ${decodedText}`);
        console.log('Raw scan:', decodedText);
        
        // Try to get the content
        let cleanCode;
        try {
          // First, try to fetch as URL content
          const url = new URL(decodedText);
          cleanCode = url.pathname.split('/').pop() || decodedText;
        } catch {
          // If not a URL, use as is
          cleanCode = decodedText;
        }
        
        // Clean the code
        cleanCode = cleanCode.trim().toUpperCase();
        console.log('Processed code:', cleanCode);
        setDebugInfo(prev => `${prev}\nProcessed: ${cleanCode}`);

        const amount = DEMO_QR_CODES[cleanCode];

        if (amount) {
          onScan({
            code: cleanCode,
            amount: amount
          });
          scanner.clear();
        } else {
          setError(`Invalid code: ${cleanCode}`);
          setTimeout(() => setError(null), 3000);
        }
      },
      (errorMessage) => {
        if (errorMessage?.includes('Camera access denied')) {
          setError('Please allow camera access to scan');
        }
      }
    );

    return () => {
      scanner.clear();
    };
  }, [onScan]);

  return (
    <div className="bg-dark-200 p-4 rounded-xl">
      <h3 className="text-white text-xl font-semibold mb-4">
        {type === 'cash' ? 'Scan Money Order' : 'Scan Check'}
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

      {/* Debug info */}
      <div className="mt-4 p-2 bg-dark-300 rounded text-xs text-gray-400">
        <p>Debug Info:</p>
        <pre>{debugInfo}</pre>
        <p>Valid codes:</p>
        {Object.entries(DEMO_QR_CODES).map(([code, amount]) => (
          <p key={code}>{code}: ${amount}</p>
        ))}
      </div>
    </div>
  );
}

export default QRScanner; 