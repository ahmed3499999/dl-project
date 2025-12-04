import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CameraUpload = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [crops, setCrops] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [firstSignName, setFirstSignName] = useState('');

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
    } catch (err) {
      console.error(err);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    const base64Image = canvas.toDataURL('image/jpeg').split(',')[1];
    setUploadedImage(canvas.toDataURL('image/jpeg'));

    try {
      const res = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image }),
      });
      const data = await res.json();
      setProcessedImage(`data:image/jpeg;base64,${data.image}`);
      setCrops(data.cropped_images || []);
      if (data.cropped_images && data.cropped_images.length > 0) {
        setSelectedIndex(0);
        setFirstSignName(data.cropped_images[0].name);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectCrop = (index) => {
    setSelectedIndex(index);
    setFirstSignName(crops[index].name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-8">
      <Link
        to="/"
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 px-4 py-2 rounded-lg hover:bg-slate-800 w-fit"
      >
        Back
      </Link>

      <div className="flex gap-6 max-w-6xl mx-auto">
        {/* Camera / Processed Image */}
        <div className="flex-1 bg-black rounded-2xl overflow-hidden flex items-center justify-center" style={{ minHeight: '500px' }}>
          {processedImage ? (
            <img src={processedImage} alt="Processed" className="w-full h-full object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
          )}
        </div>

        {/* Cropped Signs */}
        <div className="w-80 max-h-[600px] overflow-y-auto space-y-3">
          {crops.map((crop, i) => (
            <div
              key={i}
              className={`cursor-pointer rounded-xl border-2 p-1 transition ${selectedIndex === i ? 'border-blue-500' : 'border-gray-400'}`}
              onClick={() => handleSelectCrop(i)}
            >
              <img
                src={`data:image/jpeg;base64,${crop.image}`}
                alt={crop.name}
                className="w-full rounded-lg object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={capturePhoto}
          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold text-lg"
        >
          Capture & Classify
        </button>
      </div>

      {/* First Sign Name + Confidence */}
      {selectedIndex !== null && crops[selectedIndex] && (
        <div className="mt-4 max-w-md mx-auto">
          <div className="text-center mb-2 font-semibold">{crops[selectedIndex].name}</div>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div
              className="bg-orange-500 h-4 rounded-full"
              style={{ width: `${crops[selectedIndex].confidence * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraUpload;
