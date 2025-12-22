// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");


    const mapManager = new MapManager();
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
    const callback = function (locationHelper) {
        const latitude = locationHelper.latitude;
        const longitude = locationHelper.longitude;

        document.getElementById("tag-latitude").value = latitude;
        document.getElementById("tag-longitude").value = longitude;
        document.getElementById("discovery-latitude").value = latitude;
        document.getElementById("discovery-longitude").value = longitude;
    
        mapManager.initMap(latitude, longitude);

        const map = document.getElementById("map");
        let tags = [];
        if (map?.dataset?.tags) {
            tags = JSON.parse(map.dataset.tags);
        }
        mapManager.updateMarkers(latitude, longitude, tags);
    };

    let latitude = document.getElementById("discovery-latitude").value;
    let longitude = document.getElementById("discovery-longitude").value;

    if (latitude == 0 || longitude == 0) {
        LocationHelper.findLocation(callback);
    } else {
        mapManager.initMap(latitude, longitude);

        const map = document.getElementById("map");
        let tags = [];
        console.log(map.dataset.tags);
        if (map?.dataset?.tags) {
            tags = JSON.parse(map.dataset.tags);
        }
        mapManager.updateMarkers(latitude, longitude, tags);
    }


    const element = document.getElementById("mapView");
    element.remove();

    const element2 = document.getElementsByTagName("span");
    element2[0].remove();

}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

