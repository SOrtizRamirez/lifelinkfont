import"./script-BAeR12OA.js";const a="https://lifelinkback.onrender.com",b=new URLSearchParams(location.search),i=b.get("id"),l=document.getElementById("qr-data");if(!i)l.textContent="QR inválido";else{const n=await fetch(`${a}/public/qr/${encodeURIComponent(i)}`),t=await n.json();l.innerHTML=n.ok?`
      <p><b>Tipo de sangre:</b> ${t.data.blood_type||"-"}</p>
      <p><b>Alergias:</b> ${t.data.allergies||"-"}</p>
      <p><b>Enfermedades:</b> ${t.data.medical_conditions||"-"}</p>
      <p><b>Medicamentos:</b> ${t.data.current_medications||"-"}</p>
    `:t.message||"No encontrado"}document.getElementById("docLogin").addEventListener("submit",async n=>{n.preventDefault();const t=document.getElementById("email").value.trim(),m=document.getElementById("dpass").value,r=await fetch(`${a}/auth/doctor/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:t,password:m})}),c=await r.json();if(!r.ok)return alert(c.message||"Error de login doctor");const s=await fetch(`${a}/doctor/qr/${encodeURIComponent(i)}`,{headers:{Authorization:`Bearer ${c.token}`}}),d=await s.json();if(!s.ok)return alert(d.message||"No autorizado");const e=d.data,p=Array.isArray(e.emergency_contacts)&&e.emergency_contacts.length?e.emergency_contacts.map(o=>`<li><b>${o.fullname}</b> (${o.relation||"-"}) — ${o.phone||"-"} — ${o.email||"-"}</li>`).join(""):"<li>Sin contactos</li>";document.getElementById("doctor-view").innerHTML=`
      <h3>Vista médica</h3>
      <p><b>Cédula:</b> ${e.identity_document}</p>
      <p><b>Nombre:</b> ${e.name} ${e.last_name}</p>
      <p><b>Tipo de sangre:</b> ${e.blood_type||"-"}</p>
      <p><b>Alergias:</b> ${e.allergies||"-"}</p>
      <p><b>Enfermedades:</b> ${e.medical_conditions||"-"}</p>
      <p><b>Medicamentos:</b> ${e.current_medications||"-"}</p>
      <h4>Contactos de emergencia</h4>
      <ul>${p}</ul>
    `});
