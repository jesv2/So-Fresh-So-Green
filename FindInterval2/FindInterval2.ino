/*
 * Notes:
 * This could be an alternative to creating an array by using: 
 * Alarm.timerRepeat(seconds, Function)//calls Function every x amount of seconds
 * Issues/things that I'm not sure about:
 * -- Have to wait at least 1 second before calling FindIntervals
 * -- Documentation says that it calls once a day but I'm not sure if that's true
 */

#include <TimeLib.h>
#include <TimeAlarms.h>

AlarmId id;

void setup() {
  Serial.begin(9600);
  while (!Serial) ; // wait for Arduino Serial Monitor
  setTime(0,0,0,4,1,20); // set time to Wednesday 0:00:00am (12 am) April 1 2020
  // create the alarms, to trigger at specific times
  Alarm.alarmRepeat(0,0,1, FindIntervals); //should call FindIntervals function 
}

void loop() {
  digitalClockDisplay();
  Alarm.delay(1000); // wait one second between clock display
}

// functions to be called when an alarm triggers:
void FindIntervals(int perDayRate, int offset, int whatHrs[]){ //assumed offset = 0
  Serial.print("called FindIntervals");                                    
  perDayRate = 4;                                                            
  int num_interval = 24/perDayRate; //gives intervals in hours
                                    //must limit user to intervals of 24: 1,2,3,4,6,8,12,24
  int sec_interval = num_interval*3600; //gives interval in seconds
  Alarm.timerRepeat(sec_interval, WriteData);
}
void WriteData(){
  Serial.println("Called WriteData function");
}

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
