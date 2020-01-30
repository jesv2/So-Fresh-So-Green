/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const path = require("path");
const filesystemLib = require("./filesystem_control_lib.js");

/********************************************************************************
 *                                  GlOBALS                                     *
 ********************************************************************************/
// Variables for keeping track of ssts installed on the users system
let windowsPATHarray;
let configPathArray;
let programPathArray;
let licenseArray;
let exePath;
setConfigPaths();

// Variable for keeping track of the location of folder and files sstui creates and edits
let workingPath; // This is the folder that contains the exe file at runtime
let settingsFolderPath; // Location of settings folder
let settingsFilePath; // Location of settings.json
let saveFolderPath; // Location of save folder
setPathDefaults();

/********************************************************************************
 *                         Path setters and getters                             *
 ********************************************************************************/

/*
 * @DESCRIPTION: Set all variables related to the location of sst configuration files.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function setConfigPaths() {
  windowsPATHarray = filesystemLib.getWindowsPATH();
  configPathArray = filesystemLib.getConfigPaths(windowsPATHarray);
  programPathArray = filesystemLib.getProgramPaths(windowsPATHarray);
  licenseArray = filesystemLib.populateLicenseArray(programPathArray);
  exePath = filesystemLib.getExePaths(programPathArray);
}

/*
 * @DESCRIPTION: Set all variables related to working directory of the SSTUI's location.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function setPathDefaults() {
  workingPath = path.resolve(".");
  settingsFolderPath = workingPath + "\\settings";
  settingsFilePath = settingsFolderPath + "\\settings.json";
  saveFolderPath = workingPath + "\\save";
}

/*
 * @DESCRIPTION: Set the working path variables to the given path.
 * @PARAM path: The path the working path will be changed to.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setWorkingPath(path) {
  workingPath = path;
}

/*
 * @DESCRIPTION: Set the variable that represents the location of the settings folder to the given path.
 * @PARAM path: The path the setting folder would be assumed to be at.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setSettingsFolderPath(path) {
  settingsFolderPath = path;
}

/*
 * @DESCRIPTION: Set the variable that represents the location of the settings file to the given path.
 * @PARAM path: The path the setting file would be assumed to be at.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setSettingsFilePath(path) {
  settingsFilePath = path;
}

/*
 * @DESCRIPTION: Set the variable that represents the location of the save folder to the given path.
 * @PARAM path: The path the save folder would be assumed to be at.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setSaveFolderPath(path) {
  saveFolderPath = path;
}

/********************************************************************************
 *                                 DOM VARS                                     *
 ********************************************************************************/
let resize = document.getElementById("cmdColl");
let retSST = document.getElementById("retColl");

/********************************************************************************
 *                          MAKING DIVS COLLAPSIBLE                             *
 ********************************************************************************/
resize.onclick = function() {
  let div = document.getElementById("runWindowLabel");
  let cmdWin = document.getElementById("runWindowInfo");
  if (resize.innerHTML == "+") {
    console.log("grow");
    resize.innerHTML = "-";
    cmdWin.style.height = "210px";
    div.style.height = " 200px";
    div.style.zIndex = "1";
  } else {
    console.log("shrink");
    resize.innerHTML = "+";
    div.style.height = "50px";
    cmdWin.style.height = "60px";
    div.style.zIndex = "0";
  }
};

retSST.onclick = function() {
  let label = document.getElementById("retInfoLabel");
  let infoWin = document.getElementById("returnInfo");
  if (retSST.innerHTML == "+") {
    console.log("grow");
    retSST.innerHTML = "-";
    label.style.zIndex = "2";
    label.style.height = "500px";
    infoWin.style.height = "480px";
    label.style.bottom = "0px";
  } else {
    console.log("shrink");
    retSST.innerHTML = "+";
    label.style.height = "50px";
    infoWin.style.height = "200px";
    infoWin.style.bottom = "0px";
    label.style.zIndex = "0";
    label.style.bottom = "183px";
  }
};

/********************************************************************************
 *                             Variable Export                                   *
 *********************************************************************************/
module.exports = {
  //config location exports
  windowsPATHarray,
  configPathArray,
  programPathArray,
  licenseArray,
  exePath,
  setPathDefaults,
  //Path exports
  workingPath,
  settingsFolderPath,
  settingsFilePath,
  saveFolderPath,
  //DOM exports
  resize,
  retSST,
};
