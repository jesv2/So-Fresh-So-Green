const electron = require("electron");
const {Application} = require("spectron");
const mock = require("mock-fs");
//const configData = require("../config_files/PDFAlchemist_config.json");
//const configPath = "C:\\Program Files\\Datalogics\\PDF Alchemist Premium\\";
const fileSystemLib = require("../src/filesystem_control_lib.js");

module.exports = {
  //configPath,
  //configData,
  fileSystemLib,
  mock,

  beforeEach: function() {
    this.timeout(10000);

    this.app = new Application({
      path: electron,
      args: ["."],
      startTimeout: 10000,
      waitTimeout: 10000,
    });

    return this.app.start();
  },

  afterEach: function() {
    this.timeout(10000);

    if (this.app && this.app.isRunning()) {
      return this.app.stop();
    }

    return undefined;
  },
};
