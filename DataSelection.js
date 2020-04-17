/* 
  Code on using Electron to communicate between windows 
  Reference: https://www.electronjs.org/docs/faq#how-to-share-data-between-web-pages 
*/
const shared = require('electron').remote.getGlobal('sharedObject');
//shared.dataArray = null;  

/* Variable definitions/declaration for the p5 module */
const BOX_WIDTH = 80, BOX_LENGTH = 80; //it's a square for now 
const X_OFFSET = 10, Y_OFFSET = 20;
const BIG_TEXT_SIZE = 18, SMALL_TEXT_SIZE = 12;  

let xStart = 25, yStart = 25;
let xDiff = 0, yDiff = 0; 
let rowCount = 0, columnCount = 0;
let boxIndices = []; //each entry is a Point structure, has xPos and yPos. 

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
        rowCount = csvArray.length;
        columnCount = csvArray[0].length;
        // getting the box indices
        for ( let row = 0; row < rowCount; row++ ) {
          let rowEntry = [];
          for( let col = 0; col < columnCount; col++ ) {
            let point = { xPos : X_OFFSET + ( col * BOX_WIDTH ), yPos : X_OFFSET + ( row * BOX_LENGTH )  }; //just using X_OFFSET for y because it's 10
            rowEntry.push( point ); 
          }
          boxIndices.push( rowEntry );
          shared.dataArray = csvArray;  
        } 
      } );
  } //end of the if statement...hopefully 
}, false );

/* The p5 code */

function setup() {
  createCanvas(900, 900);
  //noStroke();
  //noLoop(); // Run once and stop
}

function draw() {
  background(100);
  
  
  // For drawing the data grid
  for ( let row = 0; row < rowCount; row++ ) {
    for( let col = 0; col < columnCount; col++ ) {
      rect( boxIndices[row][col].xPos, boxIndices[row][col].yPos, BOX_WIDTH, BOX_LENGTH );
      if ( row != 0 && col != 0 ) {
        textSize( BIG_TEXT_SIZE ); 
      } else { textSize( SMALL_TEXT_SIZE ); }
      text( csvArray[row][col], boxIndices[row][col].xPos + X_OFFSET, boxIndices[row][col].yPos + Y_OFFSET );
    }
  }
  push(); 
  let c = color( 200, 100 ); 
  fill( c );
  rect(xStart, yStart, xDiff, yDiff ); //The drag box's rect function
  pop(); 
}

function mousePressed() {
  xDiff = 0; 
  yDiff = 0; 
  xStart = mouseX;
  yStart = mouseY;
  return false; //prevent default  
}

function mouseDragged() {
  xDiff = mouseX - xStart; 
  yDiff = mouseY - yStart;
  // prevent default
  return false;
}

/*function mouseReleased() {
  xDiff = mouseX - xStart; 
  yDiff = mouseY - yStart; 
  // prevent default
  return false;
}*/
