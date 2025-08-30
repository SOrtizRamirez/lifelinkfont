// public/services/patientsApi.js
export const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${location.hostname}:3000`;

export async function createPatient(payload) {
    const res = await fetch(`${API_BASE}/patients/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error createPatient: ${res.status} ${txt}`);
    }
    return res.json();
}

// ------- READ (lista con filtros/paginación) -------
export async function listPatients({
        name, last_name, identity_document, gender, blood_type, email, qr_identifier,
        limit = 10, offset = 0
    } = {}) {
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (last_name) params.set('last_name', last_name);
    if (identity_document) params.set('identity_document', identity_document);
    if (gender) params.set('gender', gender);
    if (blood_type) params.set('blood_type', blood_type);
    if (email) params.set('email', email);
    if (qr_identifier) params.set('qr_identifier', qr_identifier);
    params.set('limit', limit);
    params.set('offset', offset);

    const res = await fetch(`${API_BASE}/patients?${params.toString()}`);
    if (!res.ok) throw new Error(`Error listPatients: ${res.status}`);
    return res.json();
}

// ------- READ (detalle por id) -------
export async function getPatient(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (!res.ok) throw new Error(`Error getPatient: ${res.status}`);
    return res.json();
}

// ------- UPDATE -------
export async function updatePatient(id, updates) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error updatePatient: ${res.status} ${errText}`);
    }
    return res.json();
}

// ------- DELETE -------
export async function deletePatient(id) {
    const res = await fetch(`${API_BASE}/patients/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error deletePatient: ${res.status}`);
    return res.json();
}
