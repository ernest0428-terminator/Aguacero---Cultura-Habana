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

// ==================== DETECTAR MÓVIL ====================
function isMobile() {
    return window.innerWidth <= 700;
}

// ==================== MENÚ LATERAL ====================
function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggleBtn = document.getElementById('menuToggleBtn');
    const categoriasBtn = document.getElementById('categoriasBtn');
    const categoriasMenuItem = document.getElementById('categoriasDropdown');
    const submenuCategorias = document.getElementById('submenuCategorias');
    
    if (!sidebar) return;
    
    // ========== APLICAR ESTADO INICIAL ==========
    function applyInitialState() {
        if (isMobile()) {
            sidebar.classList.remove('minimize');
            document.body.classList.remove('sidebar-visible');
            if (submenuCategorias) {
                submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                submenuCategorias.style.cssText = '';
            }
        } else {
            document.body.classList.remove('sidebar-visible');
            if (isMenuMinimized) {
                sidebar.classList.add('minimize');
            } else {
                sidebar.classList.remove('minimize');
            }
        }
    }
    
    applyInitialState();
    
    // ========== TOGGLE DEL MENÚ ==========
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMobile()) {
                document.body.classList.toggle('sidebar-visible');
            } else {
                isMenuMinimized = !isMenuMinimized;
                localStorage.setItem('menuMinimized', isMenuMinimized);
                
                if (isMenuMinimized) {
                    sidebar.classList.add('minimize');
                    if (submenuCategorias) {
                        submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                        submenuCategorias.style.cssText = '';
                        if (categoriasMenuItem) {
                            categoriasMenuItem.classList.remove('sub-menu-toggle');
                        }
                    }
                } else {
                    sidebar.classList.remove('minimize');
                    if (submenuCategorias) {
                        submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                        submenuCategorias.style.cssText = '';
                        if (categoriasMenuItem) {
                            categoriasMenuItem.classList.remove('sub-menu-toggle');
                        }
                    }
                }
            }
        });
    }
    
    // ========== COMPORTAMIENTO DE CATEGORÍAS ==========
    if (categoriasBtn && submenuCategorias && categoriasMenuItem) {
        
        categoriasBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // MÓVIL: acordeón normal
            if (isMobile()) {
                const isOpen = categoriasMenuItem.classList.contains('sub-menu-toggle');
                if (!isOpen) {
                    submenuCategorias.style.height = `${submenuCategorias.scrollHeight + 10}px`;
                    submenuCategorias.style.padding = '0.2rem 0';
                    submenuCategorias.style.opacity = '1';
                    submenuCategorias.style.visibility = 'visible';
                    submenuCategorias.classList.remove('floating-submenu');
                    categoriasMenuItem.classList.add('sub-menu-toggle');
                } else {
                    submenuCategorias.style.height = '0';
                    submenuCategorias.style.padding = '0';
                    submenuCategorias.style.opacity = '0';
                    submenuCategorias.style.visibility = 'hidden';
                    categoriasMenuItem.classList.remove('sub-menu-toggle');
                }
                return;
            }
            
            // DESKTOP - MENÚ EXPANDIDO: acordeón normal
            if (!sidebar.classList.contains('minimize')) {
                const isOpen = categoriasMenuItem.classList.contains('sub-menu-toggle');
                if (!isOpen) {
                    submenuCategorias.style.height = `${submenuCategorias.scrollHeight + 10}px`;
                    submenuCategorias.style.padding = '0.2rem 0';
                    submenuCategorias.style.opacity = '1';
                    submenuCategorias.style.visibility = 'visible';
                    submenuCategorias.classList.remove('floating-submenu');
                    categoriasMenuItem.classList.add('sub-menu-toggle');
                } else {
                    submenuCategorias.style.height = '0';
                    submenuCategorias.style.padding = '0';
                    submenuCategorias.style.opacity = '0';
                    submenuCategorias.style.visibility = 'hidden';
                    categoriasMenuItem.classList.remove('sub-menu-toggle');
                }
                return;
            }
            
            // DESKTOP - MENÚ CONTRÁIDO: submenú flotante
            if (sidebar.classList.contains('minimize')) {
                const isOpen = submenuCategorias.classList.contains('submenu-visible');
                
                if (isOpen) {
                    submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                    submenuCategorias.style.cssText = '';
                    categoriasMenuItem.classList.remove('sub-menu-toggle');
                    return;
                }
                
                const btnRect = categoriasBtn.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                
                submenuCategorias.style.cssText = '';
                
                submenuCategorias.style.position = 'fixed';
                submenuCategorias.style.left = `${sidebarRect.right + 8}px`;
                submenuCategorias.style.top = `${btnRect.top}px`;
                submenuCategorias.style.width = '240px';
                submenuCategorias.style.maxHeight = '400px';
                submenuCategorias.style.overflowY = 'auto';
                submenuCategorias.style.padding = '0.5rem 0';
                submenuCategorias.style.backgroundColor = 'var(--color-surface)';
                submenuCategorias.style.borderRadius = '0.75rem';
                submenuCategorias.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                submenuCategorias.style.border = '1px solid var(--color-border)';
                submenuCategorias.style.zIndex = '1000';
                submenuCategorias.classList.add('floating-submenu', 'submenu-visible');
                
                setTimeout(() => {
                    const submenuRect = submenuCategorias.getBoundingClientRect();
                    if (submenuRect.bottom > window.innerHeight) {
                        submenuCategorias.style.top = `${window.innerHeight - submenuRect.height - 10}px`;
                    }
                    if (submenuRect.right > window.innerWidth) {
                        submenuCategorias.style.left = `${sidebarRect.right - submenuRect.width - 8}px`;
                    }
                }, 10);
                
                categoriasMenuItem.classList.add('sub-menu-toggle');
                
                const closeSubmenu = (event) => {
                    if (!categoriasBtn.contains(event.target) && !submenuCategorias.contains(event.target)) {
                        submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                        submenuCategorias.style.cssText = '';
                        categoriasMenuItem.classList.remove('sub-menu-toggle');
                        document.removeEventListener('click', closeSubmenu);
                    }
                };
                setTimeout(() => {
                    document.addEventListener('click', closeSubmenu);
                }, 10);
            }
        });
    }
    
    // ========== TOOLTIPS (SOLO DESKTOP Y MENÚ MINIMIZADO) ==========
    let activeTooltip = null;
    let tooltipTimeout = null;
    
    const allMenuItems = document.querySelectorAll('.menu-item');
    
    allMenuItems.forEach(item => {
        const menuLink = item.querySelector('.menu-link');
        const span = menuLink ? menuLink.querySelector('span') : null;
        const itemText = span ? span.textContent : '';
        
        item.addEventListener('mouseenter', function(e) {
            if (!isMobile() && sidebar.classList.contains('minimize') && itemText) {
                if (tooltipTimeout) clearTimeout(tooltipTimeout);
                
                if (activeTooltip && activeTooltip.parentNode) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }
                
                const itemRect = this.getBoundingClientRect();
                const sidebarRect = sidebar.getBoundingClientRect();
                
                const tooltip = document.createElement('div');
                tooltip.className = 'menu-tooltip';
                tooltip.textContent = itemText;
                tooltip.style.cssText = `
                    position: fixed;
                    left: ${sidebarRect.right + 12}px;
                    top: ${itemRect.top + (itemRect.height / 2)}px;
                    transform: translateY(-50%);
                    padding: 0.5rem 0.8rem;
                    background-color: var(--color-tooltip-bg);
                    color: var(--color-tooltip-text);
                    border-radius: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 500;
                    white-space: nowrap;
                    z-index: 1001;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.2s ease, visibility 0.2s ease;
                    pointer-events: none;
                `;
                
                document.body.appendChild(tooltip);
                activeTooltip = tooltip;
                
                setTimeout(() => {
                    if (activeTooltip === tooltip) {
                        tooltip.style.opacity = '1';
                        tooltip.style.visibility = 'visible';
                    }
                }, 10);
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!isMobile() && sidebar.classList.contains('minimize')) {
                if (activeTooltip) {
                    activeTooltip.style.opacity = '0';
                    activeTooltip.style.visibility = 'hidden';
                    tooltipTimeout = setTimeout(() => {
                        if (activeTooltip && activeTooltip.parentNode) {
                            activeTooltip.remove();
                            activeTooltip = null;
                        }
                        tooltipTimeout = null;
                    }, 200);
                }
            }
        });
    });
    
    // ========== ENLACES DEL SUBMENÚ ==========
    const subMenuLinks = document.querySelectorAll('.sub-menu-link');
    subMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = link.getAttribute('data-categoria');
            if (categoria) {
                if (activeTooltip && activeTooltip.parentNode) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }
                window.location.href = `categoria.html?nombre=${encodeURIComponent(categoria)}`;
            }
        });
    });
    
    // ========== CERRAR MENÚ EN MÓVIL AL NAVEGAR ==========
    function handleMobileNavigation() {
        if (isMobile()) {
            const allLinks = document.querySelectorAll('.menu-link, .sub-menu-link');
            allLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        document.body.classList.remove('sidebar-visible');
                    }, 150);
                });
            });
        }
    }
    
    handleMobileNavigation();
    
    // ========== MANEJAR REDIMENSIONAMIENTO ==========
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isMobile()) {
                if (activeTooltip) {
                    activeTooltip.remove();
                    activeTooltip = null;
                }
                if (submenuCategorias) {
                    submenuCategorias.classList.remove('floating-submenu', 'submenu-visible');
                    submenuCategorias.style.cssText = '';
                }
                document.body.classList.remove('sidebar-visible');
                sidebar.classList.remove('minimize');
            } else {
                if (isMenuMinimized) {
                    sidebar.classList.add('minimize');
                } else {
                    sidebar.classList.remove('minimize');
                }
            }
        }, 100);
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
            alert('Notificaciones: Próximamente podrás recibir alertas.');
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

document.addEventListener('DOMContentLoaded', () => {
    setupCategoriaLinks();
});