const API = import.meta.env?.VITE_API_BASE_URL
  || (location.hostname === 'localhost'
        ? 'http://localhost:3000'             // dev
        : 'https://lifelinkback.onrender.com' // prod seguro (https al BACKEND)
     );

function url(path, params) {
  const base = API.endsWith('/') ? API : API + '/';
  const u = new URL(path, base);
  if (params) for (const [k, v] of Object.entries(params)) if (v != null) u.searchParams.set(k, v);
  return u.toString();
}

function authHeaders(token = localStorage.getItem('token')) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function asJson(res) {
  const text = await res.text();
  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  const data = isJson && text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.message || `HTTP ${res.status}: ${text.slice(0,200)}`);
  return data;
}

export async function createContact(payload, token) {
  const res = await fetch(url('emergency-contacts'), {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Accept':'application/json', ...authHeaders(token) },
    body: JSON.stringify(payload) // { fullname, relation, phone, email }
  });
  return asJson(res);
}

export async function listContacts({ relation, phone, email, fullname, limit = 10, offset = 0 } = {}, token) {
  const res = await fetch(
    url('emergency-contacts', { relation, phone, email, fullname, limit, offset }),
    { headers: { 'Accept':'application/json', ...authHeaders(token) } }
  );
  return asJson(res);
}

export async function getContact(contact_id, token) {
  const res = await fetch(url(`emergency-contacts/${encodeURIComponent(contact_id)}`), {
    headers: { 'Accept':'application/json', ...authHeaders(token) }
  });
  return asJson(res);
}

export async function updateContact(contact_id, updates, token) {
  const res = await fetch(url(`emergency-contacts/${encodeURIComponent(contact_id)}`), {
    method: 'PUT',
    headers: { 'Content-Type':'application/json', 'Accept':'application/json', ...authHeaders(token) },
    body: JSON.stringify(updates)
  });
  return asJson(res);
}

export async function deleteContact(contact_id, token) {
  const res = await fetch(url(`emergency-contacts/${encodeURIComponent(contact_id)}`), {
    method: 'DELETE',
    headers: { 'Accept':'application/json', ...authHeaders(token) }
  });
  return asJson(res);
}
