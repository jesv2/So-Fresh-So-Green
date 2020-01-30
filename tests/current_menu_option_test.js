const expect = require("chai").expect;
const testUtils = require("./utils");
const assert = require("assert");

/*
 * Test Group Name: Run Button
 * Description:
 */
describe("TEST CURRENT MENU OPTION", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("should pass if selected option has orange background", function() {
    const opt = this.app.client.$("a=Enable Bookmarks");
    opt.click();
    return this.app.client
      .getCssProperty("#EnableBookmarks", "background-color")
      .then(color => {
        expect(color.value).to.equal("rgba(240,83,43,1)");
      });
  });

  it("should pass if selected option reverts after clicking some other option", function() {
    const opt = this.app.client.$("a=Enable Bookmarks");
    opt.click();
    const opt2 = this.app.client.$("a=Keep Background");
    opt2.click();
    return this.app.client
      .getCssProperty("#EnableBookmarks", "background-color")
      .then(color => {
        expect(color.value).to.equal("rgba(44,55,61,1)");
      });
  });
});

describe("TEST mutExsET IMPLEMENTATION", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("should pass if Split By Bookmark is disable when Single File is set", async function() {
    const menuItem = this.app.client.$("a=Single File");
    await menuItem.click();

    const toggle = this.app.client.$(".slider");
    await toggle.click();

    return this.app.client
      .getCssProperty("#SplitByBookmark", "pointer-events")
      .then(val => {
        expect(val.value).to.equal("none");
      });
  });

  it("should pass if Split By # of Pages is disable when Single File is set", async function() {
    const menuItem = this.app.client.$("a=Single File");
    await menuItem.click();

    const toggle = this.app.client.$(".slider");
    await toggle.click();

    return this.app.client
      .getCssProperty("#SplitByNumberofPages", "pointer-events")
      .then(val => {
        expect(val.value).to.equal("none");
      });
  });

  it("should pass if Single File is disable when Split By Bookmark is set", async function() {
    const menuItem = this.app.client.$("a=Split By Bookmark");
    await menuItem.click();

    let input = this.app.client.$("div#paramWindowInfo").$("input");
    input.addValue("2");
    await input.click();
    await input.keys("Enter");

    return this.app.client
      .getCssProperty("#SingleFile", "pointer-events")
      .then(val => {
        expect(val.value).to.equal("none");
      });
  });

  it("should pass if Single File is disable when Split By Bookmark is set", async function() {
    const menuItem = this.app.client.$("a=Split By Number of Pages");
    await menuItem.click();

    let input = this.app.client.$("div#paramWindowInfo").$("input");
    input.addValue("2");
    await input.click();
    await input.keys("Enter");

    return this.app.client
      .getCssProperty("#SingleFile", "pointer-events")
      .then(val => {
        expect(val.value).to.equal("none");
      });
  });
});
