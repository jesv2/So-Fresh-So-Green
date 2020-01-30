const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Run Command Window
 * Description:
 */
describe("RUN COMMAND WINDOW", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if window exists.", function() {
    return this.app.client.isExisting("#runWindowInfo").then(window => {
      expect(window).to.equal(true);
    });
  });

  it("Should pass if window label is correct.", function() {
    return this.app.client.getText("#runWindowLabel").then(text => {
      expect(text).that.includes("Current Command");
    });
  });

  it("Should pass if window has correct text.", function() {
    return this.app.client.getText("#runWindowInfo").then(text => {
      expect(text).that.includes("cmd:");
    });
  });

  it("Should pass if correct command is displayed: -enableBookmarks", function() {
    let link = this.app.client.$("a=Enable Bookmarks");
    link.click();
    let win = this.app.client.$("div#paramWindowInfo");
    let check = win.$(".slider");
    // let elem = check.$('[value="false"]');
    check.click();
    return this.app.client.waitUntilTextExists(
      "#runWindowInfo",
      "cmd: PDFAlchemist -enableBookmarks false",
    );
  });

  it("Should pass if correct command is displayed: mult params", async function() {
    let link = this.app.client.$("a=Enable Bookmarks");
    link.click();
    let win = this.app.client.$("div#paramWindowInfo");
    let check = win.$(".slider");
    // let elem = check.$('[value="false"]');
    await check.click();
    let link2 = this.app.client.$("a=Image DPI");
    link2.click();
    let input = this.app.client.$("div#paramWindowInfo").$("input");
    input.addValue("200");
    await input.click();
    await input.keys("Enter");
    return this.app.client.waitUntilTextExists(
      "#runWindowInfo",
      "cmd: PDFAlchemist -enableBookmarks false -imageDPI 200",
    );
  });
});
