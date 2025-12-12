// File origin: VS1LAB A3

const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore {
    // TODO: ... your code here ...

    #geotags = [];
    #proximity = 0.01; // auf drängenden Wunsch von Chris

    addGeoTag(GeoTag) {
        // this.#geotags[0] = GeoTag;
        this.#geotags.push(GeoTag);
    }

    removeGeoTag(GeoTagName) {
        for (let i = 0; i < this.#geotags.length; i++) {
            if (this.#geotags[i].name == GeoTagName) {
                this.#geotags.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    printArray() {
        // const arr = this.#geotags;
        console.log(this.#geotags);
    }

    getNearbyGeoTags(latitude, longitude) {
        let outputArray = [];
        for (let i = 0; i < this.#geotags.length; i++) {
            if (Math.abs(this.#geotags[i].latitude - latitude) < this.#proximity) {
                if (Math.abs(this.#geotags[i].longitude - longitude) < this.#proximity) {
                    outputArray.push(this.#geotags[i]);
                }
            }
        }
        return outputArray;
    }

    searchNearbyGeoTags(searchString) {
        for (let i = 0; i < this.#geotags.length; i++) {
            let currentName = this.#geotags[i].name;
            let currentTag = this.#geotags[i].hashtag;
            if(currentName.toLowerCase().includes(searchString.toLowerCase()) || currentTag.toLowerCase().includes(searchString.toLowerCase())) {
                return this.getNearbyGeoTags(this.#geotags[i].latitude, this.#geotags[i].longitude);
            }
        }
    }
}

module.exports = InMemoryGeoTagStore
