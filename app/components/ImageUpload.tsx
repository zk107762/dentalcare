"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (base64: string) => void;
  label?: string;
  size?: "small" | "medium" | "large";
}

export default function ImageUpload({ currentImage, onImageChange, label = "Upload Image", size = "medium" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(currentImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) handleFile(file);
        break;
      }
    }
  };

  const sizeClasses = {
    small: "admin-upload-small",
    medium: "admin-upload-medium",
    large: "admin-upload-large",
  };

  return (
    <div className={`admin-image-upload ${sizeClasses[size]} ${isDragging ? "dragging" : ""}`}>
      {preview && (
        <div className="admin-upload-preview">
          <img src={preview} alt="" />
          <button
            type="button"
            className="admin-upload-remove"
            onClick={() => { setPreview(""); onImageChange(""); }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        className="admin-upload-dropzone"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
        onClick={() => inputRef.current?.click()}
      >
        <div className="admin-upload-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15L16 10L5 21" />
          </svg>
        </div>
        <span className="admin-upload-text">{label}</span>
        <span className="admin-upload-hint">Click, drag, or paste • Max 2MB</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Mobile camera button */}
      <button
        type="button"
        className="admin-upload-camera"
        onClick={() => {
          if (inputRef.current) {
            inputRef.current.removeAttribute("capture");
            inputRef.current.click();
          }
        }}
      >
        📷 Camera
      </button>
    </div>
  );
}
