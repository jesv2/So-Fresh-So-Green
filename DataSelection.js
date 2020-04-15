/* Example code on using Electron to communicate between windows */
require('electron').remote.getGlobal('sharedObject').someProperty = 'new value'; 

/* Code for the button to open the file explorer */
const { dialog } = require('electron').remote; 
const Fs = require( 'fs' ); 
const CsvReadableStream = require('csv-reader');

let fileExplorer = document.getElementById( 'getFilePath' );

let filePath = null; //global 

fileExplorer.addEventListener( 'click', () => {
  let options = {
    properties : [ 'openFile' ]
  }; 
  filePath = dialog.showOpenDialog( options );
  console.log(filePath);
  filePath = filePath[0]; //since showOpenDialog actually returns an array of strings, not a string directly
  
  /* Sample code: https://www.npmjs.com/package/csv-reader */
  let inputStream = Fs.createReadStream(filePath, 'utf8');
 
  inputStream
    .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        console.log('A row arrived: ', row);
    })
    .on('end', function (data) {
        console.log('No more rows!');
    }); 
}, false );

/* The p5 code */
function setup() {
  createCanvas(720, 400);
  noStroke();
  noLoop(); // Run once and stop
}

function draw() {
  background(100);
}
