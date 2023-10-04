// Define the loadRegionLayer function
function loadRegionLayer(map, selectedData, regionCSVData) {
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
}

// Export the loadRegionLayer function
export { loadRegionLayer };
