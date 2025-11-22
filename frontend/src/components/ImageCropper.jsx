"use client"

import { useState, useRef, useEffect } from "react"
import Cropper from 'cropperjs'


export default function ImageCropper({ image, onConfirm, onCancel }) {
  const imgRef = useRef(null)
  const cropperRef = useRef(null)
  
  useEffect(() => {
    if (imgRef.current && image) {
      if (cropperRef.current) {
        cropperRef.current.destroy()      
      }

      cropperRef.current = new Cropper(imgRef.current)
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy()
        cropperRef.current = null
      }
    }
  }, [image])

  const handleConfirm = async () => {
    if (!cropperRef.current) return
    const canvas = await cropperRef.current.getCropperSelection().$toCanvas();

    onConfirm(canvas.toDataURL("image/jpeg"))
  }

  return (
    <div className="flex flex-col gap-4 w-full h-screen">
      <div 
        className="relative bg-slate-900 rounded-lg overflow-hidden border border-emerald-700/30 flex-1" 
        style={{}}
      >
        <img 
          ref={imgRef}
          src={image || "/placeholder.svg"} 
          alt="Image to crop" 
          style={{ 
            userSelect: "none", 
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }} 
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-emerald-600 text-emerald-400 hover:bg-emerald-400/10 bg-transparent font-medium rounded-lg transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
        >
          Confirm Crop
        </button>
      </div>
    </div>
  )
}
