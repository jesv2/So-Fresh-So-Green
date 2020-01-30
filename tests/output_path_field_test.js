const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Output Path Text Field
 * Description:
 */
describe("OUTPUT PATH TEXT FIELD", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should show no input in text field.", function() {
    return this.app.client.getText("#outputDir").then(text => {
      expect(text).to.equal("");
    });
  });

  it("Should pass if incorrect text in field.", function() {
    return this.app.client.getText("#outputDir").then(text => {
      expect(text).to.not.equal("test");
    });
  });

  it("Show text field exists.", function() {
    return this.app.client.isExisting("#outputDir").then(widget => {
      expect(widget).to.equal(true);
    });
  });
});
