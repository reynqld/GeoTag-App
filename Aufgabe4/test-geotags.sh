#!/bin/bash
# test-geotags.sh

BASE_URL="http://localhost:3000"

echo "=== Testing GeoTag API ==="

# Test 1: Erfolgreiche Erstellung
echo -e "\n1. GeoTag erstellen..."
echo -e "Eingabe: curl -v -X POST "${BASE_URL}/api/geotags" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Brandenburger Tor",
    "latitude": 52.5163,
    "longitude": 13.3777,
    "hashtag": "berlin"
	}'\n"

echo -e "Ausgabe: "
response=$(curl -v -X POST "${BASE_URL}/api/geotags" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Brandenburger Tor",
    "latitude": 52.5163,
    "longitude": 13.3777,
    "hashtag": "berlin"
	}' 2>&1 | tee /dev/tty | grep -i "location")
# echo $response
id=$(echo $response | sed 's/.*\///' | sed 's/[^0-9]*//g')
echo -e "\nID: $id"

echo -e "\n\n -------------------------- "

# Test 2: Auslesen
echo -e "\n2. GeoTag auslesen..."
echo -e "Eingabe: curl -v -X GET http://localhost:3000/api/geotags/$id\n"
echo -e "Ausgabe: "
curl -v -X GET http://localhost:3000/api/geotags/$id

echo -e "\n\n -------------------------- "

# Test 3: Ändern 
echo -e "\n3. GeoTag ändern..."
echo -e "Eingabe: curl -v -X PUT "${BASE_URL}/api/geotags/$id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tor",
    "latitude": 52.5163,
    "longitude": 13.3777,
    "hashtag": "Karlruhe"
  }'\n"

echo -e "Ausgabe: "
curl -v -X PUT "${BASE_URL}/api/geotags/$id" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tor",
    "latitude": 52.5163,
    "longitude": 13.3777,
    "hashtag": "Karlruhe"
  }'

echo -e "\n\n -------------------------- "

# Test 4: Suchen
echo -e "\n4. GeoTag suchen..."
searchterm="Tor"
echo -e "Eingabe: curl -v -X GET "${BASE_URL}/api/geotags?searchterm=${searchterm}"\n"
echo -e "Ausgabe: "
curl -v -X GET "${BASE_URL}/api/geotags?searchterm=${searchterm}" 

echo -e "\n\n -------------------------- "

# Test 5: Löschen 
echo -e "\n5. GeoTag löschen..."
echo -e "Eingabe: curl -v -X DELETE http://localhost:3000/api/geotags/$id\n"
echo -e "Ausgabe: "
curl -v -X DELETE http://localhost:3000/api/geotags/$id

echo -e "\n\n -------------------------- "
echo -e "\n6. Alle GeoTags ausgeben"
echo -e "Eingabe: curl -v -X GET "${BASE_URL}/api/geotags"\n"
echo -e "Ausgabe: "
curl -v -X GET "${BASE_URL}/api/geotags"
