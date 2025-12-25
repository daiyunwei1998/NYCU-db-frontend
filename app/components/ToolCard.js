// components/ToolCard.js
import Link from "next/link";

function buildSearchHref({ tag, q }) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (tag) params.set("tag", tag);
  // page resets automatically because we don't include it
  return `/search?${params.toString()}`;
}

function PillLink({ href, children, style }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}

export default function ToolCard({ tool }) {
  const tags = Array.isArray(tool.tags) ? tool.tags : [];
  const topTags = tags.slice(0, 6);

  const pricingText = tool.is_free
    ? "Free"
    : (tool.pricing && String(tool.pricing).trim() !== "")
      ? tool.pricing
      : "Paid";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 10,
          overflow: "hidden",
          background: "#f3f4f6",
          flex: "0 0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {tool.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={tool.logo_url}
            alt={`${tool.name} logo`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: 12, color: "#6b7280" }}>No logo</span>
        )}
      </div>

      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Link
            href={`/tools/${tool.tool_id}`}
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              textDecoration: "none",
              lineHeight: 1.2,
            }}
          >
            {tool.name}
          </Link>

          <span
            style={{
              fontSize: 12,
              padding: "4px 8px",
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              color: "#111827",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
            }}
          >
            {pricingText}
          </span>
        </div>

        {tool.short_description ? (
          <p
            style={{
              marginTop: 8,
              marginBottom: 10,
              color: "#374151",
              fontSize: 14,
              lineHeight: 1.5,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {tool.short_description}
          </p>
        ) : null}

        {/* Clickable Pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tool.primary_task_name ? (
            <PillLink
              href={buildSearchHref({ tag: tool.primary_task_name })}
              style={{
                fontSize: 12,
                padding: "3px 8px",
                borderRadius: 999,
                background: "#f3f4f6",
                color: "#111827",
              }}
              title={`Filter by ${tool.primary_task_name}`}
            >
              {tool.primary_task_name}
            </PillLink>
          ) : null}

          {topTags.map((t) => (
            <PillLink
              key={t}
              href={buildSearchHref({ tag: t })}
              style={{
                fontSize: 12,
                padding: "3px 8px",
                borderRadius: 999,
                border: "1px solid #e5e7eb",
                color: "#374151",
              }}
              title={`Filter by ${t}`}
            >
              {t}
            </PillLink>
          ))}
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {tool.visit_website_url ? (
            <a
              href={tool.visit_website_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "#2563eb", textDecoration: "none" }}
            >
              Visit website
            </a>
          ) : null}

          {tool.detail_url ? (
            <a
              href={tool.detail_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 13, color: "#2563eb", textDecoration: "none" }}
            >
              Detail page
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
