const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Settings Button
 * Description:
 */
describe("SETTINGS BUTTON", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if settings button exists.", function() {
    return this.app.client.isExisting("#settingsButton").then(clear => {
      expect(clear).to.equal(true);
    });
  });

  it("Should pass if button has no text.", function() {
    return this.app.client.getText("#settingsButton").then(clear => {
      expect(clear).to.equal("");
    });
  });
});
