import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ImagePage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isClassified, setIsClassified] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setIsClassified(false);
    };
    reader.readAsDataURL(file);
  };

  const handleClassify = () => {
    setIsClassified(true);
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setIsClassified(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-orange-500 p-3 rounded-xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold">Traffic Sign Classifier</h1>
        </div>
        <p className="text-slate-300 text-lg max-w-3xl mx-auto px-4">
          Upload an image or use your camera to classify traffic signs in real-time. Our AI will identify the signs and draw their locations on the image.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 px-4 py-2 rounded-lg hover:bg-slate-800 w-fit">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>

        {/* Upload Area - Dashed border when not classified, solid background when classified */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
        <label
          htmlFor="file-upload"
          className={`block rounded-2xl transition-all cursor-pointer ${
            uploadedImage ? 'px-16 py-0 max-h-[600px] overflow-hidden' : 'p-16'
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
          <div className="text-center pointer-events-none">
            {uploadedImage ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="max-h-[600px] w-full object-contain"
                />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Upload Traffic Sign Image</h2>
                <p className="text-slate-400">Drag and drop or click to select</p>
              </>
            )}
          </div>
        </label>

        {/* Action Buttons - Only show when image is uploaded and not yet classified */}
        {uploadedImage && !isClassified && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleClassify}
              className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors text-lg"
            >
              Confirm & Classify
            </button>
            <Link
              to="/"
              className="flex-1 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors text-lg text-center"
            >
              Cancel
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePage;