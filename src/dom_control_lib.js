/*
 * @DESCRIPTION: Check if the given element is hidden
 * @PARAM element: The element being checked.
 * @AUTHORS: Elizabeth Harasymiw
 */
function checkIfHidden(element) {
  if (document.getElementById(String(element)).style.opacity === "0") {
    return true;
  } else {
    return false;
  }
}

/*
 * @DESCRIPTION: Hide the given element.
 * @PARAM element: The element being hidden.
 * @AUTHORS: Elizabeth Harasymiw
 */
function hideElement(element) {
  document.getElementById(String(element)).style.zIndex = "-1";
  document.getElementById(String(element)).style.opacity = "0";
}

/*
 * @DESCRIPTION: Unhide the given element.
 * @PARAM element: The element being unhidden.
 * @AUTHORS: Elizabeth Harasymiw
 */
function unhideElement(element) {
  document.getElementById(String(element)).style.zIndex = "3";
  document.getElementById(String(element)).style.opacity = "1";
}

module.exports = {
  checkIfHidden,
  hideElement,
  unhideElement,
};
