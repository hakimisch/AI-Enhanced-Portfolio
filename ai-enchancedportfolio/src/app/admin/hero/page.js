//src/app/admin/hero/page.js

"use client";

import { useEffect, useRef, useState } from "react";
import DashboardLayout from "components/DashboardLayout";
import dynamic from "next/dynamic";
import { Save, RefreshCw, UploadCloud, Trash2 } from "lucide-react";

// React Quill NEW version
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default function HeroSettingsPage() {
  const [loading, setLoading] = useState(true);

  const [hero, setHero] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    overlayOpacity: 0.4,
    tintColor: "rgb(0,0,0)",
    // new:
    titleColor: "rgb(255,255,255)",
    subtitleColor: "rgb(255,255,255)",
  });

  // hidden file input ref
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function loadHero() {
      const res = await fetch("/api/admin/hero");
      const data = await res.json();

      setHero({
        imageUrl: data.imageUrl || "",
        title: data.title || "Discover Original Artworks",
        subtitle: data.subtitle || "",
        overlayOpacity: data.overlayOpacity ?? 0.4,
        tintColor: data.tintColor || "rgb(0,0,0)",
        titleColor: data.titleColor || "rgb(255,255,255)",
        subtitleColor: data.subtitleColor || "rgb(255,255,255)",
      });

      setLoading(false);
    }
    loadHero();
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/admin/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hero),
    });

    if (res.ok) alert("Hero settings updated!");
    else alert("Failed to save.");
  };

  const resetDefaults = () => {
    setHero({
      imageUrl: "",
      title: "Discover Original Artworks",
      subtitle: "",
      overlayOpacity: 0.4,
      tintColor: "rgb(0,0,0)",
      titleColor: "rgb(255,255,255)",
      subtitleColor: "rgb(255,255,255)",
    });
  };

  // ----- IMAGE UPLOAD HELPERS -----
  const triggerFilePicker = () => fileInputRef.current?.click();

  const handleFileSelected = async (file) => {
    if (!file) return;
    const form = new FormData();
    form.append("image", file);

    const res = await fetch("/api/admin/hero/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    setHero((prev) => ({ ...prev, imageUrl: data.url }));
  };

  const onFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    await handleFileSelected(file);
    // reset value so selecting same file again will trigger change event
    e.target.value = "";
  };

  const removeImage = () => {
    setHero((prev) => ({ ...prev, imageUrl: "" }));
  };

  // ----- QUILL CONFIG (ensure formats include color) -----
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ header: [3, 4, false] }],
      [{ color: [] }], // built-in colors chooser
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "header",
    "color",
  ];

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <DashboardLayout isAdmin>
      <div className="p-6 md:p-10">
        <h1 className="text-3xl font-semibold mb-6">Homepage Hero Settings</h1>

        {/* ---------- LIVE PREVIEW ---------- */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-3">Live Preview</h2>

          <div className="relative h-[360px] w-full rounded-xl overflow-hidden shadow">
            <div className="absolute inset-0">
              {hero.imageUrl ? (
                <img
                  src={hero.imageUrl}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                  No Image Selected
                </div>
              )}
            </div>

            {/* Overlay Layer (tint + opacity) */}
            <div
              className="absolute inset-0"
              style={{
                background: hero.tintColor, // RGB only
                opacity: hero.overlayOpacity, // slider controls opacity
              }}
            />

            <div className="relative z-10 text-center h-full flex flex-col justify-center px-4">
              <h1
                className="text-4xl font-bold mb-4"
                style={{ color: hero.titleColor }}
              >
                {hero.title}
              </h1>
              <div
                className="text-lg max-w-2xl mx-auto"
                style={{ color: hero.subtitleColor }}
                dangerouslySetInnerHTML={{ __html: hero.subtitle }}
              />
            </div>
          </div>
        </div>

        {/* ---------- SETTINGS FORM ---------- */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

          {/* Image Upload */}
          <div>
            <label className="font-medium">Hero Background Image</label>

            <div className="flex items-center gap-3 mt-3">
              <button
                type="button"
                onClick={triggerFilePicker}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <UploadCloud size={16} />
                Upload Image
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 border rounded hover:bg-gray-50"
              >
                Choose New
              </button>

              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-2 px-3 py-2 border rounded hover:bg-gray-50 text-red-600"
              >
                <Trash2 size={14} />
                Remove
              </button>

              {hero.imageUrl && (
                <span className="text-sm text-gray-600 ml-2 truncate max-w-xs">
                  {hero.imageUrl}
                </span>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />
          </div>

          {/* Title */}
          <div>
            <label className="font-medium">Hero Title</label>
            <input
              type="text"
              value={hero.title}
              onChange={(e) =>
                setHero((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full mt-2 p-2 border rounded"
            />
            <div className="mt-2 flex items-center gap-3">
              <label className="text-sm">Title Color</label>
              <input
                type="color"
                className="w-10 h-8 p-0 border rounded"
                value={rgbToHex(hero.titleColor)}
                onChange={(e) =>
                  setHero((prev) => ({ ...prev, titleColor: hexToRGB(e.target.value) }))
                }
              />
              <span className="text-sm text-gray-500">{hero.titleColor}</span>
            </div>
          </div>

          {/* Subtitle Rich Text Editor */}
          <div>
            <label className="font-medium">Hero Subtitle</label>
            <ReactQuill
              value={hero.subtitle}
              onChange={(value) =>
                setHero((prev) => ({
                  ...prev,
                  // REMOVE Quill cursor placeholder
                  subtitle: value.replace(
                    /<span[^>]*class="[^"]*ql-cursor[^"]*"[^>]*>.*?<\/span>/g,
                    ""
                  ),
                }))
              }
              className="mt-2 bg-white"
              modules={quillModules}
              formats={quillFormats}
            />

            <div className="mt-2 flex items-center gap-3">
              <label className="text-sm">Subtitle Color (applies to whole block)</label>
              <input
                type="color"
                className="w-10 h-8 p-0 border rounded"
                value={rgbToHex(hero.subtitleColor)}
                onChange={(e) =>
                  setHero((prev) => ({ ...prev, subtitleColor: hexToRGB(e.target.value) }))
                }
              />
              <span className="text-sm text-gray-500">{hero.subtitleColor}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Tip: You can also highlight text inside the editor and pick a color from the editor&apos;s color chooser.
            </div>
          </div>

          {/* Overlay Opacity */}
          <div>
            <label className="font-medium">
              Overlay Opacity: {hero.overlayOpacity}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={hero.overlayOpacity}
              onChange={(e) =>
                setHero((prev) => ({
                  ...prev,
                  overlayOpacity: parseFloat(e.target.value),
                }))
              }
              className="w-full mt-2"
            />
          </div>

          {/* Tint Color Picker */}
          <div>
            <label className="font-medium">Tint Color</label>
            <input
              type="color"
              className="mt-2 w-20 h-10 p-0 border rounded"
              value={rgbToHex(hero.tintColor)}
              onChange={(e) => {
                const hex = e.target.value;
                setHero((prev) => ({
                  ...prev,
                  tintColor: hexToRGB(hex), // store RGB, NOT RGBA
                }));
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              <Save size={18} />
              Save Changes
            </button>

            <button
              onClick={resetDefaults}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-5 py-2 rounded hover:bg-gray-300"
            >
              <RefreshCw size={18} />
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Convert HEX to RGB (no opacity!)
function hexToRGB(hex) {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
}

// tiny helper: try to convert rgb(...) -> #rrggbb for color input default value
function rgbToHex(rgb) {
  // accept "rgb(r, g, b)" or "#xxxxxx" or already hex
  if (!rgb) return "#ffffff";
  if (rgb.startsWith("#")) return rgb;
  const m = rgb.match(/rgb\(\s*([0-9]+)[, ]\s*([0-9]+)[, ]\s*([0-9]+)\s*\)/i);
  if (!m) return "#ffffff";
  const r = parseInt(m[1], 10);
  const g = parseInt(m[2], 10);
  const b = parseInt(m[3], 10);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}
