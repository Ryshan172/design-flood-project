function loadRiversLayer(map, selectedData, riversCSVData) {

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

}

export { loadRiversLayer };