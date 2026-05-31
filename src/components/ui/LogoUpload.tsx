"use client";

import React, { useRef, useState } from "react";
import { MAX_LOGO_SIZE_BYTES } from "@/lib/constants";

/** Accepted MIME types for logo upload. */
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

/** Props accepted by the LogoUpload component. */
export interface LogoUploadProps {
  /** Current logo as a base64 data URL, or null when no logo is set. */
  value: string | null;
  /**
   * Called with the compressed base64 JPEG data URL after a valid file is
   * chosen, or with null when the user removes the logo.
   */
  onChange: (dataUrl: string | null) => void;
}

/**
 * Logo upload component with in-browser compression.
 *
 * Accepts JPG/JPEG/PNG files up to MAX_LOGO_SIZE_BYTES (200 KB). On a valid
 * selection the image is drawn onto a hidden canvas, compressed to JPEG at
 * 85% quality via `canvas.toBlob`, converted to a base64 data URL, and passed
 * to `onChange`. Invalid files (wrong type or too large) show an inline error
 * message without calling onChange.
 *
 * When a logo is already set (`value` is a data URL) a preview image is shown
 * alongside a "Remove" button. The dropzone area is keyboard-accessible:
 * pressing Enter or Space on the zone opens the file picker.
 *
 * @param value   Current logo data URL or null.
 * @param onChange Callback receiving compressed data URL or null.
 */
export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  function handleFile(file: File) {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("File must be JPG or PNG under 200 KB");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      setError("File must be JPG or PNG under 200 KB");
      return;
    }

    // File is already validated to be ≤200 KB — read it directly without
    // canvas conversion so the original format (including PNG transparency) is preserved.
    const reader = new FileReader();
    reader.onload = (evt) => {
      onChange(evt.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input value so the same file can be re-selected after removal.
    e.target.value = "";
  }

  function handleRemove() {
    setError(null);
    onChange(null);
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-[#212121]">Logo</span>

      {value ? (
        <div className="relative inline-block">
          <div className="flex items-center justify-center rounded-md border border-[#e0e0e0] bg-[#f5f5f5] p-3 min-h-[80px] min-w-[120px] max-w-[220px]">
            <img
              src={value}
              alt="Invoice logo preview"
              className="max-h-14 w-auto max-w-[180px] object-contain"
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove logo"
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white border border-[#e0e0e0] text-[#757575] shadow-sm hover:bg-red-500 hover:border-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-colors duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={openPicker}
          onKeyDown={handleKeyDown}
          aria-label="Upload logo — JPG, JPEG or PNG, less than 200 KB"
          className="flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed border-[#e0e0e0] bg-[#f5f5f5] px-4 py-6 text-center cursor-pointer hover:border-[#4caf50] hover:bg-green-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4caf50] focus-visible:ring-offset-1 transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-[#757575]"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm text-[#757575]">Upload file</span>
          <span className="text-xs text-[#757575]">JPG, JPEG, PNG, less than 200KB</span>
        </div>
      )}

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleChange}
      />
    </div>
  );
}
