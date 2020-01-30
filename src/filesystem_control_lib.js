/********************************************************************************
 *                                  Includes                                    *
 ********************************************************************************/
const filesystem = require("fs");
const path = require("path");

/*
 * @DESCRIPTION: Fetch the license type from a given sst folder path.
 * @PARAM folderPath: the folder path that is for sst you are trying to find the license for
 * @AUTHORS: Elizabeth Harasymiw
 */
function getLicense(folderPath) {
  let files = filesystem.readdirSync(String(folderPath));
  let myLicense = "";

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

  return myLicense;
}

/*
 * @DESCRIPTION: Wrapper function for readFileSync, and it'll split it into an array for me too
 * @PARAM filePath: can be string, buffer, url, or integer; integer means file descriptor
          delimiter: Used to split up the string we read into an array
 * @AUTHORS: Peter
 */
function readFileIntoArray(filePath, delimiter) {
  let fileData;
  let options = {encoding: "utf-8"};

  fileData = filesystem.readFileSync(String(filePath), options);
  fileData = fileData.split(delimiter);

  return fileData;
}

/*
 * @DESCRIPTION: This is mainly meant for switching to a mock file system when testing.
 * @PARAMS aFileSystem: The file system you are switching to.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setFileSystem(aFileSystem) {
  filesystem = require(aFileSystem);
}

/*
 * @DESCRIPTION: Function for getting the full path location from reference paths.
 * @PARAMS path: Path containing references you would like to resolve.
 * @AUTHORS: Elizabeth Harasymiw
 */
function fetchFullPath(myPath) {
  return path.resolve(String(myPath));
}

/*
 * @DESCRIPTION: Creates an object for reading all the files in a given folder path
 * @PARAMS folderPath: The folder you are creating the object off of.
 * @AUTHORS: Elizabeth Harasymiw
 */
function getReadDirObject(folderPath) {
  return filesystem.readdirSync(String(folderPath));
}

/*
 * @DESCRIPTION: Appends text to the bottom of the chosen file.
 * @PARAMS filePath: File you are appending the test to.
 * @PARAMS appendText: The text you are appending to the file.
 * @AUTHORS: Elizabeth Harasymiw
 */
function appendFileText(filePath, appendText) {
  filesystem.appendFileSync(String(filePath), appendText);
}

/*
 * @DESCRIPTION: Deletes a file at the specified path
 * @PARAM filePath: path to file that is going to be deleted
 * @AUTHORS: Elizabeth Harasymiw
 */
function deleteFile(filePath) {
  filesystem.unlinkSync(String(filePath));
}

/*
 * @DESCRIPTION: Creates an empty file at the given path with the name given at the end of the path.
 * @PARAM filePath: Where the empty file is being created, name of document is included in this path.
 * @AUTHORS: Elizabeth Harasymiw
 */
function createEmptyFile(filePath) {
  return filesystem.openSync(String(filePath), "w");
}

/*
 * @DESCRIPTION: Creates an empty folder at the given path with the name given at the end of the path.
 * @PARAM folderPath: Where the empty folder is being created, and the folders name
 * @AUTHORS: Elizabeth Harasymiw
 */
function createEmptyFolder(folderPath) {
  filesystem.mkdirSync(String(folderPath));
}

/*
 * @DESCRIPTION: Checks if the given variable is valid JSON.
 * @PARAM JSONfilePath: The variable being tested
 * @AUTHORS: Elizabeth Harasymiw
 */
function validateFileJSON(JSONfilePath) {
  try {
    let mySettings = require(JSONfilePath);
    JSON.parse(JSON.stringify(mySettings));
    return true; // if came to here, then valid
  } catch (e) {
    return false; // failed to parse
  }
  return false;
}

/*
 * @DESCRIPTION: Checks if the given file path exists
 * @PARAM filePath: the file being checked
 * @AUTHORS: Elizabeth Harasymiw
 */
function validateFileExist(filePath) {
  return filesystem.existsSync(String(filePath));
}

/*
 * @DESCRIPTION: Checks if the given folder path exists.
 * @PARAM folderPath: Folder you are checking.
 * @AUTHORS: Elizabeth Harasymiw
 */
function validateFolderExist(folderPath) {
  return filesystem.existsSync(String(folderPath));
}

/*
 * @DESCRIPTION: Sets the text of a file to the given string
 * @PARAM filePath: File you are modifying
 * @PARAM overwriteText: Text you are overwriting the file with.
 * @AUTHORS: Elizabeth Harasymiw
 */
function setFileText(filePath, overwriteText) {
  filesystem.writeFileSync(String(filePath), overwriteText);
}

/*
 * @DESCRIPTION: Fetch windows PATH
 * @PARAMS: none
 * @AUTHORS: Elizabeth Harasymiw
 */
function getWindowsPATH() {
  const execSync = require("child_process").execSync;
  let windowsPATH = execSync("echo %path%", {encoding: "utf-8"});
  let pathArray = windowsPATH.split(";");
  return pathArray;
}

/*
 * @DESCRIPTION: Takes an array of paths and builds an array of all config location paths
 * @PARAM pathArray: array of paths to search through
 * @AUTHORS: Elizabeth Harasymiw
 */
function getConfigPaths(pathArray) {
  let configPathArray = [];

  for (let i = 0; i < pathArray.length; i++) {
    if (filesystem.existsSync(pathArray[i])) {
      let files = filesystem.readdirSync(pathArray[i]);
      //console.log("path \"" + pathArray[i] + "\" is valid");
      for (let j = 0; j < files.length; j++) {
        if (files[j].includes("_config.json")) {
          //console.log("  - Config found: " + files[j]);
          configPathArray.push(pathArray[i] + "\\" + files[j]);
        }
      }
    }
  }

  return configPathArray;
}

/*
 * @DESCRIPTION: Takes an array of paths and builds an array the folder path to each sst installed.
 * @PARAM pathArray: array of paths to search through
 * @AUTHORS: Elizabeth Harasymiw
 */
function getProgramPaths(pathArray) {
  let programPathArray = [];

  for (let i = 0; i < pathArray.length; i++) {
    if (filesystem.existsSync(pathArray[i])) {
      let files = filesystem.readdirSync(pathArray[i]);
      for (let j = 0; j < files.length; j++) {
        if (files[j].includes("_config.json")) {
          programPathArray.push(pathArray[i]);
        }
      }
    }
  }
  return programPathArray;
}

/*
 *@DESCRIPTION: Fetch the path of the executable of each SST
 * @PARAM: pathArray: array of paths to search through
 * @AUTHORS: Dayana Roa-Tapia
 */
function getExePaths(pathArray) {
  // console.log("path[]: "+pathArray);
  let programExeArray = [];

  for (let i = 0; i < pathArray.length; i++) {
    if (filesystem.existsSync(pathArray[i] + "\\")) {
      let files = filesystem.readdirSync(pathArray[i] + "\\");
      // console.log(files);
      for (let j = 0; j < files.length; j++) {
        if (
          files[j].split(".").pop() == "exe" &&
          (files[j].includes("pdf") == true ||
            files[j].includes("PDFA") == true)
        ) {
          programExeArray.push(pathArray[i] + "\\" + files[j]);
        }
      }
    }
  }
  // console.log("exePath[]: ",programPathArray);
  return programExeArray;
}

/*
 * @DESCRIPTION: Populate an array that with correspond to the same spot in the
 *               given array to hold that configs license type.
 * @PARAM pathArray: An array of the paths you are looking through for licenses.
 * @AUTHORS: Elizabeth Harasymiw
 */
function populateLicenseArray(pathArray) {
  let licenseArray = [];

  for (let i = 0; i < pathArray.length; i++) {
    licenseArray.push(getLicense(pathArray[i]));
  }
  return licenseArray;
}

/*
 * @DESCRIPTION: Takes a file path and and returns the path to the folder it was in.
 * @PARAM filePath: Array of paths to search through.
 * @AUTHORS: Elizabeth Harasymiw
 */
function getFolderPath(filePath) {
  folderPath = filePath;

  var lastChar = folderPath[folderPath.length - 1]; //grab last character in path string

  while (lastChar !== "\\" && folderPath.length > 0) {
    folderPath = folderPath.slice(0, -1); //remove 1 character from the end
    lastChar = folderPath[folderPath.length - 1]; //grab last character in path string
  }

  folderPath = folderPath.slice(0, -1); //remove the remaining '\' to make it a valid folder path

  return folderPath;
}

module.exports = {
  getLicense,
  setFileSystem,
  fetchFullPath,
  getReadDirObject,
  appendFileText,
  deleteFile,
  createEmptyFile,
  createEmptyFolder,
  validateFileJSON,
  validateFileExist,
  validateFolderExist,
  setFileText,
  getWindowsPATH,
  getConfigPaths,
  getProgramPaths,
  populateLicenseArray,
  getFolderPath,
  getExePaths,
  readFileIntoArray,
};
