import { createPatient, deletePatient, updatePatient } from './services/patientsApi.js';

const API = 'https://lifelinkback.vercel.app';
const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const token = localStorage.getItem('token');


const protectedPages = ['form.html', 'info.html'];
if (protectedPages.includes(page) && !token) {
    location.href = './index.html';
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identity_document = document.getElementById('doc').value.trim();
        const password = document.getElementById('pass').value;

        const res = await fetch(`${API}/auth/patient/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity_document, password }),
        });
        const data = await res.json();
        if (!res.ok) return alert(data.message || 'Error de login');

        localStorage.setItem('token', data.token);
        location.href = './info.html';
    });
}


const signupForm = document.getElementById('signupForm');
if (signupForm) signupForm.addEventListener('submit', onSubmitCreate);

const val = id => (document.getElementById(id)?.value ?? '').trim();

async function onSubmitCreate(e) {
    e.preventDefault();

    const payload = {
        identity_document: val('doc'),
        password:          val('pass'),
        name:              val('name'),
        last_name:         val('last_name'),
        blood_type:        val('blood_type'),
        allergies:         val('allergies'),
        medical_conditions:val('medical_conditions'),
        current_medications:val('current_medications'),
    };

    const missing = Object.entries({
        identity_document: payload.identity_document,
        password:          payload.password,
        name:              payload.name,
        last_name:         payload.last_name,
        blood_type:        payload.blood_type,
    }).filter(([,v]) => !v).map(([k]) => k);
    if (missing.length) {
        alert('Faltan: ' + missing.join(', '));
        return;
    }

    try {
        const { data } = await createPatient(payload);
        alert(`Cuenta creada. Tu QR es: ${data.qr_identifier}`);

        const url = `${location.origin}/qr.html?id=${encodeURIComponent(data.qr_identifier)}`;
        const box = document.getElementById('qr-result');
        if (box && window.QRCode) {
            box.innerHTML = `<p>Tu QR único:</p><div id="qr"></div><p>${url}</p>`;
            new QRCode(document.getElementById('qr'), url);
        }
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

const meContainer = document.getElementById('me');
const genQRBtn = document.getElementById('generate-qr');
if (meContainer) {
    (async () => {
        try {
            const res = await fetch(`${API}/patients/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 401) {
                localStorage.removeItem('token');
                return (location.href = './index.html');
            }
            const payload = await res.json();
            if (!res.ok) throw new Error(payload.message || 'Error obteniendo perfil');
            const p = payload.data;

            const qrUrl = `${location.origin}/qr.html?id=${encodeURIComponent(p.qr_identifier || '')}`;

            meContainer.innerHTML = `
        <p><b>Nombre:</b> ${p.name || ''} ${p.last_name || ''}</p>
        <p><b>Cédula:</b> ${p.identity_document}</p>
        <p><b>Sangre:</b> ${p.blood_type || '-'}</p>
        <p><b>Alergias:</b> ${p.allergies || '-'}</p>
        <p><b>Condiciones:</b> ${p.medical_conditions || '-'}</p>
        <p><b>Medicamentos:</b> ${p.current_medications || '-'}</p>
        <p><b>Tu QR:</b> ${p.qr_identifier ? qrUrl : 'Aún no generado'}</p>
        <div id="qrBox"></div>
      `;
            if (p.qr_identifier && window.QRCode) {
                new QRCode(document.getElementById('qrBox'), qrUrl);
            }
        } catch (e) {
            alert(e.message);
        }
    })();

    if (genQRBtn) {
        genQRBtn.addEventListener('click', async () => {
            try {
                const res = await fetch(`${API}/patients/me/qr`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    return (location.href = './index.html');
                }
                const out = await res.json();
                if (!res.ok) throw new Error(out.message || 'No se pudo generar/rotar QR');
                alert(`Nuevo QR: ${out.data.qr_identifier}`);
                location.reload();
            } catch (e) {
                alert(e.message);
            }
        });
    }
}

async function onDelete(id) {
    if (!confirm('¿Eliminar este paciente?')) return;
    await deletePatient(id);
    alert('Paciente eliminado');
}
async function onSubmitEdit(id) {
    const updates = {
        phone_number: document.getElementById('edit_phone').value.trim(),
        email: document.getElementById('edit_email').value.trim(),
    };
    await updatePatient(id, updates);
    alert('Paciente actualizado');
}
if (typeof window !== 'undefined') {
    window.onDelete = onDelete;
    window.onSubmitEdit = onSubmitEdit;
}


const logoutBtn = document.getElementById('close-session');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        location.href = './index.html';
    });
}

const goSignup = document.getElementById('go-signup');
if (goSignup) goSignup.addEventListener('click', () => (location.href = 'signup.html'));
