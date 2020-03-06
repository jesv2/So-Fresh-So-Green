const fs = require( 'fs' );
//const sensorConfig = require( 'sensorConfig.json' );

let sensorType = 'testSensor';
let options = { flag : 'a' };

fs.writeFileSync( sensorType + '.h', '#ifndef SENSOR_INFO_HEADER \n' );
fs.writeFileSync( sensorType + '.h', '#define SENSOR_INFO_HEADER \n', options);
fs.writeFileSync( sensorType + '.h', '#define TEST_CONSTANT 25 \n', options);

fs.writeFileSync( sensorType + '.h', '#endif', options );
