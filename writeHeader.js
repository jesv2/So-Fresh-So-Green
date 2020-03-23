const fs = require( 'fs' );


JsonToHeader(); 

function JsonToHeader() {
//equivalent to using #include<iostream>
const sensorConfig = require( './sensorConfig.json' );
// if we were using our own javascript program
// const ourJavascriptProgram = require( 'ourProgram.js' );

const sensorTypes = sensorConfig.sensorType;
const collectionFreq = sensorConfig.collectionFrequency;
const headerName = 'SensorInfo.h';
//const arduinoFileName = 'initialize.ino';


let options = { flag : 'a' };

//essentially the start of main

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
fs.writeFileSync( headerName, '\n\n//These functions will initalize the arrays that contain the pin configuration\n', options );
for ( let i = 0; i < sensorTypeCount; i++ ) {
/*
  fs.writeFileSync( headerName, 'int* Init' + sensorTypes[i].toUpperCase() + "Config()\n", options );
  fs.writeFileSync( headerName, '{\n', options );
  fs.writeFileSync( headerName, '  static int configArray[ '+ sensorTypes[i].toUpperCase() + '_SENSOR_COUNT ];\n', options );
  let pinConfig = sensorConfig[sensorTypes[i]];
  let size = pinConfig.length;
  for ( let j = 0; j < size; j++ ) {
    fs.writeFileSync( headerName, '  configArray[' + j.toString() + '] = ' + pinConfig[j].toString() + ';\n', options );
  }
  //fs.writeFileSync( arduinoFileName, pinConfig[size - 1].toString() + ' ];\n', options );
  fs.writeFileSync( headerName, '  return configArray; \n}\n', options );
*/
  let pinConfig = sensorConfig[sensorTypes[i]];
  WriteFunction( headerName, sensorTypes[i].toUpperCase(), options, pinConfig, '' ); 
}

/*
  The data collection format goes:
    For "daily"
      The number that follows daily indicates how many times per day it's done
    For "weekly"
      The numbers that follow weekly tells us which days of the week data is
      collected on; 0 is Sunday, and 6 is Saturday.
*/
fs.writeFileSync( headerName, '\n\n//Start of the code that provides collection frequency information\n', options );
for ( let i = 0; i < sensorTypeCount; i++ ) {
  if ( collectionFreq[sensorTypes[i]]['type'] === 'daily' ) {
    fs.writeFileSync( headerName, '#define IS_' + sensorTypes[i].toUpperCase() + '_DAILY true\n\n', options );
    fs.writeFileSync( headerName, '#define ' + sensorTypes[i].toUpperCase() + '_DAILY_RATE ' + collectionFreq[sensorTypes[i]]['rate'] + '\n\n', options );
  } else if ( collectionFreq[sensorTypes[i]]['type'] === 'weekly' ) {
    let numbers = collectionFreq[sensorTypes[i]]['days']
    fs.writeFileSync( headerName, '#define IS_' + sensorTypes[i].toUpperCase() + '_DAILY false\n\n', options );
    WriteFunction( headerName, sensorTypes[i].toUpperCase() , options, numbers, 'Freq' );
  } else { 
    //shouldn't be possible
    throw 'Invalid frequency type';
  }
}

fs.writeFileSync( headerName, '#endif', options );

}
//end of main

function WriteFunction( headerName, functionName, options, pinConfig, freq ) {
  let size = pinConfig.length;
  fs.writeFileSync( headerName, 'int* Init' + functionName + freq + "Config()\n", options );
  fs.writeFileSync( headerName, '{\n', options );
  fs.writeFileSync( headerName, '  static int configArray[ '+ size + ' ];\n', options );
  
  for ( let j = 0; j < size; j++ ) {
    fs.writeFileSync( headerName, '  configArray[' + j.toString() + '] = ' + pinConfig[j].toString() + ';\n', options );
  }
  //fs.writeFileSync( arduinoFileName, pinConfig[size - 1].toString() + ' ];\n', options );
  fs.writeFileSync( headerName, '  return configArray; \n}\n', options );
}
