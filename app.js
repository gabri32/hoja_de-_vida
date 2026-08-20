let fotoDataURL = null;
let expCounter = 0;
let eduCounter = 0;

// Foto preview
document.getElementById('foto').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    fotoDataURL = e.target.result;
    document.getElementById('preview-foto').src = fotoDataURL;
  };
  reader.readAsDataURL(file);
});

function agregarExperiencia() {
  const id = expCounter++;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `exp-${id}`;
  div.innerHTML = `
    <input type="text" placeholder="Cargo / Puesto" data-field="cargo" />
    <input type="text" placeholder="Empresa / Organización" data-field="empresa" />
    <div class="row">
      <input type="month" data-field="inicio" title="Fecha inicio" />
      <input type="month" data-field="fin" title="Fecha fin (vacío = Presente)" />
    </div>
    <input type="text" placeholder="Ciudad (opcional)" data-field="ciudad" />
    <textarea placeholder="Descripción de responsabilidades (opcional)" rows="2" data-field="descripcion"></textarea>
    <button class="remove-btn" onclick="eliminar('exp-${id}')">✕ Eliminar</button>
  `;
  document.getElementById('lista-experiencia').appendChild(div);
}

function agregarEducacion() {
  const id = eduCounter++;
  const div = document.createElement('div');
  div.className = 'entry-card';
  div.id = `edu-${id}`;
  div.innerHTML = `
    <input type="text" placeholder="Título / Grado" data-field="titulo" />
    <input type="text" placeholder="Institución" data-field="institucion" />
    <div class="row">
      <input type="month" data-field="inicio" title="Fecha inicio" />
      <input type="month" data-field="fin" title="Fecha fin (vacío = Presente)" />
    </div>
    <input type="text" placeholder="Descripción (opcional)" data-field="descripcion" />
    <button class="remove-btn" onclick="eliminar('edu-${id}')">✕ Eliminar</button>
  `;
  document.getElementById('lista-educacion').appendChild(div);
}

function eliminar(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function leerEntradas(contenedorId) {
  const cards = document.querySelectorAll(`#${contenedorId} .entry-card`);
  return Array.from(cards).map(card => {
    const obj = {};
    card.querySelectorAll('[data-field]').forEach(el => {
      obj[el.dataset.field] = el.value.trim();
    });
    return obj;
  });
}

function formatearFecha(mesAnio) {
  if (!mesAnio) return 'Presente';
  const [anio, mes] = mesAnio.split('-');
  const nombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${nombres[parseInt(mes) - 1]} ${anio}`;
}

function generarCV() {
  const nombre = document.getElementById('nombre').value.trim();
  const cargo = document.getElementById('cargo').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const ciudad = document.getElementById('ciudad').value.trim();
  const linkedin = document.getElementById('linkedin').value.trim();
  const perfil = document.getElementById('perfil').value.trim();
  const habilidades = document.getElementById('habilidades').value.trim();

  const experiencias = leerEntradas('lista-experiencia');
  const educacion = leerEntradas('lista-educacion');

  // Header
  const fotoHTML = fotoDataURL
    ? `<img src="${fotoDataURL}" alt="Foto" />`
    : '';

  const contactoItems = [email, telefono, ciudad, linkedin]
    .filter(Boolean)
    .map(v => `<span>${v}</span>`)
    .join('');

  let html = `
    <div class="cv-header">
      ${fotoHTML}
      <div class="cv-header-info">
        <h1>${nombre || 'Tu Nombre'}</h1>
        ${cargo ? `<div class="cargo">${cargo}</div>` : ''}
        <div class="contacto">${contactoItems}</div>
      </div>
    </div>
    <div class="cv-body">
  `;

  // Sidebar: perfil + habilidades
  html += `<div class="cv-sidebar">`;

  if (perfil) {
    html += `
      <div class="sidebar-section">
        <div class="sidebar-title">Perfil</div>
        <div class="sidebar-item">${perfil}</div>
      </div>
    `;
  }

  if (habilidades) {
    const skills = habilidades.split(',').map(s => s.trim()).filter(Boolean);
    html += `
      <div class="sidebar-section">
        <div class="sidebar-title">Habilidades</div>
        <div class="cv-habilidades" style="flex-direction:column;gap:5px">
          ${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}
        </div>
      </div>
    `;
  }

  if (educacion.length) {
    html += `<div class="sidebar-section"><div class="sidebar-title">Educación</div>`;
    educacion.forEach(edu => {
      const fechas = `${formatearFecha(edu.inicio)} — ${formatearFecha(edu.fin)}`;
      html += `
        <div style="margin-bottom:12px">
          <div style="font-weight:700;font-size:.82rem;color:#e0e6ff">${edu.titulo || '—'}</div>
          ${edu.institucion ? `<div style="font-size:.78rem;color:#7eb3ff">${edu.institucion}</div>` : ''}
          <div style="font-size:.74rem;color:rgba(200,215,255,.5);margin-top:2px">${fechas}</div>
        </div>
      `;
    });
    html += `</div>`;
  }

  html += `</div>`; // end sidebar

  // Main content: experiencia
  html += `<div class="cv-main">`;

  if (experiencias.length) {
    html += `<div class="cv-section"><div class="cv-section-title">Experiencia Laboral</div>`;
    experiencias.forEach(exp => {
      const fechas = `${formatearFecha(exp.inicio)} — ${formatearFecha(exp.fin)}`;
      html += `
        <div class="cv-entry">
          <div class="cv-entry-header">
            <div>
              <span class="cv-entry-titulo">${exp.cargo || '—'}</span>
              ${exp.empresa ? ` · <span class="cv-entry-empresa">${exp.empresa}</span>` : ''}
              ${exp.ciudad ? ` · <span style="font-size:.78rem;color:#888">${exp.ciudad}</span>` : ''}
            </div>
            <span class="cv-entry-fecha">${fechas}</span>
          </div>
          ${exp.descripcion ? `<p class="cv-entry-desc">${exp.descripcion}</p>` : ''}
        </div>
      `;
    });
    html += `</div>`;
  }

  html += `</div>`; // end main
  html += `</div>`; // end cv-body

  document.getElementById('cv-output').innerHTML = html;
}

function imprimirCV() {
  generarCV();
  setTimeout(() => window.print(), 300);
}

// Agregar una entrada de cada tipo por defecto al cargar
agregarExperiencia();
agregarEducacion();
