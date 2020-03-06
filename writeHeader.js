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
for ( let i = 0; i < sensorTypeCount; i ++ ) {
  let size = sensorConfig[sensorTypes[i]].length;
  fs.writeFileSync( headerName, '#define ' + sensorTypes[i].toUpperCase() + '_SENSOR_COUNT ' + size + '\n', options );
}

fs.writeFileSync( headerName, '#endif', options );
