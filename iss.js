/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  const request = require('request');

  let url = 'https://api.ipify.org?format=json';

  request(url, (error, response, body) => {
    console.log('statusCode: ', response && response.statusCode);

    // Inside the request callback ...
    // error can be set if invalid domain, user is offline, etc.

    if (error) {
      callback(error, null);
      return;
    }

    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    // if we get here, all's well and we got the data
    const data = JSON.parse(body);

    const ip = data['ip'];
    callback(error, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {

  const request = require('request');
  let apikey = '17280200-4017-11ec-a0ef-dd5ef77ed997';
  let url = `https://api.freegeoip.app/json/?apikey=${apikey}`;
  // let badUrl = 'https://freegeoip.app/json/invalidIPHere'

  request(url, (error, response, body) => {
    console.log('statusCode: ', response && response.statusCode);

    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const result = {'latitude': data.latitude, 'longitude': data.longitude};
    
    callback(null, result);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const request = require('request');
  const lat = coords.latitude;
  const long = coords.longitude;
  const url = `https://iss-pass.herokuapp.com/json/?lat=${lat}&lon=${long}`;

  request(url, (error, response, body) => {
    console.log('statusCode: ', response && response.statusCode);

    if (error) {
      callback(error);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    const flytimes = data['response'];
    
    callback(null, flytimes);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes };