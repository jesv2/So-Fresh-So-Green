/*
 * Notes: (Possibly delete before pushing)
 * Added "Time" library
 * Added "TimeAlarms" Library
 * Link to use TimeAlarm library: https://www.pjrc.com/teensy/td_libs_TimeAlarms.html
 * To figure out how functions work, use:
 * File - > example -> TimeAlarms
 */


#include <TimeLib.h>
#include <TimeAlarms.h>

AlarmId id;

void setup() {
  Serial.begin(9600);
  while (!Serial) ; // wait for Arduino Serial Monitor
  setTime(0,0,0,4,1,20); // set time to Wednesday 0:00:00am (12 am) April 1 2020
}

FindIntervals(int perDayRate, int offset, bool whatHrs[24]){      //deleted int size because I assumed that it would always be 24 hrs
                                                                //assumed offset = 0
                                                                
  num_interval = 24/perDayRate; //must limit user to intervals of 24: 1,2,3,4,6,8,12,24
  //
  //for light num_interval is 4;
  //whatHrs = [0,6,12,18]; //May want something more like this
  //whatHrs[24] = [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0]; //I'm kind of going w/ this right now
  for(int i = 0; i < 24; i++){
    if(i = 0){
      whatHrs[i] = 1;
    }
    if() 
    whatHrs[i] == num_interval
    }
// create the alarms, to trigger at specific times
  for(i = 0; i < 24; i++){
    if(24%whatHrs[i] == 0){
      Alarm.alarmRepeat(whatHrs[i],00,0, Light);  // Light represents the light collection function
      Alarm.alarmRepeat(whatHrs[i],00,0, WriteData);  // 
      }
  }
  //Alarm.alarmRepeat(dowSaturday,8,30,30,WeeklyAlarm);  // 8:30:30 every Saturday; use this for the weekly sensors (e.g. pH)

}
void loop() {
  digitalClockDisplay();
  Alarm.delay(1000); // wait one second between clock display
}

// functions to be called when an alarm triggers:
void Light() {
  //will call the Light function to read data
}
/*
void EveningAlarm() {
  Serial.println("Alarm: - turn lights on");
}

void WeeklyAlarm() {
  Serial.println("Alarm: - its Monday Morning");
}

void ExplicitAlarm() {
  Serial.println("Alarm: - this triggers only at the given date and time");
}
*/
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
