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

    #geotags = [];
    #proximity = 0.005;
    #nextId = 1;
    #geotagIds = [];

    /** returns id of new GeoTag */
    addGeoTag(GeoTag) {
        let id = this.#nextId++;
        while (this.doesIdExist(id)) {
            id = this.#nextId++;
        }
        this.#geotags.push(GeoTag);
        this.#geotagIds.push(id);
        return id;
    }

    /** returns -1 if id already exists else returns the id */
    addGeoTagWithId(id, GeoTag) {
        if (this.doesIdExist(id)) {
            return -1;
        }

        this.#geotags.push(GeoTag);
        this.#geotagIds.push(id);
        return id;
    }

    /** Delete Geotag by name */
    removeGeoTag(GeoTagName) {
        for (let i = 0; i < this.#geotags.length; i++) {
            if (this.#geotags[i].name == GeoTagName) {
                this.#geotags.splice(i, 1);
                this.#geotagIds.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    /** returns the deleted GeoTag if nothing was deleted null is returned */
    removeGeoTagWithId(id) {
        if (this.doesIdExist(parseInt(id))) {
            let index = this.#geotagIds.indexOf(parseInt(id));
            this.#geotagIds.splice(index, 1);
            return this.#geotags.splice(index, 1);
        }
        return null;
    }

    doesIdExist(id) {
        for (let i = 0; i < this.#geotagIds.length; i++) {
            if (this.#geotagIds[i] == id) { return true; }
        }
        return false;
    }

    getAllGeoTags() {
        return this.#geotags;
    }

    /** return null if unable to find Geotag by id */
    getGeoTagbyId(id) {
        const index = this.#geotagIds.indexOf(parseInt(id));
        if (index == -1) {
            return null;
        }
        return this.#geotags[index];
    }

    changeGeoTagbyId(id, GeoTag) {
        this.#geotags.splice(this.#geotagIds.indexOf(parseInt(id)), 1, GeoTag);
    }

    getNearbyGeoTags(latitude, longitude) {
        let outputArray = [];

        for (let i = 0; i < this.#geotags.length; i++) {
            if (this.compareLocations(this.#geotags[i], latitude, longitude)) {
                outputArray.push(this.#geotags[i]);
            }
        }
        return outputArray;
    }

    searchNearbyGeoTags(latitude, longitude, searchString) {
        let outputArray = this.getNearbyGeoTags(latitude, longitude);
        for (let i = outputArray.length - 1; i >= 0; i--) {
            let currentName = outputArray[i].name;
            let currentTag = outputArray[i].hashtag;
            if (!(currentName.toLowerCase().includes(searchString.toLowerCase()) || currentTag.toLowerCase().includes(searchString.toLowerCase()))) {
                outputArray.splice(i, 1);
            }
        }
        return outputArray;
    }

    searchGeoTags(searchString) {
        let outputArray = Array.from(this.#geotags);
        for (let i = outputArray.length - 1; i >= 0; i--) {
            let currentName = outputArray[i].name;
            let currentTag = outputArray[i].hashtag;
            if (!(currentName.toLowerCase().includes(searchString.toLowerCase()) || currentTag.toLowerCase().includes(searchString.toLowerCase()))) {
                outputArray.splice(i, 1);
            }
        }
        return outputArray;
    }

    compareLocations(geotag, latitude, longitude) {
        let latdiv = Math.abs(latitude - geotag.latitude);
        let longdiv = Math.abs(longitude - geotag.longitude);
        return Math.sqrt(latdiv * latdiv + longdiv * longdiv) <= this.#proximity;
    }
}

module.exports = InMemoryGeoTagStore
