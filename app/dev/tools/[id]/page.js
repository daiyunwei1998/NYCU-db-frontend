"use client";

import { useState } from "react";
import { updateTool, deleteTool } from "../../../../lib/api";


export default function EditTool({ params }) {
  const [form, setForm] = useState({
    name: "",
    short_description: "",
    pricing: "",
  });

  return (
    <div style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>
        Edit Tool
      </h1>

      <input
        placeholder="Tool name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        style={input}
      />

      <textarea
        placeholder="Short description"
        value={form.short_description}
        onChange={(e) =>
          setForm({ ...form, short_description: e.target.value })
        }
        style={{ ...input, height: 100 }}
      />

      <input
        placeholder="Pricing"
        value={form.pricing}
        onChange={(e) => setForm({ ...form, pricing: e.target.value })}
        style={input}
      />

      <button style={primaryBtn}>Save</button>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const primaryBtn = {
  padding: "10px 16px",
  borderRadius: 10,
  background: "#2563eb",
  color: "#fff",
  border: "none",
  fontWeight: 600,
};
