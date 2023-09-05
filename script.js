mapboxgl.accessToken = "pk.eyJ1Ijoic3R1cnRpdW0iLCJhIjoiY2tnaHd6cHZjMDAxMzJybG9sM3huOTVpZCJ9.FPujWyjCdiqERPlvNhlU5w";

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-29.86011111, 31.02419444], // Set center coordinates
  zoom: 12,
});


map.on('load', function () {
  // This code will run after the map has finished loading.

  // Load the GeoJSON data
  fetch('wspopu.geojson')
    .then(response => response.json())
    .then(loadedSecondGeojson => {
      // Add the GeoJSON data as a source
      map.addSource('second-geojson', {
        type: 'geojson',
        data: loadedSecondGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: 'second-geojson-layer',
        type: 'fill',
        source: 'second-geojson', // Use the source name defined above
        paint: {
          'fill-color': 'green', // Set your desired fill color
          'fill-opacity': 0.7, // Adjust opacity as needed
        },
      });

      // You can customize popups or add more layers as needed.
    });
});
