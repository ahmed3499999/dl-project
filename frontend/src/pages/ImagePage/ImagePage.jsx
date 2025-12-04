import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ImagePage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isClassified, setIsClassified] = useState(false);

  const [processedImage, setProcessedImage] = useState(null);
  const [crops, setCrops] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setProcessedImage(null);
      setCrops([]);
      setPredictions([]);
      setSelectedIndex(null);
      setIsClassified(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClassify = async () => {
    try {
      setIsClassified(true);
      const base64Image = uploadedImage.split(",")[1];

      const res = await fetch("http://localhost:8000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });

      const data = await res.json();
      setProcessedImage(`data:image/jpeg;base64,${data.image}`);
      setCrops(data.cropped_images);
      setPredictions(data.predictions);
      setSelectedIndex(0);
    } catch (err) {
      console.error(err);
      setIsClassified(false);
    }
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setCrops([]);
    setPredictions([]);
    setSelectedIndex(null);
    setIsClassified(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-4">
      {/* Header
      <div className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Traffic Sign Classifier</h1>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl mx-auto px-2">
          Upload an image or use your camera to classify traffic signs in real-time. Our AI will identify the signs and draw their locations on the image.
        </p>
      </div> */}

      {/* Back Button */}
      <Link 
        to="/" 
        className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors mb-3 px-3 py-1 text-sm rounded-lg hover:bg-slate-800 w-fit"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Main Layout: Image + Crops */}
      <div className="flex gap-3">

        {/* LEFT: Upload / Processed Image */}
        <div className="flex-1">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className={`block rounded-lg transition-all cursor-pointer ${
              uploadedImage ? 'px-8 py-0 max-h-[400px] overflow-hidden' : 'p-8'
            } ${
              isClassified 
                ? 'bg-slate-800 border-2 border-slate-700' 
                : dragActive 
                  ? 'border-2 border-dashed border-orange-500 bg-slate-800' 
                  : 'border-2 border-dashed border-slate-600 bg-slate-800/50 hover:border-slate-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center pointer-events-none h-[400px] flex flex-col justify-center items-center">
              {processedImage ? (
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="h-full object-contain"
                />
              ) : uploadedImage ? (
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="h-full object-contain"
                />
              ) : (
                <>
                  <div className="mb-3">
                    <svg className="w-12 h-12 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold mb-2">Upload Traffic Sign Image</h2>
                  <p className="text-slate-400 text-sm">Drag and drop or click to select</p>
                </>
              )}
            </div>
          </label>

          {/* Action Buttons */}
          {uploadedImage && !isClassified && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleClassify}
                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Confirm & Classify
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Cropped Images */}
        {isClassified && crops.length > 0 && (
          <div className="w-48 flex flex-col justify-between space-y-2">
  {crops.map((crop, i) => (
    <div
      key={i}
      className={`cursor-pointer rounded-xl border-2 p-1 transition ${
        selectedIndex === i ? "border-blue-500" : "border-gray-400"
      }`}
      onClick={() => setSelectedIndex(i)}
    >
      <img
        src={`data:image/jpeg;base64,${crop.image}`}
        alt={crop.name}
        className="w-full rounded-lg object-contain"
        style={{ height: `${Math.floor(500 / crops.length)}px` }}
      />
    </div>
  ))}
</div>

        )}
      </div>

      {/* BOTTOM BAR with Confidence Progress */}
      {isClassified && crops.length > 0 && selectedIndex !== null && (
        <div className="mt-3 bg-slate-900 px-4 py-2 rounded-lg">
          <div className="flex items-center mb-1">
            <span className="text-sm text-white">{crops[selectedIndex].name}</span>
            <span className="ml-auto text-gray-400 text-xs">
              {Math.round(crops[selectedIndex].confidence * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full">
            <div
              className="h-3 bg-orange-500 rounded-full"
              style={{ width: `${crops[selectedIndex].confidence * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* NO SIGNS DETECTED MESSAGE */}
      {isClassified && crops.length === 0 && (
        <div className="mt-3 bg-yellow-900/30 border-2 border-yellow-600 px-4 py-2 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-yellow-200">No Traffic Signs Detected</span>
          </div>
          <p className="text-yellow-100/80 text-xs">
            No traffic signs were found in this image. Try uploading an image with clearer or closer traffic signs.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImagePage;
