import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function CheckScanner({ onScan, type }) {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState("select");
  const [capturedImage, setCapturedImage] = useState(null);
  const [amount, setAmount] = useState(null);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [documentType, setDocumentType] = useState(type);
  const [serialNumber, setSerialNumber] = useState('');

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setStep("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image capture from camera
  const handleCapture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setStep("preview");
      }
    }
  }, [webcamRef]);

  // Handle image processing
  const handleProcess = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('image', blob, 'check.jpg');
      formData.append('type', documentType);

      // First, check for duplicates
      const result = await fetch(`${process.env.REACT_APP_API_URL}/api/check-duplicate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(errorData.error || 'Failed to check for duplicates');
      }

      const duplicateCheck = await result.json();
      
      if (duplicateCheck.isDuplicate) {
        throw new Error(`This ${documentType} has already been deposited on ${new Date(duplicateCheck.originalDate).toLocaleDateString()} for $${duplicateCheck.amount.toFixed(2)}`);
      }

      // If not duplicate, proceed with OCR scanning
      const scanResult = await fetch(`${process.env.REACT_APP_API_URL}/api/scan-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData
      });

      const data = await scanResult.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setConfidenceScore(data.confidenceScore);

      if (!data.isValid) {
        setError(`Check validation failed (Confidence: ${data.confidenceScore.toFixed(1)}%). Please try again.`);
        setStep('select');
        return;
      }

      const detectedAmount = findAmount(data.text) || 0;
      setAmount(detectedAmount);
      setStep('confirm');
      
    } catch (err) {
      console.error('Processing error:', err);
      setError(err.message || 'Failed to process check. Please try again.');
      setStep('select');
    } finally {
      setProcessing(false);
    }
  };

  // Handle amount confirmation
  const handleConfirm = () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    onScan({
      amount: parseFloat(amount),
      image: capturedImage,
      confidence: confidenceScore,
      isValid,
    });

    // Reset the scanner after successful scan
    setMode(null);
    setStep("select");
    setCapturedImage(null);
    setAmount(null);
    setConfidenceScore(null);
    setIsValid(false);
    setManualOverride(false);
    setError(null);
  };

  // Helper function to find amount in text
  const findAmount = (text) => {
    const patterns = [
      /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/, // e.g., $1,234.56
      /(?:Amount|Payee|Pay to the order of)[^\$]*\$?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i, // e.g., Payee: $123.45
      /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*dollars/i, // e.g., 123.45 dollars
      /amount\s*[:\-]?\s*\$?(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i, // e.g., Amount: $123.45
    ];

    for (let pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return parseFloat(match[1].replace(/,/g, ""));
      }
    }
    return null;
  };

  // Camera component
  const CameraComponent = () => {
    const handleUserMediaError = useCallback((err) => {
      console.error("Camera Error:", err);
      setError("Camera access denied. Please check your camera permissions.");
      setStep("select");
    }, []);

    return (
      <div className="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 720,
            height: 480,
            facingMode: "environment", // Use the environment (rear) camera if available
          }}
          className="w-full rounded-lg"
          onUserMediaError={handleUserMediaError}
        />

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode(null);
              setStep("select");
            }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
          <button
            onClick={handleCapture}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Capture
          </button>
        </div>
      </div>
    );
  };

  // Handle scan success
  const onSuccess = (data) => {
    onScan({
      amount: parseFloat(amount),
      image: capturedImage,
      confidence: confidenceScore,
      isValid,
      depositId: data.depositId
    });
  };

  // Update handleScan function
  const handleScan = async (imageData) => {
    try {
      setIsScanning(true);
      const formData = new FormData();
      formData.append('image', imageData);
      formData.append('type', documentType);
      formData.append('amount', amount);
      if (documentType === 'money_order') {
        formData.append('serialNumber', serialNumber);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/deposits/scan-check`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        onSuccess(response.data);
      }
    } catch (error) {
      if (error.response?.data?.error === 'Duplicate deposit detected') {
        const details = error.response.data.details;
        setError(
          `This ${documentType} has already been deposited on ` +
          `${new Date(details.originalDepositDate).toLocaleDateString()} ` +
          `for $${details.originalAmount.toFixed(2)}`
        );
        setStep('select'); // Reset to selection step
      } else {
        setError('Error processing scan. Please try again.');
      }
      console.error('Scan error:', error);
    } finally {
      setIsScanning(false);
    }
  };

  // Add serial number input if it's a money order
  const renderSerialNumberInput = () => {
    if (type === 'money_order' && step === 'confirm') {
      return (
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Serial Number</label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            className="w-full p-2 rounded"
            placeholder="Enter serial number"
            required
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-dark-200 p-4 rounded-xl">
      <h3 className="text-white text-xl font-semibold mb-4">
        {type === 'cash' ? 'Scan Money Order' : 'Scan Check'}
      </h3>

      {confidenceScore !== null && (
        <div className={`mb-4 p-3 rounded-lg ${
          confidenceScore >= 50 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          <p className="text-lg font-semibold">
            Confidence Score: {confidenceScore.toFixed(1)}%
            {confidenceScore >= 50 ? ' ✓' : ' ✗'}
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {step === "select" && (
        <div className="space-y-4">
          <button
            onClick={() => {
              if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
              ) {
                setError("Camera not supported in this browser");
                return;
              }

              navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(() => {
                  setMode("camera");
                  setStep("capture");
                  setError(null);
                })
                .catch((err) => {
                  console.error("Camera permission error:", err);
                  setError("Please allow camera access to use this feature");
                });
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Use Camera
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Upload Image
          </button>
        </div>
      )}

      {mode === "camera" && step === "capture" && <CameraComponent />}

      {step === "preview" && (
        <div>
          <img
            src={capturedImage}
            alt="Captured check"
            className="w-full rounded-lg"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setStep("select")}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Try Again
            </button>
            <button
              onClick={handleProcess}
              disabled={processing}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {processing ? "Processing..." : "Process Check"}
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div className="text-center">
          <p className="text-xl mb-4">Detected Amount: ${amount?.toFixed(2)}</p>
          <input
            type="number"
            value={amount || ""}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full p-2 mb-4 rounded"
            step="0.01"
            min="0"
            placeholder="Enter or correct amount"
          />
          {renderSerialNumberInput()}
          <button
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Confirm & Deposit
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default CheckScanner;
