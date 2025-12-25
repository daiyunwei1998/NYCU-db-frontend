const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://3.26.252.24:8000";

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

async function fetchJson(url, options) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options && options.headers ? options.headers : {}),
      "Content-Type": "application/json",
    },
    // Next.js App Router: opt out of caching so list reflects latest CSV writes
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`);
  }

  return res.json();
}

export async function listTools({ q = "", tag = "", sort = "rating", has_free_ver = "", page = 1 }) {
  const query = new URLSearchParams({ 
    q, 
    tag, 
    sort, 
    page,
    // Send 1 or true if filtered, otherwise don't send
    has_free_ver: has_free_ver ? "true" : "" 
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools?${query}`, {
    cache: 'no-store'
  });
  if (!res.ok) throw new Error("Failed to fetch tools");
  return res.json();
}

export async function getTool(toolId) {
  if (toolId === undefined || toolId === null) {
    throw new Error("getTool(toolId) missing toolId");
  }
  const url = `${API_BASE}/api/v1/tools/${encodeURIComponent(toolId)}`;
  return fetchJson(url);
}

export async function listTags() {
  // Use no-store to bypass the Next.js Data Cache during development
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tags`, {
    cache: 'no-store' 
  });
  
  if (!res.ok) throw new Error("Failed to fetch tags");
  return res.json();
}
