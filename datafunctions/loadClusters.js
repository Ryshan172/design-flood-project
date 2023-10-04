function loadClustersLayer(map, selectedData, clusterCSVData) {
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

}

export { loadClustersLayer };