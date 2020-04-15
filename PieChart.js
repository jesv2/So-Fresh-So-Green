//Source: https://p5js.org/examples/form-pie-chart.html

/*
let angles = [30, 10, 45, 35, 60, 38, 75, 67];

function setup() {
  createCanvas(720, 400);
  noStroke();
  noLoop(); // Run once and stop
}

function draw() {
  background(100);
  pieChart(300, angles);
}

function pieChart(diameter, data) {
  let lastAngle = 0;
  for (let i = 0; i < data.length; i++) {
    let gray = map(i, 0, data.length, 0, 255);
    fill(gray);
    arc(
      width / 2,
      height / 2,
      diameter,
      diameter,
      lastAngle,
      lastAngle + radians(angles[i])
    );
    lastAngle += radians(angles[i]);
  }
}

*/

/* I need to add a helper function that calculates the values in the angle array above based on 
   user input/what's in the csv file. I should probably assume that the csv file has been 
   converted into a 2D array. */

/*
  The function below does the same thing as the sample source code, which is drawing a pie chart.
  However, data is different in this function than the sample, and this function will use data
  to determine the angles/size of the each chunk. It'll also allow the user to choose the colors.

  It is assumed the size of each chunk will be depended on the ratio between each chunk's data
  and the sum of all data. 
*/

const numbers = [30, 10, 25, 35, 70, 48, 75, 67];

console.log(require('electron').remote.getGlobal('sharedObject').someProperty)

function setup() {
  createCanvas(720, 400);
  noStroke();
  noLoop(); // Run once and stop
}

function draw() {
  background(100);
  PieChart(300, numbers);
}

function PieChart( diameter, data, colors ) {
  let size = data.length;
  let lastAngle = 0;
  let angles = GetAngles( data );
  for ( let i = 0; i < size; i++ ) {
    if ( colors ) {
      fill( colors[i] );
    }
    else {
      let gray = map(i, 0, size, 0, 255);
      fill(gray);
    }
    arc(
      width / 2,
      height / 2,
      diameter,
      diameter,
      lastAngle,
      lastAngle + radians(angles[i])
    );
    lastAngle += radians(angles[i]);
  } 
}

function GetAngles( data ) {
  let size = data.length;
  let angles = [];
  let total = 0;
  let roundedTotal = 0; 
  data.forEach( element => { total += element; } );
  for ( let i = 0; i < size; i++ ) {
    let angle = Math.round( 360 * ( data[i] / total ) );
    angles.push( angle );
    roundedTotal += angle;  
  }
  if ( roundedTotal < 360 ) {
    angles[size - 1 ] += ( 360 - roundedTotal ); 
  }
  return angles; 
}


