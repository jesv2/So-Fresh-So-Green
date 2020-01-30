/********************************************************************************
 *                                  IMPORTS                                      *
 *********************************************************************************/
const globalVars = require("./src/global_vars.js");
const switchSSTstartup = require("./src/switch_sst_startup_window.js");
const switchSSTruntime = require("./src/switch_sst_runtime_window.js");
const settingsWindow = require("./src/settings_window.js");
const pickDefaultWindow = require("./src/set_default_startup_window.js");
const unRef = require("./src/primary_window.js"); //temp
const settingsLib = require("./src/settings_lib.js");
const saveLoadLib = require("./src/save_load_lib.js");

/********************************************************************************
 *                                Render Logic                                   *
 *********************************************************************************/
//settingsLib.setSettingsVariables(globalVars.settingsFilePath);
settingsLib.validateSettingsFolder();
settingsLib.validateSettingsFile();
saveLoadLib.validateSaveFolder();

if (globalVars.configPathArray.length <= 0) {
  //error: you don't have any ssts installed
  switchSSTstartup.createPickSSTwindowStartUp();
} else {
  if (settingsLib.getNextRun() != "null") {
    //switch sst
    unRef.primaryWindow(String(settingsLib.getNextRun()));
    settingsLib.setNextRun("null");
  } else {
    //first startup
    if ("null" == settingsLib.getDefaultSST()) {
      //no default set
      if (globalVars.configPathArray.length == 1) {
        //open sst if only one installed
        unRef.primaryWindow(String(globalVars.configPathArray[0]));
      } else if (settingsLib.getDefaultMessage() == "ON") {
        //ask user if they want to set a default
        pickDefaultWindow.createDefaultMessagePopUp();
      } else switchSSTstartup.createPickSSTwindowStartUp(); //ask user to pick which sst to open
    } else {
      //open default
      unRef.primaryWindow(String(settingsLib.getDefaultSST()));
    }
  }
}

/*
 * Populate all HTML elements in index.html with their functionality
 */
switchSSTruntime.createPickSSTwindowRunTime();
settingsWindow.createSettingsWindow();
