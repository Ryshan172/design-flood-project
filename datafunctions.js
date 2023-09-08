function loadRegion(map, sourceName, layerId, dataUrl, circleColor, circleRadius, selectedData) {

    // Load the GeoJSON data
  fetch("datalayers/wspopu.geojson")
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

      // Data 
      const csvData = `Area, mapMean, HRU_Max, HRU_Min, DR5yr, DR10yr\n${feature.properties.Area}, ${feature.properties.mapMean}, ${feature.properties.HRU_Max}, ${feature.properties.HRU_Min}, ${feature.properties.DR5yr}, ${feature.properties.DR10yr}`;

      // Create a data URI for the CSV content
      const csvDataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvData);

      // Create the HTML content for the popup with a hyperlink
      const popupContent = `
          <h2> Region Data </h3>
          <h3> Area: ${feature.properties.Area}</h3>
          <h3> mapMean: ${feature.properties.mapMean}</h3>
          <h3> HRU_Max: ${feature.properties.HRU_Max}</h3>
          <h3> HRU_Min: ${feature.properties.HRU_Min}</h3>
          <h3> DR5yr: ${feature.properties.DR5yr}</h3>
          <h3> DR10yr: ${feature.properties.DR10yr}</h3>
          
          <a href="${csvDataUri}" download="data.csv">Download CSV</a>
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


}