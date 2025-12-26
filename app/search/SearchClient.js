// app/search/SearchClient.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ToolCard from "../components/ToolCard";
import SearchControls from "../components/SearchControls";

const PAGE_SIZE = 20;

function clampPage(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 1;
  return x < 1 ? 1 : Math.floor(x);
}

function buildUrl(pathname, currentSearchParams, patch) {
  const sp = new URLSearchParams(currentSearchParams.toString());

  Object.entries(patch || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) {
      sp.delete(k);
      return;
    }
    const s = String(v).trim();
    if (s === "") {
      sp.delete(k);
      return;
    }
    sp.set(k, s);
  });

  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

function getPageWindow(current, total) {
  // Show: 1 ... (window) ... total
  // Keep it simple + readable
  const windowSize = 7; // total buttons shown (excluding prev/next)
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  pages.push(1);

  if (left > 2) pages.push("...");

  for (let p = left; p <= right; p++) {
    pages.push(p);
  }

  if (right < total - 1) pages.push("...");

  pages.push(total);

  return pages;
}

export default function SearchClient({ q, tag, page, sort, data }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const serverItems = Array.isArray(data?.items) ? data.items : [];
  const serverTotal = Number(data?.total ?? serverItems.length);

  const currentPage = clampPage(page);
  const totalPages = Math.max(1, Math.ceil(serverTotal / PAGE_SIZE));

  // Client-only state (no URL change)
  const [isFree, setIsFree] = useState(false);

  // Reset client-only filters when the user runs a new search (q/tag changes)
  useEffect(() => {
    setIsFree(false);
  }, [q, tag]);

  // IMPORTANT: do NOT client-sort when backend paging is used
  const filteredItems = useMemo(() => {
    let items = serverItems;

    // Client-side filter: Free only
    if (isFree) {
      items = items.filter((t) => t?.is_free === true);
    }

    return items;
  }, [serverItems, isFree]);

  function goToPage(nextPage) {
    const p = clampPage(nextPage);

    const url = buildUrl(pathname, sp, {
      q: q || undefined,
      tag: tag || undefined,
      // keep URL sort convention:
      // rating => sort=rating
      // newest => remove sort param
      sort: sort === "rating" ? "rating" : undefined,
      page: p,
    });

    router.push(url);
  }

  function onChangeSort(nextSort) {
    const s = String(nextSort || "").trim().toLowerCase();

    // newest => remove sort param; rating => keep sort=rating
    const sortParam = s === "rating" ? "rating" : undefined;

    const url = buildUrl(pathname, sp, {
      q: q || undefined,
      tag: tag || undefined,
      sort: sortParam,
      page: 1, // reset to first page on sort change
    });

    router.push(url);
  }

  const pageButtons = getPageWindow(currentPage, totalPages);

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
            onChangeSort={onChangeSort}
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
            Sorted by{" "}
            <span style={{ fontWeight: 600, color: "#111827" }}>
              {sort === "rating" ? "Top Rated" : "Newest First"}
            </span>
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

        {/* ✅ PAGINATION */}
        {serverTotal > 0 && totalPages > 1 && (
          <div
            style={{
              marginTop: 28,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: currentPage > 1 ? "pointer" : "not-allowed",
                opacity: currentPage > 1 ? 1 : 0.5,
              }}
            >
              Prev
            </button>

            {pageButtons.map((p, idx) => {
              if (p === "...") {
                return (
                  <span key={`dots-${idx}`} style={{ padding: "0 6px", color: "#6b7280", fontSize: 13 }}>
                    ...
                  </span>
                );
              }

              const active = p === currentPage;

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  disabled={active}
                  aria-current={active ? "page" : undefined}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: active ? "#111827" : "#fff",
                    color: active ? "#fff" : "#111827",
                    cursor: active ? "default" : "pointer",
                  }}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: currentPage < totalPages ? "pointer" : "not-allowed",
                opacity: currentPage < totalPages ? 1 : 0.5,
              }}
            >
              Next
            </button>
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
