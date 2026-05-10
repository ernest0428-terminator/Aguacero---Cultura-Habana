// api.js - Comunicación con el backend

// Configuración - Cambiar cuando tengas el servidor desplegado
const API_URL = 'http://localhost:3000/api';

// Variable global para almacenar eventos
let eventosGlobales = [];

// ==================== CARGAR EVENTOS ====================
async function cargarEventos() {
    try {
        const response = await fetch(`${API_URL}/eventos`);
        if (!response.ok) throw new Error('Error al cargar eventos');
        eventosGlobales = await response.json();
        return eventosGlobales;
    } catch (error) {
        console.error('Error:', error);
        // Datos de ejemplo mientras no hay backend
        eventosGlobales = getEventosEjemplo();
        return eventosGlobales;
    }
}

// Eventos de ejemplo (mientras desarrollas el backend)
function getEventosEjemplo() {
    return [
        {
            id: '1',
            nombre: 'Concierto de Jazz en la Plaza',
            categoria: 'Conciertos',
            descripcion: 'Disfruta del mejor jazz cubano en la Plaza Vieja',
            fechaInicio: '2026-05-15',
            fechaFin: '2026-05-15',
            horaInicio: '20:00',
            horaFin: '23:00',
            precio: 500,
            ubicacion: 'Plaza Vieja, La Habana Vieja',
            poster: 'https://picsum.photos/id/30/400/300',
            organizador: 'Jazz Club Habana',
            telefono: '+53 55555555',
            lat: 23.1393,
            lng: -82.3523
        },
        {
            id: '2',
            nombre: 'Exposición de Arte Contemporáneo',
            categoria: 'Exposiciones',
            descripcion: 'Obras de artistas cubanos emergentes',
            fechaInicio: '2026-05-18',
            fechaFin: '2026-06-10',
            horaInicio: '10:00',
            horaFin: '18:00',
            precio: 200,
            ubicacion: 'Factoría Habana, Calle 26',
            poster: 'https://picsum.photos/id/20/400/300',
            organizador: 'Factoría Habana',
            telefono: '+53 77778888',
            lat: 23.1234,
            lng: -82.3876
        },
        {
            id: '3',
            nombre: 'Cine Cubano: Retrospectiva',
            categoria: 'Cine',
            descripcion: 'Funciones especiales de cine cubano clásico',
            fechaInicio: '2026-05-20',
            fechaFin: '2026-05-25',
            horaInicio: '15:00',
            horaFin: '22:00',
            precio: 100,
            ubicacion: 'Cine Yara, Calle 23',
            poster: 'https://picsum.photos/id/1/400/300',
            organizador: 'ICAIC',
            telefono: '+53 77774444',
            lat: 23.1385,
            lng: -82.3826
        },
        {
            id: '4',
            nombre: 'Festival de Danza',
            categoria: 'Danza',
            descripcion: 'Compañías de danza de toda la isla',
            fechaInicio: '2026-05-22',
            fechaFin: '2026-05-24',
            horaInicio: '19:00',
            horaFin: '21:30',
            precio: 800,
            ubicacion: 'Gran Teatro de La Habana',
            poster: 'https://picsum.photos/id/36/400/300',
            organizador: 'Gran Teatro',
            telefono: '+53 77776666',
            lat: 23.1372,
            lng: -82.3597
        },
        {
            id: '5',
            nombre: 'Feria del Libro',
            categoria: 'Libros',
            descripcion: 'Presentaciones y firmas de autores',
            fechaInicio: '2026-05-25',
            fechaFin: '2026-06-05',
            horaInicio: '09:00',
            horaFin: '20:00',
            precio: 0,
            ubicacion: 'Fortaleza de San Carlos de la Cabaña',
            poster: 'https://picsum.photos/id/0/400/300',
            organizador: 'Instituto del Libro',
            telefono: '+53 77779999',
            lat: 23.1455,
            lng: -82.3492
        }
    ];
}

// ==================== FILTRAR EVENTOS POR CATEGORÍA Y FECHA ====================
function filtrarEventosPorCategoria(fechaInicio = null) {
    const categoriasConEventos = {};
    
    eventosGlobales.forEach(evento => {
        const cat = evento.categoria;
        if (!categoriasConEventos[cat]) {
            categoriasConEventos[cat] = [];
        }
        categoriasConEventos[cat].push(evento);
    });
    
    // Ordenar eventos dentro de cada categoría por fecha (ascendente)
    for (let cat in categoriasConEventos) {
        categoriasConEventos[cat].sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    }
    
    return categoriasConEventos;
}

// Obtener eventos de "Esta semana" (próximos 7 días)
function getEventosEstaSemana() {
    const hoy = new Date();
    const dentroDe7Dias = new Date();
    dentroDe7Dias.setDate(hoy.getDate() + 7);
    
    return eventosGlobales.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        return fechaEvento >= hoy && fechaEvento <= dentroDe7Dias;
    }).sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
}

// Obtener eventos por fecha específica
function getEventosPorFecha(fecha) {
    const fechaObj = new Date(fecha);
    return eventosGlobales.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        return fechaEvento.toDateString() === fechaObj.toDateString();
    }).sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
}

// Obtener categorías únicas que tienen eventos
function getCategoriasConEventos() {
    const categorias = new Set();
    eventosGlobales.forEach(evento => categorias.add(evento.categoria));
    return Array.from(categorias).sort();
}

// ==================== CREAR EVENTO ====================
async function crearEvento(eventoData) {
    try {
        const response = await fetch(`${API_URL}/eventos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventoData)
        });
        if (!response.ok) throw new Error('Error al crear evento');
        const nuevoEvento = await response.json();
        eventosGlobales.push(nuevoEvento);
        return nuevoEvento;
    } catch (error) {
        console.error('Error:', error);
        // Simular creación exitosa (para pruebas sin backend)
        const nuevoEvento = { ...eventoData, id: Date.now().toString() };
        eventosGlobales.push(nuevoEvento);
        return nuevoEvento;
    }
}

// Búsqueda global
function buscarEventos(termino) {
    if (!termino.trim()) return eventosGlobales;
    const terminoLower = termino.toLowerCase();
    return eventosGlobales.filter(evento =>
        evento.nombre.toLowerCase().includes(terminoLower) ||
        evento.categoria.toLowerCase().includes(terminoLower) ||
        evento.ubicacion?.toLowerCase().includes(terminoLower)
    );
}
