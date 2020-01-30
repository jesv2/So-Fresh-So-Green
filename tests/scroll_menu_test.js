const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Scroll Menu
 * Description:
 */
describe("SCROLLING MENU", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if scrolling menu exists.", function() {
    return this.app.client.isExisting("#menu").then(menu => {
      expect(menu).to.equal(true);
    });
  });

  it("Should pass if menu is populated: 1", function() {
    return this.app.client.getText("#EnableBookmarks").then(opt => {
      expect(opt).to.equal("Enable Bookmarks");
    });
  });

  it("Should pass if menu is populated: 2", function() {
    return this.app.client.getText("#ImageDPI").then(opt => {
      expect(opt).to.equal("Image DPI");
    });
  });

  it("Should pass if menu is populated: 3", function() {
    return this.app.client.getText("#SplitByBookmark").then(opt => {
      expect(opt).to.equal("Split By Bookmark");
    });
  });

  // TESTING THAT OPTIONS BEING USED ARE MARKED IN MENU
  it("should pass if bullet point is visible when parameter is used", async function() {
    let menOpt = this.app.client.$("a=CMap");
    await menOpt.click();
    let input = this.app.client.$("div#paramWindowInfo").$("input");
    input.addValue("6");
    await input.click();
    await input.keys("Enter");

    return this.app.client.getText("#CMap").then(text => {
      expect(text).to.equal("\u2022 CMap");
    });
  });

  it("should pass if bullet point is removed when parameter removed", async function() {
    let menOpt = this.app.client.$("a=Enable Captions");
    await menOpt.click();
    let input = this.app.client.$("div#paramWindowInfo").$(".slider");
    await input.click();
    await this.app.client
      .$("div#paramWindowInfo")
      .$(".slider")
      .click();

    return this.app.client.getText("#EnableCaptions").then(text => {
      expect(text).to.equal("Enable Captions");
    });
  });
});
