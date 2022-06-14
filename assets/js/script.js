// Calling metisMenu Plugin
$(function() {
    $('#metismenu').metisMenu({
        // For auto collapse support
        toggle: true
    });
});

// Fading the jQuery loader
jQuery(window).on('load', function() {
    // Hide the matched elements by fading them to transparent.
    jQuery('.loader').fadeOut('200');
});


(function($) {
    // Encoding and Decoding URL
    function getQueryStringValue(key) {
        return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
    }

    // Getting query string value from URL
    const overlay = getQueryStringValue('layer').toString();
    const pointOverlay = getQueryStringValue('point').toString();

    // Adjusting element dimensions based on device
    let device = null;
    let screenWidth = screen.width;

    // dimButtonGroup is the div containing the buttons (2D and 3D)
    const dimButtonGroup = document.getElementById('DDD');

    // Creating the 2D button toggle
    // Creates the HTML element specified by tagName
    const button2D = document.createElement('button');

    button2D.setAttribute('class', 'btn btn-primary btn-sm');
    button2D.setAttribute('id', 'DDButton');
    button2D.innerHTML = 'Vue en 2D';

    // Creating the 3D button toggle
    const button3D = document.createElement('button');

    button3D.setAttribute('class', 'btn btn-primary btn-small');
    button3D.setAttribute('id', 'DDDButton');
    button3D.innerHTML = 'Vue en 3D';

    // Reference Zoom
    var refZoom = 15.5;

    if (screenWidth < 800) {
        console.log('Screen width is less than 800px');
        $('#carouselExampleCaptions').remove();

    }

    if (screenWidth < 500) {
        device = 'phone';
        document.getElementById('map').style.height = '75vh';
        // document.getElementById('map').style.margin = '0';
        refZoom = 15;
        dimButtonGroup.style.position = 'absolute';
        // dimButtonGroup.style.height = '50px';
        dimButtonGroup.style.width = '200px';
        dimButtonGroup.style.top = '98%';
        dimButtonGroup.style.left = '49%';
        dimButtonGroup.style.marginTop = '-25px';
        dimButtonGroup.style.marginLeft = '-50px';
        dimButtonGroup.appendChild(button2D);
        dimButtonGroup.appendChild(button3D);

        document.getElementById('switchView').style.left = '60%';
        $('#carouselExampleCaptions').remove();
        // $('#quote').remove();
    } else if (screenWidth < 768) {
        $('#carouselExampleCaptions').remove();
    } else {
        dimButtonGroup.appendChild(button2D);
        dimButtonGroup.appendChild(button3D);
    }

    // Specifying flying buttons dimensions
    if (screenWidth > 1000) {
        document.getElementById('switchView').style.width = '40%';
        document.getElementById('clinic').style.width = '20%';
        document.getElementById('apesa').style.width = '20%';
        document.getElementById('iav').style.width = '14%';
        document.getElementById('switchView').style.marginLeft = '-20%';
    }

    if (screenWidth < 1000 && screenWidth > 500) {
        // document.getElementById('switchView').style.marginLeft = '-35%';
    }

    if (screenWidth < 768) {}

    //IAV extent
    const mapExtent = [
        [-6.889706, 33.954409],
        [-6.835639, 33.998427]
    ];

    // Adding mapbox basemap
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsYWhlbGZhcmlzc2kiLCJhIjoiY2ttb3p1Yzk3Mjl2bzJ2bno3OGlqcjJ2bCJ9.pErPZNgS_t5jzHlsp_XyRQ';

    // Creating a map object
    const map = new mapboxgl.Map({
        style: 'mapbox://styles/salahelfarissi/ckzzjh6kl000k14mf1l6b88wk',
        center: [-6.8665775, 33.9769235],
        zoom: refZoom,
        pitch: 0,
        bearing: 128,
        container: 'map',
        antialias: true,
        attributionControl: false,
        maxBounds: [
            [-6.889706, 33.954409],
            [-6.835639, 33.998427]
        ],
    });
 
    map.addControl(new mapboxgl.FullscreenControl());



    // Correcting for arabic text direction for street names
    mapboxgl.setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        null,
        true // Lazy load the plugin
    );

    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // Add geolocate control to the map.
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true,
            // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        })
    );

    // Square and Square-check
    const square = 'https://cdn.jsdelivr.net/gh/salahelfarissi/interactive-iav-campus-map@master/assets/img/popup/inactive.png';
    const squareCheck = 'https://cdn.jsdelivr.net/gh/salahelfarissi/interactive-iav-campus-map@master/assets/img/popup/active.png';

    // If changed, markers must change size too
    const markerSize = [1, 13, 0.1, 25, 1.5];

    const lineSize = [1.5, 13, 2, 22, 18];
    const pointSize = [1.5, 13, 2, 22, 60];
    const iconSize = [1.5, 13, 0.25, 22, 1.7];

    // Like departments labels
    let headingLabel = [];

    // Line background color
    const activeLayerBackground = '#EEEEEE';

    // Default marker
    const pin = './assets/img/icons/dep-icon.png';

    // Départements

    let departmentsCount = 0;
    let departmentsList = [];
    let departmentsLink = document.getElementById('departments');
    let insertDepartments = document.getElementById('insertDepartment');
    headingLabel.push('departments');

    // Amphithéâtres

    let amphitheaterCount = 0;
    let amphitheaterList = [];
    let amphitheaterLink = document.getElementById('amphitheater');
    let insertAmphitheater = document.getElementById('insertAmphitheater');
    headingLabel.push('amphitheater');

    // Administration

    let adminCount = 0;
    // let adminList = [];
    let adminLink = document.getElementById('admin');
    // let insertAdmin = document.getElementById('insertAdmin');
    headingLabel.push('admin');

    // Services

    let serviceCount = 0;
    let serviceList = [];
    let serviceLink = document.getElementById('service');
    let insertService = document.getElementById('insertService');
    headingLabel.push('service');

    let cdaCount = 0;
    let cdaLink = document.getElementById('cda');
    headingLabel.push('cda');

    let biblioCount = 0;
    let biblioLink = document.getElementById('biblio');
    headingLabel.push('biblio');

    let studyCount = 0;
    let studyLink = document.getElementById('study');
    headingLabel.push('study');

    let foodCount = 0;
    let foodList = [];
    let foodLink = document.getElementById('food');
    let insertFood = document.getElementById('insertFood');
    headingLabel.push('food');

    let roomCount = 0;
    let roomList = [];
    let roomLink = document.getElementById('room');
    let insertRoom = document.getElementById('insertRoom');
    headingLabel.push('room');

    let sportCount = 0;
    let sportList = []
    let sportLink = document.getElementById('sport');
    let insertSport = document.getElementById('insertSport');
    headingLabel.push('sport');

    let healthCount = 0;
    let healthList = []
    let healthLink = document.getElementById('health');
    let insertHealth = document.getElementById('insertHealth');
    headingLabel.push('health');

    let capCount = 0;
    let capList = []
    let capLink = document.getElementById('cap');
    let insertCap = document.getElementById('insertCap');
    headingLabel.push('cap');

    let onssaCount = 0;
    let onssaList = []
    let onssaLink = document.getElementById('onssa');
    let insertOnssa = document.getElementById('insertOnssa');
    headingLabel.push('onssa');

    let bdeCount = 0;
    let bdeList = []
    let bdeLink = document.getElementById('bde');
    let insertBde = document.getElementById('insertBde');
    headingLabel.push('bde');

    let gameCount = 0;
    let gameList = []
    let gameLink = document.getElementById('game');
    let insertGame = document.getElementById('insertGame');
    headingLabel.push('game');

    let prayerCount = 0;
    let prayerList = []
    let prayerLink = document.getElementById('prayer');
    let insertPrayer = document.getElementById('insertPrayer');
    headingLabel.push('prayer');

    let pressCount = 0;
    let pressList = []
    let pressLink = document.getElementById('press');
    let insertPress = document.getElementById('insertPress');
    headingLabel.push('press');

    // Linear geometries
    var linearCount = 0;
    var linearLink = document.getElementById('Cheminements accessibles');
    var linearColor = '#138fad';
    var linearType = 'line';

    var listLayers = [departmentsLink, amphitheaterLink, adminLink, serviceLink, cdaLink, biblioLink, studyLink, foodLink, roomLink, sportLink, healthLink, capLink, onssaLink, bdeLink, gameLink, prayerLink, pressLink];

    // Other variables
    var Layers = [];
    var popup = null;
    var popupList = null;

    // Coordonnées de la salle sélectionnée
    var salleRX = null;
    var salleRY = null;
    var iconCount = 0;
    // Initialisation de de fonctions

    // Variables nécessaires à la fonctionnalité de changement de vue (2D -> 3D)
    var DDD = false; // Vue de base en 2D
    var iav2DId = 'iav2DId'; // Identifiant de la couche de bati 2D
    var iav2DCount = 0; // Nombre de fois que la couche de bati 2D a été appelée (< nécessité de changer d'identifiant)
    var iav3DId = 'iav3DId'; // Identifiant de la couche de bati 3D
    // used to be iav3DCount
    let iav3DCount = 0; // ? Number of times the 3D layer has been called (< necessary to change the ID)
    var iav2DHId = 'iav2DHId'; // idem couche hover
    var iav3DHId = 'iav3DHId'; // idem couche hover
    var label_iav2Did = 'label_iav2Did'; // idem couche etiquette
    var label_iav3Did = 'label_iav3Did'; // idem couche etiquette

    var popupBuild = new mapboxgl.Popup({ // Popup Hover Bati
        closeButton: false,
        closeOnClick: false
    });
    let popupContent = null

    // Load building data with extrusion effect
    function getiav3D() {
        // map.removeLayer(iav2DId);
        if (iav3DCount !== 0) {
            map.removeLayer(iav2DId);
            map.removeLayer(iav2DHId);
            map.removeLayer(label_iav2Did);
        }

        iconCount++;
        iav3DCount++;
        iav3DId = 'iav3DId' + iav3DCount;
        iav3DHId = 'iav3DHId' + iav3DCount;
        label_iav3Did = 'label_iav3Did' + iav3DCount;

        map.addLayer({
            id: iav3DId, // ? This ID is incremented by one each time the layer is called
            minzoom: 13, // ? At zoom levels less than the minzoom, the layer will be hidden
            source: 'iav3D',
            filter: ['==', 'extrude', 1],
            type: 'fill-extrusion',
            paint: {
                // the color of the building extrusion
                'fill-extrusion-color': ['get', 'color'],
                'fill-extrusion-height': {
                    'type': 'identity',
                    'property': 'height'
                },
                'fill-extrusion-base': {
                    'type': 'identity',
                    'property': 'height_half'
                },
                'fill-extrusion-opacity': 0.8
            }
        }, Layers[0]); // ? For pins to be displayed above the layer

        // ? A duplicate layer that is hidden on 3D toggling
        // ? Will be added once mouse is hovering over a building
        map.addLayer({
            id: iav3DHId,
            type: 'fill-extrusion',
            source: 'iav3D',
            filter: ['==', 'name', ''],
            paint: {
                // the color of the building extrusion when being hovered
                'fill-extrusion-color': ['get', 'hover_color'],
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    15, 0,
                    15.05, ['get', 'height']
                ],
                'fill-extrusion-base': {
                    'type': 'identity',
                    'property': 'height_half'
                },
                'fill-extrusion-opacity': 1
            }
        }, Layers[0]);

        // Displaying popup content on hover with a highlighting effect (color change)
        map
            .on('mousemove', iav3DId, function(e) {
                // * Displaying the feature that matches the hovered building
                // ! name field must be a unique identifier
                map.setFilter(iav3DHId, ['==', 'name', e.features[0].properties.name]);

                let popupTitle = '';
                popupContent = '';

                // ? This if statement ensures that a popup is not displayed when a pin was added
                if (Layers.length == 0) {
                    if (e.features[0].properties.name !== 'null') {
                        popupTitle = e.features[0].properties.name;
                    }
                    if (e.features[0].properties.image !== 'null') {
                        popupContent += '<img src = \'' + e.features[0].properties.image + '\'/>'
                    }
                    if (e.features[0].properties.info !== 'null') {
                        popupContent += '<p>' + e.features[0].properties.info + '<p>';
                    }
                    if (popupBuild !== null) {
                        popupBuild.remove();
                    }
                    if (e.features[0].properties.name !== 'null') {
                        if ((popup === null || popup.isOpen() === false) &&
                            (searchPopup === null || searchPopup.isOpen() === false) &&
                            (popupList === null || popupList.isOpen() === false)) {

                            popupBuild = new mapboxgl.Popup({
                                    offset: [0, -15],
                                    closeButton: false,
                                    anchor: 'bottom'
                                })
                                .setLngLat(e.lngLat)
                                .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
                                .addTo(map);
                        }
                    }
                }
            })
            // ? This adds compatibility for touch devices (phone, tablet)
            .on('click', iav3DId, function(e) {
                map.setFilter(iav3DHId, ['==', 'name', e.features[0].properties.name]);
                let popupTitle = '';
                popupContent = '';

                if (Layers.length == 0) {
                    if (e.features[0].properties.name !== 'null') {
                        popupTitle = e.features[0].properties.name;
                    }
                    if (e.features[0].properties.image !== 'null') {
                        popupContent += '<img src = \'' + e.features[0].properties.image + '\'/>'
                    }
                    if (e.features[0].properties.info !== 'null') {
                        popupContent += '<p>' + e.features[0].properties.info + '<p>';
                    }
                    if (popupBuild !== null) {
                        popupBuild.remove();
                    };
                    if (e.features[0].properties.name !== 'null') {
                        if ((popup === null || popup.isOpen() === false) &&
                            (searchPopup === null || searchPopup.isOpen() === false) &&
                            (popupList === null || popupList.isOpen() === false)) {

                            popupBuild = new mapboxgl.Popup({
                                    offset: [0, -15],
                                    closeButton: false,
                                    anchor: 'bottom'
                                })
                                .setLngLat(e.lngLat)
                                .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
                                .addTo(map);
                        }
                    }
                }
            })
            // ? Hiding the hover layer when the mouse leaves the building
            .on('mouseleave', iav3DId, function() {
                map.setFilter(iav3DHId, ['==', 'name', '']);
                popupBuild.remove();
            })

        map.addLayer({
            id: label_iav3Did,
            type: 'symbol',
            source: {
                type: 'geojson',
                data: pointsIAV
            },
            filter: ['==', 'label_state', 1],
            layout: {
                'text-field': '{label}',
                'text-anchor': 'center',
                'text-size': {
                    'base': 1.2,
                    'stops': [
                        [13, 2.5],
                        [22, 60]
                    ]
                },
                'text-max-width': 8
            },
            paint: {
                'text-color': '#5E34FF',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            },
            minzoom: 15,
        })
        addIconPlacement()
    }

    popupContent = '';

    // Displaying a 2D map
    function getiav2D() {
        if (iav3DCount !== 0) {
            map.removeLayer(iav3DId);
            map.removeLayer(iav3DHId);
            map.removeLayer(label_iav3Did);
        }

        iconCount++;
        iav2DCount++;
        iav2DId = 'iav2DId' + iav2DCount;
        iav2DHId = 'iav2DHId' + iav2DCount;
        label_iav2Did = 'label_iav2Did' + iav2DCount;

        map.addLayer({
            id: iav2DId,
            type: 'fill',
            source: 'iav3D',
            paint: {
                'fill-color': ['get', 'color'],
                'fill-opacity': 0.8
            }
        }, Layers[0]);

        map.addLayer({
            id: iav2DHId,
            type: 'fill',
            source: 'iav3D',
            filter: ['==', 'name', ''],
            paint: {
                'fill-color': ['get', 'hover_color'],
                'fill-opacity': 1
            }
        }, Layers[0]);

        map
            .on('mousemove', iav2DId, function(e) {
                map.setFilter(iav2DHId, ['==', 'name', e.features[0].properties.name]);
                let popupTitleHover = '';
                popupContent = '';
                if (Layers.length == 0) {
                    if (e.features[0].properties.name !== 'null') {
                        popupTitleHover = e.features[0].properties.name;
                    }
                    if (e.features[0].properties.image !== 'null') {
                        popupContent += '<img src = \'' + e.features[0].properties.image + '\'/>'
                    }
                    if (e.features[0].properties.info !== 'null') {
                        popupContent += '<p>' + e.features[0].properties.info + '<p>';
                    }
                    if (popupBuild !== null) {
                        popupBuild.remove();
                    };
                    if (e.features[0].properties.name !== 'null') {
                        if ((popup === null || popup.isOpen() === false) &&
                            (searchPopup === null || searchPopup.isOpen() === false) &&
                            (popupList === null || popupList.isOpen() === false)) {

                            popupBuild = new mapboxgl.Popup({
                                    offset: [0, -15],
                                    closeButton: false,
                                    anchor: 'bottom'
                                })
                                .setLngLat(e.lngLat)
                                .setHTML('<h1>' + popupTitleHover + '</h1>' + popupContent)
                                .addTo(map);
                        }
                    }
                }
            })
            .on('click', iav2DId, function(e) {
                map.setFilter(iav2DHId, ['==', 'name', e.features[0].properties.name]);
                let popupTitleHover = '';
                popupContent = '';
                if (Layers.length == 0) {
                    if (e.features[0].properties.name !== 'null') {
                        popupTitleHover = e.features[0].properties.name;
                    }
                    if (e.features[0].properties.image !== 'null') {
                        popupContent += '<img src = \'' + e.features[0].properties.image + '\'/>'
                    }
                    if (e.features[0].properties.info !== 'null') {
                        popupContent += '<p>' + e.features[0].properties.info + '<p>';
                    }
                    if (popupBuild !== null) {
                        popupBuild.remove();
                    };
                    if (e.features[0].properties.name !== 'null') {
                        if ((popup === null || popup.isOpen() === false) &&
                            (searchPopup === null || searchPopup.isOpen() === false) &&
                            (popupList === null || popupList.isOpen() === false)) {

                            popupBuild = new mapboxgl.Popup({
                                    offset: [0, -15],
                                    closeButton: false,
                                    anchor: 'bottom'
                                })
                                .setLngLat(e.lngLat)
                                .setHTML('<h1>' + popupTitleHover + '</h1>' + popupContent)
                                .addTo(map);
                        }
                    }
                }
            })
            .on('mouseleave', iav2DId, function() {
                map.setFilter(iav2DHId, ['==', 'name', '']);
                popupBuild.remove();
            });

        map.addLayer({
            id: label_iav2Did,
            type: 'symbol',
            source: {
                type: 'geojson',
                data: pointsIAV
            },
            filter: ['==', 'label_state', 1],
            layout: {
                'text-field': '{label}',
                'text-anchor': 'center',
                'text-size': {
                    'base': 1.2,
                    'stops': [
                        [13, 2.5],
                        [22, 60]
                    ]
                },
                'text-max-width': 8
            },
            paint: {
                'text-color': '#42592C',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            },
            minzoom: 15,
        });
        addIconPlacement()
    }

    function addIconPlacement() {

        // Basket
        map.loadImage(
            './assets/img/icons/basketball-ball.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('basket' + iconCount, image);

                map.addLayer({
                    'id': 'basket' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'icon_name', 'basket'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'basket' + iconCount,
                        'icon-size': 0.15
                    },
                    minzoom: 15.5,
                })
            })

        // Basket
        map.loadImage(
            './assets/img/icons/signage.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('signage' + iconCount, image);

                map.addLayer({
                    'id': 'signage' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'icon_name', 'parking'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'signage' + iconCount,
                        'icon-size': 0.25
                    },
                    minzoom: 15.5,
                })
            })

        // Grass
        map.loadImage(
            './assets/img/icons/grass.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('grass' + iconCount, image);

                map.addLayer({
                    'id': 'grass' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'name', 'grass'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'grass' + iconCount,
                        'icon-size': 0.03
                    },
                    minzoom: 15.5,
                })
            })
        
                // tree
            map.loadImage(
                    './assets/img/icons/tree.png',
                    (error, image) => {
                        if (error) throw error;
        
                        map.addImage('tree' + iconCount, image);
        
                        map.addLayer({
                            'id': 'tree' + iconCount,
                            'type': 'symbol',
                            'source': {
                                'type': 'geojson',
                                'data': pointsIAV
                            },
                            filter: ['==', 'name', 'tree'],
                            'layout': {
                                'visibility': 'visible',
                                'icon-image': 'tree' + iconCount,
                                'icon-size': 0.045
                            },
                            minzoom: 13.5,
                        })
                    })
            
                            // palmier
            map.loadImage(
                                './assets/img/icons/palmier.png',
                                (error, image) => {
                                    if (error) throw error;
                    
                                    map.addImage('palmier' + iconCount, image);
                    
                                    map.addLayer({
                                        'id': 'palmier' + iconCount,
                                        'type': 'symbol',
                                        'source': {
                                            'type': 'geojson',
                                            'data': pointsIAV
                                        },
                                        filter: ['==', 'name', 'palmier'],
                                        'layout': {
                                            'visibility': 'visible',
                                            'icon-image': 'palmier' + iconCount,
                                            'icon-size': 0.04
                                        },
                                        minzoom: 13.5,
                                    })
                                })

        // Library
        map.loadImage(
            './assets/img/icons/horse.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('horse' + iconCount, image);

                map.addLayer({
                    'id': 'horse' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'name', 'Ecurie'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'horse' + iconCount,
                        'icon-size': 0.40
                    },
                    minzoom: 15.5,
                })
            })

        map.loadImage(
            './assets/img/icons/clinic.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('clinic' + iconCount, image);

                map.addLayer({
                    'id': 'clinic' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'name', 'Clinique équine'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'clinic' + iconCount,
                        'icon-size': 0.40
                    },
                    minzoom: 15.5,
                })
            })

        map.loadImage(
            './assets/img/icons/coffee.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('coffee' + iconCount, image);

                map.addLayer({
                    'id': 'coffee' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'name', 'Club El Harka'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'coffee' + iconCount,
                        'icon-size': 0.40
                    },
                    minzoom: 15.5,
                })
            })

        map.loadImage(
            './assets/img/icons/barrier.png',
            (error, image) => {
                if (error) throw error;

                map.addImage('barrier' + iconCount, image);

                map.addLayer({
                    'id': 'barrier' + iconCount,
                    'type': 'symbol',
                    'source': {
                        'type': 'geojson',
                        'data': pointsIAV
                    },
                    filter: ['==', 'icon_name', 'entrance'],
                    'layout': {
                        'visibility': 'visible',
                        'icon-image': 'barrier' + iconCount,
                        'icon-size': 0.30
                    },
                    minzoom: 15.5,
                })
            })
    }

    function addPointOverlay(name, iconSize) {
        var iconURL = './icons/layers_icons/recherche.png'
        var markerOffset = [-15, -20];
        if (iconSize.toString() === '1,13,0.1,25,1.5') {
            markerOffset = [-30, -50];
        } else if (iconSize.toString() === '1,13,0.05,25,1') {
            markerOffset = [-40, -50]
        }
        map.loadImage(iconURL, function(error, image) {
            if (error) throw error;
            map.addImage(name + 'image', image);
            map.addLayer({
                'id': name,
                'type': 'symbol',
                'source': {
                    'type': 'geojson',
                    'data': pointsIAV
                },
                'filter': ['==', 'name', name],
                'layout': {
                    'icon-image': name + 'image',
                    'icon-size': {
                        'base': iconSize[0],
                        'stops': [
                            [iconSize[1], iconSize[2]],
                            [iconSize[3], iconSize[4]]
                        ]
                    },
                    'icon-allow-overlap': true,
                    'icon-offset': {
                        stops: [
                            [13, [0, markerOffset[0]]],
                            [22, [0, markerOffset[1]]]
                        ]
                    }
                },

            });
        });
        Layers.push(name);
        var layer = name;
        var type = 'marker';
    };

    // htmlLink refers to the item to be clicked in index.html
    function addCategoryOverlay(htmlLink, layerName, ordre, type, colorOrUrl, iconSize, overlayCount) {
        // Adding linear data
        if (type === 'line') {
            if (overlayCount === 0) {
                map.addLayer({
                    id: layerName,
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: lines
                    },

                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    filter: ['==', 'grouping', layerName],
                    paint: {
                        'line-color': colorOrUrl,
                        'line-width': {
                            'base': iconSize[0],
                            'stops': [
                                [iconSize[1], iconSize[2]],
                                [iconSize[3], iconSize[4]]
                            ]
                        }
                    }
                });
                Layers.push(layerName);
                for (let i = 0; i < htmlLink.childNodes.length; i++) {
                    if (htmlLink.childNodes[i].className == 'square') {
                        htmlLink.childNodes[i].classList.add('active');
                        break;
                    }
                }
                htmlLink.classList.add('active');
            } else {
                var visibility = map.getLayoutProperty(layerName, 'visibility');
                if (visibility === 'visible') {

                    for (var i = 0; i < htmlLink.childNodes.length; i++) {
                        if (htmlLink.childNodes[i].className == 'square active') {
                            htmlLink.childNodes[i].classList.remove('active');
                            break;
                        }
                    }
                    htmlLink.classList.remove('active');

                    map.setLayoutProperty(layerName, 'visibility', 'none');
                    Layers = Layers.filter(item => item != layerName);
                    if (subLabel) {
                        map.setLayoutProperty(labelLayerName, 'visibility', 'none');
                        Layers = Layers.filter(item => item != labelLayerName);
                    }
                } else {
                    map.setLayoutProperty(layerName, 'visibility', 'visible');
                    Layers.push(layerName);

                    for (var i = 0; i < htmlLink.childNodes.length; i++) {
                        if (htmlLink.childNodes[i].className == 'square') {
                            htmlLink.childNodes[i].classList.add('active');
                            break;
                        }
                    }
                    htmlLink.classList.add('active');
                }
            };


            // Adding marker data
        } else {
            let subLabel = false;
            for (let i = 0; i < headingLabel.length; i++) {
                if (headingLabel[i] === layerName) {
                    subLabel = true;
                    var labelLayerName = layerName + 'label';
                }
            }
            if (overlayCount === 0) {
                if (type === 'marker') {
                    let markerOffset;
                    // If iconSize is set to markerSize, this block of code is executed
                    // This code specifies the position of the marker once an htmlList is called
                    if (iconSize.toString() === '1,13,0.1,25,1.5') {
                        markerOffset = [-23, -40];
                    }

                    map.loadImage(
                        colorOrUrl,
                        (error, image) => {
                            if (error) throw error;

                            map.addImage(layerName + 'image', image);

                            map.addLayer({
                                // if problem add 'new'
                                'id': layerName,
                                'type': 'symbol',
                                'source': {
                                    'type': 'geojson',
                                    'data': pointsIAV
                                },
                                'filter': ['==', 'grouping', layerName],
                                'layout': {
                                    'visibility': 'visible',
                                    'icon-image': layerName + 'image',
                                    'icon-size': {
                                        'base': iconSize[0],
                                        'stops': [
                                            [iconSize[1], iconSize[2]],
                                            [iconSize[3], iconSize[4]]
                                        ]
                                    },
                                    'icon-allow-overlap': true,
                                    'icon-offset': {
                                        stops: [
                                            [13, [0, markerOffset[0]]],
                                            [22, [0, markerOffset[1]]]
                                        ]
                                    }
                                },
                            });
                        });
                    Layers.push(layerName);

                    if (subLabel) {

                        function labelOverlay() {
                            let overlayLabel = map.addLayer({
                                id: labelLayerName,
                                type: 'symbol',
                                source: {
                                    type: 'geojson',
                                    data: pointsIAV
                                },
                                filter: ['==', 'grouping', layerName],
                                layout: {
                                    'text-field': '{label}',
                                    'text-anchor': 'center',
                                    'text-size': {
                                        'base': 1.5,
                                        'stops': [
                                            [15.8, 10],
                                            [20, 25]
                                        ]
                                    },
                                    'text-allow-overlap': true,
                                    'text-offset': {
                                        stops: [
                                            [15.8, [0, -1.8]],
                                            [20, [0, -2.4]]
                                        ]
                                    }
                                },
                                paint: {
                                    'text-color': '#5E34FF',
                                    'text-halo-color': '#fff',
                                    'text-halo-width': 2
                                },
                                minzoom: 15.5
                            });
                            map.moveLayer(layerName + 'label', 0)
                        }

                        setTimeout(labelOverlay, 1000);
                        Layers.push(labelLayerName);

                    }
                }
                // Adding point data
                if (type == 'point') {

                    map.addLayer({
                        id: layerName,
                        type: 'circle',
                        source: {
                            type: 'geojson',
                            data: pointsIAV
                        },
                        filter: ['==', 'grouping', layerName],
                        layout: {
                            'visibility': 'visible'
                        },
                        paint: {
                            'circle-radius': {
                                'base': iconSize[0],
                                'stops': [
                                    [iconSize[1], iconSize[2]],
                                    [iconSize[3], iconSize[4]]
                                ]
                            },
                            'circle-color': colorOrUrl,
                            'circle-opacity': 0.9
                        }
                    });
                    if (subLabel) {
                        overlayEtiquette = map.addLayer({
                            id: labelLayerName,
                            type: 'symbol',
                            source: {
                                type: 'geojson',
                                data: pointsIAV
                            },
                            filter: ['==', 'grouping', layerName],
                            layout: {
                                'text-field': '{label}',
                                'text-anchor': 'center',
                                'text-size': {
                                    'base': 1.5,
                                    'stops': [
                                        [13, 2],
                                        [22, 60]
                                    ]
                                },
                            },
                            paint: {
                                'text-color': 'black'
                            },
                            minzoom: 15.8
                        });

                        Layers.push(labelLayerName);
                    }
                }
                if (type == 'picto') {
                    map.loadImage(colorOrUrl, function(error, image) {
                        if (error) throw error;
                        map.addImage(layerName + 'image', image);
                        map.addLayer({
                            'id': layerName,
                            'type': 'symbol',
                            'source': {
                                'type': 'geojson',
                                'data': pointsIAV
                            },
                            'filter': ['==', 'grouping', layerName],
                            'layout': {
                                'icon-image': layerName + 'image',
                                'icon-size': {
                                    'base': iconSize[0],
                                    'stops': [
                                        [iconSize[1], iconSize[2]],
                                        [iconSize[3], iconSize[4]]
                                    ]
                                },
                                'icon-allow-overlap': true,
                            },

                        });
                    });
                    Layers.push(layerName);
                    if (subLabel) {
                        function labelOverlay() {
                            overlayEtiquette = map.addLayer({
                                id: labelLayerName,
                                type: 'symbol',
                                source: {
                                    type: 'geojson',
                                    data: pointsIAV
                                },
                                filter: ['==', 'grouping', layerName],
                                layout: {
                                    'text-field': '{label}',
                                    'text-anchor': 'center',
                                    'text-size': {
                                        'base': 1.5,
                                        'stops': [
                                            [13, 8],
                                            [22, 50]
                                        ]
                                    },
                                    'text-allow-overlap': true,
                                },
                                paint: {
                                    'text-color': 'white',
                                },
                                minzoom: 15.8
                            });
                            map.moveLayer(layerName + 'etiquette', 0)
                        }

                        setTimeout(labelOverlay, 1000);
                        Layers.push(labelLayerName);
                    }
                }
                Layers.push(layerName);
                if (htmlLink.nodeName == 'LI') {
                    for (var i = 0; i < htmlLink.childNodes.length; i++) {
                        if (htmlLink.childNodes[i].className == 'square') {
                            htmlLink.childNodes[i].classList.add('active');
                        }
                    }
                    htmlLink.classList.add('active');
                }

                if (htmlLink.nodeName == 'A') {
                    htmlLink.classList.add('active');
                    htmlLink.parentElement.classList.add('active');
                }
            } else {
                function hideLayer(layerName, htmlLink) {
                    if (htmlLink.nodeName === 'LI') {
                        for (var i = 0; i < htmlLink.childNodes.length; i++) {
                            if (htmlLink.childNodes[i].className === 'square active') {
                                htmlLink.childNodes[i].classList.remove('active');
                            }
                        }
                        htmlLink.classList.remove('active');
                    }
                    if (htmlLink.nodeName === 'A') {
                        htmlLink.classList.remove('active');
                        htmlLink.parentElement.classList.remove('active');

                    }
                    map.setLayoutProperty(layerName, 'visibility', 'none');
                    Layers = Layers.filter(item => item != layerName);
                    if (popup) {
                        popup.remove();
                    }
                    if (popupList) {
                        popupList.remove();
                    }
                    if (subLabel) {
                        map.setLayoutProperty(labelLayerName, 'visibility', 'none');
                        Layers = Layers.filter(item => item != labelLayerName);
                        if (popup) {
                            popup.remove();
                        }
                    }
                }

                function showLayer(layerName, htmllink) {
                    map.setLayoutProperty(layerName, 'visibility', 'visible');

                    map.moveLayer(layerName, 0)
                    Layers.push(layerName);
                    if (htmllink.nodeName === 'LI') {
                        for (var i = 0; i < htmllink.childNodes.length; i++) {
                            if (htmllink.childNodes[i].className === 'square') {
                                htmllink.childNodes[i].classList.add('active');
                                break;
                            }
                        }
                        htmllink.classList.add('active');

                    }
                    if (htmllink.nodeName === 'A') {
                        htmllink.classList.add('active');
                        htmllink.parentElement.classList.add('active');
                    }

                    if (subLabel) {
                        map.setLayoutProperty(labelLayerName, 'visibility', 'visible')
                        Layers.push(labelLayerName);
                        map.moveLayer(labelLayerName, 0)
                    }
                }

                var visibility = map.getLayoutProperty(layerName, 'visibility');

                if (visibility === 'visible') {
                    if (listLayers.includes(htmlLink)) {
                        if (ordre !== 'nav-third-level mm-collapse') {
                            hideLayer(layerName, htmlLink);
                        }
                    } else {
                        hideLayer(layerName, htmlLink);
                    }
                } else {
                    showLayer(layerName, htmlLink);
                }
            };
            getPopup(layerName, colorOrUrl, type);
            map.on('mousemove', function(e) {
                var features = map.queryRenderedFeatures(e.point, {
                    layers: Layers
                });
                map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
            });
        }
    };

    var popupTitle = null;
    popupContent = [];

    function getPopupContent(feature) {
        popupTitle = null;
        popupContent = [];
        //Titre de la popup
        // if (feature.properties.grouping !== 'null' && feature.properties.grouping !== null && feature.properties.grouping !== '') {
        //     popupTitle = feature.properties.grouping;
        // }
        if (feature.properties.name !== null) {
            popupTitle = feature.properties.name;
        }
        // Contenu de la popup
        // if (feature.properties.building !== 'null' && feature.properties.building !== null && feature.properties.building !== '') {
        //     popupContent += '<p>Building: ' + feature.properties.building + '</p>';
        // }
        if (feature.properties.brochure !== 'null' && feature.properties.brochure !== null && feature.properties.brochure !== '') {
            console.log(feature.properties.brochure);
            popupContent += '<p>• <b>Brochure</b>' + feature.properties.brochure + '</p>';
        }
        // if (feature.properties.capacity !== 'null' && feature.properties.capacity !== null && feature.properties.capacity !== '') {
        //     popupContent += '<p>' + feature.properties.capacity + '<p>';
        // }
        // if (feature.properties.info !== 'null' && feature.properties.info !== null && feature.properties.info !== '') {
        //     popupContent += '<p>' + feature.properties.info + '<p>';
        // }
        // if (feature.properties.link !== 'null' && feature.properties.link !== null && feature.properties.link !== '') {
        //     popupContent += '<p><a href = ' + feature.properties.link + ' target=\'_blank\'>Site internet<a></p>';
        // }
        if (feature.properties.mail !== 'null' && feature.properties.mail !== null && feature.properties.mail !== '') {
            popupContent += '<p>• <b>E-mail</b> <a href="mailto:' + feature.properties.mail + '">' + feature.properties.mail + '</a>' + '</p>';
        }
        // if (feature.properties.phone !== 'null' && feature.properties.phone !== null && feature.properties.phone !== '') {
        //     popupContent += '<p>Contacter par téléphone : ' + feature.properties.phone + '</p>';
        // }
        if (feature.properties.image !== 'null' && feature.properties.image !== null && feature.properties.image !== '') {
            // if (feature.properties.grouping == 'Département de formation') {
            // popupTitle += '<img style = \'height : 60px; position : absolute; right : 0;top:0\' src = \'' + feature.properties.image + '\'/>'
            // } else {
            popupContent += '<img style = \'height : 50px; width : 50px; display : block; margin-left : auto; margin-right : auto; margin-bottom: 5px;\' src = \'' + feature.properties.image + '\'/>'
                // }
        }
    }

    function getPopup(layer, iconURL, type) {
        map.on('click', function(e) {
            var features = map.queryRenderedFeatures(e.point, {
                layers: [layer]
            });

            if (!features.length) {
                return;
            }
            var feature = features[0];

            getPopupContent(feature);

            if (type == 'marker') {
                popup = new mapboxgl.Popup({
                        offset: [0, -40],
                        closeButton: false
                    })
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
                    .addTo(map);
            } else {
                popup = new mapboxgl.Popup({
                        offset: [0, -15],
                        closeButton: false
                    })
                    .setLngLat(feature.geometry.coordinates)
                    .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
                    .addTo(map);
            }

        });
    }

    var roomOfInterest = null;

    function createHTMLList(category, namesList, targetedElement, overlayCount) {
        roomOfInterest = null;

        var linkList = [];
        elLink = null;
        elList = null;
        if (overlayCount == 0) {
            var data = fproperties.filter(function(e) {
                return e.grouping === category;
            })
            for (i = 0; i < data.length; i++) {
                namesList.push(data[i]['name']);
            }
            for (i = 0; i < namesList.length; i++) {
                currentName = namesList[i].split("'").join('!');
                elList = document.createElement('li');
                targetedElement.appendChild(elList);
                elLink = document.createElement('a');
                elLink.innerHTML = namesList[i];
                elLink.setAttribute('id', namesList[i]);
                elLink.setAttribute('href', '#');
                elLink.classList.add('leaf');
                var theFunction = 'switchPOI(' + '\'' + currentName + '\');return false;'
                elLink.setAttribute('onclick', theFunction);
                elList.appendChild(elLink);
            }
            for (i = 0; i < namesList.length; i++) {
                linkList.push(document.getElementById(namesList[i]))
            }
        }
    }

    // Fonctions pour zoomer sur l'item sélectionné dans la liste
    function getSwitchPopup() {
        getPopupContent(roomOfInterest);
        popupList = new mapboxgl.Popup({
                offset: [0, -45],
                closeButton: false
            })
            .setLngLat(roomOfInterest.geometry.coordinates)
            .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
            .addTo(map);
    };

    switchPOI = function(value) {
        value = value.split('!').join("'");
        roomOfInterest = null;
        salleRX = null;
        salleRY = null;
        var htmlPOI = document.getElementById(value);
        if (document.getElementsByClassName('leaf active')) {
            var previousActiveLeaves = document.getElementsByClassName('leaf active');
            for (i = 0; i < previousActiveLeaves.length; i++) {
                previousActiveLeaves[i].classList.remove('active');
            }
        }
        htmlPOI.classList.add('active');
        // if (document.getElementById('test')) {
        //     document.getElementById('test').remove();
        // }
        // var htmlPOI = document.getElementById(value);
        // var htmlPOIParent = htmlPOI.parentNode;
        // var arrow = document.createElement('img');
        // arrow.setAttribute('src', 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Pfeil.png');
        // arrow.setAttribute('id', 'test');
        // arrow.style.width = '20px';
        // arrow.style.position = 'absolute';
        // htmlPOIParent.insertBefore(arrow, htmlPOI);
        if (popup) {
            popup.remove();
        }
        if (popupList) {
            popupList.remove();
        }
        for (var i = 0; i < dataPoints.length; i++) {

            if (dataPoints[i].properties.name === value) {
                roomOfInterest = dataPoints[i];
            }
        }
        salleRX = roomOfInterest.geometry.coordinates[0];
        salleRY = roomOfInterest.geometry.coordinates[1];
        // if (roomOfInterest.properties.switchView === 'iav') {
        //     map.setMaxBounds(mapExtent);
        // } else {
        //     map.setMaxBounds(mapExtent);
        // };
        if (DDD) {
            map.flyTo({
                center: [salleRX, salleRY],
                zoom: 16.5,
                pitch: 45,
                speed: 0.6
            });
        } else {
            map.flyTo({
                center: [salleRX, salleRY],
                zoom: 16.5,
                pitch: 0,
                speed: 0.6
            });
        }
        getSwitchPopup();
    }

    // Make the menus interactive
    // Zooming
    let flyingZoom = 18;
    if (device = 'phone') {
        flyingZoom = 15
    };

    let zoomiav = document.getElementById('iav')
    let zoomApesa = document.getElementById('apesa')
    let zoomClinic = document.getElementById('clinic')

    // zoomiav.style.backgroundColor = '#184c78';
    // zoomClinic.style.backgroundColor = '#D9D9D9';
    // zoomApesa.style.backgroundColor = '#D9D9D9';

    // zoomClinic.style.color = '#184c78';
    // zoomApesa.style.color = '#184c78';

    zoomiav.addEventListener('click', function() {
        // map.setMaxBounds(mapExtent);
        map.flyTo({
            zoom: refZoom,
            center: [-6.8665775, 33.9769235],
            essential: true,
            bearing: 128
        });
        // zoomiav.style.backgroundColor = '#184c78';
        // zoomClinic.style.backgroundColor = '#D9D9D9';
        // zoomApesa.style.backgroundColor = '#D9D9D9';

        // zoomiav.style.color = 'white';
        // zoomClinic.style.color = '#184c78';
        // zoomApesa.style.color = '#184c78';
    });

    zoomApesa.addEventListener('click', function() {
        // map.setMaxBounds(mapExtent);
        map.flyTo({
            zoom: refZoom,
            center: [-6.8685626, 33.9724241],
            essential: true,
            bearing: 128
        });
        // zoomApesa.style.backgroundColor = '#184c78';
        // zoomClinic.style.backgroundColor = '#D9D9D9';
        // zoomiav.style.backgroundColor = '#D9D9D9';

        // zoomApesa.style.color = 'white';
        // zoomiav.style.color = '#184c78';
        // zoomClinic.style.color = '#184c78';

    });

    zoomClinic.addEventListener('click', function() {
        // map.setMaxBounds(mapExtent);
        map.flyTo({
            zoom: refZoom,
            center: [-6.8686041, 33.9742859],
            essential: true,
            bearing: 128
        });
        // zoomClinic.style.backgroundColor = '#184c78';
        // zoomiav.style.backgroundColor = '#D9D9D9';
        // zoomApesa.style.backgroundColor = '#D9D9D9';

        // zoomClinic.style.color = 'white';
        // zoomiav.style.color = '#184c78';
        // zoomApesa.style.color = '#184c78';

    });

    // Initialize the map data
    var pointsIAV = (function() {
        var json = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': './data/points_iav.geojson',
            'dataType': 'json',
            'success': function(data) {
                json = data;
            }
        });
        return json;
    })();

    var dataPoints = [];
    dataPoints = pointsIAV.features;

    var fproperties = pointsIAV.features.map(function(el) {
        return el.properties;
    });

    var lines = (function() {
        var jsonLines = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': './data/roads.geojson',
            'dataType': 'json',
            'success': function(data) {
                jsonLines = data;
            }
        });
        return jsonLines;
    })();

    setInterval(function() {
        departmentsLinkState = departmentsLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        amphitheaterLinkState = amphitheaterLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        adminLinkState = adminLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        serviceLinkState = serviceLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        cdaLinkState = cdaLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        biblioLinkState = biblioLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        studyLinkState = studyLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        foodLinkState = foodLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        roomLinkState = roomLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        sportLinkState = sportLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        healthLinkState = healthLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        capLinkState = capLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        onssaLinkState = onssaLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        bdeLinkState = bdeLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        gameLinkState = gameLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        prayerLinkState = prayerLink.nextElementSibling.className;
    }, 500);

    setInterval(function() {
        pressLinkState = pressLink.nextElementSibling.className;
    }, 500);

    map.on('load', function() {

        // ? Adding data sources
        // Grass
        map.addSource('grass', {
            'type': 'geojson',
            'data': './data/grass.geojson'
        })
    
        // Roads
        map.addSource('roads', {
            'type': 'geojson',
            'data': './data/roads.geojson'
        })
    
        // terrain
        map.addSource('terrain', {
                    'type': 'geojson',
                    'data': './data/terrain.geojson'
        })
    
        // 3D Buildings
        map.addSource('iav3D', {
            type: 'geojson',
            data: './data/iav3D.geojson'
        })
    
        // Calling 2D Buildings
        getiav2D();
    
        // Adding the grass layer
        map.addLayer({
            id: 'grass',
            type: 'fill',
            source: 'grass',
            paint: {
                'fill-color': '#A4E463',
                'fill-opacity': 0.5,
            }
    
        })
    
        // Adding the terrain layer
        map.addLayer({
            id: 'terrain',
            type: 'fill',
            source: 'terrain',
            paint: {
                'fill-color': '#c2b286',
                'fill-opacity': 0.7,
            }
        })
    
        // Adding the roads layer
        map.addLayer({
            id: 'roads',
            type: 'line',
            source: 'roads',
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': ['get', 'color'],
                'line-width': ['get', 'width'],
                'line-blur': 0,
                'line-dasharray': [0, 2],
            }
        });
    
        // IAV 3D buildings
        if (pointOverlay) {
            getSearchedItem(pointOverlay);
        }
    
        if (overlay == 'departments') {
            addCategoryOverlay(departmentsLink, 'departments', departmentsLinkState, 'marker', pin, markerSize, departmentsCount);
            if (departmentsCount == 0) {
                createHTMLList('departments', departmentsList, insertDepartments, departmentsCount);
            }
            departmentsCount++;
        }
        departmentsLink.onclick = function(e) {
            addCategoryOverlay(departmentsLink, 'departments', departmentsLinkState, 'marker', pin, markerSize, departmentsCount);
            if (departmentsCount == 0) {
                createHTMLList('departments', departmentsList, insertDepartments, departmentsCount);
            }
            departmentsCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'departments') {
                    map.flyTo({
                        center: [-6.8656229, 33.9773255],
                        zoom: refZoom,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'amphitheater') {
            addCategoryOverlay(amphitheaterLink, 'amphitheater', amphitheaterLinkState, 'marker', pin, markerSize, amphitheaterCount);
            if (amphitheaterCount == 0) {
                createHTMLList('amphitheater', amphitheaterList, insertAmphitheater, amphitheaterCount);
            }
            amphitheaterCount++;
        }
        amphitheaterLink.onclick = function(e) {
            addCategoryOverlay(amphitheaterLink, 'amphitheater', amphitheaterLinkState, 'marker', pin, markerSize, amphitheaterCount);
            if (amphitheaterCount == 0) {
                createHTMLList('amphitheater', amphitheaterList, insertAmphitheater, amphitheaterCount);
            }
            amphitheaterCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'amphitheater') {
                    map.flyTo({
                        center: [-6.8656229, 33.9773255],
                        zoom: 15,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'admin') {
            addCategoryOverlay(adminLink, 'admin', adminLinkState, 'marker', pin, markerSize, adminCount);
            // if (adminCount == 0) {
            //     createHTMLList('admin', adminList, insertAdmin, adminCount);
            // }
            adminCount++;
        }
        adminLink.onclick = function(e) {
            addCategoryOverlay(adminLink, 'admin', adminLinkState, 'marker', pin, markerSize, adminCount);
            // if (adminCount == 0) {
            //     createHTMLList('admin', adminList, insertAdmin, adminCount);
            // }
            adminCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'admin') {
                    map.flyTo({
                        center: [-6.86360425, 33.98013032],
                        zoom: 19,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'service') {
            addCategoryOverlay(serviceLink, 'service', serviceLinkState, 'marker', pin, markerSize, serviceCount);
            if (serviceCount == 0) {
                createHTMLList('service', serviceList, insertService, serviceCount);
            }
            serviceCount++;
        }
        serviceLink.onclick = function(e) {
            addCategoryOverlay(serviceLink, 'service', serviceLinkState, 'marker', pin, markerSize, serviceCount);
            if (serviceCount == 0) {
                createHTMLList('service', serviceList, insertService, serviceCount);
            }
            serviceCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'service') {
                    map.flyTo({
                        center: [-6.8681803, 33.9756317],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'cda') {
            addCategoryOverlay(cdaLink, 'cda', cdaLinkState, 'marker', pin, markerSize, cdaCount);
            // if (cdaCount == 0) {
            //     createHTMLList('cda', cdaList, insertCda, cdaCount);
            // }
            // cdaCount++;
        }
        cdaLink.onclick = function(e) {
            addCategoryOverlay(cdaLink, 'cda', cdaLinkState, 'marker', pin, markerSize, cdaCount);
            // if (cdaCount == 0) {
            //     createHTMLList('cda', cdaList, insertCda, cdaCount);
            // }
            cdaCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'cda') {
                    map.flyTo({
                        center: [-6.8625206, 33.9800988],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'biblio') {
            addCategoryOverlay(biblioLink, 'biblio', biblioLinkState, 'marker', pin, markerSize, biblioCount);
            // if (biblioCount == 0) {
            //     createHTMLList('biblio', biblioList, insertBiblio, biblioCount);
            // }
            biblioCount++;
        }
        biblioLink.onclick = function(e) {
            addCategoryOverlay(biblioLink, 'biblio', biblioLinkState, 'marker', pin, markerSize, biblioCount);
            // if (biblioCount == 0) {
            //     createHTMLList('biblio', biblioList, insertBiblio, biblioCount);
            // }
            biblioCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'biblio') {
                    map.flyTo({
                        center: [-6.86703011, 33.97634391],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'study') {
            addCategoryOverlay(studyLink, 'study', studyLinkState, 'marker', pin, markerSize, studyCount);
            // if (studyCount == 0) {
            //     createHTMLList('study', studyList, insertStudy, studyCount);
            // }
            studyCount++;
        }
        studyLink.onclick = function(e) {
            addCategoryOverlay(studyLink, 'study', studyLinkState, 'marker', pin, markerSize, studyCount);
            // if (studyCount == 0) {
            //     createHTMLList('study', studyList, insertStudy, studyCount);
            // }
            studyCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'study') {
                    map.flyTo({
                        center: [-6.86222444, 33.98028317],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'food') {
            addCategoryOverlay(foodLink, 'food', foodLinkState, 'marker', pin, markerSize, foodCount);
            if (foodCount == 0) {
                createHTMLList('food', foodList, insertFood, foodCount);
            }
            foodCount++;
        }
        foodLink.onclick = function(e) {
            addCategoryOverlay(foodLink, 'food', foodLinkState, 'marker', pin, markerSize, foodCount);
            if (foodCount == 0) {
                createHTMLList('food', foodList, insertFood, foodCount);
            }
            foodCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'food') {
                    map.flyTo({
                        center: [-6.8623910, 33.9802626],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'room') {
            addCategoryOverlay(roomLink, 'room', roomLinkState, 'marker', pin, markerSize, roomCount);
            if (roomCount == 0) {
                createHTMLList('room', roomList, insertRoom, roomCount);
            }
            roomCount++;
        }
        roomLink.onclick = function(e) {
            addCategoryOverlay(roomLink, 'room', roomLinkState, 'marker', pin, markerSize, roomCount);
            if (roomCount == 0) {
                createHTMLList('room', roomList, insertRoom, roomCount);
            }
            roomCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'room') {
                    map.flyTo({
                        center: [-6.8620442, 33.9802653],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'sport') {
            addCategoryOverlay(sportLink, 'sport', sportLinkState, 'marker', pin, markerSize, sportCount);
            if (sportCount == 0) {
                createHTMLList('sport', sportList, insertSport, sportCount);
            }
            sportCount++;
        }
        sportLink.onclick = function(e) {
            addCategoryOverlay(sportLink, 'sport', sportLinkState, 'marker', pin, markerSize, sportCount);
            if (sportCount == 0) {
                createHTMLList('sport', sportList, insertSport, sportCount);
            }
            sportCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'sport') {
                    map.flyTo({
                        center: [-6.8668067, 33.9722996],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'health') {
            addCategoryOverlay(healthLink, 'health', healthLinkState, 'marker', pin, markerSize, healthCount);
            if (healthCount == 0) {
                createHTMLList('health', healthList, insertHealth, healthCount);
            }
            healthCount++;
        }
        healthLink.onclick = function(e) {
            addCategoryOverlay(healthLink, 'health', healthLinkState, 'marker', pin, markerSize, healthCount);
            if (healthCount == 0) {
                createHTMLList('health', healthList, insertHealth, healthCount);
            }
            healthCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'health') {
                    map.flyTo({
                        center: [-6.86189559, 33.98034012],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'cap') {
            addCategoryOverlay(capLink, 'cap', capLinkState, 'marker', pin, markerSize, capCount);
            if (capCount == 0) {
                createHTMLList('cap', capList, insertCap, capCount);
            }
            capCount++;
        }
        capLink.onclick = function(e) {
            addCategoryOverlay(capLink, 'cap', capLinkState, 'marker', pin, markerSize, capCount);
            if (capCount == 0) {
                createHTMLList('cap', capList, insertCap, capCount);
            }
            capCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'cap') {
                    map.flyTo({
                        center: [-6.8659338, 33.9768833],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'onssa') {
            addCategoryOverlay(onssaLink, 'onssa', onssaLinkState, 'marker', pin, markerSize, onssaCount);
            if (onssaCount == 0) {
                createHTMLList('onssa', onssaList, insertOnssa, onssaCount);
            }
            onssaCount++;
        }
        onssaLink.onclick = function(e) {
            addCategoryOverlay(onssaLink, 'onssa', onssaLinkState, 'marker', pin, markerSize, onssaCount);
            if (onssaCount == 0) {
                createHTMLList('onssa', onssaList, insertOnssa, onssaCount);
            }
            onssaCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'onssa') {
                    map.flyTo({
                        center: [-6.8694824, 33.9748096],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'bde') {
            addCategoryOverlay(bdeLink, 'bde', bdeLinkState, 'marker', pin, markerSize, bdeCount);
            if (bdeCount == 0) {
                createHTMLList('bde', bdeList, insertBde, bdeCount);
            }
            bdeCount++;
        }
        bdeLink.onclick = function(e) {
            addCategoryOverlay(bdeLink, 'bde', bdeLinkState, 'marker', pin, markerSize, bdeCount);
            if (bdeCount == 0) {
                createHTMLList('bde', bdeList, insertBde, bdeCount);
            }
            bdeCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'bde') {
                    map.flyTo({
                        center: [-6.86195781, 33.98035932],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'game') {
            addCategoryOverlay(gameLink, 'game', gameLinkState, 'marker', pin, markerSize, gameCount);
            if (gameCount == 0) {
                createHTMLList('game', gameList, insertGame, gameCount);
            }
            gameCount++;
        }
        gameLink.onclick = function(e) {
            addCategoryOverlay(gameLink, 'game', gameLinkState, 'marker', pin, markerSize, gameCount);
            if (gameCount == 0) {
                createHTMLList('game', gameList, insertGame, gameCount);
            }
            gameCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'game') {
                    map.flyTo({
                        center: [-6.86190483, 33.98040555],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'prayer') {
            addCategoryOverlay(prayerLink, 'prayer', prayerLinkState, 'marker', pin, markerSize, prayerCount);
            if (prayerCount == 0) {
                createHTMLList('prayer', prayerList, insertPrayer, prayerCount);
            }
            prayerCount++;
        }
        prayerLink.onclick = function(e) {
            addCategoryOverlay(prayerLink, 'prayer', prayerLinkState, 'marker', pin, markerSize, prayerCount);
            if (prayerCount == 0) {
                createHTMLList('prayer', prayerList, insertPrayer, prayerCount);
            }
            prayerCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'prayer') {
                    map.flyTo({
                        center: [-6.86124916, 33.98036075],
                        zoom: 17,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
        if (overlay == 'press') {
            addCategoryOverlay(pressLink, 'press', pressLinkState, 'marker', pin, markerSize, pressCount);
            if (pressCount == 0) {
                createHTMLList('press', pressList, insertPress, pressCount);
            }
            pressCount++;
        }
        pressLink.onclick = function(e) {
            addCategoryOverlay(pressLink, 'press', pressLinkState, 'marker', pin, markerSize, pressCount);
            if (pressCount == 0) {
                createHTMLList('press', pressList, insertPress, pressCount);
            }
            pressCount++;
            for (let i = 0; i < Layers.length; i++) {
                if (Layers[i] = 'press') {
                    map.flyTo({
                        center: [-6.86214164, 33.98034866],
                        zoom: 16,
                        pitch: 0,
                        speed: 0.6
                    });
                }
            }
        }
    
    
    
    });

    // Search bar

    // initialisation des popup
    var searchPopup = null
    var campusData = fproperties.filter(function(e) {
            return e.name !== null;
        })
        // Récupération des propriétés du json
    var searchValue = null;
    var searchItem = [];
    var searchX = null;
    var searchY = null;
    var searchLayerCount = 0;
    var searchLayerId = 'SearchResult';
    var searchPopup = null;
    var options = {
        data: campusData,
        // Name of field that contains the name of the item
        getValue: 'name',
        template: {
            type: 'description',
            fields: {
                // Add another value as a description
                description: 'department'
            }
        },
        list: {
            match: {
                enabled: true
            }
        },
        theme: 'plate-dark',
        adjustWidth: false,
    };
    $('#searchBuild').easyAutocomplete(options);

    function getSearchPopup() {
        var popupTitle = searchItem.properties.name;
        var popupContent = '';

        // if (searchItem.properties.building != null) {
        //     popupContent += '<p>Building: ' + searchItem.properties.building;
        // };
        if (searchItem.properties.brochure != null) {
            popupContent += '<p>• <b>Brochure</b>' + searchItem.properties.brochure + '</p>';
        };
        if (searchItem.properties.info != null) {
            popupContent += '<p>' + searchItem.properties.info + '<p>';
        };
        // if (searchItem.properties.capacity != null) {
        //     popupContent += '<p>' + searchItem.properties.capacity + '<p>';
        // };
        // if (searchItem.properties.link != null) {
        //     popupContent += '<p><a href = ' + searchItem.properties.link + ' target=\'_blank\'>Site internet<a></p>';
        // };
        if (searchItem.properties.mail != null) {
            popupContent += '<p>• <b>E-mail</b> <a href="mailto:' + searchItem.properties.mail + '">' + searchItem.properties.mail + '</a>' + '</p>';
        };
        // if (searchItem.properties.phone != null) {
        //     popupContent += '<p>Phone: ' + searchItem.properties.phone + '</p>';
        // };
        if (searchItem.properties.image != null) {
            // if (searchItem.properties.grouping == 'Département de formation') {
            //     popupTitle += '<img style = \'height : 60px ; position : absolute ; right : 0\' src = \'' + searchItem.properties.image + '\'/>';
            // } else {
            popupContent += '<img style = \'height : 50px; width : 50px; display : block; margin-left : auto; margin-right : auto\' src = \'' + searchItem.properties.image + '\'/>';
            // }
        };
        searchPopup = new mapboxgl.Popup({
                offset: [0, -45],
                closeButton: false
            })
            .setLngLat(searchItem.geometry.coordinates)
            .setHTML('<h1>' + popupTitle + '</h1>' + popupContent)
            .addTo(map);
    };

    // Cross mark used to remove the popup of the search
    var cross = null;
    var searchBarCrossPresence = null;

    // Search for a location
    function getSearchedItem(item) {
        if (searchValue !== null) {
            searchValue = null;
            searchItem = [];
            searchX = null;
            searchY = null;
            // searchLayerId has a value of 'SearchResult'
            Layers = Layers.filter(item => item != searchLayerId);
            searchLayerCount++;
            searchPopup.remove();
            map.removeLayer(searchLayerId)
            searchLayerId = 'searchResult' + searchLayerCount;
        }

        if (item) {
            searchValue = item;
        } else {
            searchValue = document.getElementById('searchBuild').value;
        }

        for (let i = 0; i < dataPoints.length; i++) {
            if (dataPoints[i].properties.name === searchValue) {
                searchItem = dataPoints[i];

                map.loadImage('./icons/location-pin.png', function(error, image) {
                    if (error) throw error;
                    map.addImage(searchLayerId + 'image', image);
                    map.addLayer({
                        'id': searchLayerId,
                        'type': 'symbol',
                        'source': {
                            'type': 'geojson',
                            'data': searchItem
                        },
                        'layout': {
                            'icon-image': searchLayerId + 'image',
                            'icon-size': {
                                'base': markerSize[0],
                                'stops': [
                                    [markerSize[1], markerSize[2]],
                                    [markerSize[3], markerSize[4]]
                                ]
                            },
                            'icon-allow-overlap': true,
                            'icon-offset': {
                                stops: [
                                    [13, [0, -30]],
                                    [22, [0, -50]]
                                ]
                            }
                        },
                    });
                });

                Layers.push(searchLayerId);
                map.on('mousemove', function(e) {
                    let features = map.queryRenderedFeatures(e.point, {
                        layers: Layers
                    });
                    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
                });

                searchX = searchItem.geometry.coordinates[0];
                searchY = searchItem.geometry.coordinates[1];

                // if (dataPoints[i].properties.switchView === 'iav') {
                //     map.setMaxBounds(mapExtent);
                //     zoomClinic.style.backgroundColor = '#D9D9D9';
                //     zoomiav.style.backgroundColor = '#184c78';
                //     zoomApesa.style.backgroundColor = '#D9D9D9';
                // }
                // if (dataPoints[i].properties.switchView === 'clinic') {
                //     map.setMaxBounds(mapExtent);
                //     zoomClinic.style.backgroundColor = '#184c78';
                //     zoomiav.style.backgroundColor = '#D9D9D9';
                //     zoomApesa.style.backgroundColor = '#D9D9D9';
                // }
                // if (dataPoints[i].properties.switchView === 'apesa') {
                //     map.setMaxBounds(mapExtent);
                //     zoomApesa.style.color = 'white';
                //     zoomiav.style.color = '#184c78';
                //     zoomClinic.style.backgroundColor = '#D9D9D9';
                //     zoomiav.style.backgroundColor = '#D9D9D9';
                //     zoomApesa.style.backgroundColor = '#184c78';
                // }
                if (DDD) {
                    map.flyTo({
                        center: [searchX, searchY],
                        zoom: 16.5,
                        pitch: 45,
                        speed: 0.6
                    });
                } else {
                    map.flyTo({
                        center: [searchX, searchY],
                        zoom: 16.5,
                        pitch: 0,
                        speed: 0.6
                    });
                }
                getSearchPopup();
                map.on('click', function(e) {
                    if (searchPopup.isOpen() == true) {
                        searchPopup.remove();
                    }
                })



            }
        }
    }

    // 2D & 3D buttons behavior
    DDButton = document.getElementById('DDButton');
    DDDButton = document.getElementById('DDDButton');
    // DDButton.style.backgroundColor = '#184c78';
    // DDDButton.style.backgroundColor = '#dddddd';
    // DDDButton.style.color = '#184c78';
    // DDButton.style.fontSize = '12px';
    // DDDButton.style.fontSize = '12px';

    DDD = false

    // 3D button behavior
    DDDButton.addEventListener('click', function() {
        var X = map.getCenter()['lng'];
        var Y = map.getCenter()['lat'];
        var currentZoom = map.getZoom()
        if (DDD === false) {
            Y = Y - 0.00021;
            getiav3D();
            let switchDimZoom = currentZoom + 0.5;
            map.flyTo({
                center: [X, Y],
                // The horizon angle when clicking the DDDButton
                pitch: 60,
                bearing: 128,
                speed: 0.08,
                zoom: switchDimZoom
            });

            // DDDButton.style.color = 'white';
            // DDDButton.style.backgroundColor = '#184c78';

            DDD = true;
            map.dragRotate.enable();

            // DDButton.style.backgroundColor = '#dddddd';
            // DDButton.style.color = '#184c78';
        }
    })

    // 2D button behavior
    DDButton.addEventListener('click', function() {
        let X = map.getCenter()['lng'];
        let Y = map.getCenter()['lat'];
        let currentZoom = map.getZoom();
        // let button = document.getElementById('DDDButton');
        if (DDD) {
            Y = Y + 0.00021;
            getiav2D();
            let switchDimZoom = currentZoom - 0.5;
            map.flyTo({
                center: [X, Y],
                pitch: 0,
                bearing: 128,
                speed: 0.08,
                zoom: switchDimZoom
            });
            map.dragRotate.disable();

            // DDButton.style.color = 'white';
            // DDButton.style.backgroundColor = '#184c78';

            DDD = false;

            // DDDButton.style.backgroundColor = '#dddddd';
            // DDDButton.style.color = '#184c78';
        }
    })

    // Adding zoom and rotation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');

    // Attribution to mapbox and authors
    if (screen.width > 700) {
        map.addControl(new mapboxgl.AttributionControl({
            customAttribution: 'Memento Mori'
        }));
    }

    var searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', function(e) {
        if (searchBarCrossPresence == null) {
            searchBarCrossPresence = 'yes';
            $(searchButton).addClass('off');
            getSearchedItem();
        } else {
            Layers = Layers.filter(item => item != searchLayerId);
            map.removeLayer(searchLayerId);
            searchPopup.remove();
            searchBarCrossPresence = null;
            $("#searchBuild").val("");
            $(searchButton).removeClass('off');
        }
    })

    var searchBuild = document.getElementById('searchBuild');
    searchBuild.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {
            getSearchedItem();
        }
    })

    $("#btnRemovefilters").on("click", function() {
        $('ul#metismenu li:not(.sidebar-search,.sidebar-remove-filters), ul#metismenu li:not(.sidebar-search,.sidebar-remove-filters) a').each(function(i) {
            if ($(this).attr('id')) {
                var removelayer = $(this).attr('id');
                if (map.getLayer(removelayer)) {

                    var visibility = map.getLayoutProperty(removelayer, 'visibility');
                    if (visibility != "none") {
                        if (Layers.includes(removelayer)) {
                            var element = $("[id='" + removelayer + "']");
                            if (!element.next('ul').hasClass("mm-show"))
                                element.next('ul').addClass("mm-show");
                            if (listLayers.includes(element.get(0))) {
                                var index = $.inArray(element.get(0), listLayers);
                                if (index > -1) {
                                    listLayers.splice(index, 1);
                                }
                            }
                            element.trigger("click");
                            if (element.next('ul').hasClass("mm-show"))
                                element.next('ul').removeClass("mm-show");
                            if (element.parent().hasClass("active"))
                                element.parent().removeClass("active");
                        }
                    }
                }
            }
        })

        $('ul.metismenu li.mm-active ul.mm-collapse a.active').each(function(i) {
            if ($(this).hasClass("active"))
                $(this).removeClass("active");
        })

        $('ul.metis-menu li.mm-active:not(.sidebar-search,.sidebar-remove-filters), ul.metis-menu li.mm-active:not(.sidebar-search,.sidebar-remove-filters) ul.mm-show ').each(function(i) {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
            if ($(this).hasClass("mm-show"))
                $(this).removeClass("mm-show");
        })

    })
})(jQuery);
