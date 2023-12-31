
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
    mapb.setView([latitude, longitude], 16);
  } else {
    // Display an error message if the input values are not valid
    alert("Invalid coordinates. Please enter valid numbers.");
  }
});

// // Change Styles, Centre, View etc. 
// var mapb = L.mapbox
//   .map("map")
//   .setView([-29.86011111, 31.02419444], 16)
//   .addLayer(L.mapbox.styleLayer("mapbox://styles/mapbox/satellite-v9"));

// var listings = document.getElementById("listings");
// var locations = L.mapbox.featureLayer().addTo(map);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [31.02419444, -29.86011111], // Set center coordinates
    zoom: 7,
  });

//locations.setGeoJSON(geojson);

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

    
    // Load the GeoJSON data
    fetch('rivers.geojson')
      .then(response => response.json())
      .then(loadedRiversGeojson => {
        // Add the GeoJSON data as a source
        map.addSource('riversgeojson', {
          type: 'geojson',
          data: loadedRiversGeojson,
        });
  
        // Add a fill layer for the GeoJSON data and set its style
        map.addLayer({
          id: 'river-geojson-layer',
          type: 'line',
          source: 'riversgeojson', // Use the source name defined above
          paint: {
            'line-color': 'blue', // Set your desired line color
            'line-opacity': 0.7, // Adjust opacity as needed
            'line-width': 2, // Set line width
          },
        });
  
        // You can customize popups or add more layers as needed.
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

