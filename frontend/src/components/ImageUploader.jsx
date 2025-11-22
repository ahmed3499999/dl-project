"use client"

import { useState, useRef } from "react"

export default function ImageUploader({ onImageUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragging ? "border-emerald-400 bg-emerald-400/10" : "border-emerald-700/50 hover:border-emerald-600"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <svg
          className="w-12 h-12 text-emerald-400 mx-auto mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <h2 className="text-xl font-semibold text-white mb-1">Drag and drop your plant photo</h2>
        <p className="text-emerald-200">or click to browse</p>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      </div>
    </div>
  )
}
