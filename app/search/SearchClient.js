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

  // When the user does a NEW SEARCH (q/tag changes), reset client filters
  useEffect(() => {
    setIsFree(false);
    setSort("rating");
  }, [q, tag]);

  const filteredItems = useMemo(() => {
    let items = serverItems;

    // 1) client-side filter: free only
    if (isFree) {
      items = items.filter((t) => t?.has_free_ver === true);
      // If your backend doesn't provide has_free_ver on each item, you must compute it in backend
      // or include pricing field and compute here.
    }

    // 2) client-side sort
    items = [...items];
    if (sort === "newest") {
      // assuming you have created_at or published_at or something sortable
      // if you don't, either add it in backend or remove this sort option
      items.sort((a, b) => {
        const ta = new Date(a?.created_at || 0).getTime();
        const tb = new Date(b?.created_at || 0).getTime();
        return tb - ta;
      });
    } else {
      // rating desc
      items.sort((a, b) => (Number(b?.rating || 0) - Number(a?.rating || 0)));
    }

    return items;
  }, [serverItems, isFree, sort]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
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
            // client-state controlled
            sort={sort}
            isFree={isFree}
            onChangeSort={setSort}
            onToggleFree={() => setIsFree((v) => !v)}
            onClearFree={() => setIsFree(false)}
          />
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
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
            <span
              style={{
                color: "#9ca3af",
                fontWeight: "400",
                marginLeft: 8,
              }}
            >
              ({filteredItems.length} shown / {serverTotal} total)
            </span>
          </h2>
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
          <div
            style={{
              textAlign: "center",
              padding: "100px 0",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: 18 }}>
              No tools found. Try adjusting your filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
