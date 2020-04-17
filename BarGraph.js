//Source: https://editor.p5js.org/jsarachan/sketches/ry8TEc_0b
budgetValues = [];

function preload() {
  table = loadTable("sampledata.csv", "csv", "header");
}
console.log(require('electron').remote.getGlobal('sharedObject').dataArray);

function setup() {
  createCanvas(400, 500);//400,500
  numberOfRows = table.getRowCount();
  numberOfColumns = table.getColumnCount();
}

function draw() {
  background(220);
  fill(0);

  for (var i = 0; i < numberOfRows; i++) {
    //place years
    text(table.getString(i, 0), i * 30 + 60, 420);
    //pull numbers
    budgetValues[i] = table.getString(i, 1);
    //draw graph
    rect(i * 30 + 60, 400 - budgetValues[i], 20, budgetValues[i])
  }
   //determine highest value
   maxValue=max(budgetValues);
  for (var k=0;k<maxValue;k=k+50){
    text(k,10,420-k);
  }

}