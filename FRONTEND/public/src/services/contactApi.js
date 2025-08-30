export const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${location.hostname}:3000`;

export async function createContact(payload, token) {
  const res = await fetch(url('emergency-contacts'), {
    method: 'POST',
    headers: { 'Content-Type':'application/json', Accept:'application/json', Authorization:`Bearer ${token}` },
    body: JSON.stringify(payload) // { fullname, relation, phone, email }
  });
  const json = await res.json(); if (!res.ok) throw new Error(json.message || `Error ${res.status}`);
  return json;
}

export async function listContacts({
    id, relation, phone, email, fullname, limit = 10, offset = 0
} = {}) {
    const params = new URLSearchParams();
    if (id) params.set('id', id);
    if (relation) params.set('relation', relation);
    if (phone) params.set('phone', phone);
    if (email) params.set('email', email);
    if (fullname) params.set('fullname', fullname);
    params.set('limit', limit);
    params.set('offset', offset);

    const res = await fetch(`${API_BASE}/?${params.toString()}`);
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al listar contactos de emergencia: ${res.status} ${txt}`);
    }
    return res.json();
}

export async function getContact(contact_id) {
    const res = await fetch(`${API_BASE}/${contact_id}`);
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al obtener contacto de emergencia: ${res.status} ${txt}`);
    }
    return res.json();
}

export async function updateContact(contact_id, updates) {
    const res = await fetch(`${API_BASE}/${contact_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al actualizar contacto de emergencia: ${res.status} ${txt}`);
    }
    return res.json();
}

export async function deleteContact(contact_id) {
    const res = await fetch(`${API_BASE}/${contact_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al eliminar contacto de emergencia: ${res.status} ${txt}`);
    }
    return res.json();
}
