const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Clear Button
 * Description:
 */
describe("CLEAR BUTTON", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if clear button exists.", function() {
    return this.app.client.isExisting("#clearButton").then(clear => {
      expect(clear).to.equal(true);
    });
  });

  it("Should pass if button is labeled as CLEAR.", function() {
    return this.app.client.getText("#clearButton").then(clear => {
      expect(clear).to.equal("CLEAR");
    });
  });

  it("Should clear run command window", function() {
    let opt = this.app.client.$("a=Enable Bookmarks");
    opt.click();
    let check = this.app.client.$(".slider");
    check.click();
    let clear = this.app.client.$("#clearButton");
    clear.click();

    return this.app.client.getText("#runWindowInfo").then(text => {
      expect(text).to.equal("cmd:\nCLEAR");
    });
  });

  it("Should clear option that was selected", async function() {
    let opt = this.app.client.$("a=Enable Bookmarks");
    await opt.click();
    let check = this.app.client.$(".slider");
    await check.click();
    let clear = this.app.client.$("#clearButton");
    await clear.click();

    return this.app.client
      .$(".slider")
      .getText()
      .then(val => {
        expect(val).to.equal("");
      });
  });

  it("Should clear run cmd window: multiple parameters", async function() {
    let opt = this.app.client.$("a=Enable Bookmarks");
    await opt.click();
    let check = this.app.client.$(".slider");
    await check.click();
    let opt2 = this.app.client.$("a=Keep Background");
    await opt2.click();
    let check2 = this.app.client.$(".slider");
    await check2.click();

    let opt3 = this.app.client.$("a=OCR Language");
    await opt3.click();
    let sel = this.app.client.$("#ocrLanguage");
    await sel.selectByAttribute("value", "ita");

    let clear = this.app.client.$("#clearButton");
    await clear.click();

    return this.app.client.getText("#runWindowInfo").then(text => {
      expect(text).to.equal("cmd:\nCLEAR");
    });
  });

  it("Should revert elements to original state: multiple parameters", async function() {
    let opt = this.app.client.$("a=Enable Bookmarks");
    await opt.click();
    let check = this.app.client.$(".slider");
    await check.click();
    let opt2 = this.app.client.$("a=Keep Background");
    await opt2.click();
    let check2 = this.app.client.$(".slider");
    await check2.click();

    let opt3 = this.app.client.$("a=OCR Language");
    await opt3.click();
    let sel = this.app.client.$("#ocrLanguage");
    await sel.selectByAttribute("value", "ita");

    let clear = this.app.client.$("#clearButton");
    await clear.click();
    //checking that all elements have been reverted to original state
    await this.app.client.$("a=Enable Bookmarks").click();
    await this.app.client
      .$(".slider")
      .getText()
      .then(val => {
        expect(val).to.equal("");
      });

    await this.app.client.$("a=Keep Background").click();
    await this.app.client
      .$(".slider")
      .getText()
      .then(val => {
        expect(val).to.equal("");
      });

    await this.app.client.$("#OCRLanguage").click();
    return this.app.client
      .$("#ocrLanguage")
      .getAttribute("value")
      .then(val => {
        expect(val).to.equal("");
      });
  });
});
