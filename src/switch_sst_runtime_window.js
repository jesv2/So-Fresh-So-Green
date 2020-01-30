/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const globalVars = require("./global_vars.js");
const settingsLib = require("./settings_lib.js");

/********************************************************************************
 *                          SWITCH SST WINDOW RUN TIME                          *
 ********************************************************************************/

/*
 * @DESCRIPTION: Closes the switch sst window as a result of the user pressing
 *               the cancel button.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function cancelSwitchRunTimeClickEvent() {
  switchsstbuttonBOOL = false;

  //close switch window
  document.getElementById("switchSSTwindowRunTime").style.zIndex = "-1";
  document.getElementById("switchSSTwindowRunTime").style.opacity = "0";
}

/*
 * @DESCRIPTION: Restarts the program and opens the sst the user wanted.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function confirmSwitchRunTimeClickEvent() {
  switchsstbuttonBOOL = false;
  let savedPath;

  //update settings file and open the one they choose
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    checkingConfig = require(globalVars.configPathArray[i]);
    if (
      switchSSTdropDownRunTime.value ===
      checkingConfig.programName + " " + globalVars.licenseArray[i]
    ) {
      currentSTTconfig = require(globalVars.configPathArray[i]);
      savedPath = globalVars.configPathArray[i];
    }
  }

  //close switch window
  document.getElementById("switchSSTwindowRunTime").style.zIndex = "-1";
  document.getElementById("switchSSTwindowRunTime").style.opacity = "0";

  settingsLib.setNextRun(savedPath);

  //reload
  location.reload();
}

/*@DESCRIPTION: Returns the path of the executable of the current SST.
 *@PARAM currSST: current sst being used
 *@AUTHORS: Dayana Roa-Tapia
 */
function currentSSTexe(currSST) {
  let sst;
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    let config = globalVars.configPathArray[i];
    if (currSST == config) {
      sst = globalVars.exePath[i];
    }
  }
  return sst;
}

/*
 * @DESCRIPTION: Create the sub window that lets the user pick which sst
 *               they want to switch to. When first created it is default to
 *               hidden.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function createPickSSTwindowRunTime() {
  let switchSSTwindowRunTime = document.createElement("div");
  switchSSTwindowRunTime.setAttribute("id", "switchSSTwindowRunTime");
  document.body.appendChild(switchSSTwindowRunTime);

  if (globalVars.configPathArray.length !== 1) {
    let pleaseSeletSSTLabel = document.createElement("label");
    pleaseSeletSSTLabel.setAttribute("id", "whiteTextLabel");
    pleaseSeletSSTLabel.innerHTML = "Select which SST you would like to use.";
    switchSSTwindowRunTime.appendChild(pleaseSeletSSTLabel);

    switchSSTwindowRunTime.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );
    let warningSeletSSTLabel = document.createElement("label");
    warningSeletSSTLabel.setAttribute("id", "whiteTextLabel");
    warningSeletSSTLabel.innerHTML =
      "Warning: the current SST form will be deleted if you confirm.";
    switchSSTwindowRunTime.appendChild(warningSeletSSTLabel);

    switchSSTwindowRunTime.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );
    switchSSTwindowRunTime.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );

    //Drop down
    let switchSSTdropDownRunTime = document.createElement("select");
    switchSSTdropDownRunTime.setAttribute("id", "switchSSTdropDownRunTime");
    switchSSTwindowRunTime.appendChild(switchSSTdropDownRunTime);
    for (let i = 0; i < globalVars.configPathArray.length; i++) {
      let anOption = document.createElement("option");
      anOption.setAttribute("id", "DDSelectDefault_" + String(i));
      aConfig = require(globalVars.configPathArray[i]);
      anOption.innerHTML =
        aConfig.programName + " " + globalVars.licenseArray[i];
      switchSSTdropDownRunTime.appendChild(anOption);
    }

    switchSSTwindowRunTime.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );
    switchSSTwindowRunTime.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );

    //Cancel Button
    let cancelSwitchButton = document.createElement("button");
    cancelSwitchButton.setAttribute("id", "cancelSwitchButton");
    cancelSwitchButton.innerHTML = "Cancel";
    switchSSTwindowRunTime.appendChild(cancelSwitchButton);
    cancelSwitchButton.addEventListener("click", cancelSwitchRunTimeClickEvent);

    //Confirm button
    let confirmSwitchButton = document.createElement("button");
    confirmSwitchButton.setAttribute("id", "confirmSwitchButton");
    confirmSwitchButton.innerHTML = "Confirm";
    switchSSTwindowRunTime.appendChild(confirmSwitchButton);
    confirmSwitchButton.addEventListener(
      "click",
      confirmSwitchRunTimeClickEvent,
    );
  } else {
    let notInstalledLabel = document.createElement("label");
    notInstalledLabel.setAttribute("id", "whiteTextLabel");
    notInstalledLabel.innerHTML = "You only have one SST installed";
    switchSSTwindowRunTime.appendChild(notInstalledLabel);
  }

  document.getElementById("switchSSTwindowRunTime").style.zIndex = "-1";
  document.getElementById("switchSSTwindowRunTime").style.opacity = "0";
}

module.exports = {
  createPickSSTwindowRunTime,
  currentSSTexe,
};
