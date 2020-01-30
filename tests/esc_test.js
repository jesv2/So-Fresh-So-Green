const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Application Launch
 * Description:
 */
describe("ESC implementation", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("should pass if ESC closes settings window", async function() {
    let settings = this.app.client.$("#settingsButton");
    await settings.click();

    this.app.client.keys("Escape");

    return this.app.client
      .$("#settingsWindow")
      .getAttribute("style")
      .then(val => {
        expect(val).to.equal("z-index: -1; opacity: 0;");
      });
  });

  it("should pass if ESC closes switch SST window", async function() {
    let settings = this.app.client.$("#switchSSTButton");
    await settings.click();

    this.app.client.keys("Escape");

    return this.app.client
      .$("#switchSSTwindowRunTime")
      .getAttribute("style")
      .then(val => {
        expect(val).to.equal("z-index: -1; opacity: 0;");
      });
  });

  it("should pass if ESC collapses cmd window", async function() {
    let collapse = this.app.client.$("#cmdColl");
    await collapse.click();

    this.app.client.keys("Escape");

    return this.app.client
      .$("#runWindowLabel")
      .getAttribute("style")
      .then(val => {
        expect(val).to.equal("height: 50px; z-index: 0;");
      });
  });

  it("should pass if ESC collapses SST info window", async function() {
    let collapse = this.app.client.$("#retColl");
    await collapse.click();

    this.app.client.keys("Escape");

    return this.app.client
      .$("#retInfoLabel")
      .getAttribute("style")
      .then(val => {
        expect(val).to.equal("z-index: 0; height: 50px; bottom: 183px;");
      });
  });
});
