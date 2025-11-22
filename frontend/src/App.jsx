"use client"

import { useState } from "react"
import ImageUploader from "./components/ImageUploader"
import ImageCropper from "./components/ImageCropper"
import PlantResults from "./components/PlantResults"

export default function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("upload")

  const handleImageUpload = (image) => {
    setUploadedImage(image)
    setStep("crop")
  }

  const handleCropConfirm = async (croppedImageData) => {
    setCroppedImage(croppedImageData)
    setStep("results")
    setLoading(true)
    setResults("We are waiting for basil, donia, and nour to finish the model please ")
    setLoading(false)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setCroppedImage(null)
    setResults(null)
    setStep("upload")
  }

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Plant Disease Identifier</h1>
          <p className="text-emerald-100">Upload a photo to discover your plant's disease</p>
        </div>

        {step === "upload" && (
          <div className="bg-slate-800 border border-emerald-700/30 rounded-lg p-8">
            <ImageUploader onImageUpload={handleImageUpload} />
          </div>
        )}

        {step === "crop" && uploadedImage && (
          <div className="bg-slate-800 border border-emerald-700/30 rounded-lg p-8">
            <ImageCropper image={uploadedImage} onConfirm={handleCropConfirm} onCancel={() => setStep("upload")} />
          </div>
        )}

        {step === "results" && (
          <div className="bg-slate-800 border border-emerald-700/30 rounded-lg p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <svg
                  className="w-8 h-8 text-emerald-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-white text-lg">Analyzing your plant...</p>
              </div>
            ) : (
              <>
                {croppedImage && (
                  <div className="mb-6">
                    <img
                      src={croppedImage || "/placeholder.svg"}
                      alt="Cropped plant"
                      className="w-full h-auto rounded-lg border border-emerald-700/30"
                    />
                  </div>
                )}
                <PlantResults results={results} />
                <button
                  onClick={handleReset}
                  className="w-full mt-6 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Identify Another Plant
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
