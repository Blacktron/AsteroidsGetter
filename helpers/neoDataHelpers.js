const https = require('https');
const constants = require('../config/constants');

/**
 * Traverses the data searching for objects in the specified range.
 * @param {object} data The data returned from the API.
 * @param {number} distanceValue The range in which to search for objects.
 * @returns {array} The names of the objects found if any.
 */
function filterAsteroidsByDistance(data, distanceValue) {
    let filteredObjects = [];
    let nearEarthObjects = data.near_earth_objects;
    for (let date in nearEarthObjects) {
        let neoDataArr = nearEarthObjects[date];
        neoDataArr.forEach((entry) => {
            entry.close_approach_data.forEach((approachData) => {
                if (approachData.miss_distance.kilometers <= distanceValue) {
                    filteredObjects.push(entry.name);
                }
            });
        });
    }

    return {
        asteroids: filteredObjects
    };
}

/**
 * Executes the request to an API and calls the callback
 * function to process the response on success. If a status code different
 * from 200 is returned, the status code and status message are sent to the browser.
 * @param {object} options The object holding the details needed to make the request.
 * @param {number} distance The range of kilometers to search for NEOs.
 * @param {function} onResult Called to send the data to the browser.
 */
function getNeosNames(options, distance, onResult) {
    let output = '';
    const req = https.request(options, (res) => {
        console.log(`${options.hostname} : ${res.statusCode}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
            output += chunk;
        });

        res.on('end', () => {
            let obj = JSON.parse(output);
            let asteroidNames = filterAsteroidsByDistance(obj, distance);

            if (res.statusCode !== constants.statusCode200) {
                onResult(res.statusCode, {
                    error: true,
                    message: res.statusMessage
                });
            } else {
                onResult(res.statusCode, asteroidNames);
            }
        });
    });

    req.on('error', (err) => {
        console.log('error: ' + err.message);
        onResult(constants.statusCode500, err.message);
    });

    req.end();
}

module.exports = {
    getNeosNames: getNeosNames
}