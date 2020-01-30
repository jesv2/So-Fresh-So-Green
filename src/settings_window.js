/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const globalVars = require("./global_vars.js");
const settingsLib = require("./settings_lib.js");

/********************************************************************************
 *                               SETTINGS WINDOW                                *
 ********************************************************************************/

/*
 * @DESCRIPTION: Modifies the settings file with the default the user selected.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function defaultChangeConfirm() {
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    checkingConfig = require(globalVars.configPathArray[i]);
    if (
      changeDefaultDropDown.value ===
      checkingConfig.programName + " " + globalVars.licenseArray[i]
    ) {
      settingsLib.setDefaultSST(globalVars.configPathArray[i]);
      document.getElementById("currentDefaultTextLabel").innerHTML =
        checkingConfig.programName + " " + globalVars.licenseArray[i];
    }
  }
  document.getElementById("settingsWindow").style.zIndex = "-1";
  document.getElementById("settingsWindow").style.opacity = "0";
}

/*
 * @DESCRIPTION: Clears out the default that was saved in the settings file.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function clearDefaultClickEvent() {
  settingsLib.setDefaultSST("null"); //update the settings.json
  document.getElementById("currentDefaultTextLabel").innerHTML = "None"; //update label
  document.getElementById("settingsWindow").style.zIndex = "-1";
  document.getElementById("settingsWindow").style.opacity = "0";
}

/*
 * @DESCRIPTION: Create the elements required to make the settings sub window.
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function createSettingsWindow() {
  let settingsWindow = document.createElement("div");
  settingsWindow.setAttribute("id", "settingsWindow");
  document.body.appendChild(settingsWindow);

  //Settings
  let settingsWindowLabel = document.createElement("label");
  settingsWindowLabel.setAttribute("id", "settingsWindowLabel");
  settingsWindowLabel.innerHTML = "Settings";
  settingsWindow.appendChild(settingsWindowLabel);

  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  //Current Default Label
  let currentDefaultLabel = document.createElement("label");
  currentDefaultLabel.setAttribute("id", "currentDefaultLabel");
  currentDefaultLabel.innerHTML = "Current Default: ";
  settingsWindow.appendChild(currentDefaultLabel);

  //Current Default Text
  let currentDefaultTextLabel = document.createElement("label");
  currentDefaultTextLabel.setAttribute("id", "currentDefaultTextLabel");

  if (settingsLib.getDefaultSST() !== "null")
    currentDefaultTextLabel.innerHTML = settingsLib.getDefaultSSTProgramName();
  else currentDefaultTextLabel.innerHTML = "none";

  settingsWindow.appendChild(currentDefaultTextLabel);

  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  //Change Default to:
  let changeDefaultLabel = document.createElement("label");
  changeDefaultLabel.setAttribute("id", "changeDefaultLabel");
  changeDefaultLabel.innerHTML = "Change Default to: ";
  settingsWindow.appendChild(changeDefaultLabel);

  //Drop Down
  let changeDefaultDropDown = document.createElement("select");
  changeDefaultDropDown.setAttribute("id", "changeDefaultDropDown");
  settingsWindow.appendChild(changeDefaultDropDown);
  for (let i = 0; i < globalVars.configPathArray.length; i++) {
    let anOption = document.createElement("option");
    anOption.setAttribute("id", "DDChangeDefault_" + String(i));
    aConfig = require(globalVars.configPathArray[i]);
    anOption.innerHTML = aConfig.programName + " " + globalVars.licenseArray[i];

    changeDefaultDropDown.appendChild(anOption);
  }

  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  //Confirm button
  let confirmChangeDefaultButton = document.createElement("button");
  confirmChangeDefaultButton.setAttribute("id", "confirmChangeDefaultButton");
  confirmChangeDefaultButton.innerHTML = "Confirm";
  settingsWindow.appendChild(confirmChangeDefaultButton);
  confirmChangeDefaultButton.addEventListener("click", defaultChangeConfirm);

  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );
  settingsWindow.appendChild(
    (temp = document.createElement("break")),
    (temp.innerHTML = "<br>"),
  );

  //Clear Default button
  let clearDefaultButton = document.createElement("button");
  clearDefaultButton.setAttribute("id", "clearDefaultButton");
  clearDefaultButton.innerHTML = "Clear Default";
  settingsWindow.appendChild(clearDefaultButton);
  clearDefaultButton.addEventListener("click", clearDefaultClickEvent);

  document.getElementById("settingsWindow").style.zIndex = "-1";
  document.getElementById("settingsWindow").style.opacity = "0";
}

module.exports = {
  createSettingsWindow,
};
