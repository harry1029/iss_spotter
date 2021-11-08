const {fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes} = require('./iss');

/*
fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
});
*/

/*
fetchCoordsByIP('173.230.177.117', (error, coord) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned coordinates:", coord);
});
*/

/*
fetchISSFlyOverTimes({ latitude: '49.27670', longitude: '-123.13000' }, (error, response) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log("It worked! Returned flyover times:", response)
});
*/

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
    if (error) {
      console.log('Error fetching IP!', error);
      return;
    }

    console.log('Fetching IP successful! Returned IP:', ip);

    fetchCoordsByIP(ip, (error, coord) => {
      if (error) {
        console.log("Error fetching coordinates!", error);
        return;
      }
    
      console.log("Fetching coordinates successful! Returned coordinates:", coord);

      fetchISSFlyOverTimes(coord, (error, response) => {
        if (error) {
          console.log("Error fetching flyover times!", error);
          return;
        }
      
        console.log("Fetching flyover times successful! Returned flyover times:", response);
        callback(error, response);
      });
    });
  });
};

/**
 * Input:
 *   Array of data objects defining the next fly-overs of the ISS.
 *   [ { risetime: <number>, duration: <number> }, ... ]
 * Returns:
 *   undefined
 * Sideffect:
 *   Console log messages to make that data more human readable.
 *   Example output:
 *   Next pass at Mon Jun 10 2019 20:11:44 GMT-0700 (Pacific Daylight Time) for 468 seconds!
 */
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  // success, print out the deets!
  printPassTimes(passTimes);
});