// ==================== VARIABLES GLOBALES ====================
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let isMenuMinimized = localStorage.getItem('menuMinimized') === 'true';

// ==================== TEMA OSCURO ====================
function applyTheme() {
    const iconMappings = [
        { light: '.home-light', dark: '.home-dark' },
        { light: '.categories-light', dark: '.categories-dark' },
        { light: '.dropdown-light', dark: '.dropdown-dark' },
        { light: '.calendar-light', dark: '.calendar-dark' },
        { light: '.map-light', dark: '.map-dark' },
        { light: '.promo-light', dark: '.promo-dark' }
    ];
    
    iconMappings.forEach(mapping => {
        const lightIcon = document.querySelector(mapping.light);
        const darkIcon = document.querySelector(mapping.dark);
        if (lightIcon && darkIcon) {
            lightIcon.style.display = isDarkMode ? 'none' : 'inline-block';
            darkIcon.style.display = isDarkMode ? 'inline-block' : 'none';
        }
    });
    
    const searchLight = document.getElementById('searchIconLight');
    const searchDark = document.getElementById('searchIconDark');
    const themeLight = document.getElementById('themeIconLight');
    const themeDark = document.getElementById('themeIconDark');
    const notifLight = document.getElementById('notifIconLight');
    const notifDark = document.getElementById('notifIconDark');
    const menuIcon = document.getElementById('menuIcon');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (searchLight) searchLight.style.display = 'none';
        if (searchDark) searchDark.style.display = 'inline-block';
        if (themeLight) themeLight.style.display = 'none';
        if (themeDark) themeDark.style.display = 'inline-block';
        if (notifLight) notifLight.style.display = 'none';
        if (notifDark) notifDark.style.display = 'inline-block';
        if (menuIcon) menuIcon.src = 'resources/icons_dark/menu.png';
    } else {
        document.body.classList.remove('dark-mode');
        if (searchLight) searchLight.style.display = 'inline-block';
        if (searchDark) searchDark.style.display = 'none';
        if (themeLight) themeLight.style.display = 'inline-block';
        if (themeDark) themeDark.style.display = 'none';
        if (notifLight) notifLight.style.display = 'inline-block';
        if (notifDark) notifDark.style.display = 'none';
        if (menuIcon) menuIcon.src = 'resources/icons_light/menu.png';
    }
}

// ==================== MENÚ LATERAL COMPLETO ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const categoriasBtn = document.getElementById('categoriasBtn');
    const submenuCategorias = document.getElementById('submenuCategorias');
    
    if (!sidebar) return;
    
    // Aplicar estado guardado del menú
    if (isMenuMinimized) {
        sidebar.classList.add('minimize');
    } else {
        sidebar.classList.remove('minimize');
    }
    
    // Toggle del menú (contraer/expandir)
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isMenuMinimized = !isMenuMinimized;
            localStorage.setItem('menuMinimized', isMenuMinimized);
            if (isMenuMinimized) {
                sidebar.classList.add('minimize');
            } else {
                sidebar.classList.remove('minimize');
                // Si se expande, cerramos el submenú de categorías
                if (submenuCategorias) {
                    submenuCategorias.style.height = '0';
                    submenuCategorias.style.padding = '0';
                    if (categoriasBtn) categoriasBtn.parentElement.classList.remove('sub-menu-toggle');
                }
            }
            // Refrescar mapa si existe
            if (typeof window.dispatchEvent === 'function') {
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 300);
            }
        });
    }
    
    // Desplegar submenú de categorías
    if (categoriasBtn && submenuCategorias) {
        let categoriasOpen = false;
        
        categoriasBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Si el menú está minimizado, lo expandimos primero
            if (sidebar.classList.contains('minimize')) {
                isMenuMinimized = false;
                localStorage.setItem('menuMinimized', false);
                sidebar.classList.remove('minimize');
                setTimeout(() => {
                    categoriasOpen = !categoriasOpen;
                    if (categoriasOpen) {
                        submenuCategorias.style.height = `${submenuCategorias.scrollHeight + 10}px`;
                        submenuCategorias.style.padding = '0.5rem 0';
                        categoriasBtn.parentElement.classList.add('sub-menu-toggle');
                    } else {
                        submenuCategorias.style.height = '0';
                        submenuCategorias.style.padding = '0';
                        categoriasBtn.parentElement.classList.remove('sub-menu-toggle');
                    }
                }, 300);
                return;
            }
            
            // Comportamiento normal cuando está expandido
            categoriasOpen = !categoriasOpen;
            if (categoriasOpen) {
                submenuCategorias.style.height = `${submenuCategorias.scrollHeight + 10}px`;
                submenuCategorias.style.padding = '0.5rem 0';
                categoriasBtn.parentElement.classList.add('sub-menu-toggle');
            } else {
                submenuCategorias.style.height = '0';
                submenuCategorias.style.padding = '0';
                categoriasBtn.parentElement.classList.remove('sub-menu-toggle');
            }
        });
    }
    
    // Tooltips para menú minimizado - hover sobre items
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            if (sidebar.classList.contains('minimize')) {
                const span = this.querySelector('.menu-link span');
                if (span) {
                    span.style.display = 'block';
                    span.style.opacity = '1';
                }
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (sidebar.classList.contains('minimize')) {
                const span = this.querySelector('.menu-link span');
                if (span) {
                    span.style.display = '';
                    span.style.opacity = '';
                }
                // Cerrar submenú si está abierto
                if (this.classList.contains('menu-item-dropdown')) {
                    const subMenu = this.querySelector('.sub-menu');
                    if (subMenu) {
                        this.classList.remove('sub-menu-toggle');
                        subMenu.style.height = '0';
                        subMenu.style.padding = '0';
                    }
                }
            }
        });
    });
}

// ==================== AVATAR Y SESIÓN ====================
function initAvatar() {
    const avatarDiv = document.getElementById('avatarUsuario');
    const menuPromocion = document.getElementById('menuPromocion');
    
    if (!avatarDiv) return;
    
    function updateAvatar() {
        const usuario = getUsuarioActual();
        if (usuario && usuario.nombre) {
            avatarDiv.textContent = usuario.nombre.charAt(0).toUpperCase();
            avatarDiv.style.backgroundColor = usuario.avatarColor || '#2ecc71';
            if (menuPromocion) {
                menuPromocion.style.display = usuario.rol === 'organizador' ? 'block' : 'none';
            }
        } else {
            avatarDiv.textContent = '?';
            avatarDiv.style.backgroundColor = '#9CA2B8';
            if (menuPromocion) menuPromocion.style.display = 'none';
        }
    }
    
    avatarDiv.addEventListener('click', () => {
        const usuario = getUsuarioActual();
        if (usuario) {
            if (confirm(`Cerrar sesión ${usuario.nombre}?`)) {
                cerrarSesion();
                window.location.reload();
            }
        } else {
            window.location.href = 'login.html';
        }
    });
    
    updateAvatar();
}

// ==================== BÚSQUEDA GLOBAL ====================
function initSearch() {
    const buscador = document.getElementById('buscador-global');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!buscador) return;
    
    function realizarBusqueda() {
        const termino = buscador.value.trim();
        if (termino) {
            window.location.href = `busqueda.html?q=${encodeURIComponent(termino)}`;
        }
    }
    
    buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') realizarBusqueda();
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', realizarBusqueda);
    }
}

// ==================== NOTIFICACIONES ====================
function initNotifications() {
    const notifBtn = document.getElementById('notificationsBtn');
    if (notifBtn) {
        notifBtn.addEventListener('click', () => {
            alert('📢 Notificaciones: Próximamente podrás recibir alertas.');
        });
    }
}

// ==================== INICIALIZACIÓN GENERAL ====================
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    initSidebar();
    initAvatar();
    initSearch();
    initNotifications();
    
    // Botón de tema oscuro
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            localStorage.setItem('darkMode', isDarkMode);
            applyTheme();
        });
    }
});

// ==================== FUNCIONES COMPLEMENTARIAS ====================
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

function getIconoCategoria(categoria) {
    const iconos = {
        'Conciertos': '🎵', 'Teatro': '🎭', 'Cine': '🎬', 'Exposiciones': '🖼️',
        'Danza': '💃', 'Libros': '📚', 'Festival': '🎉', 'Infantiles': '🧸',
        'Deportes': '⚽', 'Talleres': '🔧', 'Museos': '🏛️', 'Ferias': '🛍️', 'Farándula': '✨'
    };
    return iconos[categoria] || '📌';
}

// Configurar clics en categorías del submenú
function setupCategoriaLinks() {
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = link.getAttribute('data-categoria');
            if (categoria) {
                window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
            }
        });
    });
}

// Llamar a la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupCategoriaLinks();
});