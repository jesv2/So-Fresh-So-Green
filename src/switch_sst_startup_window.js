/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const globalVars = require("./global_vars.js");
const unRef = require("./primary_window.js"); //temp

/********************************************************************************
 *                           SWITCH SST WINDOW START UP                         *
 ********************************************************************************/

/*
 * @DESCRIPTION: Update settings file and open the one they choose.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function confirmSwitchStartUpClickEvent() {
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    checkingConfig = require(globalVars.configPathArray[i]);
    if (
      switchSSTdropDownStartUp.value ===
      checkingConfig.programName + " " + globalVars.licenseArray[i]
    ) {
      currentSTTconfig = globalVars.configPathArray[i];
    }
  }

  //close switch window
  document.getElementById("switchSSTwindowStartUp").style.zIndex = "-1";
  document.getElementById("switchSSTwindowStartUp").style.opacity = "0";

  unRef.primaryWindow(currentSTTconfig);
}

/*
 * @DESCRIPTION: Create the window that allows the user to pick which sst
 *               they want to open at startup if they did not want to set
 *               a default.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function createPickSSTwindowStartUp() {
  let switchSSTwindowStartUp = document.createElement("div");
  switchSSTwindowStartUp.setAttribute("id", "switchSSTwindowStartUp");
  document.body.appendChild(switchSSTwindowStartUp);

  if (globalVars.configPathArray.length !== 0) {
    let pleaseSeletSSTLabel = document.createElement("label");
    pleaseSeletSSTLabel.setAttribute("id", "whiteTextLabel");
    pleaseSeletSSTLabel.innerHTML = "Select which SST you would like to use.";
    switchSSTwindowStartUp.appendChild(pleaseSeletSSTLabel);

    switchSSTwindowStartUp.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );
    switchSSTwindowStartUp.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );

    //Drop down
    let switchSSTdropDownStartUp = document.createElement("select");
    switchSSTdropDownStartUp.setAttribute("id", "switchSSTdropDownStartUp");
    switchSSTwindowStartUp.appendChild(switchSSTdropDownStartUp);
    for (let i = 0; i < globalVars.configPathArray.length; i++) {
      let anOption = document.createElement("option");
      anOption.setAttribute("id", "DDSelectDefault_" + String(i));
      aConfig = require(globalVars.configPathArray[i]);
      anOption.innerHTML =
        aConfig.programName + " " + globalVars.licenseArray[i];
      switchSSTdropDownStartUp.appendChild(anOption);
    }

    switchSSTwindowStartUp.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );
    switchSSTwindowStartUp.appendChild(
      (temp = document.createElement("break")),
      (temp.innerHTML = "<br>"),
    );

    //Confirm button
    let confirmSwitchButton = document.createElement("button");
    confirmSwitchButton.setAttribute("id", "confirmSwitchButton");
    confirmSwitchButton.innerHTML = "Confirm";
    switchSSTwindowStartUp.appendChild(confirmSwitchButton);
    confirmSwitchButton.addEventListener(
      "click",
      confirmSwitchStartUpClickEvent,
    );
  } else {
    let notInstalledLabel = document.createElement("label");
    notInstalledLabel.setAttribute("id", "whiteTextLabel");
    notInstalledLabel.innerHTML = "You appear to not have any SSTs installed.";
    switchSSTwindowStartUp.appendChild(notInstalledLabel);
  }
}

module.exports = {
  createPickSSTwindowStartUp,
};
