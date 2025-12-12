// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

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

        let mapManager = new MapManager();

        mapManager.initMap(latitude, longitude);
        mapManager.updateMarkers(latitude, longitude);

        const element = document.getElementById("mapView");
        element.remove();

        const element2 = document.getElementsByTagName("span");
        element2[0].remove();
    };

    LocationHelper.findLocation(callback);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});

