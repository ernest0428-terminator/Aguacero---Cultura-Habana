// script.js - Cultura Habana
// Navegación, pantallas, listas horizontales, modal, etc.

let map = null;
let marker = null;
let currentStep = 1;
let posterDataURL = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar eventos
    await cargarEventos();
    
    // Inicializar pantalla de inicio
    renderizarInicio();
    
    // Inicializar pantalla de calendario
    inicializarCalendario();
    renderizarFiltrosCategorias();
    
    // Configurar navegación del menú
    configurarNavegacion();
    
    // Configurar buscador global
    configurarBuscador();
    
    // Configurar wizard del formulario
    configurarWizard();
    
    // Configurar modal
    configurarModal();
    
    // Cargar eventos en calendario (fecha actual)
    const hoy = new Date().toISOString().split('T')[0];
    renderizarEventosEnCalendario(hoy);
});

// ==================== NAVEGACIÓN ENTRE PANTALLAS ====================
function configurarNavegacion() {
    const menuItems = document.querySelectorAll('.menu-item-static');
    const pantallas = document.querySelectorAll('.pantalla');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const pantallaId = item.getAttribute('data-pantalla');
            
            // Activar item del menú
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            // Mostrar pantalla correspondiente
            pantallas.forEach(p => p.classList.remove('active'));
            document.getElementById(`pantalla-${pantallaId}`).classList.add('active');
            
            // Si es calendario, refresh
            if (pantallaId === 'calendario') {
                const fechaSeleccionada = document.getElementById('calendario-input')?.value;
                if (fechaSeleccionada) {
                    renderizarEventosEnCalendario(fechaSeleccionada);
                }
            }
            
            // Cerrar menú en móvil
            if (window.innerWidth <= 700) {
                document.body.classList.remove('sidebar-hidden');
            }
        });
    });
}

function configurarBuscador() {
    const buscador = document.getElementById('buscador-global');
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const termino = e.target.value;
            const resultados = buscarEventos(termino);
            
            // Mostrar resultados en la pantalla actual
            const pantallaActiva = document.querySelector('.pantalla.active');
            if (pantallaActiva.id === 'pantalla-inicio') {
                renderizarInicioConResultados(resultados);
            } else if (pantallaActiva.id === 'pantalla-calendario') {
                renderizarListaEventos(resultados);
            }
        });
    }
}

// ==================== PANTALLA INICIO ====================
function renderizarInicio() {
    renderizarInicioConResultados(eventosGlobales);
}

function renderizarInicioConResultados(eventosFiltrados) {
    const contenedor = document.getElementById('contenedor-listas-inicio');
    if (!contenedor) return;
    
    // Guardar eventos originales para no modificar
    const eventos = eventosFiltrados || eventosGlobales;
    
    // Obtener eventos de "Esta semana"
    const eventosSemana = eventos.filter(evento => {
        const hoy = new Date();
        const fechaEvento = new Date(evento.fechaInicio);
        const dentroDe7Dias = new Date();
        dentroDe7Dias.setDate(hoy.getDate() + 7);
        return fechaEvento >= hoy && fechaEvento <= dentroDe7Dias;
    }).sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    
    // Agrupar por categoría (solo categorías con eventos)
    const eventosPorCategoria = {};
    eventos.forEach(evento => {
        const cat = evento.categoria;
        if (!eventosPorCategoria[cat]) {
            eventosPorCategoria[cat] = [];
        }
        eventosPorCategoria[cat].push(evento);
    });
    
    // Ordenar eventos dentro de cada categoría por fecha ascendente
    for (let cat in eventosPorCategoria) {
        eventosPorCategoria[cat].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    }
    
    // Construir HTML
    let html = '';
    
    // Lista "Esta semana"
    html += `
        <div class="lista-horizontal-container">
            <h2>🎯 Esta semana</h2>
            <div class="lista-horizontal">
                ${renderizarTarjetasEventos(eventosSemana)}
            </div>
        </div>
    `;
    
    // Listas por categoría (solo las que tienen eventos)
    for (const [categoria, eventosCat] of Object.entries(eventosPorCategoria)) {
        if (eventosCat.length > 0) {
            const icono = getIconoCategoria(categoria);
            html += `
                <div class="lista-horizontal-container">
                    <h2>${icono} ${categoria}</h2>
                    <div class="lista-horizontal">
                        ${renderizarTarjetasEventos(eventosCat)}
                    </div>
                </div>
            `;
        }
    }
    
    if (html === '') {
        html = '<div class="loading-spinner">No hay eventos disponibles</div>';
    }
    
    contenedor.innerHTML = html;
    
    // Agregar event listeners a las tarjetas
    document.querySelectorAll('.evento-card').forEach(card => {
        card.addEventListener('click', () => {
            const eventoId = card.getAttribute('data-id');
            const evento = eventosGlobales.find(e => e.id === eventoId);
            if (evento) mostrarDetalleEvento(evento);
        });
    });
}

function renderizarTarjetasEventos(eventos) {
    if (!eventos || eventos.length === 0) {
        return '<div class="loading-spinner">No hay eventos</div>';
    }
    
    return eventos.map(evento => `
        <div class="evento-card" data-id="${evento.id}">
            ${evento.poster ? 
                `<img class="evento-poster" src="${evento.poster}" alt="${evento.nombre}">` :
                `<div class="evento-poster-placeholder">📷 ${evento.nombre}</div>`
            }
        </div>
    `).join('');
}

function getIconoCategoria(categoria) {
    const iconos = {
        'Conciertos': '🎵',
        'Teatro': '🎭',
        'Cine': '🎬',
        'Exposiciones': '🖼️',
        'Danza': '💃',
        'Libros': '📚',
        'Festival': '🎉',
        'Infantiles': '🧸',
        'Deportes': '⚽',
        'Talleres': '🔧',
        'Museos': '🏛️',
        'Ferias': '🛍️',
        'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

// ==================== PANTALLA CALENDARIO ====================
function inicializarCalendario() {
    const inputCalendario = document.getElementById('calendario-input');
    if (inputCalendario) {
        flatpickr(inputCalendario, {
            dateFormat: "Y-m-d",
            locale: "es",
            onChange: function(selectedDates, dateStr) {
                renderizarEventosEnCalendario(dateStr);
            }
        });
        // Fecha actual por defecto
        const hoy = new Date().toISOString().split('T')[0];
        inputCalendario.value = hoy;
    }
}

function renderizarFiltrosCategorias() {
    const container = document.getElementById('filtros-categorias');
    if (!container) return;
    
    const categorias = getCategoriasConEventos();
    
    container.innerHTML = categorias.map(cat => `
        <label>
            <input type="checkbox" class="filtro-categoria" value="${cat}" checked>
            ${getIconoCategoria(cat)} ${cat}
        </label>
    `).join('');
    
    // Agregar event listeners
    document.querySelectorAll('.filtro-categoria').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const fecha = document.getElementById('calendario-input')?.value;
            if (fecha) renderizarEventosEnCalendario(fecha);
        });
    });
}

function renderizarEventosEnCalendario(fecha) {
    // Obtener categorías seleccionadas
    const categoriasSeleccionadas = Array.from(document.querySelectorAll('.filtro-categoria:checked'))
        .map(cb => cb.value);
    
    // Filtrar eventos por fecha y categorías
    let eventosFiltrados = getEventosPorFecha(fecha);
    
    if (categoriasSeleccionadas.length > 0) {
        eventosFiltrados = eventosFiltrados.filter(e => categoriasSeleccionadas.includes(e.categoria));
    }
    
    // Orden
    const orden = document.getElementById('orden-eventos')?.value || 'asc';
    eventosFiltrados.sort((a, b) => {
        const fechaA = new Date(a.fechaInicio);
        const fechaB = new Date(b.fechaInicio);
        return orden === 'asc' ? fechaA - fechaB : fechaB - fechaA;
    });
    
    renderizarListaEventos(eventosFiltrados);
}

function renderizarListaEventos(eventos) {
    const container = document.getElementById('lista-eventos-calendario');
    if (!container) return;
    
    if (eventos.length === 0) {
        container.innerHTML = '<div class="loading-spinner">No hay eventos para esta fecha</div>';
        return;
    }
    
    container.innerHTML = eventos.map(evento => `
        <div class="evento-grid-card" data-id="${evento.id}">
            ${evento.poster ? 
                `<img class="evento-grid-img" src="${evento.poster}" alt="${evento.nombre}">` :
                `<div class="evento-grid-img" style="background: var(--color-border); display: flex; align-items: center; justify-content: center;">📷</div>`
            }
            <div class="evento-grid-info">
                <h4>${evento.nombre}</h4>
                <p class="fecha">📅 ${formatFecha(evento.fechaInicio)} ${evento.horaInicio ? '⏰ ' + evento.horaInicio : ''}</p>
                <p>📍 ${evento.ubicacion?.substring(0, 30) || 'Sin ubicación'}</p>
                <span class="categoria">${getIconoCategoria(evento.categoria)} ${evento.categoria}</span>
            </div>
        </div>
    `).join('');
    
    // Event listeners
    document.querySelectorAll('.evento-grid-card').forEach(card => {
        card.addEventListener('click', () => {
            const eventoId = card.getAttribute('data-id');
            const evento = eventosGlobales.find(e => e.id === eventoId);
            if (evento) mostrarDetalleEvento(evento);
        });
    });
}

// ==================== MODAL DETALLE EVENTO ====================
function configurarModal() {
    // Crear modal si no existe
    if (!document.getElementById('modal-evento')) {
        const modalHTML = `
            <div id="modal-evento" class="modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <div class="modal-body"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.querySelector('.modal-close')?.addEventListener('click', () => {
            document.getElementById('modal-evento').classList.remove('active');
        });
        
        document.getElementById('modal-evento')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal-evento')) {
                e.target.classList.remove('active');
            }
        });
    }
}

function mostrarDetalleEvento(evento) {
    const modal = document.getElementById('modal-evento');
    const modalBody = modal?.querySelector('.modal-body');
    
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        ${evento.poster ? `<img class="modal-poster" src="${evento.poster}" alt="${evento.nombre}">` : ''}
        <span class="modal-categoria">${getIconoCategoria(evento.categoria)} ${evento.categoria}</span>
        <h3>${evento.nombre}</h3>
        <p><strong>📅 Fecha:</strong> ${formatFecha(evento.fechaInicio)} ${evento.horaInicio ? 'a las ' + evento.horaInicio : ''}</p>
        ${evento.fechaFin && evento.fechaFin !== evento.fechaInicio ? `<p><strong>📅 Hasta:</strong> ${formatFecha(evento.fechaFin)}</p>` : ''}
        <p><strong>📍 Ubicación:</strong> ${evento.ubicacion || 'No especificada'}</p>
        <p><strong>💰 Precio:</strong> ${evento.precio === 0 ? 'Gratis' : `$${evento.precio}`}</p>
        ${evento.descripcion ? `<p><strong>📝 Descripción:</strong> ${evento.descripcion}</p>` : ''}
        ${evento.organizador ? `<p><strong>👤 Organizador:</strong> ${evento.organizador}</p>` : ''}
        ${evento.telefono ? `<p><strong>📞 Contacto:</strong> ${evento.telefono}</p>` : ''}
    `;
    
    modal.classList.add('active');
}

function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ==================== WIZARD FORMULARIO ====================
function configurarWizard() {
    const nextBtn = document.getElementById('wizard-next');
    const prevBtn = document.getElementById('wizard-prev');
    const submitBtn = document.getElementById('wizard-submit');
    const form = document.getElementById('form-evento');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => cambiarPaso(1));
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => cambiarPaso(-1));
    }
    if (form) {
        form.addEventListener('submit', enviarEvento);
    }
    
    // Subida de poster
    const uploadArea = document.getElementById('poster-upload');
    const posterInput = document.getElementById('evento-poster');
    if (uploadArea && posterInput) {
        uploadArea.addEventListener('click', () => posterInput.click());
        posterInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    posterDataURL = event.target.result;
                    const preview = document.getElementById('poster-preview');
                    if (preview) {
                        preview.innerHTML = `<img src="${posterDataURL}" alt="Poster preview">`;
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Inicializar mapa en paso 2 (se crea cuando se muestra)
    inicializarMapaCuandoVisible();
}

function cambiarPaso(delta) {
    const nuevoPaso = currentStep + delta;
    if (nuevoPaso < 1 || nuevoPaso > 3) return;
    
    // Validar paso actual antes de avanzar
    if (delta === 1 && !validarPasoActual()) return;
    
    // Ocultar paso actual
    document.querySelector(`.step-${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    currentStep = nuevoPaso;
    
    // Mostrar nuevo paso
    document.querySelector(`.step-${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    
    // Actualizar botones
    const nextBtn = document.getElementById('wizard-next');
    const prevBtn = document.getElementById('wizard-prev');
    const submitBtn = document.getElementById('wizard-submit');
    
    if (prevBtn) prevBtn.disabled = (currentStep === 1);
    
    if (currentStep === 3) {
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) submitBtn.style.display = 'inline-block';
    } else {
        if (nextBtn) nextBtn.style.display = 'inline-block';
        if (submitBtn) submitBtn.style.display = 'none';
    }
    
    // Si es paso 2, refrescar mapa
    if (currentStep === 2) {
        setTimeout(() => refrescarMapa(), 100);
    }
}

function validarPasoActual() {
    if (currentStep === 1) {
        const nombre = document.getElementById('evento-nombre')?.value;
        const categoria = document.getElementById('evento-categoria')?.value;
        const fechaInicio = document.getElementById('evento-fecha-inicio')?.value;
        const horaInicio = document.getElementById('evento-hora-inicio')?.value;
        
        if (!nombre) { alert('Por favor, ingresa el nombre del evento'); return false; }
        if (!categoria) { alert('Por favor, selecciona una categoría'); return false; }
        if (!fechaInicio) { alert('Por favor, selecciona la fecha de inicio'); return false; }
        if (!horaInicio) { alert('Por favor, selecciona la hora de inicio'); return false; }
    }
    if (currentStep === 2) {
        const municipio = document.getElementById('evento-municipio')?.value;
        const sede = document.getElementById('evento-sede')?.value;
        const direccion = document.getElementById('evento-direccion')?.value;
        
        if (!municipio) { alert('Por favor, selecciona el municipio'); return false; }
        if (!sede) { alert('Por favor, ingresa la sede o lugar'); return false; }
        if (!direccion) { alert('Por favor, ingresa la dirección'); return false; }
    }
    return true;
}

function inicializarMapaCuandoVisible() {
    // Observer para crear mapa cuando el paso 2 se hace visible
    const step2 = document.querySelector('.step-2');
    if (!step2) return;
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (step2.classList.contains('active') && !map) {
                iniciarMapa();
            }
        });
    });
    observer.observe(step2, { attributes: true, attributeFilter: ['class'] });
}

function iniciarMapa() {
    const lat = 23.1136;
    const lng = -82.3666;
    
    map = L.map('mapa').setView([lat, lng], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
    }).addTo(map);
    
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    
    marker.on('dragend', function() {
        const pos = marker.getLatLng();
        document.getElementById('evento-lat').value = pos.lat;
        document.getElementById('evento-lng').value = pos.lng;
    });
    
    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        document.getElementById('evento-lat').value = e.latlng.lat;
        document.getElementById('evento-lng').value = e.latlng.lng;
    });
}

function refrescarMapa() {
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
}

async function enviarEvento(e) {
    e.preventDefault();
    
    const responsable = document.getElementById('evento-responsable')?.checked;
    const terminos = document.getElementById('evento-terminos')?.checked;
    
    if (!responsable) { alert('Debes aceptar la responsabilidad de la información'); return; }
    if (!terminos) { alert('Debes aceptar los términos y condiciones'); return; }
    
    const eventoData = {
        nombre: document.getElementById('evento-nombre')?.value,
        categoria: document.getElementById('evento-categoria')?.value,
        descripcion: document.getElementById('evento-descripcion')?.value,
        fechaInicio: document.getElementById('evento-fecha-inicio')?.value,
        fechaFin: document.getElementById('evento-fecha-fin')?.value || document.getElementById('evento-fecha-inicio')?.value,
        horaInicio: document.getElementById('evento-hora-inicio')?.value,
        horaFin: document.getElementById('evento-hora-fin')?.value,
        precio: parseFloat(document.getElementById('evento-precio')?.value) || 0,
        maxInvitados: document.getElementById('evento-max-invitados')?.value,
        aptoMenores: document.getElementById('evento-menores')?.checked,
        aireLibre: document.getElementById('evento-aire-libre')?.checked,
        posibilidadReserva: document.getElementById('evento-reservas')?.checked,
        municipio: document.getElementById('evento-municipio')?.value,
        sede: document.getElementById('evento-sede')?.value,
        ubicacion
