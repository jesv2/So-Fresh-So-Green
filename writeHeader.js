const fs = require( 'fs' );
//equivalent to using #include<iostream>
const sensorConfig = require( './sensorConfig.json' );
// if we were losing in our own javascript program
// const ourJavascriptProgram = require( 'ourProgram.js' );

const sensorTypes = sensorConfig.sensorType;
const collectionFrequency = sensorConfig.collectionFrequency;
const headerName = 'SensorInfo.h';


let options = { flag : 'a' };

fs.writeFileSync( headerName, '#ifndef SENSOR_INFO_HEADER \n' );
fs.writeFileSync( headerName, '#define SENSOR_INFO_HEADER \n', options);
const sensorTypeCount = sensorTypes.length;

//This loop writes the macros that tells us which pins are in use
for ( let i = 0; i < sensorTypeCount; i++ ) {
  fs.writeFileSync( headerName, '#define ' + sensorTypes[i].toUpperCase() + '_IN_USE true\n', options );
}

//This loop writes the macros that tells us how many pins of each type are used
for ( let i = 0; i < sensorTypeCount; i++ ) {
  let size = sensorConfig[sensorTypes[i]].length;
  fs.writeFileSync( headerName, '#define ' + sensorTypes[i].toUpperCase() + '_SENSOR_COUNT ' + size + '\n', options );
}

//this loop should write the functions to initialize the arrays that have the pin configuration
for ( let i = 0; i < sensorTypeCount; i++ ) {

}

/*
  The data collection format goes:
    For "daily"
      The number that follows daily indicates how many times per day it's done
    For "weekly"
      The numbers that follow weekly tells us which days of the week data is
      collected on; 0 is Sunday, and 6 is Saturday.
*/
//this loop should write the functions and macros that contain data collection frequency
for ( let i = 0; i < sensorTypeCount; i++ ) {

}

fs.writeFileSync( headerName, '#endif', options );
