// app/page.js
import { listTags } from "../lib/api";
import FilterBar from "./components/FilterBar";
import { Suspense } from "react";

function BrandMark() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px",
        borderRadius: 999,
        background: "#eff6ff",
        color: "#3b82f6",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 28,
          height: 28,
          borderRadius: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #60a5fa, #2563eb)",
          color: "#fff",
          fontWeight: 900,
          boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
          flex: "0 0 auto",
          fontSize: 16,
          lineHeight: 1,
        }}
      >
        ⚙︎
      </span>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, lineHeight: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 900,
            letterSpacing: "0.02em",
            color: "#111827",
            whiteSpace: "nowrap",
          }}
        >
          AI TOOLS
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            color: "#3b82f6",
            opacity: 0.95,
          }}
        >
          Catalog
        </div>
      </div>
    </div>
  );
}

export default async function IndexPage() {
  const tagsData = await listTags().catch(() => ({ items: [] }));

  const popularTags = tagsData.items.filter((t) => t.count > 1).slice(0, 15);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", width: "100%", maxWidth: 750 }}>
        {/* Branding (JSX-only logo) */}
        <div style={{ marginBottom: 24 }}>
          <BrandMark />
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 8vw, 64px)",
            fontWeight: 900,
            marginBottom: 16,
            letterSpacing: "-0.04em",
          }}
        >
          Build with Intelligence.
        </h1>

        <p style={{ fontSize: 20, color: "#6b7280", marginBottom: 48, lineHeight: 1.5 }}>
          Search the directory for tasks like{" "}
          <span style={{ color: "#111827", fontWeight: 500 }}>"Video Editing"</span> or{" "}
          <span style={{ color: "#111827", fontWeight: 500 }}>"Code Generation."</span>
        </p>

        <Suspense fallback={<div>Loading Search...</div>}>
          <FilterBar availableTags={popularTags} isHome={true} />
        </Suspense>

        <div
          style={{
            marginTop: 24,
            fontSize: 13,
            color: "#9ca3af",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Trending Categories
        </div>
      </div>
    </main>
  );
}
