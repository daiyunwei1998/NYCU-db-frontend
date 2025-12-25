// app/dev/page.js
"use client";

import { useEffect, useState } from "react";
import { DEV_USER } from "../../lib/devConfig";
import { listTools, createTool, updateTool, deleteTool } from "../../lib/api";

export default function DevPage() {
  const DEV_NAME = DEV_USER?.name || "Developer";

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // IMPORTANT: do NOT call this field "name" to avoid mixing with DEV_USER.name
  const emptyForm = {
    tool_name: "",
    logo_url: "", 
    visit_website_url: "",
    short_description: "",
    full_description: "",
    primary_task_name: "",
    is_free: false,
    tags_text: "",
    pricing_text: "",
  };

  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);

    const data = await listTools({ page: 1, dev_name: DEV_NAME });
    const items = Array.isArray(data?.items) ? data.items : [];

    // Backend may ignore dev_name query. Filter locally when dev_name exists in data.
    const mine =
      items.length > 0 && Object.prototype.hasOwnProperty.call(items[0], "dev_name")
        ? items.filter((t) => String(t?.dev_name || "") === DEV_NAME)
        : items;

    setTools(mine);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId("NEW");
    setForm(emptyForm);
  }

  function startEdit(tool) {
    const tagsArr = Array.isArray(tool.tags) ? tool.tags : [];
    const pricingStr = typeof tool.pricing === "string" ? tool.pricing : "";

    setEditingId(tool.tool_id);
    setForm({
      tool_name: tool.name || "",
      logo_url: tool.logo_url || "", 
      visit_website_url: tool.visit_website_url || "",
      short_description: tool.short_description || "",
      full_description: tool.full_description || "",
      primary_task_name: tool.primary_task_name || "",
      is_free: !!tool.is_free,
      tags_text: tagsArr.join(", "),
      pricing_text: pricingStr,
    });
  }

  function parseTags(tagsText) {
    const parts = String(tagsText || "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const seen = new Set();
    const out = [];
    for (const t of parts) {
      const key = t.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(t);
    }
    return out;
  }

  function buildBackendPayload() {
  const payload = {
    name: String(form.tool_name).trim(),
    visit_website_url: String(form.visit_website_url).trim(),
    short_description: String(form.short_description).trim(),
    full_description: String(form.full_description).trim(),
    primary_task_name: String(form.primary_task_name).trim(),
    is_free: !!form.is_free,
    tags: parseTags(form.tags_text),
    dev_name: DEV_NAME,
  };

  const logo = String(form.logo_url || "").trim();
  if (logo !== "") payload.logo_url = logo;

  const pricing = String(form.pricing_text || "").trim();
  if (pricing !== "") payload.pricing = pricing;

  return payload;
}


  async function submitForm(e) {
    e.preventDefault();

    const payload = buildBackendPayload();

    if (editingId === "NEW") {
      await createTool(payload);
    } else {
      await updateTool(editingId, payload);
    }

    setEditingId(null);
    setForm(emptyForm);
    load();
  }

  async function onDelete(toolId) {
    if (!confirm("Delete this tool?")) return;
    await deleteTool(toolId);
    load();
  }

  return (
    <main style={page}>
      <div style={wrap}>
        <header style={header}>
          <div>
            <h1 style={title}>
              Developer <span style={{ color: "#2563eb" }}>· {DEV_NAME}</span>
            </h1>
            <p style={subtitle}>Manage your tools</p>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a href="/" style={linkBtn}>← Back</a>
            <button onClick={startCreate} style={primaryBtn}>Add Tool</button>
          </div>
        </header>

        {editingId && (
          <form onSubmit={submitForm} style={panel}>
            <h3 style={{ margin: 0, marginBottom: 16 }}>
              {editingId === "NEW" ? "New Tool" : "Edit Tool"}
            </h3>

            <Field label="Tool Name (required)">
              <input
                value={form.tool_name}
                onChange={(e) => setForm((f) => ({ ...f, tool_name: e.target.value }))}
                required
                style={input}
              />
            </Field>

            <Field label="Logo URL (optional)">
                <input
                    value={form.logo_url}
                    onChange={(e) =>
                    setForm((f) => ({ ...f, logo_url: e.target.value }))
                    }
                    placeholder="https://example.com/logo.png"
                    style={input}
                />
            </Field>


            <Field label="Visit website URL (required)">
              <input
                value={form.visit_website_url}
                onChange={(e) =>
                  setForm((f) => ({ ...f, visit_website_url: e.target.value }))
                }
                required
                placeholder="https://example.com"
                style={input}
              />
            </Field>

            <Field label="Primary task (required)">
              <input
                value={form.primary_task_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, primary_task_name: e.target.value }))
                }
                required
                style={input}
              />
            </Field>

            <Field label="Short description (required)">
              <textarea
                value={form.short_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, short_description: e.target.value }))
                }
                required
                style={{ ...input, height: 84, resize: "vertical" }}
              />
            </Field>

            <Field label="Full description (required)">
              <textarea
                value={form.full_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_description: e.target.value }))
                }
                required
                style={{ ...input, height: 140, resize: "vertical" }}
              />
            </Field>

            <Field label="Tags (comma separated, can be empty)">
              <input
                value={form.tags_text}
                onChange={(e) => setForm((f) => ({ ...f, tags_text: e.target.value }))}
                placeholder="e.g. music, lyrics, generation"
                style={input}
              />
            </Field>

            <Field label="Pricing (optional, string)">
              <textarea
                value={form.pricing_text}
                onChange={(e) => setForm((f) => ({ ...f, pricing_text: e.target.value }))}
                placeholder={"Example:\nFree\nPro $10/mo\nEnterprise"}
                style={{ ...input, height: 110, resize: "vertical", fontFamily: "inherit" }}
              />
              <div style={helpText}>
                Stored as a single string in backend. One plan per line is OK.
              </div>
            </Field>

            <label style={checkboxRow}>
              <input
                type="checkbox"
                checked={form.is_free}
                onChange={(e) => setForm((f) => ({ ...f, is_free: e.target.checked }))}
              />
              Free tool (required boolean)
            </label>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button type="submit" style={primaryBtn}>
                {editingId === "NEW" ? "Create" : "Update"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                style={ghostBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section style={panel}>
          {loading && <p style={{ margin: 0 }}>Loading…</p>}

          {!loading && tools.length === 0 && (
            <p style={{ margin: 0, color: "#6b7280" }}>No tools yet.</p>
          )}

          {tools.map((tool) => (
            <div key={tool.tool_id} style={row}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: "#111827" }}>
                  {tool.name || "(no name)"}
                </div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  {tool.primary_task_name || "—"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button type="button" onClick={() => startEdit(tool)} style={editBtn}>
                  Edit
                </button>
                <button type="button" onClick={() => onDelete(tool.tool_id)} style={deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label style={field}>
      <span style={labelStyle}>{label}</span>
      <div style={{ width: "100%" }}>{children}</div>
    </label>
  );
}

/* ---------- styles ---------- */

const page = { minHeight: "100vh", background: "#ffffff", padding: "48px 24px" };
const wrap = { maxWidth: 960, margin: "0 auto" };
const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: 32,
};
const title = { fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: "-0.02em" };
const subtitle = { fontSize: 14, color: "#6b7280", margin: "6px 0 0 0" };
const panel = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 24,
  marginBottom: 28,
  width: "100%",
};
const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #e5e7eb",
  gap: 12,
};
const field = { display: "block", width: "100%", marginBottom: 16 };
const labelStyle = {
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 6,
  display: "block",
  color: "#111827",
};
const input = {
  width: "100%",
  boxSizing: "border-box",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  outline: "none",
};
const helpText = { marginTop: 6, fontSize: 12, color: "#6b7280" };
const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  fontSize: 14,
  fontWeight: 600,
  color: "#111827",
};
const primaryBtn = {
  padding: "10px 16px",
  borderRadius: 12,
  background: "#2563eb",
  color: "#fff",
  border: "1px solid #2563eb",
  fontWeight: 800,
  cursor: "pointer",
};
const ghostBtn = {
  padding: "10px 16px",
  borderRadius: 12,
  background: "#f3f4f6",
  color: "#111827",
  border: "1px solid #e5e7eb",
  fontWeight: 700,
  cursor: "pointer",
};
const linkBtn = {
  padding: "10px 12px",
  borderRadius: 12,
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: 700,
};
const editBtn = {
  padding: "8px 14px",
  borderRadius: 12,
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  color: "#2563eb",
  fontWeight: 800,
  cursor: "pointer",
};
const deleteBtn = {
  padding: "8px 14px",
  borderRadius: 12,
  border: "1px solid #fecaca",
  background: "#fee2e2",
  color: "#991b1b",
  fontWeight: 800,
  cursor: "pointer",
};
