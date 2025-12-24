// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
myStore = new GeoTagStore;


// GeoTagExamples into Store
const GeoTagExamples = require('../models/geotag-examples');
const examplesArray = GeoTagExamples.tagList;

for (const [name, latitude, longitude, hashtag] of examplesArray) {
  myStore.addGeoTag(new GeoTag(name, latitude, longitude, hashtag));
}


// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: [], longitude: 0, latitude: 0 });
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', function (req, res) {
  const searchterm = req.query.searchterm;
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;
  let geoTags = [];


  if (searchterm && latitude && longitude) {
    geoTags = myStore.searchNearbyGeoTags(latitude, longitude, searchterm);
  } else if (latitude && longitude) {
    geoTags = myStore.getNearbyGeoTags(latitude, longitude);
  } else if (searchterm) {
    geoTags = myStore.searchGeoTags(searchterm);
  } else {
    geoTags = myStore.getAllGeoTags();
  }

  res.json(geoTags);
})

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const hashtag = req.body.hashtag;

  // simple fail safe
  if (!name || !latitude || !longitude) {
    return res.status(400).send();
  }

  const newTag = new GeoTag(name, latitude, longitude, hashtag);
  const id = myStore.addGeoTag(newTag);


  res.status(201).location(`http://${req.get('host')}/api/geotags/${id}`).json(newTag);
})

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', function (req, res) {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send();
  }

  const geoTag = myStore.getGeoTagbyId(id);
  
  if (!geoTag) {
    return res.status(404).send();
  }

  res.status(200).json(geoTag);

})


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', function (req, res) {
  const id = req.params.id;

  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const hashtag = req.body.hashtag;

  // simple fail safe
  if (!name || !latitude || !longitude || !id) {
    return res.status(400).send();
  }
  const changedTag = new GeoTag(name, latitude, longitude, hashtag);
  myStore.changeGeoTagbyId(id, changedTag);

  res.json(changedTag);
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send();
  }

  const geoTag = myStore.removeGeoTagWithId(id);

  if (!geoTag) {
    return res.status(404).send();
  }

  res.status(200).json(geoTag);

})


module.exports = router;
