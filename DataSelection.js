/* Code on using Electron to communicate between windows */
const shared = require('electron').remote.getGlobal('sharedObject');
//shared.dataArray = null; 

/* Code for the button to open the file explorer */
const { dialog } = require('electron').remote; 
const Fs = require( 'fs' ); 
const CsvReadableStream = require('csv-reader');

let csvArray = []; 
let fileExplorer = document.getElementById( 'getFilePath' );

let filePath = null; //global 

fileExplorer.addEventListener( 'click', () => {
  let options = {
    properties : [ 'openFile' ]
  }; 
  filePath = dialog.showOpenDialog( options );
  console.log(filePath);
  
  /* Sample code: https://www.npmjs.com/package/csv-reader */

  if ( filePath ) {
    filePath = filePath[0]; //since showOpenDialog actually returns an array of strings, not a string directly
    let inputStream = Fs.createReadStream(filePath, 'utf8');
 
    inputStream
      .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
      .on('data', function (row) {
        console.log('A row arrived: ', row);
        csvArray.push( row ); 
      })
      .on('end', function (data) {
        console.log('No more rows!');
      } );
  } //end of the if statement...hopefully 
}, false );

/* The p5 code */
function setup() {
  createCanvas(800, 600);
  noStroke();
  noLoop(); // Run once and stop
}

function draw() {
  background(100);
}
