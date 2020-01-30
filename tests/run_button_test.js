const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Run Button
 * Description:
 */
describe("TEST RUN BUTTON", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Run Button Exists.", function() {
    return this.app.client.isExisting("#runbutton").then(clear => {
      expect(clear).to.equal(true);
    });
  });

  it("Button is labeled: RUN.", function() {
    return this.app.client.getText("#runbutton").then(clear => {
      expect(clear).to.equal("RUN");
    });
  });

  it("Test if run button is disabled when not given parameters", function() {
    const runBtn = this.app.client.$("#runbutton");
    runBtn.click();
    return this.app.client.$('#returnInfo').getText().then(text=>{
      expect(text).to.equal("");
    })
  });
});
