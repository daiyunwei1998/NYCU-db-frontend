// lib/api.js

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://3.26.252.24:8000";
const API_PREFIX = "/api/v1";

/**
 * Build query string:
 * - omit undefined / null
 * - omit empty/whitespace strings
 */
function buildQuery(params) {
  const qs = new URLSearchParams();

  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (s === "") return;
    qs.set(k, s);
  });

  return qs.toString();
}

/**
 * Remove empty-string optional URL fields so FastAPI/Pydantic HttpUrl won't reject them.
 * (Do not touch non-URL fields.)
 */
function stripEmptyOptionalUrlFields(payload) {
  const out = { ...(payload || {}) };

  const urlFields = [
    "logo_url",
    "detail_url",
    "visit_website_url",
  ];

  for (const k of urlFields) {
    if (!(k in out)) continue;
    const v = out[k];

    if (v === undefined || v === null) {
      delete out[k];
      continue;
    }

    if (typeof v === "string" && v.trim() === "") {
      delete out[k];
      continue;
    }
  }

  return out;
}

/**
 * Always send JSON header.
 * MUST NOT break when called like fetchJson(url) with no options.
 */
async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers ? options.headers : {}),
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json();
}

export async function listTools({
  q = "",
  tag = "",
  sort = "rating",
  has_free_ver = false,
  page = 1,
  dev_name = "",
} = {}) {
  const query = buildQuery({
    q,
    tag,
    sort,
    page,
    has_free_ver: has_free_ver === true ? "true" : undefined,
    dev_name,
  });

  const url = `${API_BASE}${API_PREFIX}/tools${query ? `?${query}` : ""}`;
  return fetchJson(url);
}

export async function getTool(toolId) {
  if (toolId === undefined || toolId === null) {
    throw new Error("getTool(toolId) missing toolId");
  }
  const url = `${API_BASE}${API_PREFIX}/tools/${encodeURIComponent(toolId)}`;
  return fetchJson(url);
}

export async function listTags() {
  const url = `${API_BASE}${API_PREFIX}/tags`;
  return fetchJson(url);
}

export async function createTool(payload) {
  const url = `${API_BASE}${API_PREFIX}/tools`;

  const bodyPayload = stripEmptyOptionalUrlFields(payload);

  return fetchJson(url, {
    method: "POST",
    body: JSON.stringify(bodyPayload),
  });
}

export async function updateTool(toolId, payload) {
  if (toolId === undefined || toolId === null) {
    throw new Error("updateTool(toolId) missing toolId");
  }
  const url = `${API_BASE}${API_PREFIX}/tools/${encodeURIComponent(toolId)}`;

  const bodyPayload = stripEmptyOptionalUrlFields(payload);

  return fetchJson(url, {
    method: "PUT",
    body: JSON.stringify(bodyPayload),
  });
}

export async function deleteTool(toolId) {
  if (toolId === undefined || toolId === null) {
    throw new Error("deleteTool(toolId) missing toolId");
  }
  const url = `${API_BASE}${API_PREFIX}/tools/${encodeURIComponent(toolId)}`;

  return fetchJson(url, {
    method: "DELETE",
  });
}
