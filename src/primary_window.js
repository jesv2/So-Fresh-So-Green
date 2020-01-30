/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const fileSystemLib = require("./filesystem_control_lib.js");
const settingsLib = require("./settings_lib.js");
const DOMsystemLib = require("./dom_control_lib.js");
const {dialog} = require("electron").remote;
const saveLoadLib = require("./save_load_lib.js");

/********************************************************************************
 *                                   GLOBALS                                     *
 ********************************************************************************/
let currentSTTpath;
let run = document.getElementById("runbutton");
let clear = document.getElementById("clearButton");
let headerDiv = document.getElementById("greet");
let currSST = document.getElementById("sstname");
let trays = document.getElementById("prntTry");
let runWindow = document.getElementById("runWindowInfo");
let paramWindow = document.getElementById("paramWindowInfo"); //PARAMETER INFO WINDOW

let isRunButtonReady = false;
let cmd = []; //store command line parameters to display in run command window
let fileArray = []; //file name objects for keeping order of parameters
let elemArray = []; //holds all input elements as objects

/*
 * @DESCRIPTION: Setter for the path to the current sst configuration.
 * @PARAM STTpath: Current path to the sst configuration file.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setCurrentSTTpath(STTpath) {
  currentSTTpath = STTpath;
}

/********************************************************************************
 *                  FUNTION TO RETRIEVE USED ELEMENT VALUES                     *
 ********************************************************************************/

/*
    isForSave indicates that we're generating a command that will include extra information
    for the load feature. The command will include the parameter name in situations where the
    parameter name doesn't actually show up in the command we send to execFile i.e. most of
    the ones that are file names. The parameter name is necessary for the load feature
    so that we can use getElementById() in order to gain access to a specific element.
  */

/*
    Colons are being used instead of dashes to indicate that something is a parameter keyword for
    the save feature because dashes are allowed in file names.
  */

  /*
 * @DESCRIPTION: Retrieves the input data from an element.
 * @PARAMS: isForSave^
 * @AUTHORS: Dayana Roa-Tapia, Peter Chen
 */

function retrieveElemVal(isForSave) {
  let configData = require(currentSTTpath);
  let arr = [];
  let isRange;

  if (fileArray[0] !== undefined && fileArray[0] !== null) {
    //console.log("Checking what fileArray is: " + typeof(fileArray));
    let stringForCheckingIfRange = String(Object.values(fileArray[0]));
    isRange = stringForCheckingIfRange.includes("range");
    /* This solution to the problem might cause another problem */
    /* What happens if we're not running the range parameter, but the file name has range? */
  }
  if (isForSave) {
    arr.push(configData.programName);
  }

  //console.log("At the start of RetrieveElemVal and fileArray is: ");
  //console.log(fileArray);
  //console.log(elemArray);

  for (let i = 0, length = elemArray.length; i < length; i++) {
    if (configData.params[i].id === "fileName" && elemArray[i].used == true) {
      for (let j = 0, fileCount = fileArray.length; j < fileCount; j++) {
        if (isForSave && !isRange) {
          arr.push("<" + configData.params[i].cmd);
        }
        if (isForSave && isRange) {
          fileArray[j].range = "<" + fileArray[j].range;
          arr.push(Object.values(fileArray[j]));
          fileArray[j].range = fileArray[j].range.replace("<", "");
        } else {
          arr.push(Object.values(fileArray[j]));
        }

        //console.log("FileArray loop, the array accepting fileArray's file is: " + arr);
      }

      //console.log("After pushing fileArray into arr, arr is: ");
      //console.log(arr);
    } else if (
      configData.params[i].cmd.includes("=") == true &&
      elemArray[i].used == true
    ) {
      if (elemArray[i].id != "range") {
        if (isForSave) {
          arr.push(
            configData.params[i].cmd.replace("-", "<") +
              elemArray[i].element.value,
          );
        } else {
          arr.push(configData.params[i].cmd + elemArray[i].element.value);
        }
      }
    } else if (
      /*this scenario is when the parameter only needs the value so something like "executableName parameterValue" as oppose to "executableName -parameterName parameterValue" */
      !configData.params[i].cmd.includes("=") &&
      !configData.params[i].cmd.includes("-") &&
      elemArray[i].used == true
    ) {
      if (isForSave) {
        arr.push("<" + configData.params[i].cmd, elemArray[i].element.value);
      } else {
        // console.log("Current element id: " + elemArray[i].element.id);
        // console.log(typeof(elemArray[i].element.value));
        // console.log("Current element value: " + elemArray[i].element.value);
        arr.push(elemArray[i].element.value);
      }
    } else if (
      configData.params[i].justParameter == false &&
      elemArray[i].used == true
    ) {
      if (isForSave) {
        arr.push(
          configData.params[i].cmd.replace("-", "<"),
          elemArray[i].element.value,
        );
      } else {
        arr.push(configData.params[i].cmd, elemArray[i].element.value);
      }
    } else if (
      configData.params[i].justParameter == true &&
      elemArray[i].used == true
    ) {
      if (isForSave) {
        arr.push(configData.params[i].cmd.replace("-", "<"));
      } else {
        arr.push(configData.params[i].cmd);
      }
    }
  }
  let cmdArr = [];
  for (let a = 0; a < arr.length; a++) {
    if (Array.isArray(arr[a])) {
      for (let r = 0; r < arr[a].length; r++) {
        if (arr[a][r] != "") {
          cmdArr.push(arr[a][r]);
        }
      }
    } else {
      cmdArr.push(arr[a]);
    }
  }
  // console.log("cmdArr:"+cmdArr);
  if (!isForSave) {
    runWindow.innerHTML =
      "cmd: " + configData.programName + " " + cmdArr.join("   ");
    runWindow.appendChild(clear);
  }
  return cmdArr;
}

/*
 * @DESCRIPTION: Function to create/populate menu options with dummy data.
 * @PARAMS: none
 * @AUTHORS: Dayana Roa-Tapia
 */
function createMenu() {
  let configData = require(currentSTTpath);
  let clicked;
  let params = configData.params; //SCROLLING MENU
  let paramWindow = document.getElementById("paramWindowInfo"); //PARAMETER INFO WINDOW
  for (let i = 0; i < params.length; i++) {
    let optionItem = document.createElement("A");
    optionItem.setAttribute("id", params[i].label.replace(/\s+/g, ""));
    optionItem.innerHTML = params[i].label;

    let menuDiv = document.getElementById("menu"); //SCROLLING MENU  //create the div to hold the menu
    menuDiv.appendChild(optionItem);
    /*******************************ADDING ACTION LISTENERS*****************************/
    createInputElem(
      i,
      params[i].element,
      params[i].elementType,
      params[i].critical,
      params[i].value,
    );

    document.getElementById(
      params[i].label.replace(/\s+/g, ""),
    ).onclick = () => {
      if (document.getElementById("cmdColl").innerHTML == "-") {
        document.getElementById("cmdColl").click();
      }
      if (document.getElementById("retColl").innerHTML == "-") {
        document.getElementById("retColl").click();
      }

      if (
        clicked != null &&
        document.getElementById(params[i].label.replace(/\s+/g, "")) != clicked
      ) {
        clicked.setAttribute("class", "inactive");
      }
      clicked = document.getElementById(params[i].label.replace(/\s+/g, ""));
      clicked.setAttribute("class", "active");
      updateParamInfo(i, params[i].id);

      // handling the --showtrays option for pdf to print
      if (params[i].label == "Tray") {
        let trays = document.createElement("BUTTON");
        trays.innerHTML = "--showtrays";
        trays.setAttribute("id", "trays");
        paramWindow.appendChild(trays);
        let printerTrays = document.createElement("input");
        printerTrays.setAttribute("type", "text");
        printerTrays.setAttribute("id", "prntTry");
        printerTrays.setAttribute("placeholder", "tray ID value");

        trays.onclick = function() {
          console.log("trays");
          let child = require("child_process");
          child.exec("start cmd.exe /K pdf2print --showtrays");
          paramWindow.appendChild(printerTrays);

          printerTrays.addEventListener("keyup", function(event) {
            if (event.keyCode === 13 && printerTrays.value.length > 0) {
              for (let j = 0; j < elemArray.length; j++) {
                if (elemArray[j].id == "tray") {
                  let trayOpt = document.createElement("option");
                  trayOpt.value = printerTrays.value;
                  trayOpt.text = printerTrays.value;
                  elemArray[j].element.add(
                    trayOpt,
                    elemArray[j].element[elemArray[j].element.length],
                  );
                  let len = elemArray[j].element.length;
                  elemArray[j].element.selectedIndex = len - 1;
                  elemArray[j].element.click();
                  console.log(len);
                  retrieveElemVal();
                  printerTrays.value = "";
                  break;
                }
              }
            }
          });
        };
      }
      if (params[i].label == "Range") {
        rangeParam(i);
      }
    };
  }
}

/*
 * @DESCRIPTION: Seperates required input elements from optional on SSTUI
 * @PARAM label: The id of the DOM element being placed
 * @AUTHORS: Dayana Roa-Tapia
 */
function separateByRequired(label) {
  let paramWindow = document.getElementById("paramWindowInfo"); //PARAMETER INFO WINDOW
  for (let i = 0; i < elemArray.length; i++) {
    if (
      label === elemArray[i].id &&
      elemArray[i].crit == false &&
      elemArray[i].id != "range"
    ) {
      paramWindow.append(elemArray[i].element);
    }
  }
}

/*
 * @DESCRIPTION:
 * @PARAM num:
 * @AUTHORS:
 */
function updateParamInfo(num) {
  let configData = require(currentSTTpath);
  let paramWindow = document.getElementById("paramWindowInfo"); //PARAMETER INFO WINDOW
  let paramLabel = document.getElementById("paramWindowLabel"); //PARAMETER INFO WINDOW
  if (num >= 0) {
    paramWindow.innerHTML = configData.params[num].info + "<br><br><br>";
    paramLabel.innerHTML = configData.params[num].label + " Information";
  } else {
    paramWindow.innerHTML = configData.description;
    paramLabel.innerHTML = "Welcome to " + configData.programName;
  }

  // paramWindow.setAttribute("id", "paramWindowInfo");
  // paramLabel.setAttribute("id", "paramWindowLabel");
  paramLabel.appendChild(paramWindow);
  document.body.appendChild(paramLabel);

  if (num > -1) {
    separateByRequired(configData.params[num].id);
  }
}

/*
 * @DESCRIPTION: Creates all the DOM input elements according to config file
 * @PARAM index: Index of option n params[] to create element for
 * @PARAM elem: Kind of DOM element to be created 
 * @PARAM elemType: Kind of input the element takes
 * @PARAM critical: Boolean that determines whether an input its required 
 * @PARAM val: Default value of element. Set in config file
 * @AUTHORS: Dayana Roa-Tapia
 */
function createInputElem(index, elem, elemType, critical, val) {
  let run = document.getElementById("runbutton");
  let configData = require(currentSTTpath);
  const reqLabel = document.getElementById("reqLabel"); //DIV FOR REQUIRED
  let params = configData.params;
  let inputElem = document.createElement(elem);
  inputElem.setAttribute("id", params[index].id);
  let newElem = {};

  // creating slector options if elem === select
  if (elem === "select") {
    for (let i = 0; i < configData.params[index].options.length; i++) {
      let selOpt = document.createElement("option");

      selOpt.setAttribute("value", configData.params[index].options[i]);
      selOpt.innerHTML = configData.params[index].options[i];
      inputElem.appendChild(selOpt);
    }
    newElem = {
      id: params[index].id,
      element: inputElem,
      crit: critical,
      type: elem,
      used: false,
      label: params[index].label,
    };
    inputElem.onchange = () => {
      selectGetVal(inputElem, index);
    };
  } else {
    // creating types of input elements
    switch (elemType) {
      case "text":
        inputElem.setAttribute("type", "text");
        inputElem.setAttribute("placeholder", configData.params[index].label);
        newElem = {
          id: params[index].id,
          element: inputElem,
          crit: critical,
          type: elemType,
          used: false,
          label: params[index].label,
        };

        inputElem.onclick = () => {
          textBoxGetVal(inputElem, params[index].cmd, index);
        };
        // inputElem.addEventListener("keyup", () => {
        //   if (inputElem.value != "") {
        //     elemArray[index].used = true;
        //     isRunButtonReady = EnableRunButton(isRunButtonReady, run);
        //   }
        // });
        break;

      case "checkbox":
        let lbl = document.createElement("label");
        lbl.setAttribute("class", "switch");
        let slider = document.createElement("span");
        slider.setAttribute("class", "slider");
        slider.setAttribute("id", "slider");
        inputElem.setAttribute("type", "checkbox");
        if (val) {
          inputElem.value = false;
          lbl.value = false;
        } else {
          lbl.value = true;
          inputElem.value = true;
        }
        lbl.appendChild(inputElem);
        lbl.append(slider);
        newElem = {
          id: params[index].id,
          element: lbl,
          crit: critical,
          type: elemType,
          used: false,
          label: params[index].label,
        };
        inputElem.onclick = () => {
          checkBoxGetVal(lbl, index);
        };
        break;
    }
  }
  if (critical === true) {
    reqLabel.appendChild(inputElem);
    inputElem.addEventListener("click", () => {
      isRunButtonReady = EnableRunButton(run);
    });
  }
  elemArray.push(newElem);
}

//////////////////////////////////////////////////////////////
// FUNCTION TO DISABLE MENU OPTIONS WHEN THEY CAN'T BE USED //
/////////////////////////////////////////////////////////////
/*
 * @DESCRIPTION: Sets the mutExSet option from config file which disables 
 *               options that cannot be used with current option
 * @PARAM index: Index of current option in params[] 
 * @PARAM params: params[] from config file
 * @AUTHORS: Dayana Roa-Tapia
 */

function mutExParams(index, params) {
  if (params[index].mutExSet.length > 0) {
    for (let m = 0; m < params[index].mutExSet.length; m++) {
      if (elemArray[index].used == true) {
        console.log("mutEx: " + params[index].mutExSet[m]);
        document.getElementById(params[index].mutExSet[m]).style.pointerEvents =
          "none";

        document
          .getElementById(params[index].mutExSet[m])
          .setAttribute("class", "disabled");
        // document.getElementById(params[index].mutExSet[m]).style.cursor = "default";
      } else if (elemArray[index].used == false) {
        document
          .getElementById(params[index].label.replace(/\s+/g, ""))
          .style.removeProperty("pointer-events");
        document
          .getElementById(params[index].mutExSet[m])
          .style.removeProperty("pointer-events");

        document
          .getElementById(params[index].mutExSet[m])
          .setAttribute("class", "");
      }
    }
  }
}

/*
 * @DESCRIPTION: Text box event handler function
 * @PARAM element: Text box element being used
 * @PARAM command: Not used
 * @PARAM index: Index of current option in params[] 
 * @AUTHORS: Dayana Roa-Tapia
 */
let clicks = 0;
function fileClicks() {
  clicks = 0;
}
function textBoxGetVal(element, command, index) {
  let configData = require(currentSTTpath);
  const depath = require("path");
  let params = configData.params;
  if (params[index].file === true) {
    let options = {
      defaultPath: depath.resolve("\\Documents") + "\\",
      properties: ["openFile"],
    };
    if (params[index].createFile === true) {
      options.properties.push("promptToCreate");
    }
    if (params[index].repeatable === true) {
      options.properties.push("multiSelections");
    }
    document.getElementById(params[index].label.replace(/\s+/g, "")).click();
    const {dialog} = require("electron").remote;
    let path;
    clicks++;
    let canceled = false;
    if (path == undefined && clicks == 1) {
      path = dialog.showOpenDialog(options);
      if (path == undefined) {
        canceled = true;
      }
    }
    if (canceled == true) {
      event.preventDefault();
      canceled = false;
    }
    setTimeout(fileClicks, 500);
    if (path) {
      elemArray[index].used = true;
      document.getElementById(
        params[index].label.replace(/\s+/g, ""),
      ).innerHTML = "<span>\u2022\t</span>" + params[index].label;
      for (let i = 0; i < path.length; i++) {
        let file = {};
        element.value = path[i];
        file.range = "";
        file.name = path[i];
        if (params[index].repeatable || fileArray.length == 0) {
          fileArray.push(file);
        } else {
          fileArray[0] = file;
        }
        //console.log(fileArray);
        retrieveElemVal();
      }
      mutExParams(index, params);
      retrieveElemVal();
    }
  } else if (params[index].directory === true) {
    let outDir;
    let options = {
      properties: ["openDirectory"],
    };
    if (params[index].repeatable === true) {
      options.properties.push("multiSelections");
    }
    document.getElementById(params[index].label.replace(/\s+/g, "")).click();
    let path;
    clicks++;
    let canceled = false;
    if (path == undefined && clicks == 1) {
      path = dialog.showOpenDialog(options);
      if (path == undefined) {
        canceled = true;
      }
    }
    if (canceled == true) {
      event.preventDefault();
      canceled = false;
    }
    setTimeout(fileClicks, 1000);
    if (path) {
      elemArray[index].used = true;
      document.getElementById(
        params[index].label.replace(/\s+/g, ""),
      ).innerHTML = "<span>\u2022\t</span>" + params[index].label;
      let length = path.length;
      if (params[index].cmd !== "-fontlist=") {
        for (let counter = 0; counter < length; counter++) {
          path[counter] = path[counter] + "\\"; //
        }
      }
      outDir = path.join(";");
      element.value = outDir;
      console.log("outDir: " + outDir);
      mutExParams(index, params);
      retrieveElemVal();
    }
  } else {
    element.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        elemArray[index].used = true;
        document.getElementById(
          params[index].label.replace(/\s+/g, ""),
        ).innerHTML = "<span>\u2022\t</span>" + params[index].label;
        if (
          element.value.length != 0 &&
          params[index].file !== true &&
          params[index].directory !== true
        ) {
          mutExParams(index, params);
          retrieveElemVal();
        } else {
          elemArray[index].used = false;
          mutExParams(index, params);
          document.getElementById(
            params[index].label.replace(/\s+/g, ""),
          ).innerHTML = params[index].label;
        }
        isRunButtonReady = EnableRunButton(run);
      }
    });
    // if(element.value != ""){
    element.onblur = function() {
      elemArray[index].used = true;
      document.getElementById(
        params[index].label.replace(/\s+/g, ""),
      ).innerHTML = "<span>\u2022\t</span>" + params[index].label;
      if (
        element.value.length != 0 &&
        params[index].file !== true &&
        params[index].directory !== true
      ) {
        mutExParams(index, params);
        retrieveElemVal();
      } else {
        elemArray[index].used = false;
        mutExParams(index, params);
        document.getElementById(
          params[index].label.replace(/\s+/g, ""),
        ).innerHTML = params[index].label;
      }
      isRunButtonReady = EnableRunButton(run);
    };
    // }
  }
}

/*
 * @DESCRIPTION: Checkbox handler function
 * @PARAM element: Checkbox element in use
 * @PARAM index: Index of current option in params[]
 * @AUTHORS: Dayana Roa-Tapia
 */
function checkBoxGetVal(element, index) {
  let configData = require(currentSTTpath);
  let check = element.firstElementChild;
  let params = configData.params;
  if (check.checked == true) {
    elemArray[index].used = true;
    document.getElementById(params[index].label.replace(/\s+/g, "")).innerHTML =
      "<span>\u2022\t</span>" + params[index].label;

    mutExParams(index, params);
    retrieveElemVal();
  } else {
    elemArray[index].used = false;
    mutExParams(index, params);
    retrieveElemVal();
    document.getElementById(params[index].label.replace(/\s+/g, "")).innerHTML =
      params[index].label;
  }
}

/*
 * @DESCRIPTION: Selector event handler function
 * @PARAM element:
 * @PARAM index:
 * @AUTHORS:
 */
function selectGetVal(element, index) {
  let configData = require(currentSTTpath);
  let params = configData.params;
  // range.setAttribute("hidden",true);

  if (element.options[element.selectedIndex].value != "") {
    elemArray[index].used = true;
    // range.setAttribute("hidden");
    retrieveElemVal();

    document.getElementById(params[index].label.replace(/\s+/g, "")).innerHTML =
      "<span>\u2022\t</span>" + params[index].label;

    mutExParams(index, params);
  } else {
    elemArray[index].used = false;
    mutExParams(index, params);
    retrieveElemVal();
    document.getElementById(params[index].label.replace(/\s+/g, "")).innerHTML =
      params[index].label;
  }
}

/*
 * @DESCRIPTION: Populate return info window
 * @PARAMS: none
 * @AUTHORS: Dayana Roa-Tapia, Peter
 */
function runCommand() {
  let configData = require(currentSTTpath);
  let run = retrieveElemVal();
  let exe = require("./switch_sst_window_runtime");
  let useExe = exe.currentSSTexe(currentSTTpath); //path of the executable to be ran
  console.log("exe: " + useExe);
  let runWindow = document.getElementById("runWindowInfo");
  runWindow.innerHTML = "cmd: " + configData.programName + " " + run.join(" ");
  runWindow.appendChild(clear);
  const {execFile} = require("child_process");
  let returnStatus = execFile(useExe, run, (error, stdout, stderr) => {
    if (stderr) {
      returnInfo.innerHTML = returnInfo.innerHTML + stderr;
      throw stderr;
    }
    returnInfo.innerHTML = returnInfo.innerHTML + stdout;
  });
  //This function is executed before the callback function of execFile
  returnStatus.on("exit", code => {
    returnInfo.innerHTML = "Exit code is: " + code + "<br>";
  });
}

/*
 * @DESCRIPTION: Handles PDF2PRINT range option
 * @PARAM index: Index of current option in params[]
 * @AUTHORS: Dayana Roa-Tapia
 */
function rangeParam(index) {
  let configData = require(currentSTTpath);
  let params = configData.params;
  if (fileArray.length > 0) {
    // if(element.options[element.selectedIndex].value == "n-n" && fileArray.length > 0){
    let rangeSet = 0;
    for (let j = 0; j < fileArray.length; j++) {
      let rangeSel = document.createElement("SELECT");
      // rangeSel.setAttribute("class","rng");
      for (let p = 0; p < params[index].options.length; p++) {
        let option = document.createElement("option");
        option.setAttribute("value", params[index].options[p]);
        option.innerHTML = params[index].options[p];
        rangeSel.appendChild(option);
      }
      let fileName = document.createElement("P");
      fileName.setAttribute("class", "rng");
      fileName.innerHTML =
        fileArray[j].name + ": " + fileArray[j].range + "<br>";
      paramWindow.appendChild(fileName);
      fileName.appendChild(rangeSel);
      let add = document.createElement("BUTTON");
      add.setAttribute("class", "rng");
      add.setAttribute("id", "addBtn");
      add.innerHTML = "+";
      fileName.appendChild(add);
      rangeSel.onchange = function() {
        if (rangeSel.options[rangeSel.selectedIndex].value == "n-n") {
          console.log("range");
          elemArray[index].used = true;
          let rng = document.createElement("INPUT");
          rng.setAttribute("id", "rngIn");
          rng.setAttribute("type", "text");
          rng.setAttribute("placeholder", "n-n");
          add.remove();
          fileName.appendChild(rng);
          fileName.appendChild(add);
          rng.onkeyup = function() {
            if (event.key === "Enter") {
              console.log("enter");
              if (rng.value != "") {
                fileArray[j].range = params[index].cmd + rng.value;
                fileName.innerHTML =
                  fileArray[j].name + ": " + fileArray[j].range + "<br>";
                fileName.appendChild(rangeSel);
                fileName.appendChild(rng);
                fileName.appendChild(add);
                retrieveElemVal();
                console.log(fileArray[j].range);
              }
            }
          };
          rangeSet++;
        } else if (rangeSel.options[rangeSel.selectedIndex].value != "") {
          elemArray[index].used = true;
          fileArray[j].range =
            params[index].cmd + rangeSel.options[rangeSel.selectedIndex].value;
          fileName.innerHTML =
            fileArray[j].name + ": " + fileArray[j].range + "<br>";
          fileName.appendChild(rangeSel);
          fileName.appendChild(add);
          retrieveElemVal();
          rangeSet++;
        } else {
          document.getElementById(
            params[index].label.replace(/\s+/g, ""),
          ).innerHTML = params[index].label;
          elemArray[index].used = false;
          if (document.getElementById("rngIn")) {
            document.getElementById("rngIn").remove();
            fileArray[j].range = "";
            fileName.innerHTML =
              fileArray[j].name + ": " + fileArray[j].range + "<br>";
            fileName.appendChild(rangeSel);
            retrieveElemVal();
          } else {
            fileArray[j].range = "";
            fileName.innerHTML =
              fileArray[j].name + ": " + fileArray[j].range + "<br>";
            fileName.appendChild(rangeSel);
            retrieveElemVal();
          }
        }
        if (rangeSet > 0) {
          document.getElementById(
            params[index].label.replace(/\s+/g, ""),
          ).innerHTML = "<span>\u2022\t</span>" + params[index].label;
        } else {
          document.getElementById(
            params[index].label.replace(/\s+/g, ""),
          ).innerHTML = params[index].label;
        }
      };
      add.onclick = function() {
        let file = {};
        file.range = "";
        file.name = fileArray[j].name;
        fileArray.push(file);
        fileArray.sort((a, b) => (a.name > b.name ? 1 : -1));
        console.log("add" + fileArray);
        document
          .getElementById(params[index].label.replace(/\s+/g, ""))
          .click();
      };
    }
  }
}

/*
 * @DESCRIPTION: 
 * @PARAMS: none
 * @AUTHORS:
 */
function CheckRunButtonStatus() {
  //elemArray is a global that gets its value in the event handler of the menu options.
  /* console.log( "length: " + length ); */

  for (let i = 0, length = elemArray.length; i < length; i++) {
    /*console.log( String(i) + "th crit value: " + elemArray[i].crit );
            console.log( String(i) + "th used value: " + elemArray[i].used );*/
    if (elemArray[i].crit && !elemArray[i].used) {
      return false;
    }
  } //end of the for loop
  return true;
}

/*
 * @DESCRIPTION:
 * @PARAM runButton:
 * @AUTHORS:
 */
function EnableRunButton(runButton) {
  /* condition check */
  /* Since I'm thinking about adding this function to the element's onblur handler,
               I don't want to go through the whole process of checking the states on every blur. */

  /*console.log( "In EnableRunButton(): " + isRunButtonReady );*/
  if (isRunButtonReady) {
    return isRunButtonReady; //should be equivalent to return true
  }

  isRunButtonReady = CheckRunButtonStatus();
  if (isRunButtonReady) {
    //runButton should refer to the same element as run of the global scope
    //runButton.setAttribute( "disabled", false );
    runButton.removeAttribute("disabled");
    return true;
  }
  return false; //implicit else statement
}

/*
 * @DESCRIPTION:
 * @PARAMS: none
 * @AUTHORS:
 */
function toggleSettingsWindow() {
  defaultLicense = settingsLib.getDefaultLicense(); //Update the label telling the user what the current default is
  document.getElementById("currentDefaultTextLabel").innerHTML =
    settingsLib.getDefaultSSTProgramName() + " " + defaultLicense;

  if (DOMsystemLib.checkIfHidden("settingsWindow")) {
    DOMsystemLib.unhideElement("settingsWindow");
    DOMsystemLib.hideElement("switchSSTwindowRunTime");
  } else {
    DOMsystemLib.hideElement("settingsWindow");
  }
}

/*
 * @DESCRIPTION:
 * @PARAMS: none
 * @AUTHORS:
 */
function toggleSwitchWindowRunTime() {
  if (DOMsystemLib.checkIfHidden("switchSSTwindowRunTime")) {
    DOMsystemLib.unhideElement("switchSSTwindowRunTime");
    DOMsystemLib.hideElement("settingsWindow");
  } else {
    DOMsystemLib.hideElement("switchSSTwindowRunTime");
  }
}

/*
 * @DESCRIPTION:
 * @PARAMS: none
 * @AUTHORS:
 */
function loadFileClickEvent(configData) {
  let filePath = dialog.showOpenDialog({properties: ["openFile"]});
  //console.log("filePath: " + filePath);
  if (filePath === "" || filePath === undefined || filePath === null) {
    /*let options = {
      type: "info",
      message: "Load cancelled.",
    };
    dialog.showMessageBox(options);*/
    return null;
  }
  let saveCommandArray = saveLoadLib.loadSaveFile(filePath, "*");
  //console.log(saveCommandArray);
  saveLoadLib.fillInElements(
    saveCommandArray,
    elemArray,
    fileArray,
    configData.programName,
  );
  isRunButtonReady = EnableRunButton(run);
  let returnedCommand = retrieveElemVal(false);
  //console.log(returnedCommand);
}

/*
 * @DESCRIPTION:
 * @PARAMS: none
 * @AUTHORS:
 */
function saveFileClickEvent() {
  let options = {
    properties: ["openFile", "promptToCreate"],
  };
  let filePath = dialog.showOpenDialog(options);
  if (filePath === undefined) {
    //this condition means the user cancelled the file explorer
    /*options = {
      type: "info",
      message: "Save cancelled.",
    };
    dialog.showMessageBox(options);*/
    return false; //exits the handler now what happens to this return value?
  }
  /* I should give some consideration to moving the code above into the writeCommandToFile function */

  //console.log("Save file to be created at: " + filePath);
  let saveCommand = retrieveElemVal(true);
  //console.log("In save button's handler, saveCommand: " + saveCommand);
  saveLoadLib.writeCommandToFile(filePath, saveCommand, "*");
}

/*
 * @DESCRIPTION:
 * @PARAMS: none
 * @AUTHORS:
 */
function massRunClickEvent() {
  //nothing
}

/*
 * @DESCRIPTION: Clears SSTUI of any options selected
 * @PARAMS: none
 * @AUTHORS: Dayana Roa-Tapia
 */
function clearClickEvent() {
  let configData = require(currentSTTpath);
  cmd = [];
  fileArray = [];
  runCmd = [];
  document.getElementById("returnInfo").innerHTML = "";
  let els = document.getElementsByClassName("rng");
  let l = els.length;
  for (let j = l - 1; j >= 0; j--) {
    els[j].remove();
  }

  for (let i = 0; i < elemArray.length; i++) {
    if (elemArray[i].used == true) {
      elemArray[i].used = false;
      if (elemArray[i].type == "select") {
        elemArray[i].element.selectedIndex = "0";
        // elemArray[i].element.click();
      } else if (elemArray[i].type == "checkbox") {
        elemArray[i].element.children[0].click();
      } else {
        elemArray[i].element.value = "";
      }
      document.getElementById(
        configData.params[i].label.replace(/\s+/g, ""),
      ).innerHTML = configData.params[i].label;
    }
    if (
      document.getElementById(configData.params[i].label.replace(/\s+/g, ""))
        .style.pointerEvents == "none"
    ) {
      document
        .getElementById(configData.params[i].label.replace(/\s+/g, ""))
        .style.removeProperty("pointer-events");
      document
        .getElementById(configData.params[i].label.replace(/\s+/g, ""))
        .setAttribute("class", "");
    }
  }
  if (trays) {
    trays.parentNode.removeChild(trays);
  }
  run.setAttribute("disabled", "disabled");
  isRunButtonReady = false;
  // location.reload();
  runWindow.innerHTML = "cmd: " + cmd.join(" ");
  //console.log("cmd: " + cmd);
  runWindow.appendChild(clear);
}

/*
 * @DESCRIPTION:
 * @PARAM SSTpath:
 * @AUTHORS:
 */
function primaryWindow(STTpath) {
  setCurrentSTTpath(STTpath);
  let configData = require(currentSTTpath);

  currSST.innerHTML =
    configData.programName +
    " " +
    fileSystemLib.getLicense(fileSystemLib.getFolderPath(currentSTTpath));
  updateParamInfo(-1);
  const required = document.getElementById("required"); //DIV FOR REQUIRED
  let params = configData.params; //SCROLLING MENU
  createMenu(); //SCROLLING MENU
  let runWindow = document.getElementById("runWindowInfo");

  // CLEAR BUTTON                                   *
  clear.addEventListener("click", clearClickEvent);
  runWindow.appendChild(clear);

  // RUN BUTTON
  run.addEventListener("click", runCommand);
  isRunButtonReady = false; //this variable is technically unnecessary since it should always be the inverse of run.disabled

  // RETURNING TO HOME SCREEN FROM BANNER
  let sstHeader = document.getElementById("sstname");
  sstHeader.onclick = function() {
    updateParamInfo(-1);

    let actives = document.getElementsByClassName("active");
    console.log(actives);
    for (let a = 0; a < actives.length; a++) {
      actives[a].setAttribute("class", "inactive");
    }
  };

  // RETURN INFO WINDOW
  let returnInfo = document.getElementById("returnInfo");
  let retInfoLabel = document.getElementById("retInfoLabel");

  // SETTINGS BUTTON
  let settings = document.createElement("SETTINGS");
  settings.setAttribute("id", "settingsButton");
  settings.innerHTML =
    '<img src="./assets/settings.ico" width="50px" height="50px">';
  headerDiv.appendChild(settings);
  settings.addEventListener("click", toggleSettingsWindow);

  // Switch SST BUTTON
  let switchsst = document.createElement("SwitchSST");
  switchsst.setAttribute("id", "switchSSTButton");
  switchsst.innerHTML =
    '<img src="./assets/Switch_SST.ico" width="55px" height="55px">';
  headerDiv.appendChild(switchsst);
  switchsst.addEventListener("click", toggleSwitchWindowRunTime);

  // Load file BUTTON
  let loadfile = document.createElement("loadFile");
  loadfile.setAttribute("id", "loadFileButton");
  loadfile.innerHTML =
    '<img src="./assets/file_open.ico" width="55px" height="55px">';
  headerDiv.appendChild(loadfile);
  loadfile.addEventListener("click", () => {
    clearClickEvent();
    loadFileClickEvent(configData);
  });

  // Save file BUTTON
  let savefile = document.createElement("saveFile");
  savefile.setAttribute("id", "saveFileButton");
  savefile.innerHTML =
    '<img src="./assets/save_icon.ico" width="55px" height="55px">';
  headerDiv.appendChild(savefile);
  savefile.addEventListener("click", saveButtonClickHandler);

  /*
   * @DESCRIPTION: This function is just meant to call retrieveElemVal() with the isForSave parameter set to true.
      It should then store the command returned from the above function call in a file that is written to disk or some
      other sort of permanent storage.
   * @PARAM: none
   * @AUTHORS: Peter Chen
   */

  function saveButtonClickHandler() {
    let options = {
      properties: ["openFile", "promptToCreate"],
    };
    let filePath = dialog.showOpenDialog(options);
    if (filePath === undefined) {
      //this condition means the user cancelled the file explorer
      /*options = {
        type: "info",
        message: "Save cancelled.",
      };
      dialog.showMessageBox(options);*/
      return false; //exits the handler now, seriously, what happens to this return value?
    }
    /* I should give some consideration to moving the code above into the writeCommandToFile function */

    //console.log("Save file to be created at: " + filePath);

    let saveCommand = retrieveElemVal(true);
    //console.log("In save button's handler: " + saveCommand);
    saveLoadLib.writeCommandToFile(filePath, saveCommand, "*");
  }

  // Mass run BUTTON
  let massrun = document.createElement("massRun");
  massrun.setAttribute("id", "massRunButton");
  massrun.innerHTML =
    '<img src="./assets/Mass_Run.ico" width="55px" height="55px">';
  headerDiv.appendChild(massrun);
  massrun.addEventListener("click", massRunClickEvent);

  // HELP BUTTON
  /*
 * @DESCRIPTION: Runs the help command of the SST and displays it
 * @PARAMS: None
 * @AUTHORS: Dayana Roa-Tapia
 */
  let help = document.getElementById("help");
  help.onclick = function() {
    runWindow.innerHTML =
      "cmd: " + configData.programName + " " + configData.help;
    runWindow.appendChild(clear);
    const {exec} = require("child_process");
    console.log(configData.help);
    exec(
      configData.programName + " " + configData.help,
      (error, stdout, stderr) => {
        if (stderr) {
          returnInfo.innerHTML = stderr;
          throw stderr;
        }
        returnInfo.innerHTML = stdout.split("\n").join("<br/>") + "<br><br>";
      },
    );
  };

  // ESC Sub windows implementation
  /*
 * @DESCRIPTION: Closes all sub widowa when esc is pressed
 * @PARAMS: none
 * @AUTHORS: Dayana Roa-Tapia
 */
  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      DOMsystemLib.hideElement("settingsWindow");
      DOMsystemLib.hideElement("switchSSTwindowRunTime");
      if (document.getElementById("cmdColl").innerHTML === "-") {
        document.getElementById("cmdColl").click();
      }
      if (document.getElementById("retColl").innerHTML === "-") {
        document.getElementById("retColl").click();
      }
    }
  });
}

module.exports = {
  primaryWindow,
};
