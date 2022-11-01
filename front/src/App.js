import React, { useRef, useEffect, useState } from 'react';
// ! Not disabling the eslint rule
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
    'pk.eyJ1Ijoic2FsYWhlbGZhcmlzc2kiLCJhIjoiY2ttb3p1Yzk3Mjl2bzJ2bno3OGlqcjJ2bCJ9.pErPZNgS_t5jzHlsp_XyRQ';

function App() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-6.8665775);
    const [lat, setLat] = useState(33.9769235);
    const [zoom, setZoom] = useState(15.5);
    const mapBounds = [
        [-6.889706, 33.954409],
        [-6.835639, 33.998427],
    ];

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/salahelfarissi/ckzzjh6kl000k14mf1l6b88wk',
            center: [lng, lat],
            zoom: zoom,
            pitch: 0,
            bearing: 128,
            antialias: true,
            attributionControl: false,
            maxBounds: mapBounds,
        });

        // Add full screen control
        map.current.addControl(new mapboxgl.FullscreenControl());

        // Support for RTL languages
        mapboxgl.setRTLTextPlugin(
            'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
            null,
            true
        );

        map.current.dragRotate.disable();
    });

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default App;
