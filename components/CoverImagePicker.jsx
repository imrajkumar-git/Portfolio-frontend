"use client";

import { useEffect, useRef, useState } from "react";

const MAX_BYTES = 5 * 1024 * 1024; // keep in sync with BLOG_COVER_MAX_BYTES
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

function prettySize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Picks a cover image from the author's own device.
 *
 * Reports changes upward as `{ file, removed }`:
 *   file    — a File to upload, or null
 *   removed — true when the author cleared an image that was already saved
 *
 * `existingUrl` is the cover already stored on the post, if any.
 */
export default function CoverImagePicker({ existingUrl = "", onChange, disabled }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(existingUrl || "");
  const [dragOver, setDragOver] = useState(false);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (!file) setPreviewUrl(existingUrl || "");
  }, [existingUrl, file]);

  // Release the object URL when the picked file changes or we unmount.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = (picked) => {
    if (!picked) return;
    if (!ACCEPTED.includes(picked.type)) {
      setProblem("That file type isn't supported. Use JPG, PNG, WEBP, GIF or AVIF.");
      return;
    }
    if (picked.size > MAX_BYTES) {
      setProblem(
        `That image is ${prettySize(picked.size)}. The limit is ${prettySize(MAX_BYTES)} — try compressing it first.`
      );
      return;
    }
    setProblem("");
    setFile(picked);
    onChange?.({ file: picked, removed: false });
  };

  const clear = () => {
    setFile(null);
    setPreviewUrl("");
    setProblem("");
    if (inputRef.current) inputRef.current.value = "";
    onChange?.({ file: null, removed: true });
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    accept(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-300">
        Cover image
      </label>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        disabled={disabled}
        onChange={(e) => accept(e.target.files?.[0])}
      />

      {previewUrl ? (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Cover preview" className="h-52 w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/85 to-transparent px-4 py-3">
            <span className="scrim truncate text-xs text-slate-300">
              {file ? `${file.name} · ${prettySize(file.size)}` : "Current cover"}
            </span>
            <span className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="scrim rounded-full border border-white/20 bg-black/50 px-3 py-1 text-xs font-medium text-slate-100 transition hover:border-emerald-400/60"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={clear}
                disabled={disabled}
                className="scrim rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-medium text-red-300 transition hover:border-red-400/60"
              >
                Remove
              </button>
            </span>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          disabled={disabled}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition ${
            dragOver
              ? "border-emerald-400 bg-emerald-400/10"
              : "border-white/15 bg-black/20 hover:border-emerald-400/50 hover:bg-emerald-400/[0.04]"
          }`}
        >
          <span className="text-2xl">🖼️</span>
          <span className="text-sm font-medium text-slate-200">
            Choose an image from your device
          </span>
          <span className="text-xs text-slate-500">
            or drop one here — JPG, PNG, WEBP, GIF or AVIF, up to {prettySize(MAX_BYTES)}
          </span>
        </button>
      )}

      {problem && (
        <p className="mt-2 text-xs text-red-300">{problem}</p>
      )}
    </div>
  );
}
