$(document).ready(function() {
    $('#metismenu').metisMenu();
});

// Adding mapbox basemap
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsYWhlbGZhcmlzc2kiLCJhIjoiY2ttb3p1Yzk3Mjl2bzJ2bno3OGlqcjJ2bCJ9.pErPZNgS_t5jzHlsp_XyRQ';

// Reference Zoom
let refZoom = 15.5;

// Creating a map object
const map = new mapboxgl.Map({
    style: 'mapbox://styles/salahelfarissi/ckzzjh6kl000k14mf1l6b88wk',
    center: [-6.8641885, 33.9780371],
    zoom: refZoom,
    pitch: 0,
    bearing: 38,
    container: 'map',
    antialias: true,
    attributionControl: false
});