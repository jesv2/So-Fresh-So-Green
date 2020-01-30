const fileSystemLib = require("./filesystem_control_lib.js");
const globalVars = require("./global_vars.js");
const {dialog} = require("electron").remote;

/*------------------------------------------------------------------------------------------------------------------------------------------------*/
/*                                                             Private functions                                                                  */
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
 * @DESCRIPTION: Checks if a file existences if not creates it
 * @PARAMS: filePath
 * @AUTHORS: Peter
 */

function createSaveFile(filePath) {
  if (fileSystemLib.validateFileExist(filePath)) {
    return true;
  }

  try {
    fileSystemLib.createEmptyFile(filePath);
  } catch (error) {
    console.log("Trying to create the save file caused this error:\n" + error);
    return false;
  }
  return true;
}

/*
 * @DESCRIPTION: Adds a span to an anchor tag element so that it'll display a red dot when a parameter has a value
 * @PARAMS: label: Corresponds to the label property of each params object, and since each anchorTag's ID is tied to this label,
                  it's what we use to gain access to this element. It's also the text that we actually put into the anchor tag.
 * @AUTHORS: Peter
   @Returns: Nothing
 */

function addRedDot(label) {
  let anchorTag = document.getElementById(label.replace(/\s+/g, ""));
  anchorTag.innerHTML = "<span>\u2022\t</span>" + label;
}

/*------------------------------------------------------------------------------------------------------------------------------------------------*/
/*                                                            Exported functions                                                                  */
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/*
 * @DESCRIPTION: Checks if a folder existences if not creates it
 * @PARAMS: none
 * @AUTHORS: Peter
 */

function validateSaveFolder() {
  //console.log("Directory should be created at: " + globalVars.saveFolderPath);
  if (!fileSystemLib.validateFileExist(globalVars.saveFolderPath)) {
    try {
      fileSystemLib.createEmptyFolder(globalVars.saveFolderPath);
    } catch (error) {
      console.log(
        "Trying to create the save folder caused this error:\n" + error,
      );
    }
  }
}

/*
 * @DESCRIPTION: Takes in an array, converts it into a string, then creates a file, then writes data into the file; the file is overwritten if it already exists
 * @PARAMS: filePath: an absolute path, although relative path might work too
 *          data: Just the information we're trying to write into the file, it's assumed to be an array
            separator: The character(s) that are used to join the array into a single string
 * @AUTHORS: Peter
 *  Note: It doesn't look like I use the return value of this function
 */

function writeCommandToFile(filePath, data, separator) {
  filePath = String(filePath);
  if (!filePath.includes(".txt")) {
    filePath = filePath + ".txt";
  }

  data = data.join(separator);
  //console.log("In writeCommandToFile, after join, data is: " + data);
  if (!createSaveFile(filePath)) {
    return false;
  }
  try {
    fileSystemLib.setFileText(filePath, data);
  } catch (error) {
    console.log("Trying to write to a file caused this error:\n" + error);
    return false;
  }
  return true;
}

/*
 * @DESCRIPTION: Loads a save file
 * @PARAMS: filePath: Path to the file
            delimiter: Used to split up the string we read into an array
 * @AUTHORS: Peter
 * @RETURNS: Returns the information in the file in an array of strings
 */

function loadSaveFile(filePath, delimiter) {
  if (!fileSystemLib.validateFileExist(filePath)) {
    console.log(
      "File doesn't exist, you can't load a file that doesn't exist!",
    );
    return null;
  }

  return fileSystemLib.readFileIntoArray(filePath, delimiter);
}

/*
 * @DESCRIPTION: This function is meant to take the array of strings from loadSaveFile and populate the HTML elements with the values from the array.
 * @PARAMS: commandArray: The array of strings from loadSaveFile
            elemArray: An array that holds references to our HTML objects along with some information about them
            fileArray: an array that we use to hold information for PDF2Print's range parameter and any other SST parameters that are called "fileName"
            currentSST: The SST that the user is interacting with
 * @AUTHORS: Peter
 * @Notes: There's an assumption that every string that starts with a dash is a parameter while strings that don't start with dashes are values.
 */

function fillInElements(commandArray, elemArray, fileArray, currentSST) {
  if (!Array.isArray(commandArray)) {
    console.log("fillInElements expects an array");
    return null;
  }
  if (commandArray[0] !== currentSST) {
    console.log("The loaded file is meant for another SST");
    let options = {
      type: "info",
      message: "The loaded file is not meant for this SST!",
    };
    dialog.showMessageBox(options);
    return null;
  }

  let currentID;
  let currentValue = "";
  let splitToken;
  let elementToFill;
  let justParameter; //this corresponds to the justParameter property in the config file
  let slider; //A reference to the toggle switches for Boolean value parameters
  let elemArrayLength =
    elemArray.length; /*This is just out here because I didn't want to include it in the nested loop to prevent it from being called multiple times*/
  let rangeAnchorTag;
  if (currentSST === "PDF2PRINT") {
    rangeAnchorTag = document.getElementById(
      elemArray[elemArrayLength - 2].label.replace(/\s+/g, ""),
    );
  }

  for (let i = 1, length = commandArray.length; i < length; i++) {
    justParameter = false;

    if (commandArray[i].includes("=") && commandArray[i].includes("<")) {
      //current token has both the parameter name and value
      splitToken = commandArray[i].split("=");
      splitToken[0] = splitToken[0].replace("<", "");
      currentID = splitToken[0];
      //console.log("= sign if statement, currentID: " + currentID);
      currentID = currentID.replace(/-/g, "");
      currentValue = splitToken[1];
    } else if (commandArray[i].includes("<")) {
      //current token just has the parameter name
      currentID = commandArray[i].replace("<", "");
      currentID = currentID.replace(/-/g, "");
      currentValue = "";
      //console.log("commandArray[i+1] " + commandArray[i + 1]);
      if (
        commandArray[i + 1] === undefined ||
        commandArray[i + 1].includes("<")
      ) {
        console.log("Next index in commandArray: " + commandArray[i + 1]);
        console.log("currentID: " + currentID);
        justParameter = true;
      }
    } else {
      //when the current token just has the value
      currentValue = commandArray[i];
    }

    if (currentID === "range") {
      let fileObject;
      let fileName = "";
      currentValue = "--range=" + splitToken[1];
      i++; /*The order of this increment and the next statement are important!*/
      fileName = commandArray[i];

      fileObject = {
        range: currentValue,
        name: fileName,
      };
      fileArray.push(fileObject);
      //console.log(fileObject);
      //console.log(fileArray);

      /*We need to set the "used" property correspond to the fileName element to true because we don't technically ever access the range element.
        The range element is tied to the fileName element, and the retrieveElemVal function actually accesses the fileArray based on the fileName element's used property.*/
      elemArray[elemArrayLength - 1].used = true; //fileName is the last element in the config file
      rangeAnchorTag.innerHTML =
        "<span>\u2022\t</span>" + elemArray[elemArrayLength - 2].label;
    } else if (currentValue !== "" || justParameter) {
      /* Template for a member of elemArray:
          newElem = {id: params[index].id, element: inputElem, crit: critical, used: false }; */
      /* inputElem here refers to the element that's generated when an option of the menu is selected. */
      console.log("currentID at index " + i + " : " + currentID);
      let index;
      for (index = 0; index < elemArrayLength; index++) {
        if (currentID === elemArray[index].id) {
          //console.log("currentID at in the inner loop check when there's a match: " + currentID);
          elementToFill = elemArray[index].element;
          elemArray[index].used = true;
          addRedDot(elemArray[index].label);
          break;
        }
      }

      //console.log("currentValue: " + currentValue);
      //console.log("elementToFill: " + elementToFill.id);
      //console.log("currentID: " + currentID);
      //console.log(elementToFill.className);

      if (elementToFill.className === "switch") {
        /*
          Our structure for the Boolean parameter is kind of weird. Apparently the element we store into the elemArray is actually a label element
          and not a checkbox element. The checkbox should be the first element that's appended to this label, and that's the actual element that
          I'm currently interested in. This is why I'm checking the className instead of checking the element type. This was necessary to make the
          checkboxes into the toggle switches, but it does force us to do some weird things here.

          For the slider, it's the 2nd element that's appended into the label, but there should only be two elements in this label element so...
        */
        slider = elementToFill.lastElementChild;
        slider.click();
      } else if (currentID === "fileName" && currentID !== "range") {
        let fileObject = {
          range: "",
          name: currentValue,
        };
        fileArray.push(fileObject);
        elementToFill.value = currentValue;
      } else {
        // console.log("Where we call use fieldName to set value, currentID is: " + currentID );
        // console.log("currentValue is: " + currentValue);
        // console.log("JustParameter is: " + justParameter);
        // console.log("the elementToFill's id is: " + elementToFill.id);
        elementToFill.value = currentValue;
        //console.log(elementToFill)
        //console.log("After the access by fieldName, the value is: " + elementToFill.value);
      }
    } //end of else if with currentValue
  } //end of for loop
}

/*
  The exports will appear in the order that the functions are written...hopefully
  Give some consideration to organizing them by alphabetical order
*/
module.exports = {
  validateSaveFolder,
  /*
   * @DESCRIPTION: Checks if a folder existences if not creates it
   * @PARAMS: none
   * @AUTHORS: Peter
   */
  writeCommandToFile,
  /*
   * @DESCRIPTION: Creates a file, then writes data into the file; the file is overwritten if it already exists
   * @PARAMS: filePath is an absolute path, although relative path might work too
   *          data is just the information we're trying to write into the file, it's assumed to be an array
   * @AUTHORS: Peter
   *  Note: It doesn't look like I use the return value of this function
   */
  loadSaveFile,
  /*
   * @DESCRIPTION: Loads a save file
   * @PARAMS: filePath: Path to the file
              delimiter: Used to split up the string we read into an array
   * @AUTHORS: Peter
   * @RETURNS: Returns the information in the file in an array of strings
   */
  fillInElements,
  /*
   * @DESCRIPTION: This function is meant to take the array of strings from loadSaveFile and populate the HTML elements with the values from the array.
   * @PARAMS: commandArray: The array of strings from loadSaveFile
              currentSST: The SST that the user is interacting with
   * @AUTHORS: Peter
   * @Notes: There's an assumption that every string that starts with a dash is a parameter while strings that don't start with dashes are values.
   */
};
