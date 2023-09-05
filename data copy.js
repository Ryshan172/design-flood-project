
/**
 * Mapbox API Access token added by Ryshan Ramlall 
 * Account owner 
 * Need to pay attention to the pricing if it the amount of user increases substantially
 * Currently only using the Map from the API 
 */
L.mapbox.accessToken =
"pk.eyJ1Ijoic3R1cnRpdW0iLCJhIjoiY2tnaHd6cHZjMDAxMzJybG9sM3huOTVpZCJ9.FPujWyjCdiqERPlvNhlU5w";

mapboxgl.accessToken =
"pk.eyJ1Ijoic3R1cnRpdW0iLCJhIjoiY2tnaHd6cHZjMDAxMzJybG9sM3huOTVpZCJ9.FPujWyjCdiqERPlvNhlU5w";


//Navigation controls. For finding directions//

//The actual dataset
//Note: this is going to be hundreds of lines. Don't delete sections or move them//

/**
 * Image attribution for icon:
 * <a href="https://www.flaticon.com/free-icons/mini-bus" title="mini bus icons">Mini bus icons created by Vectors Tank - Flaticon</a>
 */

// ToDo: Move Data to a separate file

var geojson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [31.02419444, -29.86011111],
      },
      properties: {
        title: "Durban Central",
        description: "Durban Central Area",
        routes: "None",
        landmarks: "Schwarma Palace",
        geolocation: "-29.86011111, 31.02419444",
        image: "https://cdn.24.co.za/files/Cms/General/d/8082/8eedb832797b4ea599400a5dd23804e9.png",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [31.011273, -29.858300],
      },
      properties: {
        title: "Rank no. 95",
        description: "Durban Central Area",
        routes: "N/A",
        landmarks: "Near English market sign",
        geolocation: "-29.858300, 31.011273",
        image: "https://cdn.24.co.za/files/Cms/General/d/8082/8eedb832797b4ea599400a5dd23804e9.png",
      },
    },
  ],
};


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
    map.setView([latitude, longitude], 16);
  } else {
    // Display an error message if the input values are not valid
    alert("Invalid coordinates. Please enter valid numbers.");
  }
});

// Change Styles, Centre, View etc. 
var map = L.mapbox
  .map("map")
  .setView([-29.86011111, 31.02419444], 16)
  .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/satellite-v9"));

var listings = document.getElementById("listings");
var locations = L.mapbox.featureLayer().addTo(map);

locations.setGeoJSON(geojson);

// Load the second GeoJSON data
fetch('wspopu.geojson')
  .then(response => response.json())
  .then(loadedSecondGeojson => {
    

    var secondLocations = L.mapbox.featureLayer().addTo(map); // Create a new feature layer for the second dataset
    
    secondLocations.setGeoJSON(loadedSecondGeojson); // Set the loaded GeoJSON data
    
    secondLocations.eachLayer(function (locale) {
      // Customize the popup for the second dataset
      var popupContent = 'Hello World'; // Set the popup content
      locale.bindPopup(popupContent); // Bind the popup to the layer
    });
  });


// Define a function to set the style based on feature properties
function geoJSONStyle(feature) {
  // Check the geometry type of the feature
  var geometryType = feature.geometry.type;

  // Define a default style for all other feature types
  var defaultStyle = {
    color: "blue", // Change this to your desired color
    weight: 2,
  };

  // Define a style for MultiLineString features
  var multiLineStyle = {
    color: "red", // Change this to your desired color for MultiLineString
    weight: 4,     // Change this to your desired line weight
  };

  // Apply different styles based on geometry type
  switch (geometryType) {
    case "MultiLineString":
      return multiLineStyle;
    default:
      return defaultStyle;
  }
}



// Load the rivers GeoJSON data
fetch('rivers.geojson')
.then(response => response.json())
.then(loadedRiversGeojson => {

  var riverLocationsLocations = L.mapbox.featureLayer().addTo(map); // Create a new feature layer for the second dataset
  
  riverLocationsLocations.setGeoJSON(loadedRiversGeojson); // Set the loaded GeoJSON data

  riverLocations.eachLayer(function (locale) {
    // Customize the popup for the second dataset
    // var popupContent = 'Hello World'; // Set the popup content
    // locale.bindPopup(popupContent); // Bind the popup to the layer
  });
});


function setActive(el) {
  var siblings = listings.getElementsByTagName("div");
  for (var i = 0; i < siblings.length; i++) {
    siblings[i].className = siblings[i].className
      .replace(/active/, "")
      .replace(/\s\s*$/, "");
  }

  el.className += " active";
}

locations.eachLayer(function (locale) {
  // Shorten locale.feature.properties to just `prop` so we're not
  // writing this long form over and over again.
  var prop = locale.feature.properties;

  // Each marker on the map.
  var popup = prop.title;

  var listing = listings.appendChild(document.createElement("div"));
  listing.className = "item";

  var link = listing.appendChild(document.createElement("a"));
  link.href = "#";
  link.className = "title";

  // ToDo: Need to add in titles/colons for each section in popup
  link.innerHTML = prop.title;
  if (prop.description) {
    link.innerHTML +=
      '<br /><small class="quiet">' + prop.description + "</small>";
    popup += '<br /><small class="quiet">' + prop.description + "</small>";
  }
  if (prop.routes) {
    link.innerHTML +=
      '<br /><small class="quiet">' + prop.routes + "</small>";
    popup += '<br /><small class="quiet">' + prop.routes + "</small>";
  }
  if (prop.landmarks) {
    link.innerHTML +=
      '<br /><small class="quiet">' + prop.landmarks + "</small>";
    popup += '<br /><small class="quiet">' + prop.landmarks + "</small>";
  }
  if (prop.geolocation) {
    link.innerHTML +=
      '<br /><small class="quiet">' + prop.geolocation + "</small>";
    popup += '<br /><small class="quiet">' + prop.geolocation + "</small>";
  }
  if (prop.image) {
    popup += '<img src="' + prop.image + '" alt="" width = 300 height = 300>';
  }

  link.onclick = function () {
    setActive(listing);

    // When a menu item is clicked, animate the map to center
    // its associated locale and open its popup.
    map.setView(locale.getLatLng(), 18);
    locale.openPopup();
    return false;
  };

  // Marker interaction
  locale.on("click", function (e) {
    // 1. center the map on the selected marker.
    map.panTo(locale.getLatLng());

    // 2. Set active the markers associated listing.
    setActive(listing);
  });

  popup += "</div>";
  locale.bindPopup(popup);

  locale.setIcon(
    L.icon({
      iconUrl: "transport.png",
      iconSize: [50, 50],
      iconAnchor: [30, 30],
      popupAnchor: [0, -20],
    })
  );
});


// Searchbox functionality
// Edit to change search parameters
var searchBox = document.getElementById("search-box");
searchBox.addEventListener("keyup", function (e) {
  var searchString = e.target.value.toLowerCase();

  locations.eachLayer(function (locale) {
    var title = locale.feature.properties.title.toLowerCase();
    var description = locale.feature.properties.description
      ? locale.feature.properties.description.toLowerCase()
      : "";
    var routes = locale.feature.properties.routes
      ? locale.feature.properties.routes.toLowerCase()
      : "";
    var geolocation = locale.feature.properties.geolocation
      ? locale.feature.properties.geolocation.toLowerCase()
      : "";

    if (
      title.indexOf(searchString) !== -1 ||
      description.indexOf(searchString) !== -1 ||
      routes.indexOf(searchString) !== -1 ||
      geolocation.indexOf(searchString) !== -1
    ) {
      locale.setOpacity(1);
      if (map.getBounds().contains(locale.getLatLng()) === false) {
        map.panTo(locale.getLatLng());
      }
    } else {
      locale.setOpacity(0);
    }
  });
});

