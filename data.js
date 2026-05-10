// data.js - Base de datos local con localStorage

const eventosEjemplo = [
    {
        id: "evt_001",
        nombre: "VAN VAN - Concierto Especial",
        categoria: "Conciertos",
        descripcion: "La leyenda de la música cubana en concierto único.",
        fechaInicio: "2026-05-20",
        fechaFin: "2026-05-20",
        horaInicio: "21:00",
        horaFin: "02:00",
        precio: 500,
        ubicacion: "Pabellón Cuba, Calle 23 e/ M y N, Vedado",
        sede: "Pabellón Cuba",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 23 # 59, Vedado",
        lat: 23.1395,
        lng: -82.3824,
        poster: "https://picsum.photos/id/30/400/300",
        organizador: "Empresa de Conciertos",
        telefono: "+53 55550001",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_002",
        nombre: "Lachy Fortuna - Session Especial",
        categoria: "Farándula",
        descripcion: "El ex-charanguero presenta su nuevo proyecto musical.",
        fechaInicio: "2026-05-22",
        fechaFin: "2026-05-22",
        horaInicio: "22:00",
        horaFin: "03:00",
        precio: 350,
        ubicacion: "Casa de la Música, Miramar",
        sede: "Casa de la Música",
        municipio: "Playa",
        direccion: "Calle 20 e/ 35 y 37, Miramar",
        lat: 23.1184,
        lng: -82.4257,
        poster: "https://picsum.photos/id/39/400/300",
        organizador: "Casa de la Música",
        telefono: "+53 55550002",
        aptoMenores: false,
        aireLibre: true,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_003",
        nombre: "Taller de Pintura Calcónica",
        categoria: "Talleres",
        descripcion: "Aprende técnicas de pintura calcónica.",
        fechaInicio: "2026-05-25",
        fechaFin: "2026-06-01",
        horaInicio: "09:00",
        horaFin: "12:00",
        precio: 25,
        ubicacion: "Taller de Cultura, Calle 12 # 304",
        sede: "Taller de Cultura",
        municipio: "Centro Habana",
        direccion: "Calle 12 # 304 e/ 5 y 7",
        lat: 23.1321,
        lng: -82.3765,
        poster: "https://picsum.photos/id/96/400/300",
        organizador: "Proyecto Vende",
        telefono: "+53 55550003",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: false,
        creadoPor: "organizador"
    },
    {
        id: "evt_004",
        nombre: "Exposición de Arte Contemporáneo",
        categoria: "Exposiciones",
        descripcion: "Obras de artistas cubanos emergentes.",
        fechaInicio: "2026-05-28",
        fechaFin: "2026-06-18",
        horaInicio: "10:00",
        horaFin: "18:00",
        precio: 0,
        ubicacion: "Factoría Habana, Calle 26 e/ 11 y 13",
        sede: "Factoría Habana",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 26 # 509",
        lat: 23.1234,
        lng: -82.3876,
        poster: "https://picsum.photos/id/20/400/300",
        organizador: "Factoría Habana",
        telefono: "+53 55550004",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: false,
        creadoPor: "organizador"
    },
    {
        id: "evt_005",
        nombre: "Cine Cubano: Retrospectiva",
        categoria: "Cine",
        descripcion: "Funciones especiales de cine cubano.",
        fechaInicio: "2026-06-01",
        fechaFin: "2026-06-08",
        horaInicio: "15:00",
        horaFin: "22:00",
        precio: 100,
        ubicacion: "Cine Yara, Calle 23",
        sede: "Cine Yara",
        municipio: "Plaza de la Revolución",
        direccion: "Calle 23 # 59",
        lat: 23.1385,
        lng: -82.3826,
        poster: "https://picsum.photos/id/1/400/300",
        organizador: "ICAIC",
        telefono: "+53 55550005",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    },
    {
        id: "evt_006",
        nombre: "Festival de Danza",
        categoria: "Danza",
        descripcion: "Compañías de danza de toda la isla.",
        fechaInicio: "2026-06-05",
        fechaFin: "2026-06-07",
        horaInicio: "19:00",
        horaFin: "21:30",
        precio: 800,
        ubicacion: "Gran Teatro de La Habana",
        sede: "Gran Teatro",
        municipio: "Centro Habana",
        direccion: "Paseo del Prado # 458",
        lat: 23.1372,
        lng: -82.3597,
        poster: "https://picsum.photos/id/36/400/300",
        organizador: "Gran Teatro",
        telefono: "+53 55550006",
        aptoMenores: true,
        aireLibre: false,
        posibilidadReserva: true,
        creadoPor: "organizador"
    }
];

function inicializarDatos() {
    if (!localStorage.getItem('eventos')) {
        localStorage.setItem('eventos', JSON.stringify(eventosEjemplo));
    }
    if (!localStorage.getItem('usuarios')) {
        const usuariosIniciales = [
            { id: "user_001", email: "organizador@culturahabana.com", password: "123456", nombre: "Carlos Pérez", rol: "organizador", telefono: "+53 51234567", avatarColor: "#2ecc71" },
            { id: "user_002", email: "usuario@example.com", password: "123456", nombre: "Laura Gómez", rol: "usuario", telefono: "+53 59876543", avatarColor: "#3498db" }
        ];
        localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
}

function getEventos() { 
    return JSON.parse(localStorage.getItem('eventos')) || []; 
}

function guardarEventos(eventos) { 
    localStorage.setItem('eventos', JSON.stringify(eventos)); 
}

function getEventoById(id) { 
    return getEventos().find(e => e.id === id); 
}

function agregarEvento(evento) {
    const eventos = getEventos();
    const nuevoId = "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
    const nuevoEvento = { ...evento, id: nuevoId };
    eventos.push(nuevoEvento);
    guardarEventos(eventos);
    return nuevoEvento;
}

function getUsuarios() { 
    return JSON.parse(localStorage.getItem('usuarios')) || []; 
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function registrarUsuario(usuario) {
    const usuarios = getUsuarios();
    if (usuarios.find(u => u.email === usuario.email)) {
        return { exito: false, mensaje: "El correo ya está registrado" };
    }
    const colores = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'];
    const nuevoUsuario = { 
        ...usuario, 
        id: "user_" + Date.now(), 
        avatarColor: colores[Math.floor(Math.random() * colores.length)] 
    };
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);
    return { exito: true, usuario: nuevoUsuario };
}

function iniciarSesion(email, password) {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
        localStorage.setItem('usuarioActual', JSON.stringify(usuario));
        return { exito: true, usuario };
    }
    return { exito: false, mensaje: "Correo o contraseña incorrectos" };
}

function cerrarSesion() { 
    localStorage.removeItem('usuarioActual'); 
}

function getUsuarioActual() { 
    const u = localStorage.getItem('usuarioActual'); 
    return u ? JSON.parse(u) : null; 
}

function esOrganizador() { 
    const u = getUsuarioActual(); 
    return u && u.rol === 'organizador'; 
}

function getEventosFuturos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return getEventos().filter(e => new Date(e.fechaInicio) >= hoy).sort((a,b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
}

function getCategoriasConEventos() {
    const categorias = new Set();
    getEventos().forEach(e => categorias.add(e.categoria));
    return Array.from(categorias).sort();
}

function getEventosPorFecha(fechaStr) {
    if (!fechaStr) return [];
    const eventos = getEventos();
    
    // Convertir fechaStr de formato "dd/mm/aaaa" a objeto Date
    const partes = fechaStr.split('/');
    if (partes.length !== 3) return [];
    
    // partes[0] = día, partes[1] = mes, partes[2] = año
    const dia = parseInt(partes[0]);
    const mes = parseInt(partes[1]) - 1; // Los meses en JS van de 0 a 11
    const anio = parseInt(partes[2]);
    
    const fechaBuscar = new Date(anio, mes, dia);
    fechaBuscar.setHours(0, 0, 0, 0);
    
    console.log("🔍 Buscando eventos para fecha:", fechaBuscar.toLocaleDateString('es-ES'));
    
    const resultados = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fechaInicio);
        fechaEvento.setHours(0, 0, 0, 0);
        
        const coincide = fechaEvento.getTime() === fechaBuscar.getTime();
        if (coincide) {
            console.log("✅ Coincide:", evento.nombre, evento.fechaInicio);
        }
        return coincide;
    });
    
    console.log(`📊 Encontrados ${resultados.length} eventos`);
    return resultados.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
}

function buscarEventos(termino) {
    if (!termino || termino.trim() === "") return getEventos();
    const t = termino.toLowerCase();
    return getEventos().filter(e => 
        e.nombre.toLowerCase().includes(t) || 
        e.categoria.toLowerCase().includes(t) || 
        (e.ubicacion && e.ubicacion.toLowerCase().includes(t))
    );
}

function formatFechaShort(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function formatFechaDDMMYYYY(fechaStr) {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function getIcono(categoria) {
    const iconos = {
        'Conciertos': '🎵', 'Teatro': '🎭', 'Cine': '🎬', 'Exposiciones': '🖼️',
        'Danza': '💃', 'Libros': '📚', 'Festival': '🎉', 'Infantiles': '🧸',
        'Deportes': '⚽', 'Talleres': '🔧', 'Museos': '🏛️', 'Ferias': '🛍️', 'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

inicializarDatos();