mapboxgl.accessToken = "pk.eyJ1Ijoic3R1cnRpdW0iLCJhIjoiY2tnaHd6cHZjMDAxMzJybG9sM3huOTVpZCJ9.FPujWyjCdiqERPlvNhlU5w";

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-29.86011111, 31.02419444], // Set center coordinates
  zoom: 12,
});

map.on('load', () => {
  // Load GeoJSON data from file
  fetch('wspopu.geojson')
    .then(response => response.json())
    .then(geojsonData => {
      // Add the GeoJSON source
      map.addSource('geojson-source', {
        type: 'geojson',
        data: geojsonData,
      });

      // Add a layer to display the GeoJSON features
      map.addLayer({
        id: 'geojson-layer',
        type: 'fill',
        source: 'geojson-source',
        paint: {
          'fill-color': '#FF0000',
          'fill-opacity': 0.5,
        },
      });
    });
});
