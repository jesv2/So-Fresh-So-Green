
/* setup() function which initializes the SD card (might not need) 
 *  WriteSD() 
 *  Assume the following:
    1. We all know all the pin configurations
    2. We all the frequency of data collection
 */

#include <SPI.h>
#include <SD.h>

File myFile;
const int pinCS = 53;

const int n = 10; 
const String testName = "datatest";
int testData[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

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

  bool success = WriteData(testData, testName, n, false); 
}

bool WriteData( int inputData[], String fileName, int count, bool newFile ){ //didn't use newFile
  //same stuff inside 
    myFile = SD.open( fileName + ".csv", FILE_WRITE); //open csv file to write in
    if(myFile){                                         //checks to see if opened correctly
      for (int i = 0; i < count; i++ ) {
       myFile.print( String(inputData[i]) + ',' ); //might end up adding ascii value of comma
       Serial.write( inputData[i] + ',' ); //writes same val. to serial monitor (use for debugging)
      }
      myFile.print('\n');
      myFile.close();
      return true; 
    }
    else{
      Serial.println("Could not open csv file");
      return false;
      }
}
void loop() { //need to include this or else error w/ multiple libraries will occur
  // nothing happens after setup
}
