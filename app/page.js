import { listTags } from "../lib/api";
import FilterBar from "./components/FilterBar";
import { Suspense } from "react";

export default async function IndexPage() {
  const tagsData = await listTags().catch(() => ({ items: [] }));
  
  // 1. Filter out tags that only have 1 item (noise reduction)
  // 2. Take the top 15 most frequent tags
  const popularTags = tagsData.items
    .filter(t => t.count > 1) 
    .slice(0, 15);

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "20px",
      background: "#ffffff"
    }}>
      <div style={{ textAlign: "center", width: "100%", maxWidth: 750 }}>
        {/* Branding */}
        <div style={{ 
          display: "inline-block", 
          padding: "8px 16px", 
          borderRadius: 100, 
          backgroundColor: "#eff6ff", 
          color: "#3b82f6", 
          fontSize: 14, 
          fontWeight: 600,
          marginBottom: 24
        }}>
          Now indexing 500+ AI tools
        </div>

        <h1 style={{ fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.04em" }}>
          Build with Intelligence.
        </h1>
        
        <p style={{ fontSize: 20, color: "#6b7280", marginBottom: 48, lineHeight: 1.5 }}>
          Search the directory for tasks like <span style={{ color: "#111827", fontWeight: 500 }}>"Video Editing"</span> or <span style={{ color: "#111827", fontWeight: 500 }}>"Code Generation."</span>
        </p>

        <Suspense fallback={<div>Loading Search...</div>}>
          <FilterBar availableTags={popularTags} isHome={true} />
        </Suspense>

        {/* Optional: Add a "trending" label */}
        <div style={{ marginTop: 24, fontSize: 13, color: "#9ca3af", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Trending Categories
        </div>
      </div>
    </main>
  );
}