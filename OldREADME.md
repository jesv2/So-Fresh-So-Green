Server Scriptable Tools UI Project
==================================

Team Members:

Arnie

Elizabeth Harasymiw

Dayana

Peter


Instructions
------------

Commands to run to get necessary node modules:
- `npm install`

Command to run off local src:
- `npm start`

Command to create an executable with electron packager:
- `npm run package-win`

Command to create an executable and an installer with electron builder:
- `npm run builder-win`


Bug Patches
-----------

Due to how pop-ups at the beginning of the programs run time the current test suite can break.
Steps to temporary fix this until code and tests are re-factored.
1. Make sure settings.json is deleted
2. Run the program once yourself
3. Set PDF Alchemist to default.
4. Close the program.
5. Should be able to run "npm run test-master" now with all tests but one test passing (one test is incomplete and will finish as pending).



JSON SST configuration file specs
---------------------------------

The following are the specifications to be followed when creating a SST config file

{
  "programName" : "The name of the .exe of the SST to be used.",
  "description" : "Overall description of the SST.",
  "help" : "Help parameter that displays all the different options of SST. (-h, --help, "")",
  "params": Array of SST parameter objects
      |==> [
            {
              "cmd" : "Parameter argument to be sent to command line (-enableBookmarks, --printer=)",

              "id": "id attribute for input element for this argument (cmd without - and =)",

              "critical" : boolean determining whether argument is required or not to run SST,

              "value" : "value to set to input element for input retrieval purposes. Applies to
     			  elements which value does not change (toggle switches, checkboxes)",

              "element" : "DOM element to be created (input, select)",

              "elementType" : "Type attribute of the DOM element (input types: text, checkbox,
				  NOT_USED -> only when the DOM element = select)",

              "options" : array of options for select elements begining with a blank option
                    |===> ["", "option", "option"],

              "justParameter" : bolean that indicates whether this argument gets passed with a
				  value attached to it, a value following it, or just the argument
				  itself wiht no value,

              "mutExSet" : Array of label values of arguments without spaces that cannot be used when this argument                is in use,
              "repeatable" : booelan specifying whether an element can repeatedly be given input,

              "info" : "description of argument",

              "label" : "The label shown in the menu for this argument"
            },
            {....},
            {....}
          ]
}
