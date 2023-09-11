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


// Empty Array
var selectedData = [];
var regionCSVData = "Area,mapMean,HRU_Max,HRU_Min,DR5yr,DR10yr\n";
var riversCSVData = "NAME,REACHCODE,FLOW\n";
var soilsCSVData = "SCS_SOIL_C,DEPAHO,DEPBHO,ABRESP,ERODE\n";
var rainfallCSV = "Gauge\n"
var clusterCSVData = "Cluster\n"

// Show the loading element
function showLoading() {
  document.getElementById("loading").style.display = "block";
}

// Hide the loading element
function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

// Call showLoading() before you start loading your layers
//showLoading();

// Call hideLoading() when your layers have finished loading
//hideLoading();


map.on("load", function () {
  // This code will run after the map has finished loading.

  // Load the GeoJSON data
  fetch("datalayers/wspopu.geojson")
    .then((response) => response.json())
    .then((loadedRegionGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("region-geojson", {
        type: "geojson",
        data: loadedRegionGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: "region-geojson-layer",
        type: "fill",
        source: "region-geojson", // Use the source name defined above
        paint: {
          "fill-color": "green", // Set your desired fill color
          "fill-opacity": 0.7, // Adjust opacity as needed
        },
      });

      map.moveLayer("region-geojson-layer", "stations-geojson-layer");

      // Add a click event listener to show a popup
      map.on("click", "region-geojson-layer", function (e) {
        const feature = e.features[0];

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h2> Region Data </h2>
            <h3> Area: ${feature.properties.Area}</h3>
            <h3> mapMean: ${feature.properties.mapMean}</h3>
            <h3> HRU_Max: ${feature.properties.HRU_Max}</h3>
            <h3> HRU_Min: ${feature.properties.HRU_Min}</h3>
            <h3> DR5yr: ${feature.properties.DR5yr}</h3>
            <h3> DR10yr: ${feature.properties.DR10yr}</h3>
            <button id="add-to-region-csv">Add Region data to CSV</button>
            
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);


        
        // Create an object to store the selected data
        const selectedFeature = {
          Area: feature.properties.Area,
          mapMean: feature.properties.mapMean,
          HRU_Max: feature.properties.HRU_Max,
          HRU_Min: feature.properties.HRU_Min,
          DR5yr: feature.properties.DR5yr,
          DR10yr: feature.properties.DR10yr
        };
        
        // Add the selected data to the array
        selectedData.push(selectedFeature);

        document.getElementById("add-to-region-csv").addEventListener("click", function () {

          regionCSVData += `${feature.properties.Area},${feature.properties.mapMean},${feature.properties.HRU_Max},${feature.properties.HRU_Min},${feature.properties.DR5yr},${feature.properties.DR10yr}\n`;

        });
        
      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "region-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "region-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });

      
    });



  // Load the GeoJSON data
  fetch("datalayers/rivers.geojson")
    .then((response) => response.json())
    .then((loadedRiversGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("riversgeojson", {
        type: "geojson",
        data: loadedRiversGeojson,
      });

      // Add a line layer for the GeoJSON data and set its style
      map.addLayer({
        id: "rivers-geojson-layer",
        type: "line",
        source: "riversgeojson", // Use the source name defined above
        paint: {
          "line-color": "blue", // Set your desired line color
          "line-opacity": 0.7, // Adjust opacity as needed
          "line-width": 2, // Set line width
        },
      });

      map.moveLayer("rivers-geojson-layer", "stations-geojson-layer");

      // Add a click event listener to show a popup
      map.on("click", "rivers-geojson-layer", function (e) {
        const feature = e.features[0];

        var infoText = "Hello World";

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h2> River Data </h3>
            <h3> NAME: ${feature.properties.NAME}</h3>
            <h3> REACHCODE: ${feature.properties.REACHCODE}</h3>
            <h3> FLOW: ${feature.properties.FLOW}</h3>
            <button id="add-to-rivers-csv">Add Rivers data to CSV</button>
            
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);


        // Create an object to store the selected data
        const selectedFeature = {
          NAME: feature.properties.NAME,
          REACHCODE: feature.properties.REACHCODE,
          FLOW: feature.properties.FLOW,
          
        };
        
        // Add the selected data to the array
        selectedData.push(selectedFeature);

        // Add to soils csv
        document.getElementById("add-to-rivers-csv").addEventListener("click", function () {

          riversCSVData += `${feature.properties.NAME},${feature.properties.REACHCODE},${feature.properties.FLOW}\n`;

        });


      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "rivers-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "rivers-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });
    });

  
  
  // Load the Stations GeoJSON data
  fetch("datalayers/ustations.geojson")
    .then((response) => response.json())
    .then((loadedStationsGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("stationsgeojson", {
        type: "geojson",
        data: loadedStationsGeojson,
      });

      // Add a line layer for the GeoJSON data and set its style
      map.addLayer({
        id: "stations-geojson-layer",
        type: "circle",
        source: "stationsgeojson", // Use the source name defined above
        paint: {
          "circle-color": "white", // Set your desired circle color
          "circle-opacity": 0.7, // Adjust opacity as needed
          "circle-radius": 5, // Set circle radius
        },
      });

      // Add a click event listener to show a popup
      map.on("click", "stations-geojson-layer", function (e) {
        const feature = e.features[0];

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h2> Rainfall Stations </h3>
            <h3> Gauge: ${feature.properties.gauge}</h3>
            <button id="add-to-rainfall-csv">Add Gauge data to CSV</button>
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);
        

        // Create an object to store the selected data
        const selectedFeature = {
          Gauge: feature.properties.gauge,
        };
        
        // Add the selected data to the array
        selectedData.push(selectedFeature);

        // Add to soils csv
        document.getElementById("add-to-rainfall-csv").addEventListener("click", function () {

          rainfallCSV += `${feature.properties.gauge}\n`;

        });
        
      });


      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "stations-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "stations-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });


    });


    // Load the Soils data
    fetch("datalayers/scssoils.geojson")
    .then((response) => response.json())
    .then((loadedSoilsGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("soils-geojson", {
        type: "geojson",
        data: loadedSoilsGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: "soils-geojson-layer",
        type: "fill",
        source: "soils-geojson", // Use the source name defined above
        paint: {
          "fill-color": "orange", // Set your desired fill color
          "fill-opacity": 0.7, // Adjust opacity as needed
        },
      });

      // Add a click event listener to show a popup
      map.on("click", "soils-geojson-layer", function (e) {
        const feature = e.features[0];

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h2> SCS Soils Data </h3>
            <h3> SCS_SOIL_C: ${feature.properties.SCS_SOIL_C}</h3>
            <h3> DEPAHO: ${feature.properties.DEPAHO}</h3>
            <h3> DEPBHO: ${feature.properties.DEPBHO}</h3>
            <h3> ABRESP: ${feature.properties.ABRESP}</h3>
            <h3> ERODE: ${feature.properties.ERODE}</h3>
            <button id="add-to-soils-csv">Add Soils data to CSV</button>
            
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);

        
        // Create an object to store the selected data
        const selectedFeature = {
          SCS_SOIL_C: feature.properties.SCS_SOIL_C,
          DEPAHO: feature.properties.DEPAHO,
          HRU_Max: feature.properties.DEPBHO,
          HRU_Min: feature.properties.ABRESP,
          ERODE: feature.properties.ERODE
        };
        
        // Add the selected data to the array
        selectedData.push(selectedFeature);

        // Add to soils csv
        document.getElementById("add-to-soils-csv").addEventListener("click", function () {

          soilsCSVData += `${feature.properties.SCS_SOIL_C},${feature.properties.DEPAHO},${feature.properties.DEPBHO},${feature.properties.ABRESP},${feature.properties.ERODE}\n`;

        });
        
      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "soils-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "soils-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });

      
    });

    
    // Load the Soils data
    fetch("datalayers/clusters.geojson")
    .then((response) => response.json())
    .then((loadedClustersGeojson) => {
      // Add the GeoJSON data as a source
      map.addSource("clusters-geojson", {
        type: "geojson",
        data: loadedClustersGeojson,
      });

      // Add a fill layer for the GeoJSON data and set its style
      map.addLayer({
        id: "clusters-geojson-layer",
        type: "fill",
        source: "clusters-geojson", // Use the source name defined above
        paint: {
          "fill-color": "purple", // Set your desired fill color
          "fill-opacity": 0.5, // Adjust opacity as needed
        },
      });

      // Add a click event listener to show a popup
      map.on("click", "clusters-geojson-layer", function (e) {
        const feature = e.features[0];

        // Create the HTML content for the popup with a hyperlink
        const popupContent = `
            <h2> Clusters Data </h3>
            <h3> Cluster: ${feature.properties.Cluster}</h3>
            <button id="add-to-clusters-csv">Add Clusters data to CSV</button>
            
        `;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(popupContent)
          .addTo(map);

        
        // Create an object to store the selected data
        const selectedFeature = {
          Cluster: feature.properties.Cluster,
        };
        
        // Add the selected data to the array
        selectedData.push(selectedFeature);

        // Add to soils csv
        document.getElementById("add-to-clusters-csv").addEventListener("click", function () {

          clusterCSVData += `${feature.properties.Cluster}\n`;

        });
        
      });

      // Change the cursor to a pointer when hovering over the GeoJSON data
      map.on("mouseenter", "clusters-geojson-layer", function () {
        map.getCanvas().style.cursor = "pointer";
      });

      // Change it back to the default cursor when it leaves the GeoJSON data
      map.on("mouseleave", "clusters-geojson-layer", function () {
        map.getCanvas().style.cursor = "";
      });

      
    });





    document.getElementById("toggle-stations").addEventListener("change", function (e) {

      const checkBox = e.target;
      const layerId = "stations-geojson-layer"; // Change this layer

      if (checkBox.checked) {
        // Show the layer
        map.setLayoutProperty(layerId, "visibility", "visible");

      }
      else {
        // Hide the layer
        map.setLayoutProperty(layerId, "visibility", "none");

      }

    });

	document.getElementById("toggle-rivers").addEventListener("change", function (e) {

        const checkBox = e.target;
        const layerId = "rivers-geojson-layer"; // Change this layer

        if (checkBox.checked) {
          // Show the layer
          map.setLayoutProperty(layerId, "visibility", "visible");

        }
        else {
          // Hide the layer
          map.setLayoutProperty(layerId, "visibility", "none");

        }

    });

	document.getElementById("toggle-region").addEventListener("change", function (e) {

        const checkBox = e.target;
        const layerId = "region-geojson-layer"; // Change this layer

        if (checkBox.checked) {
          // Show the layer
          map.setLayoutProperty(layerId, "visibility", "visible");

        }
        else {
          // Hide the layer
          map.setLayoutProperty(layerId, "visibility", "none");

        }

    });

    document.getElementById("toggle-soils").addEventListener("change", function (e) {

      const checkBox = e.target;
      const layerId = "soils-geojson-layer"; // Change this layer

      if (checkBox.checked) {
        // Show the layer
        map.setLayoutProperty(layerId, "visibility", "visible");

      }
      else {
        // Hide the layer
        map.setLayoutProperty(layerId, "visibility", "none");

      }

    });

    document.getElementById("toggle-clusters").addEventListener("change", function (e) {

      const checkBox = e.target;
      const layerId = "clusters-geojson-layer"; // Change this layer

      if (checkBox.checked) {
        // Show the layer
        map.setLayoutProperty(layerId, "visibility", "visible");

      }
      else {
        // Hide the layer
        map.setLayoutProperty(layerId, "visibility", "none");

      }

    });


  function downloadCSV() {
    // Combine the separate CSV data into one CSV
    var combinedCSVData = regionCSVData + riversCSVData + soilsCSVData + rainfallCSV + clusterCSVData;
  
    const blob = new Blob([combinedCSVData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
  
    // Create a temporary link element and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected_data.csv";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  
    // Update the display in the corresponding div element
    // updateSelectedDataDisplay("selected-all-data", combinedCSVData);
  }
  


  document.getElementById("download-csv").addEventListener("click", function () {
    downloadCSV();
  });


    
});
