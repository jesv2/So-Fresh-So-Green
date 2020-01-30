const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: Banner
 * Description:
 */
describe("BANNER", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if the banner shows SST being used.", function() {
    return this.app.client.getText("#sstname").then(text => {
      expect(text).to.equal(
        testUtils.configData.programName +
          " " +
          testUtils.fileSystemLib.getLicense(
            testUtils.fileSystemLib.getFolderPath(testUtils.configPath),
          ),
      );
    });
  });
});
