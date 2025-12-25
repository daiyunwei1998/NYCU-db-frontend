// app/search/SearchClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import ToolCard from "../components/ToolCard";
import SearchControls from "../components/SearchControls";

export default function SearchClient({ q, tag, page, data }) {
  const serverItems = Array.isArray(data?.items) ? data.items : [];
  const serverTotal = Number(data?.total ?? serverItems.length);

  // Client-only state (no URL change)
  const [isFree, setIsFree] = useState(false);
  const [sort, setSort] = useState("rating"); // "rating" | "newest"

  // Reset client-only filters when the user runs a new search (q/tag changes)
  useEffect(() => {
    setIsFree(false);
    setSort("rating");
  }, [q, tag]);

  const filteredItems = useMemo(() => {
    let items = serverItems;

    // Client-side filter: Free only
    if (isFree) {
      items = items.filter((t) => t?.is_free === true);
    }

    // Client-side sort
    items = [...items];
    if (sort === "newest") {
      items.sort((a, b) => {
        const ta = new Date(a?.created_at || 0).getTime();
        const tb = new Date(b?.created_at || 0).getTime();
        return tb - ta;
      });
    } else {
      items.sort((a, b) => Number(b?.rating || 0) - Number(a?.rating || 0));
    }

    return items;
  }, [serverItems, isFree, sort]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", display: "flex", flexDirection: "column" }}>
      {/* Sticky Top Header with Search & Filters */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 100,
          borderBottom: "1px solid #eee",
          padding: "16px 0",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <SearchControls
            q={q}
            tag={tag}
            sort={sort}
            isFree={isFree}
            onChangeSort={setSort}
            onToggleFree={() => setIsFree((v) => !v)}
            onClearFree={() => setIsFree(false)}
          />
        </div>
      </div>

      {/* Content */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px", width: "100%", flex: "1 1 auto" }}>
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: "600", margin: 0 }}>
            Results{" "}
            <span style={{ color: "#9ca3af", fontWeight: "400", marginLeft: 8 }}>
              ({filteredItems.length} shown / {serverTotal} total)
            </span>
          </h2>

          <div style={{ fontSize: 13, color: "#6b7280" }}>
            Sorted by <span style={{ fontWeight: 600, color: "#111827" }}>{sort}</span>
          </div>
        </div>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {filteredItems.map((tool) => (
            <ToolCard key={tool.tool_id} tool={tool} />
          ))}
        </section>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#6b7280" }}>
            <p style={{ fontSize: 18 }}>No tools found. Try adjusting your filters.</p>
          </div>
        )}
      </main>

      {/* Footer with Developer entrance */}
      <footer
        style={{
          borderTop: "1px solid #eee",
          padding: "18px 20px",
          background: "#fff",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            AI Tools Catalog
            <span style={{ margin: "0 8px", color: "#d1d5db" }}>·</span>
            Browse, filter, and compare tools
          </div>

          <a
            href="/dev"
            style={{
              fontSize: 13,
              color: "#6b7280",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
            }}
            title="Developer console"
          >
            <span aria-hidden="true" style={{ fontSize: 15 }}>⚙︎</span>
            Developer
          </a>
        </div>
      </footer>
    </div>
  );
}
