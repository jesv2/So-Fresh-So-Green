`/*
  This file will contain the code that handles the timing of FERN's functionalities.
  It's essentially a schedule manager, but it's also what I consider to be the "main"
  function. It will import modules that are capable of handling interacting with the hardware,
  and the SensorInfo header will contain information about the sensors and data collection 
  frequency.
    * Should probably also include in a header with function declarations

  Functions/modules that are needed: 
    1. Something to keep track of time
    2. Something to determine the times of data collection
      - The current plan is to support up to 24 times a day for sensors that are collected daily
      - Or let the user chose which days of the week (what time? Can we support multiple times on
        the chosen day of the week?)
    3. Fill out the loop and setup function
      - This will consist of using the two modules above and the imported modules. 

  Importing modules seem to be a bit more annoying than I thought it would be in Arduino
*/

#include "SensorInfo.h"
#include <SPI.h>
#include <SD.h>
#include <TimeLib.h>
#include <TimeAlarms.h>

File myFile;
const int pinCS = 53;

const int n = LIGHT_SENSOR_COUNT; //10
const String testName = "TestingLight";
int* testData = InitLIGHTConfig(); //1 2 3 4 5 7 7 7 7 7

///////////////////////////////////////////
// Used to test WriteData function
/*
const int n = 10; 
const String testName = "datatest";
int testData[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
*/
///////////////////////////////////////

void setup() {
// Open serial communications and wait for port to open:
  Serial.begin(9600);

  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }
  
  Serial.print("Initializing SD card...");
  if (!SD.begin(pinCS)) {
    Serial.println("initialization failed!");
    while (1);
  }
  Serial.println("initialization done.");
  setTime(0,0,0,4,1,20); // set time to Wednesday 0:00:00am (12 am) April 1 2020 //finding interval
//  bool success = WriteData(testData, testName, n, false);
  Alarm.alarmRepeat(0,0,3, Sucess);
}
bool Sucess(){
  if (WriteData(testData, testName, n, false) == true){
    return true;
    }
  }
void digitalClockDisplay(){
  // digital clock display of the time
  Serial.print(hour());
  printDigits(minute());
  printDigits(second());
  Serial.println(); 
}
void printDigits(int digits){
  Serial.print(":");
  if(digits < 10)
    Serial.print('0');
  Serial.print(digits);
}
void loop() {
  digitalClockDisplay();
  Alarm.delay(1000); // wait one second between clock display
}

/*
  The idea is that this function will use perDayRate to find out at what hours of the day
  the Arduino needs to ask for data from the sensors. 
  It should probably be called once for each sensor in use during the setup function. 
  The array it returns will have the index correspond to the hour of the day (starting at 0), and 
  the loop function should just check the array every hour to see if it needs to ask for data. 

  This function isn't very flexible right now in terms of letting the user chose exactly which hrs
  of the day they want to collect info from. It only works if we're given "nice" numbers that divide
  evenly into 24.

  Inputs: 
  1. int perDayRate
    - 24 / perDayRate tells us how many hours there are between data collection,
      and this information can be used to tell us what times of the day we collect data.
  2. int offset
    - This number tells us when to start the first data collection
  3. int size
    - The size of the array we're creating which will correspond to the number of hrs a day
      so pretty much always 24, but maybe we'll change it for some reason!?
  Returns (by reference): an array of booleans, with the index indicating which hour, and the value being
    true means that we do collect data at this time.  
  
*/

void GetDayIntervals( int perDayRate, int offset, int size, bool whatHrs[] ) {
  if ( ( size % perDayRate ) == 0 ) {
    int hrsBetween = size / perDayRate;
    /* Need to make sure that offset is a non-negative number */
    whatHrs[ offset ] = true;
    for ( int i = 1; i < perDayRate; i++ ) {
      int current = ( i * hrsBetween ) + offset; 
      /* I'm not sure if the commented condition below will actually be an issue given how I'm restricting 
         myself to nice inputs for now, but there will need to be input sanitation for offset too.  */
      /*if ( current >= size ) {
      } else {
      }*/
      whatHrs[ current ] = true; 
    } 
  } else {
  /*
    There are issues when perDateRate doesn't divide into a whole number
    so we're just ignoring the issue for now by not doing anything when this happens. 
  */ 
  } 
}
