// Tracking Page JavaScript

// Google Maps variables
let map;
let currentMarker;
let routePolyline;
let mapInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tracking functionality
    initializeTracking();
});

// Demo tracking data with coordinates
const demoTrackingData = {
    'OTIF-2024-001234': {
        status: 'En Tránsito',
        origin: 'Ciudad de México, MX',
        destination: 'Monterrey, MX',
        shipmentType: 'Terrestre',
        weight: '500 kg',
        volume: '2.5 m³',
        estimatedDate: '15 de Enero, 2024',
        estimatedTime: '14:00 - 18:00',
        recipient: 'Juan Pérez',
        phone: '+52 81 1234-5678',
        coordinates: {
            origin: { lat: 19.4326, lng: -99.1332 },
            destination: { lat: 25.6866, lng: -100.3161 },
            current: { lat: 20.5888, lng: -100.3899 }, // Querétaro
            route: [
                { lat: 19.4326, lng: -99.1332 }, // CDMX
                { lat: 20.5888, lng: -100.3899 }, // Querétaro
                { lat: 21.1743, lng: -101.6991 }, // León
                { lat: 22.1565, lng: -100.9855 }, // San Luis Potosí
                { lat: 25.6866, lng: -100.3161 }  // Monterrey
            ]
        },
        timeline: [
            {
                title: 'Envío Recibido',
                time: '10 de Enero, 2024 - 09:30',
                description: 'El envío ha sido recibido en nuestras instalaciones de Ciudad de México',
                location: 'Centro de Distribución CDMX',
                status: 'completed',
                coordinates: { lat: 19.4326, lng: -99.1332 }
            },
            {
                title: 'En Proceso de Embalaje',
                time: '10 de Enero, 2024 - 14:15',
                description: 'El envío está siendo preparado y embalado para su transporte',
                location: 'Centro de Distribución CDMX',
                status: 'completed',
                coordinates: { lat: 19.4326, lng: -99.1332 }
            },
            {
                title: 'En Ruta',
                time: '11 de Enero, 2024 - 08:00',
                description: 'El envío ha salido de nuestras instalaciones y está en ruta hacia su destino',
                location: 'Autopista México-Querétaro',
                status: 'current',
                coordinates: { lat: 20.5888, lng: -100.3899 }
            },
            {
                title: 'En Tránsito',
                time: '12 de Enero, 2024 - 12:30',
                description: 'El envío está en tránsito hacia Monterrey',
                location: 'Centro de Distribución Querétaro',
                status: 'pending',
                coordinates: { lat: 20.5888, lng: -100.3899 }
            },
            {
                title: 'Entrega Programada',
                time: '15 de Enero, 2024 - 14:00',
                description: 'Entrega programada en Monterrey',
                location: 'Monterrey, Nuevo León',
                status: 'pending',
                coordinates: { lat: 25.6866, lng: -100.3161 }
            }
        ]
    },
    'OTIF-2024-005678': {
        status: 'Entregado',
        origin: 'Guadalajara, MX',
        destination: 'Tijuana, MX',
        shipmentType: 'Aéreo',
        weight: '150 kg',
        volume: '0.8 m³',
        estimatedDate: '12 de Enero, 2024',
        estimatedTime: '10:00 - 12:00',
        recipient: 'María González',
        phone: '+52 664 987-6543',
        coordinates: {
            origin: { lat: 20.6597, lng: -103.3496 },
            destination: { lat: 32.5149, lng: -117.0382 },
            current: { lat: 32.5149, lng: -117.0382 }, // Tijuana (entregado)
            route: [
                { lat: 20.6597, lng: -103.3496 }, // Guadalajara
                { lat: 32.5149, lng: -117.0382 }  // Tijuana
            ]
        },
        timeline: [
            {
                title: 'Envío Recibido',
                time: '8 de Enero, 2024 - 16:45',
                description: 'El envío ha sido recibido en nuestras instalaciones de Guadalajara',
                location: 'Centro de Distribución GDL',
                status: 'completed',
                coordinates: { lat: 20.6597, lng: -103.3496 }
            },
            {
                title: 'En Proceso de Embalaje',
                time: '9 de Enero, 2024 - 10:30',
                description: 'El envío está siendo preparado para transporte aéreo',
                location: 'Centro de Distribución GDL',
                status: 'completed',
                coordinates: { lat: 20.6597, lng: -103.3496 }
            },
            {
                title: 'En Ruta al Aeropuerto',
                time: '9 de Enero, 2024 - 14:00',
                description: 'El envío está en ruta hacia el aeropuerto de Guadalajara',
                location: 'Aeropuerto Internacional de Guadalajara',
                status: 'completed',
                coordinates: { lat: 20.6597, lng: -103.3496 }
            },
            {
                title: 'En Vuelo',
                time: '10 de Enero, 2024 - 08:30',
                description: 'El envío está en vuelo hacia Tijuana',
                location: 'En Vuelo GDL-TIJ',
                status: 'completed',
                coordinates: { lat: 26.5, lng: -110.5 } // Punto medio
            },
            {
                title: 'Entregado',
                time: '12 de Enero, 2024 - 11:30',
                description: 'El envío ha sido entregado exitosamente',
                location: 'Tijuana, Baja California',
                status: 'completed',
                coordinates: { lat: 32.5149, lng: -117.0382 }
            }
        ]
    },
    'OTIF-2024-009876': {
        status: 'En Almacén',
        origin: 'Veracruz, MX',
        destination: 'Cancún, MX',
        shipmentType: 'Marítimo',
        weight: '2000 kg',
        volume: '8.0 m³',
        estimatedDate: '20 de Enero, 2024',
        estimatedTime: '09:00 - 17:00',
        recipient: 'Carlos Rodríguez',
        phone: '+52 998 456-7890',
        coordinates: {
            origin: { lat: 19.1738, lng: -96.1342 },
            destination: { lat: 21.1743, lng: -86.8466 },
            current: { lat: 19.1738, lng: -96.1342 }, // Veracruz (en almacén)
            route: [
                { lat: 19.1738, lng: -96.1342 }, // Veracruz
                { lat: 21.1743, lng: -86.8466 }  // Cancún
            ]
        },
        timeline: [
            {
                title: 'Envío Recibido',
                time: '5 de Enero, 2024 - 11:20',
                description: 'El envío ha sido recibido en el puerto de Veracruz',
                location: 'Puerto de Veracruz',
                status: 'completed',
                coordinates: { lat: 19.1738, lng: -96.1342 }
            },
            {
                title: 'En Almacén',
                time: '6 de Enero, 2024 - 08:00',
                description: 'El envío está almacenado esperando embarque',
                location: 'Almacén Portuario Veracruz',
                status: 'current',
                coordinates: { lat: 19.1738, lng: -96.1342 }
            },
            {
                title: 'Programado para Embarque',
                time: '15 de Enero, 2024 - 10:00',
                description: 'El envío está programado para embarque en el próximo buque',
                location: 'Puerto de Veracruz',
                status: 'pending',
                coordinates: { lat: 19.1738, lng: -96.1342 }
            },
            {
                title: 'En Tránsito Marítimo',
                time: '16 de Enero, 2024 - 06:00',
                description: 'El envío está en tránsito por mar hacia Cancún',
                location: 'Golfo de México',
                status: 'pending',
                coordinates: { lat: 20.5, lng: -91.5 } // Punto medio en el golfo
            },
            {
                title: 'Entrega Programada',
                time: '20 de Enero, 2024 - 09:00',
                description: 'Entrega programada en Cancún',
                location: 'Cancún, Quintana Roo',
                status: 'pending',
                coordinates: { lat: 21.1743, lng: -86.8466 }
            }
        ]
    }
};

function initializeTracking() {
    const searchBtn = document.getElementById('search-btn');
    const trackingInput = document.getElementById('tracking-number');
    const demoBtns = document.querySelectorAll('.demo-btn');
    
    if (!searchBtn || !trackingInput) {
        console.error('Elementos de búsqueda no encontrados');
        return;
    }
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        const trackingNumber = trackingInput.value.trim();
        if (trackingNumber) {
            searchTracking(trackingNumber);
        } else {
            showError('Por favor ingresa un número de guía');
        }
    });
    
    // Enter key in input
    trackingInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Demo buttons
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const trackingNumber = this.dataset.tracking;
            trackingInput.value = trackingNumber;
            searchTracking(trackingNumber);
        });
    });
}

function searchTracking(trackingNumber) {
    const resultsSection = document.getElementById('tracking-results');
    
    if (!resultsSection) {
        console.error('Sección de resultados no encontrada');
        return;
    }
    
    // Show loading state
    resultsSection.style.display = 'block';
    resultsSection.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="text-muted">Buscando información del envío...</p>
        </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const trackingData = demoTrackingData[trackingNumber];
        
        if (trackingData) {
            displayTrackingResults(trackingNumber, trackingData);
        } else {
            showTrackingError('No se encontró información para este número de guía');
        }
    }, 1500);
}

function displayTrackingResults(trackingNumber, data) {
    const resultsSection = document.getElementById('tracking-results');
    
    if (!resultsSection) {
        console.error('Sección de resultados no encontrada');
        return;
    }
    
    resultsSection.innerHTML = `
        <div class="tracking-header bg-white rounded-3 shadow-sm p-4 mb-4">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h2 class="mb-2">Envió #<span id="tracking-id">${trackingNumber}</span></h2>
                    <p class="tracking-status mb-0" id="tracking-status">${data.status}</p>
                </div>
                <div class="col-md-4 text-md-end">
                    <div class="tracking-actions d-flex gap-2 justify-content-md-end">
                        <button class="btn btn-outline-primary">
                            <span class="material-icons me-1">download</span>
                            <span class="btn-label">PDF</span>
                        </button>
                        <button class="btn btn-outline-primary">
                            <span class="material-icons me-1">share</span>
                            <span class="btn-label">Compartir</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="tracking-details mb-4">
            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="tracking-card bg-white rounded-3 shadow-sm p-4 h-100">
                        <h3 class="h5 mb-3">Información del Envío</h3>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Origen:</span>
                            <span class="detail-value" id="origin">${data.origin}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Destino:</span>
                            <span class="detail-value" id="destination">${data.destination}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Tipo de Envío:</span>
                            <span class="detail-value" id="shipment-type">${data.shipmentType}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Peso:</span>
                            <span class="detail-value" id="weight">${data.weight}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2">
                            <span class="detail-label fw-semibold">Volumen:</span>
                            <span class="detail-value" id="volume">${data.volume}</span>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="tracking-card bg-white rounded-3 shadow-sm p-4 h-100">
                        <h3 class="h5 mb-3">Información de Entrega</h3>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Fecha Estimada:</span>
                            <span class="detail-value" id="estimated-date">${data.estimatedDate}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Hora Estimada:</span>
                            <span class="detail-value" id="estimated-time">${data.estimatedTime}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2 border-bottom">
                            <span class="detail-label fw-semibold">Destinatario:</span>
                            <span class="detail-value" id="recipient">${data.recipient}</span>
                        </div>
                        <div class="detail-item d-flex justify-content-between py-2">
                            <span class="detail-label fw-semibold">Teléfono:</span>
                            <span class="detail-value" id="phone">${data.phone}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Timeline -->
        <div class="tracking-timeline bg-white rounded-3 shadow-sm p-4 mb-4">
            <h3 class="h5 mb-4">Historial de Eventos</h3>
            <div class="timeline" id="timeline">
                ${generateTimelineHTML(data.timeline)}
            </div>
        </div>

        <!-- Map Section -->
        <div class="tracking-map bg-white rounded-3 shadow-sm p-4">
            <h3 class="h5 mb-4">Ubicación Actual</h3>
            <div class="map-container" id="map-container">
                <div id="map" style="height: 400px; width: 100%; border-radius: 8px;"></div>
                <div class="map-info mt-3">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="map-detail">
                                <span class="material-icons text-primary me-2">location_on</span>
                                <span id="current-location">${getCurrentLocationText(data)}</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="map-detail">
                                <span class="material-icons text-success me-2">schedule</span>
                                <span id="last-update">${getLastUpdateText(data)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update status color
    const statusElement = document.getElementById('tracking-status');
    if (statusElement) {
        statusElement.className = 'tracking-status mb-0';
        
        if (data.status === 'Entregado') {
            statusElement.style.color = 'var(--otif-success)';
        } else if (data.status === 'En Tránsito') {
            statusElement.style.color = 'var(--otif-warning)';
        } else {
            statusElement.style.color = 'var(--otif-blue)';
        }
    }
    
    // Show results
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Initialize map after DOM is updated
    setTimeout(() => {
        initializeMapWithData(data);
    }, 100);
}

function generateTimelineHTML(timelineData) {
    return timelineData.map(item => `
        <div class="timeline-item ${item.status}">
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4 class="timeline-title">${item.title}</h4>
                    <span class="timeline-time">${item.time}</span>
                </div>
                <p class="timeline-description">${item.description}</p>
                <div class="timeline-location">
                    <span class="material-icons" style="font-size: 16px; vertical-align: middle; margin-right: 4px;">location_on</span>
                    ${item.location}
                </div>
            </div>
        </div>
    `).join('');
}

function showTrackingError(message) {
    const resultsSection = document.getElementById('tracking-results');
    
    if (!resultsSection) {
        console.error('Sección de resultados no encontrada');
        return;
    }
    
    resultsSection.innerHTML = `
        <div class="text-center py-5">
            <span class="material-icons text-muted mb-3" style="font-size: 4rem;">search_off</span>
            <h3 class="text-muted mb-3">No se encontró el envío</h3>
            <p class="text-muted mb-4">${message}</p>
            <button class="btn btn-primary" onclick="document.getElementById('tracking-results').style.display='none'">
                <span class="btn-label">Intentar de nuevo</span>
            </button>
        </div>
    `;
    
    resultsSection.style.display = 'block';
}

function showError(message) {
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

// Google Maps Functions
function initializeMapWithData(data) {
    if (!data.coordinates) {
        console.error('No hay coordenadas disponibles para el mapa');
        return;
    }

    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Elemento del mapa no encontrado');
        return;
    }

    // Clear existing map
    if (map) {
        map = null;
    }

    // Initialize map
    const mapOptions = {
        center: data.coordinates.current,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    };

    map = new google.maps.Map(mapElement, mapOptions);

    // Add markers and route
    addMarkersAndRoutes(data.coordinates);
    
    // Fit bounds to show entire route
    fitMapToRoute(data.coordinates.route);
}

function addMarkersAndRoutes(coordinates) {
    if (!map) return;

    // Clear existing markers and polyline
    if (currentMarker) currentMarker.setMap(null);
    if (routePolyline) routePolyline.setMap(null);

    // Add origin marker
    const originMarker = new google.maps.Marker({
        position: coordinates.origin,
        map: map,
        title: 'Origen',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4CAF50',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        }
    });

    // Add destination marker
    const destinationMarker = new google.maps.Marker({
        position: coordinates.destination,
        map: map,
        title: 'Destino',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#F44336',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 2
        }
    });

    // Add current location marker
    currentMarker = new google.maps.Marker({
        position: coordinates.current,
        map: map,
        title: 'Ubicación Actual',
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#2196F3',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3
        }
    });

    // Add route polyline
    routePolyline = new google.maps.Polyline({
        path: coordinates.route,
        geodesic: true,
        strokeColor: '#FF9800',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    routePolyline.setMap(map);

    // Add info windows
    addInfoWindows(originMarker, 'Origen', coordinates.origin);
    addInfoWindows(destinationMarker, 'Destino', coordinates.destination);
    addInfoWindows(currentMarker, 'Ubicación Actual', coordinates.current);
}

function addInfoWindows(marker, title, position) {
    const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>${title}</strong><br>${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}</div>`
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

function fitMapToRoute(route) {
    if (!map || !route || route.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    route.forEach(point => {
        bounds.extend(point);
    });

    map.fitBounds(bounds);
    
    // Add some padding
    const listener = google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
    });
}

function getCurrentLocationText(data) {
    const currentEvent = data.timeline.find(event => event.status === 'current');
    return currentEvent ? currentEvent.location : 'Ubicación actual del envío';
}

function getLastUpdateText(data) {
    const currentEvent = data.timeline.find(event => event.status === 'current');
    return currentEvent ? `Actualizado: ${currentEvent.time}` : 'Última actualización';
}

// Initialize map when Google Maps API is loaded
if (typeof google !== 'undefined' && google.maps) {
    // API is already loaded
} else {
    // Wait for API to load
    window.addEventListener('load', function() {
        if (typeof google !== 'undefined' && google.maps) {
            // API loaded, initialize if needed
        }
    });
} 