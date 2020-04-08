/*
 * Notes:
 * Added "Time" library
 * Added "TimeAlarms" Library
 * Link to use TimeAlarm library: https://www.pjrc.com/teensy/td_libs_TimeAlarms.html
 * To figure out how functions work, use:
 * File - > example -> TimeAlarms
 */

#include <TimeLib.h>
#include <TimeAlarms.h>

AlarmId id;

int tempIntervals[24]; 

void setup() {
  Serial.begin(9600);
  while (!Serial) ; // wait for Arduino Serial Monitor
  setTime(0,0,0,4,1,20); // set time to Wednesday 0:00:00am (12 am) April 1 2020
  FindIntervals( TEMPERATURE_DAILY_RATE, 0, tempIntervals ); 
  
  //Alarm.alarmRepeat(0,0,3, FindIntervals); // should call FindIntervals function to run once a day at 12:00:03 am
}

//Function creates array that designates the interval.
void FindIntervals(int perDayRate, int offset, int whatHrs[]){ //assumed offset = 0
                                                               //changed whatHrs[] from bool to int because it wasn't giving correct output
  perDayRate = 4;                                                            
  int num_interval = 24/perDayRate; //must limit user to intervals of 24: 1,2,3,4,6,8,12,24
  //for light num_interval is 6 (inteval increments by 6);
  //whatHrs[4] = [0,6,12,18]; //May want something more like this
  int i;
  for(i = 0; i < perDayRate; i++){
    if(i == 0){
      whatHrs[i] = 0;
    }
    else{
      whatHrs[i] = whatHrs[i-1] + num_interval;
    }
  }
  for(i = 0; i < perDayRate; i++){
      Serial.println(whatHrs[i]);
   }
}

  /*
  for(i = 0; i < 24; i++){
    if(i == 0){
      //Alarm.alarmRepeat(whatHrs[i],10,0, Light);  // Light represents the light collection function
      Alarm.alarmRepeat(whatHrs[i],15,0, WriteData);  //
      }
    else if(24%whatHrs[i] == 0){
      //Alarm.alarmRepeat(whatHrs[i],10,0, Light);  // Light represents the light collection function
      Alarm.alarmRepeat(whatHrs[i],15,0, WriteData);  // 
      }
  }
  */
void loop() {
  //digitalClockDisplay();
  //Alarm.delay(1000); // wait one second between clock display
  int currHr = hour();
  int currMin = minute();
  int currSec = second();
  int* data; 
  /*
    Go through the interval arrays for each type of sensor to see if there is a match with the current time
    If there is, then execute WriteData() with the correct parameters passed to it. 
  */
  if ( tempIntervals[currHr] ) {
    if ( currMin == 0 && currSec == 0 ) {
        //call CollectAllTempSensor( data, TEMPERATURE_SENSOR_COUNT );        
        WriteData( data, "temperatureData.csv", TEMPERATURE_SENSOR_COUNT, false ); 
    }
  }
  else {
    //do nothing
  }
}
/*
// functions to be called when an alarm triggers:
void Light() {
  //will call the Light function to read data
}
*/

void WriteData() {
  Serial.println("Called WriteData function");
}
/*
void WeeklyAlarm() {
  Serial.println("Alarm: - its Monday Morning");
}

void ExplicitAlarm() {
  Serial.println("Alarm: - this triggers only at the given date and time");
}
*/
/*
void digitalClockDisplay() {
  // digital clock display of the time
  Serial.print(hour());
  printDigits(minute());
  printDigits(second());
  Serial.println();
}

void printDigits(int digits) {
  Serial.print(":");
  if (digits < 10)
    Serial.print('0');
  Serial.print(digits);
}
*/
