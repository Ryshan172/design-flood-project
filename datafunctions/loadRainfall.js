function loadedRainStations(map, selectedData, rainfallCSV) {

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

}

export { loadedRainStations };