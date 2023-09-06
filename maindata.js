mapboxgl.accessToken =
  "pk.eyJ1Ijoic3R1cnRpdW0iLCJhIjoiY2tnaHd6cHZjMDAxMzJybG9sM3huOTVpZCJ9.FPujWyjCdiqERPlvNhlU5w";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-v9",
  center: [31.02419444, -29.86011111], // Set center coordinates
  zoom: 7,
});

/**
 * Test the pan for coordinates
 * Latitude: -29.622356
 * Longitude: 30.396547
 */

// Get references to the input fields and the button
var latitudeInput = document.getElementById("latitude");
var longitudeInput = document.getElementById("longitude");
var panButton = document.getElementById("pan-to-coordinate");

// Add a click event listener to the button
panButton.addEventListener("click", function () {
  // Get the latitude and longitude values from the input fields
  var latitude = parseFloat(latitudeInput.value);
  var longitude = parseFloat(longitudeInput.value);

  // Check if the input values are valid numbers
  if (!isNaN(latitude) && !isNaN(longitude)) {
    // Pan the map to the specified coordinates
    map.flyTo({ center: [longitude, latitude], zoom: 16 }); // Use flyTo for smooth animation
  } else {
    // Display an error message if the input values are not valid
    alert("Invalid coordinates. Please enter valid numbers.");
  }
});

map.on("load", function () {
  // This code will run after the map has finished loading.

  // Load the GeoJSON data
  fetch("wspopu.geojson")
    .then((response) => response.json())
    .then((loadedSecondGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("second-geojson", {
        type: "geojson",
        data: loadedSecondGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: "second-geojson-layer",
        type: "fill",
        source: "second-geojson", // Use the source name defined above
        paint: {
          "fill-color": "green", // Set your desired fill color
          "fill-opacity": 0.7, // Adjust opacity as needed
        },
      });

      // Add a click event listener to show a popup
      map.on("click", "second-geojson-layer", function (e) {
        const feature = e.features[0];

        // Define the URL you want to link to
        const linkURL = "https://example.com"; // Replace with your actual URL

        var infoText = "Hello World";

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h3>${feature.properties.Area}</h3>
			      <p>${infoText}</p>
            <a href="${linkURL}" target="_blank">Visit Website</a>
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "second-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "second-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });

      // You can customize popups or add more layers as needed.
    });

  // Load the GeoJSON data
  fetch("rivers.geojson")
    .then((response) => response.json())
    .then((loadedRiversGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("riversgeojson", {
        type: "geojson",
        data: loadedRiversGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: "river-geojson-layer",
        type: "line",
        source: "riversgeojson", // Use the source name defined above
        paint: {
          "line-color": "blue", // Set your desired line color
          "line-opacity": 0.7, // Adjust opacity as needed
          "line-width": 2, // Set line width
        },
      });

      // Add a click event listener to show a popup
      map.on("click", "river-geojson-layer", function (e) {
        const feature = e.features[0];

        var infoText = "Hello World";

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h3>${feature.properties.REACHCODE}</h3>
			      <p>${infoText}</p>
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "river-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "river-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });
    });
});
