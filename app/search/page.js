import { listTools } from "../../lib/api";
import ToolCard from "../components/ToolCard";
import SearchControls from "../components/SearchControls";

export default async function SearchPage(props) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const tag = searchParams?.tag || "";
  const sort = searchParams?.sort || "rating";
  const isFree = searchParams?.has_free_ver === "true";
  const page = Number(searchParams?.page) || 1;

  const data = await listTools({ q, tag, sort, has_free_ver: isFree, page });
  const items = data?.items || [];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Sticky Top Header with Search & Filters */}
      <div style={{ position: "sticky", top: 0, backgroundColor: "#fff", zIndex: 100, borderBottom: "1px solid #eee", padding: "16px 0" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>
          <SearchControls q={q} tag={tag} sort={sort} isFree={isFree} />
        </div>
      </div>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: "600", margin: 0 }}>
             Results <span style={{ color: "#9ca3af", fontWeight: "400", marginLeft: 8 }}>({data.total})</span>
          </h2>
        </div>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {items.map((tool) => (
            <ToolCard key={tool.tool_id} tool={tool} />
          ))}
        </section>

        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0", color: "#6b7280" }}>
            <p style={{ fontSize: 18 }}>No tools found. Try adjusting your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}