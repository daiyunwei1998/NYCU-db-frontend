"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FilterBar({ availableTags = [] }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const navigate = (params) => {
    const qs = new URLSearchParams(params);
    router.push(`/search?${qs.toString()}`);
  };

  return (
    <div style={{ width: "100%" }}>
      <form onSubmit={e => { e.preventDefault(); navigate({ q }); }} style={{ position: "relative", marginBottom: 32 }}>
        <input 
          value={q} onChange={e => setQ(e.target.value)}
          placeholder="Try 'AI Logo Generator'..." 
          style={{ width: "100%", padding: "24px 140px 24px 32px", fontSize: 20, borderRadius: 100, border: "1px solid #e5e7eb", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", outline: "none" }}
        />
        <button type="submit" style={{ position: "absolute", right: 12, top: 12, bottom: 12, padding: "0 32px", background: "#000", color: "#fff", border: "none", borderRadius: 100, fontWeight: "700", cursor: "pointer" }}>
          Search
        </button>
      </form>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {availableTags.map(t => (
          <button key={t.tag} onClick={() => navigate({ tag: t.tag })} style={{ padding: "12px 24px", borderRadius: 100, border: "1px solid #e5e7eb", backgroundColor: "#fff", cursor: "pointer", fontSize: 15, fontWeight: "500" }}>
            {t.tag} <span style={{ opacity: 0.4, marginLeft: 6 }}>{t.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}