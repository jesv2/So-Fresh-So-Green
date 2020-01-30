const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Application Launch
 * Description:
 */
describe("Application Launch", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should show no input in text field.", function() {
    return this.app.client.getText("#fileName").then(text => {
      expect(text).to.equal("");
    });
  });

  it("Should pass if incorrect text in field.", function() {
    return this.app.client.getText("#fileName").then(text => {
      expect(text).to.not.equal("test");
    });
  });

  it("Show text field exists.", function() {
    return this.app.client.isExisting("#fileName").then(widget => {
      expect(widget).to.equal(true);
    });
  });

  it("Should pass for non existent text field.", function() {
    return this.app.client.isExisting("#doesnotexist").then(widget => {
      expect(widget).to.equal(false);
    });
  });
});
