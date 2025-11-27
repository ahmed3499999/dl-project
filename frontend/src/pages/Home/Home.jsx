import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
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

      {/* Main Content - Two Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {/* Upload Image Card */}
          <Link 
            to="/image"
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-orange-500 hover:bg-slate-800 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-all">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Upload Image</h2>
              <p className="text-slate-400">Select a traffic sign image from your device</p>
            </div>
          </Link>

          {/* Use Camera Card */}
          <Link 
            to="/camera"
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 hover:border-blue-500 hover:bg-slate-800 transition-all group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-500/20 transition-all">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold mb-3">Use Camera</h2>
              <p className="text-slate-400">Capture a live camera feed to classify signs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;