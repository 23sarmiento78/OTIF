// Material Design Components Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Material Design components
    mdc.autoInit();
    
    // Initialize text fields
    const textFields = document.querySelectorAll('.mdc-text-field');
    textFields.forEach(field => {
        new mdc.textField.MDCTextField(field);
    });
    
    // Initialize buttons
    const buttons = document.querySelectorAll('.mdc-button');
    buttons.forEach(button => {
        new mdc.ripple.MDCRipple(button);
    });
    
    // Initialize top app bar
    const topAppBar = document.querySelector('.mdc-top-app-bar');
    if (topAppBar) {
        new mdc.topAppBar.MDCTopAppBar(topAppBar);
    }
    
    // Initialize navbar buttons
    initNavbarButtons();
});

// Initialize navbar buttons
function initNavbarButtons() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = 'registro.html';
        });
    }
}

// Cotización Wizard
class CotizacionWizard {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {
            tipo: '',
            origen: '',
            destino: '',
            peso: '',
            volumen: '',
            tipoCarga: ''
        };
        
        this.initializeWizard();
    }
    
    initializeWizard() {
        // Tipo de envío selection
        const tipoCards = document.querySelectorAll('.tipo-envio-card');
        tipoCards.forEach(card => {
            card.addEventListener('click', () => {
                tipoCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.formData.tipo = card.dataset.tipo;
                this.updateResumen();
            });
        });
        
        // Navigation buttons
        const btnNext = document.getElementById('btn-next');
        const btnPrev = document.getElementById('btn-prev');
        const btnSubmit = document.getElementById('btn-submit');
        
        btnNext.addEventListener('click', () => this.nextStep());
        btnPrev.addEventListener('click', () => this.prevStep());
        btnSubmit.addEventListener('click', (e) => this.submitForm(e));
        
        // Form inputs
        const inputs = ['origen', 'destino', 'peso', 'volumen', 'tipo-carga'];
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.formData[inputId.replace('-', '')] = e.target.value;
                    this.updateResumen();
                });
            }
        });
        
        this.updateProgress();
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStep();
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStep();
        }
    }
    
    updateStep() {
        // Hide all steps
        const steps = document.querySelectorAll('.form-step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Show current step
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
        
        // Update navigation buttons
        const btnNext = document.getElementById('btn-next');
        const btnPrev = document.getElementById('btn-prev');
        const btnSubmit = document.getElementById('btn-submit');
        
        btnPrev.style.display = this.currentStep > 1 ? 'block' : 'none';
        btnNext.style.display = this.currentStep < this.totalSteps ? 'block' : 'none';
        btnSubmit.style.display = this.currentStep === this.totalSteps ? 'block' : 'none';
        
        this.updateProgress();
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                if (!this.formData.tipo) {
                    this.showError('Por favor selecciona un tipo de envío');
                    return false;
                }
                break;
            case 2:
                if (!this.formData.origen || !this.formData.destino) {
                    this.showError('Por favor completa origen y destino');
                    return false;
                }
                break;
            case 3:
                if (!this.formData.peso || !this.formData.volumen || !this.formData.tipoCarga) {
                    this.showError('Por favor completa todos los campos de carga');
                    return false;
                }
                break;
        }
        return true;
    }
    
    updateResumen() {
        // Update summary in step 4
        const resumenTipo = document.getElementById('resumen-tipo');
        const resumenRuta = document.getElementById('resumen-ruta');
        const resumenCarga = document.getElementById('resumen-carga');
        const precioEstimado = document.getElementById('precio-estimado');
        
        if (resumenTipo) {
            const tipoLabels = {
                'terrestre': 'Transporte Terrestre',
                'aereo': 'Transporte Aéreo',
                'maritimo': 'Transporte Marítimo',
                'paqueteria': 'Paquetería'
            };
            resumenTipo.textContent = tipoLabels[this.formData.tipo] || '-';
        }
        
        if (resumenRuta) {
            resumenRuta.textContent = this.formData.origen && this.formData.destino 
                ? `${this.formData.origen} → ${this.formData.destino}` 
                : '-';
        }
        
        if (resumenCarga) {
            resumenCarga.textContent = this.formData.peso && this.formData.volumen && this.formData.tipoCarga
                ? `${this.formData.peso}kg, ${this.formData.volumen}m³, ${this.formData.tipoCarga}`
                : '-';
        }
        
        if (precioEstimado) {
            precioEstimado.textContent = this.calculatePrice();
        }
    }
    
    calculatePrice() {
        if (!this.formData.tipo || !this.formData.peso || !this.formData.volumen) {
            return '$0.00';
        }
        
        const basePrices = {
            'terrestre': 2.5,
            'aereo': 8.0,
            'maritimo': 1.2,
            'paqueteria': 15.0
        };
        
        const basePrice = basePrices[this.formData.tipo] || 0;
        const weight = parseFloat(this.formData.peso) || 0;
        const volume = parseFloat(this.formData.volumen) || 0;
        
        // Calculate based on weight and volume (whichever is higher)
        const weightPrice = weight * basePrice;
        const volumePrice = volume * basePrice * 100; // Volume is more expensive
        
        const totalPrice = Math.max(weightPrice, volumePrice);
        
        return `$${totalPrice.toFixed(2)}`;
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
    }
    
    showError(message) {
        // Create and show error notification
        const notification = document.createElement('div');
        notification.className = 'alert alert-danger alert-dismissible fade show position-fixed';
        notification.style.cssText = `
            top: 100px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
        `;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    submitForm(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = document.getElementById('btn-submit');
        const originalText = submitBtn.querySelector('.btn-label').textContent;
        
        submitBtn.querySelector('.btn-label').textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.showSuccess();
            submitBtn.querySelector('.btn-label').textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    showSuccess() {
        const notification = document.createElement('div');
        notification.className = 'modal fade';
        notification.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-4">
                        <span class="material-icons text-success" style="font-size: 3rem;">check_circle</span>
                        <h3 class="mt-3">¡Cotización Enviada!</h3>
                        <p class="text-muted">Recibirás tu cotización detallada en tu correo electrónico en los próximos minutos.</p>
                        <button class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show modal
        const modal = new bootstrap.Modal(notification);
        modal.show();
        
        // Remove modal from DOM after it's hidden
        notification.addEventListener('hidden.bs.modal', () => {
            notification.remove();
        });
    }
}

// Scroll suave para enlaces de navegación
// (Evita error con href="#")
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Si el href es solo '#', no hacer nada
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80; // Ajusta según tu header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Service card interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.servicio-card');
    
    serviceCards.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function() {
                // Scroll to cotización widget and pre-select service
                const cotizacionWidget = document.querySelector('.cotizacion-widget');
                if (cotizacionWidget) {
                    cotizacionWidget.scrollIntoView({ behavior: 'smooth' });
                    
                    // Pre-select service type based on card
                    const cardTitle = card.querySelector('h3').textContent.toLowerCase();
                    let tipo = '';
                    
                    if (cardTitle.includes('terrestre')) tipo = 'terrestre';
                    else if (cardTitle.includes('aéreo')) tipo = 'aereo';
                    else if (cardTitle.includes('marítimo')) tipo = 'maritimo';
                    
                    if (tipo) {
                        setTimeout(() => {
                            const tipoCard = document.querySelector(`[data-tipo="${tipo}"]`);
                            if (tipoCard) {
                                document.querySelectorAll('.tipo-envio-card').forEach(c => c.classList.remove('selected'));
                                tipoCard.classList.add('selected');
                                wizard.formData.tipo = tipo;
                                wizard.updateResumen();
                            }
                        }, 500);
                    }
                }
            });
        }
    });
});

// User type card interactions
document.addEventListener('DOMContentLoaded', function() {
    const userCards = document.querySelectorAll('.usuario-card');
    
    userCards.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function() {
                const userType = card.querySelector('h3').textContent.toLowerCase();
                
                // Show user-specific modal or redirect
                showUserModal(userType);
            });
        }
    });
});

function showUserModal(userType) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center p-4">
                    <h2>Acceso ${userType}</h2>
                    <p class="text-muted">Esta funcionalidad está en desarrollo. Pronto podrás acceder a tu dashboard personalizado.</p>
                    <button class="btn btn-primary" data-bs-dismiss="modal">Entendido</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
    
    // Remove modal from DOM after it's hidden
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Initialize wizard when DOM is loaded
let wizard;
document.addEventListener('DOMContentLoaded', function() {
    wizard = new CotizacionWizard();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error-notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);

// App.js - Funcionalidad principal de OTIF
document.addEventListener('DOMContentLoaded', function() {
    console.log('OTIF App inicializada');
    
    // Inicializar componentes
    initNavbar();
    initCotizacion();
    initScrollEffects();
    initAnimations();
    
    // Organizar dropdowns después de que Bootstrap se inicialice
    setTimeout(organizeDropdowns, 200);
});

// Funcionalidad del Navbar
function initNavbar() {
    const navbar = document.querySelector('.main-navbar');
    const loginBtn = document.getElementById('login-btn');
    const cartBtn = document.getElementById('cart-btn');
    const ordersBtn = document.getElementById('orders-btn');
    
    // Efecto de scroll en navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Simulación de login (para mostrar carrito y pedidos)
    loginBtn.addEventListener('click', function() {
        const isLoggedIn = loginBtn.textContent.includes('Iniciar');
        
        if (isLoggedIn) {
            // Simular login
            loginBtn.innerHTML = '<span class="material-icons me-1">logout</span><span class="btn-label">Cerrar Sesión</span>';
            cartBtn.style.display = 'inline-flex';
            ordersBtn.style.display = 'inline-flex';
            
            // Mostrar notificación
            showNotification('Sesión iniciada correctamente', 'success');
        } else {
            // Simular logout
            loginBtn.innerHTML = '<span class="material-icons me-1">login</span><span class="btn-label">Iniciar Sesión</span>';
            cartBtn.style.display = 'none';
            ordersBtn.style.display = 'none';
            
            showNotification('Sesión cerrada', 'info');
        }
    });
    
    // Funcionalidad del carrito
    cartBtn.addEventListener('click', function() {
        showNotification('Carrito de compras (funcionalidad en desarrollo)', 'info');
    });
    
    // Funcionalidad de pedidos
    ordersBtn.addEventListener('click', function() {
        showNotification('Historial de pedidos (funcionalidad en desarrollo)', 'info');
    });
}

// Función para organizar dropdowns automáticamente
function organizeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    
    dropdowns.forEach(dropdown => {
        const items = dropdown.querySelectorAll('.dropdown-item');
        const maxItemsPerColumn = 6;
        
        if (items.length > maxItemsPerColumn) {
            // Agregar clase multi-column si no la tiene
            if (!dropdown.classList.contains('multi-column')) {
                dropdown.classList.add('multi-column');
            }
            
            // Calcular número de columnas necesarias
            const numColumns = Math.ceil(items.length / maxItemsPerColumn);
            
            // Ajustar el ancho máximo del dropdown (250px por columna)
            const maxWidth = Math.min(numColumns * 250, 750); // 250px por columna, máximo 750px
            dropdown.style.maxWidth = `${maxWidth}px`;
            
            // Ajustar grid columns con ancho mínimo de 250px
            dropdown.style.gridTemplateColumns = `repeat(${numColumns}, minmax(250px, 1fr))`;
        }
    });
}

// Funcionalidad de Cotización
function initCotizacion() {
    const btnCotizar = document.getElementById('btn-cotizar');
    const btnMedidas = document.getElementById('btn-medidas');
    const cotizacionResult = document.getElementById('cotizacion-result');
    const btnReservar = document.getElementById('btn-reservar');
    
    // Abrir modal de medidas prediseñadas
    btnMedidas.addEventListener('click', function() {
        const modal = new bootstrap.Modal(document.getElementById('medidasModal'));
        modal.show();
    });
    
    // Configurar selección de medidas prediseñadas
    setupMedidasPrediseñadas();
    
    btnCotizar.addEventListener('click', function() {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        const peso = parseFloat(document.getElementById('peso').value);
        const largo = parseFloat(document.getElementById('largo').value);
        const ancho = parseFloat(document.getElementById('ancho').value);
        const alto = parseFloat(document.getElementById('alto').value);
        const tipo = document.getElementById('tipo').value;
        
        // Validación básica
        if (!origen || !destino || !peso || !largo || !ancho || !alto || !tipo) {
            showNotification('Por favor completa todos los campos', 'error');
            return;
        }
        
        if (peso <= 0) {
            showNotification('El peso debe ser mayor a 0', 'error');
            return;
        }
        
        if (largo <= 0 || ancho <= 0 || alto <= 0) {
            showNotification('Todas las dimensiones deben ser mayores a 0', 'error');
            return;
        }
        
        // Simular cálculo de cotización
        const cotizacion = calcularCotizacion(origen, destino, peso, largo, ancho, alto, tipo);
        
        // Mostrar resultado
        mostrarResultadoCotizacion(cotizacion);
        
        // Mostrar sección de resultado
        cotizacionResult.style.display = 'block';
        cotizacionResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    
    btnReservar.addEventListener('click', function() {
        showNotification('Reserva realizada correctamente. Te contactaremos pronto.', 'success');
    });
}

// Configurar medidas prediseñadas
function setupMedidasPrediseñadas() {
    const medidas = {
        'a4': { largo: 33, ancho: 23, alto: 5, peso: 0.1 },
        'general': { largo: 50, ancho: 50, alto: 50, peso: 2.0 },
        'atypical': { largo: 150, ancho: 70, alto: 30, peso: 5.0 },
        'shoe': { largo: 35, ancho: 23.5, alto: 13.5, peso: 0.5 },
        'international': { largo: 96, ancho: 15, alto: 15, peso: 1.0 },
        'tires': { largo: 33, ancho: 23, alto: 5, peso: 8.0 },
        'suitcase': { largo: 70, ancho: 50, alto: 30, peso: 3.0 },
        'pallet': { largo: 120, ancho: 80, alto: 100, peso: 25.0 }
    };
    
    // Agregar event listeners a todos los botones de selección
    document.querySelectorAll('.btn-seleccionar-medida').forEach(btn => {
        btn.addEventListener('click', function() {
            const medidaCard = this.closest('.medida-card');
            const medidaKey = medidaCard.getAttribute('data-medida');
            const medida = medidas[medidaKey];
            
            if (medida) {
                // Llenar automáticamente todos los campos
                document.getElementById('peso').value = medida.peso;
                document.getElementById('largo').value = medida.largo;
                document.getElementById('ancho').value = medida.ancho;
                document.getElementById('alto').value = medida.alto;
                
                // Mostrar notificación con las dimensiones
                const dimensiones = `${medida.largo} x ${medida.ancho} x ${medida.alto} cm`;
                showNotification(`Medida seleccionada: ${dimensiones} - Peso: ${medida.peso} kg`, 'success');
                
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('medidasModal'));
                modal.hide();
                
                // Hacer scroll al formulario
                document.getElementById('cotizacion').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// Función para calcular cotización
function calcularCotizacion(origen, destino, peso, largo, ancho, alto, tipo) {
    // Precios base por tipo de servicio
    const preciosBase = {
        'terrestre': 150,
        'aereo': 450,
        'maritimo': 300,
        'express': 600
    };
    
    // Calcular volumen en cm³
    const volumen = largo * ancho * alto;
    const volumenM3 = volumen / 1000000; // Convertir a m³
    
    // Factor de volumen (peso volumétrico vs peso real)
    const pesoVolumetrico = volumenM3 * 167; // 167 kg/m³ es el factor estándar
    const pesoFacturable = Math.max(peso, pesoVolumetrico);
    
    // Multiplicadores por distancia (simulado)
    const distancia = Math.random() * 2000 + 100; // 100-2100 km
    const multiplicadorDistancia = 1 + (distancia / 1000) * 0.5;
    
    // Multiplicador por peso
    const multiplicadorPeso = 1 + (pesoFacturable / 10) * 0.3;
    
    // Multiplicador por volumen
    const multiplicadorVolumen = 1 + (volumenM3 * 0.5);
    
    // Cálculo final
    const precioBase = preciosBase[tipo] || 200;
    const precioFinal = precioBase * multiplicadorDistancia * multiplicadorPeso * multiplicadorVolumen;
    
    // Tiempo estimado de entrega
    const tiemposEntrega = {
        'terrestre': '3-5 días hábiles',
        'aereo': '1-2 días hábiles',
        'maritimo': '7-15 días hábiles',
        'express': '24-48 horas'
    };
    
    return {
        origen: origen,
        destino: destino,
        peso: peso,
        pesoVolumetrico: pesoVolumetrico.toFixed(2),
        pesoFacturable: pesoFacturable.toFixed(2),
        dimensiones: `${largo} x ${ancho} x ${alto} cm`,
        volumen: volumenM3.toFixed(3),
        tipo: tipo,
        precio: Math.round(precioFinal),
        tiempoEntrega: tiemposEntrega[tipo] || '3-5 días hábiles',
        distancia: Math.round(distancia)
    };
}

// Función para mostrar resultado de cotización
function mostrarResultadoCotizacion(cotizacion) {
    // Actualizar información principal
    document.getElementById('precio-estimado').textContent = `$${cotizacion.precio.toLocaleString()}`;
    document.getElementById('tiempo-estimado').textContent = cotizacion.tiempoEntrega;
    
    // Actualizar detalles del envío
    const detallesEnvio = document.getElementById('detalles-envio');
    if (detallesEnvio) {
        detallesEnvio.innerHTML = `
            <div class="row g-3">
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">location_on</span>
                        <div>
                            <strong>Origen:</strong> ${cotizacion.origen}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">location_on</span>
                        <div>
                            <strong>Destino:</strong> ${cotizacion.destino}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">scale</span>
                        <div>
                            <strong>Peso:</strong> ${cotizacion.peso} kg
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">straighten</span>
                        <div>
                            <strong>Dimensiones:</strong> ${cotizacion.dimensiones}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">cubic</span>
                        <div>
                            <strong>Volumen:</strong> ${cotizacion.volumen} m³
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">local_shipping</span>
                        <div>
                            <strong>Servicio:</strong> ${cotizacion.tipo.charAt(0).toUpperCase() + cotizacion.tipo.slice(1)}
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">speed</span>
                        <div>
                            <strong>Distancia:</strong> ${cotizacion.distancia} km
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="detalle-item">
                        <span class="material-icons">calculate</span>
                        <div>
                            <strong>Peso facturable:</strong> ${cotizacion.pesoFacturable} kg
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Efectos de scroll
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.service-card, .benefit-card, .partner-card').forEach(el => {
        observer.observe(el);
    });
}

// Animaciones generales
function initAnimations() {
    // Animación de contadores
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Iniciar animación cuando el elemento sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="material-icons notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">
                <span class="material-icons">close</span>
            </button>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Funcionalidad de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Funciones auxiliares para notificaciones
function getNotificationIcon(type) {
    const icons = {
        'success': 'check_circle',
        'error': 'error',
        'warning': 'warning',
        'info': 'info'
    };
    return icons[type] || 'info';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// Exportar funciones para uso global
window.OTIFApp = {
    showNotification,
    calcularCotizacion,
    mostrarResultadoCotizacion
};

// --- NAVBAR MÓVIL PERSONALIZADO ---
document.addEventListener('DOMContentLoaded', function() {
    var burger = document.getElementById('navbarBurger');
    var menu = document.getElementById('navbarMobileMenu');
    if (burger && menu) {
        burger.addEventListener('click', function() {
            menu.classList.toggle('open');
        });
        // Cerrar menú al hacer click fuera
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && !burger.contains(e.target)) {
                menu.classList.remove('open');
            }
        });
        // Dropdowns personalizados
        menu.querySelectorAll('.has-dropdown > .dropdown-toggle-custom').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var parent = btn.parentElement;
                var isOpen = parent.classList.contains('open');
                // Cerrar otros
                menu.querySelectorAll('.has-dropdown.open').forEach(function(drop) {
                    if (drop !== parent) drop.classList.remove('open');
                });
                // Alternar actual
                parent.classList.toggle('open', !isOpen);
            });
        });
        // Cerrar menú al hacer click en un enlace
        menu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                menu.classList.remove('open');
                menu.querySelectorAll('.has-dropdown').forEach(function(drop) { drop.classList.remove('open'); });
            });
        });
    }
});
// --- FIN NAVBAR MÓVIL PERSONALIZADO --- 