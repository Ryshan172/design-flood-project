function loadSoilsLayer(map, selectedData, soilsCSVData) {

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

        

        
        })
        .catch((error) => {
        console.error("Error fetching GeoJSON:", error);
    });

}

export { loadSoilsLayer };