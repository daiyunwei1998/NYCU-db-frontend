// app/components/SearchControls.js
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchControls({
  q: initialQ,
  tag,
  sort,
  isFree,
  onChangeSort,
  onToggleFree,
  onClearFree,
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [input, setInput] = useState(initialQ);

  useEffect(() => setInput(initialQ), [initialQ]);

  // Only update URL for things that should re-fetch from backend: q, tag, page
  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "" || v === undefined) params.delete(k);
      else params.set(k, String(v));
    });
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Row 1: JSX-only Brand + Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        {/* Brand (no images, no border) */}
        <a
          href="/"
          title="Back to home"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flex: "0 0 auto",
            padding: "6px 4px",
            borderRadius: 14,
            background: "transparent",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #60a5fa, #2563eb)",
              color: "#fff",
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
              flex: "0 0 auto",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ⚙︎
          </span>

          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                letterSpacing: "0.02em",
                color: "#111827",
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              AI TOOLS
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#2563eb",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Catalog
            </div>
          </div>
        </a>

        {/* Search bar (no search icon) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateQueryParams({ q: input });
          }}
          style={{
            position: "relative",
            flex: "1 1 420px",
            minWidth: 280,
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Research tools..."
            style={{
              width: "100%",
              padding: "12px 100px 12px 16px",
              borderRadius: 12,
              border: "1px solid #ddd",
              fontSize: 16,
              outline: "none",
              height: 48,
            }}
          />

          <button
            type="submit"
            style={{
              position: "absolute",
              right: 6,
              top: 6,
              bottom: 6,
              padding: "0 16px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Row 2: Filters & Sorting */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {/* Active Pill Area */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {initialQ ? (
            <Pill label={`"${initialQ}"`} onClear={() => updateQueryParams({ q: null })} />
          ) : null}

          {tag ? (
            <Pill
              label={tag}
              onClear={() => updateQueryParams({ tag: null })}
              color="#eff6ff"
              textColor="#3b82f6"
            />
          ) : null}

          {isFree ? (
            <Pill label="Free Only" onClear={onClearFree} color="#f0fdf4" textColor="#16a34a" />
          ) : null}
        </div>

        {/* Client-only Filter & Sort */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            type="button"
            onClick={onToggleFree}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: "600",
              cursor: "pointer",
              border: "1px solid",
              backgroundColor: isFree ? "#16a34a" : "#fff",
              borderColor: isFree ? "#16a34a" : "#ddd",
              color: isFree ? "#fff" : "#333",
            }}
          >
            {isFree ? "✓ Free Only" : "Free Only"}
          </button>

          <select
            value={sort}
            onChange={(e) => onChangeSort(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: 10,
              border: "1px solid #ddd",
              fontSize: 13,
              outline: "none",
            }}
          >
            <option value="rating">Top Rated</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Pill({ label, onClear, color = "#f3f4f6", textColor = "#333" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 100,
        backgroundColor: color,
        color: textColor,
        fontSize: 13,
        fontWeight: "500",
      }}
    >
      {label}
      <span
        onClick={onClear}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 18,
          lineHeight: 1,
          marginLeft: 4,
        }}
      >
        ×
      </span>
    </div>
  );
}
