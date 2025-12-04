//components/JustifiedGallery.js

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JustifiedGallery({
  images = [],
  rowHeight = 460,
  gap = 10,
  containerPadding = 24,
}) {
  const [measured, setMeasured] = useState([]);
  const [rows, setRows] = useState([]);
  const [animateKey, setAnimateKey] = useState(0);
  const [viewportW, setViewportW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Measure natural sizes
  useEffect(() => {
    let cancelled = false;
    async function measureAll() {
      const arr = await Promise.all(
        images.map(
          (img) =>
            new Promise((resolve) => {
              if (img.width && img.height) {
                resolve({
                  ...img,
                  width: +img.width,
                  height: +img.height,
                  aspect: +img.width / +img.height,
                });
                return;
              }
              const el = new window.Image();
              el.src = img.imageUrl;
              el.onload = () =>
                resolve({
                  ...img,
                  width: el.naturalWidth || 1000,
                  height: el.naturalHeight || 800,
                  aspect: (el.naturalWidth || 1000) / (el.naturalHeight || 800),
                });
              el.onerror = () =>
                resolve({
                  ...img,
                  width: 1000,
                  height: 800,
                  aspect: 1000 / 800,
                });
            })
        )
      );
      if (!cancelled) setMeasured(arr);
    }
    measureAll();
    return () => (cancelled = true);
  }, [images]);

  // Handle resize
  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Build rows
  useEffect(() => {
    if (!measured.length) return;

    const availableWidth = Math.max(400, viewportW - containerPadding * 2);
    const target = Math.max(80, rowHeight);
    const maxVariance = Math.round(target * 0.1);

    const newRows = [];
    let current = [];
    let sumAspect = 0;

    const pushRow = (row, justify = true) => {
      if (!row.length) return;
      const gapTotal = gap * (row.length - 1);
      const containerW = Math.max(1, availableWidth - gapTotal);
      const sumA = row.reduce((s, it) => s + it.aspect, 0);
      const naturalH = containerW / sumA;
      const finalH = Math.max(80, Math.round(target * 0.7 + naturalH * 0.3));

      const scaledRow = row.map((it) => {
        const w = justify ? Math.round(it.aspect * finalH) : Math.round(it.aspect * finalH);
        return {
          ...it,
          displayWidth: w,
          displayHeight: finalH,
        };
      });

      newRows.push(scaledRow);
    };

    measured.forEach((img) => {
      current.push(img);
      sumAspect += img.aspect;

      const estW = sumAspect * target + gap * (current.length - 1);
      if (estW >= availableWidth) {
        pushRow(current, true);
        current = [];
        sumAspect = 0;
      }
    });

    if (current.length) pushRow(current, false);

    setRows(newRows);
    setAnimateKey((k) => k + 1);
  }, [measured, viewportW, rowHeight, gap, containerPadding]);

  if (!rows.length) return null;

  return (
    <div className="justified-gallery" data-jg-key={animateKey}>
      {rows.map((row, rIdx) => (
        <div key={rIdx} className="jg-row" style={{ gap: `${gap}px` }}>
          {row.map((img) => (
            <Link
              key={img._id}
              href={`/artworks/${img._id}`}
              className="jg-link"
              style={{
                width: `${img.displayWidth}px`,
                height: `${img.displayHeight}px`,
              }}
            >
              <img
                src={img.imageUrl}
                alt={img.title || img.artistName}
                className="jg-img"
              />
              <div className="jg-overlay">
                <div className="jg-meta">
                  <div className="jg-title">{img.title}</div>
                  <div className="jg-artist">{img.artistName}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
