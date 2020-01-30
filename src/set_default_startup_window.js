/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const globalVars = require("./global_vars.js");
const switchSSTstartup = require("./switch_sst_startup_window.js");
const settingsLib = require("./settings_lib.js");
const unRef = require("./primary_window.js"); //temp

/********************************************************************************
 *                             SET DEFAULT WINDOW                               *
 ********************************************************************************/

/*
 * @DESCRIPTION: Result when the user clicks the No button for turning off
 *               the message that asks the user if they want to set a default
 *               when SSTUI first is opened.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function messageNoClickEvent() {
  //If box checked toggle the popup to not show up next time
  if (document.getElementById("defaultCheckboxOff").checked) {
    settingsLib.setDefaultMessage("OFF");
  }

  //hide popup
  document.getElementById("setDefaultPopUp").style.zIndex = "-1";
  document.getElementById("setDefaultPopUp").style.opacity = "0";

  //make window for user to pick witch sst they want
  switchSSTstartup.createPickSSTwindowStartUp();
}

/*
 * @DESCRIPTION: Result when the user clicks the Yes button for turning off
 *               the message that asks the user if they want to set a default
 *               when SSTUI first is opened.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function messageYesClickEvent() {
  //update settings file and open the one they choose
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    checkingConfig = require(globalVars.configPathArray[i]);
    if (
      sstDropDown.value ===
      checkingConfig.programName + " " + globalVars.licenseArray[i]
    ) {
      currentSTTconfig = globalVars.configPathArray[i];
      settingsLib.setDefaultSST(globalVars.configPathArray[i]);
    }
  }

  //check if checkbox was checked
  if (document.getElementById("defaultCheckboxOff").checked) {
    settingsLib.setDefaultMessage("OFF");
  }

  //hide popup
  document.getElementById("setDefaultPopUp").style.zIndex = "-1";
  document.getElementById("setDefaultPopUp").style.opacity = "0";

  unRef.primaryWindow(currentSTTconfig);
}

/*
 * @DESCRIPTION: Create the necessary elements for the pop-up that asks
 *               the user if they want to set and default and what to.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function createDefaultMessagePopUp() {
  let setDefaultPopUp = document.createElement("div");
  setDefaultPopUp.setAttribute("id", "setDefaultPopUp");
  document.body.appendChild(setDefaultPopUp);

  let setDefaultLabel = document.createElement("label");
  setDefaultLabel.setAttribute("id", "setDefaultLabel");
  setDefaultLabel.innerHTML = "Welcome to Datalogics SSTUI";
  setDefaultPopUp.appendChild(setDefaultLabel);

  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  let setDefaultQ = document.createElement("label");
  setDefaultQ.setAttribute("id", "setDefaultQ");
  setDefaultQ.innerHTML = "Would you like to set a default?";
  setDefaultPopUp.appendChild(setDefaultQ);

  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  let sstDropDown = document.createElement("select");
  sstDropDown.setAttribute("id", "sstDropDown");
  setDefaultPopUp.appendChild(sstDropDown);
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    let anOption = document.createElement("option");
    anOption.setAttribute("id", "DDSelectDefault_" + String(i));
    aConfig = require(globalVars.configPathArray[i]);
    anOption.innerHTML = aConfig.programName + " " + globalVars.licenseArray[i];
    sstDropDown.appendChild(anOption);
  }

  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  let messageNoButton = document.createElement("button");
  messageNoButton.setAttribute("id", "messageNoButton");
  messageNoButton.innerHTML = "No";
  setDefaultPopUp.appendChild(messageNoButton);
  messageNoButton.addEventListener("click", messageNoClickEvent);

  let messageYesButton = document.createElement("button");
  messageYesButton.setAttribute("id", "messageYesButton");
  messageYesButton.innerHTML = "Yes";
  setDefaultPopUp.appendChild(messageYesButton);
  messageYesButton.addEventListener("click", messageYesClickEvent);

  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  setDefaultPopUp.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  let defaultCheckboxOff = document.createElement("input");
  defaultCheckboxOff.setAttribute("type", "checkbox");
  defaultCheckboxOff.setAttribute("id", "defaultCheckboxOff");
  setDefaultPopUp.appendChild(defaultCheckboxOff);

  let defaultMessageOffLabel = document.createElement("label");
  defaultMessageOffLabel.setAttribute("id", "defaultMessageOffLabel");
  defaultMessageOffLabel.innerHTML = "Never ask me again";
  setDefaultPopUp.appendChild(defaultMessageOffLabel);

  document.getElementById("setDefaultPopUp").style.zIndex = "3";
}

module.exports = {
  createDefaultMessagePopUp,
};
