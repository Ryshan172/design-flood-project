// Imports
import { loadRegionLayer } from './datafunctions/loadRegion.js';
import { loadRiversLayer } from './datafunctions/loadRivers.js';
import { loadedRainStations } from './datafunctions/loadRainfall.js';
import { loadSoilsLayer } from './datafunctions/loadSoils.js';
import { loadClustersLayer } from './datafunctions/loadClusters.js';

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

// Loaded or not?
var loadedRegion = false;
var loadedSoils = false;
var loadedStations = false;
var loadedClusters = false;
var loadedRivers = false;

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

    document.getElementById("toggle-stations").addEventListener("change", function (e) {

      const checkBox = e.target;
      const layerId = "stations-geojson-layer"; // Change this layer

      if (checkBox.checked && loadedStations == false) {
        loadedRainStations(map, selectedData, rainfallCSV);
        loadedStations = true;

      }
      else if (checkBox.checked && loadedStations == true) {
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

        if (checkBox.checked && loadedRivers == false) {
          // Load the layer
          loadRiversLayer(map, selectedData, riversCSVData);
          loadedRivers = true;
          

        }
        else if (checkBox.checked && loadedRivers == true) {
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

        if (checkBox.checked && loadedRegion == false) {
          // Show the layer
          //map.setLayoutProperty(layerId, "visibility", "visible");
          loadRegionLayer(map, selectedData, regionCSVData);
          loadedRegion = true;

        }
        else if (checkBox.checked && loadedRegion == true) {
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

      if (checkBox.checked && loadedSoils == false) {
        loadSoilsLayer(map, selectedData, soilsCSVData);
        loadedSoils = true;

      }
      else if (checkBox.checked && loadedSoils == true) {
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

      if (checkBox.checked && loadedClusters == false) {
        loadClustersLayer(map, selectedData, clusterCSVData);
        loadedClusters = true

      }
      else if (checkBox.checked && loadedClusters == true) {
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
