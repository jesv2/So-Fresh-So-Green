/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const fileSystemLib = require("./filesystem_control_lib.js");
const globalVars = require("./global_vars.js");

/*
 * @DESCRIPTION: Delete old settings file and replace it with a clean default
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function resetSettingsFileToDefault() {
  //"./settings/settings.json"
  console.log(globalVars.settingsFilePath);
  fileSystemLib.deleteFile(globalVars.settingsFilePath);
  createSettingsDefaultFile(globalVars.settingsFilePath);
}

/*
 * @DESCRIPTION: Create a settings file with the given path/name.
 * @PARAM filePath: Path that decides the location and name of a new default settings file.
 * @AUTHORS: Elizabeth Harasymiw
 */
function createSettingsDefaultFile() {
  fileSystemLib.createEmptyFile(globalVars.settingsFilePath);
  fileSystemLib.appendFileText(globalVars.settingsFilePath, "{\n");
  fileSystemLib.appendFileText(
    globalVars.settingsFilePath,
    '\t"nextrun":"null",\n',
  );
  fileSystemLib.appendFileText(
    globalVars.settingsFilePath,
    '\t"default":"null",\n',
  );
  fileSystemLib.appendFileText(
    globalVars.settingsFilePath,
    '\t"message":"ON",\n',
  );
  fileSystemLib.appendFileText(globalVars.settingsFilePath, '\t"paths": []\n');
  fileSystemLib.appendFileText(globalVars.settingsFilePath, "}");
}

/*
 * @DESCRIPTION: Checks if settings folder existences if not creates it
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function validateSettingsFolder() {
  if (!fileSystemLib.validateFileExist(globalVars.settingsFilePath)) {
    fileSystemLib.createEmptyFolder(globalVars.settingsFolderPath);
  }
}

/*
 * @DESCRIPTION: Checks if settings file existences if not creates a default settings.json
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function validateSettingsFile() {
  if (!fileSystemLib.validateFileExist(globalVars.settingsFilePath)) {
    createSettingsDefaultFile(globalVars.settingsFilePath);
  } else {
    if (!fileSystemLib.validateFileJSON(globalVars.settingsFilePath)) {
      resetSettingsFileToDefault();
    } else {
      let mySettings = require(globalVars.settingsFilePath);

      //validate nextrun param
      if (
        mySettings.nextrun !== null &&
        mySettings.nextrun !== "null" &&
        !fileSystemLib.validateFileExist(mySettings.nextrun)
      ) {
        mySettings.nextrun = "null";
        fileSystemLib.setFileText(
          globalVars.settingsFilePath,
          JSON.stringify(mySettings),
        );
      }
      //validate default param
      if (
        mySettings.default !== null &&
        mySettings.default !== "null" &&
        !fileSystemLib.validateFileExist(mySettings.default)
      ) {
        mySettings.default = "null";
        fileSystemLib.setFileText(
          globalVars.settingsFilePath,
          JSON.stringify(mySettings),
        );
      }
      //validate toggle for setting a default param
      if (mySettings.message !== "ON" && mySettings.message !== "OFF") {
        mySettings.message = "ON";
        fileSystemLib.setFileText(
          globalVars.settingsFilePath,
          JSON.stringify(mySettings),
        );
      }
      //validate that the paths array existence if not make it
      if (mySettings.paths === undefined || mySettings.paths === "undefined") {
        resetSettingsFileToDefault();
        //reload
        location.reload();
      }
    }
  }
}

/*
 * @DESCRIPTION: Update the settings.json with an array of paths to check
 * @PARAM anArrayOfPaths: An array of paths most likely gotten as a return from getWindowsPATH function
 * @AUTHORS: Elizabeth Harasymiw
 */
function updatePathSettings(anArrayOfPaths) {
  let mySettings = require(globalVars.settingsFilePath);

  for (let r = mySettings.paths.length; r !== 0; r--) mySettings.paths.pop();

  for (let i = 0; i < anArrayOfPaths.length; i++) {
    if (fileSystemLib.validateFileExist(anArrayOfPaths[i])) {
      let files = fileSystemLib.getReadDirObject(anArrayOfPaths[i]);
      //console.log("path \"" + anArrayOfPaths[i] + "\" is valid");
      for (let j = 0; j < files.length; j++) {
        if (files[j].includes("_config.json")) {
          //console.log("  - Config found: " + files[j]);
          mySettings.paths.push(anArrayOfPaths[i] + "\\" + files[j]);
        }
      }
    }
  }

  fileSystemLib.setFileText(
    globalVars.settingsFilePath,
    JSON.stringify(mySettings),
  );
}

/*
 * @DESCRIPTION: Sets the variable that tells SSTUI to open a specific SST first on open.
 * @PARAM sstConfigLocation:
 * @AUTHORS: Elizabeth Harasymiw
 */
function setDefaultSST(sstConfigLocation) {
  let mySettings = require(globalVars.settingsFilePath);
  mySettings.default = sstConfigLocation;
  fileSystemLib.setFileText(
    globalVars.settingsFilePath,
    JSON.stringify(mySettings),
  );
}

/*
 * @DESCRIPTION: Toggles the default message popup in the settings file
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function setDefaultMessage(newState) {
  let mySettings = require(globalVars.settingsFilePath);

  if (newState === "ON" || newState === "OFF") mySettings.message = newState;

  fileSystemLib.setFileText(
    globalVars.settingsFilePath,
    JSON.stringify(mySettings),
  );
}

/*
 * @DESCRIPTION: Getter for the default in settings.json
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getDefaultSST() {
  let mySettings = require(globalVars.settingsFilePath);
  return mySettings.default;
}

/*
 * @DESCRIPTION: Getter for the default in settings.json
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getDefaultSSTProgramName() {
  let mySettings = require(globalVars.settingsFilePath);
  if (mySettings.default != "null") {
    let aConfig = require(mySettings.default);
    return aConfig.programName;
  } else return "None";
}

/*
 * @DESCRIPTION: Getter for the default's license
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getDefaultLicense() {
  let mySettings = require(globalVars.settingsFilePath);
  let myLicense = "";

  if (mySettings.default != "null") {
    let files = fileSystemLib.getReadDirObject(
      fileSystemLib.getFolderPath(mySettings.default),
    );

    for (let i = 0; i < files.length; i++) {
      if (files[i].includes("_standard.lic")) {
        myLicense = "Standard";
      } else if (files[i].includes("_pro.lic")) {
        myLicense = "Pro";
      }
    }

    if (myLicense === "") {
      myLicense = "Premium";
    }
  }

  return myLicense;
}

/*
 * @DESCRIPTION: Getter for the boolean in settings.json to display whether the user wanted a reminder to set a default
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getDefaultMessage() {
  let mySettings = require(globalVars.settingsFilePath);
  return mySettings.message;
}

/*
 * @DESCRIPTION: set the next run data in settings.json
 * @PARAM nextRun: Either a path to the next sst to be open or null for no sst to be ran next
 * @AUTHORS: Elizabeth Harasymiw
 */
function setNextRun(nextRun) {
  let mySettings = require(globalVars.settingsFilePath); //update global?
  mySettings.nextrun = nextRun;
  fileSystemLib.setFileText(
    globalVars.settingsFilePath,
    JSON.stringify(mySettings),
  );
}

/*
 * @DESCRIPTION: fetch the next run data from settings.json
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getNextRun() {
  let mySettings = require(globalVars.settingsFilePath);
  return mySettings.nextrun;
}

module.exports = {
  validateSettingsFolder,
  validateSettingsFile,
  updatePathSettings,
  setDefaultSST,
  setDefaultMessage,
  getDefaultSST,
  getDefaultSSTProgramName,
  getDefaultLicense,
  getDefaultMessage,
  setNextRun,
  getNextRun,
};
