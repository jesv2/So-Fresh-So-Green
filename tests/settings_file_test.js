const expect = require("chai").expect;
const testMockFS = require("./mockfs");

/*
 * Test Group Name: Application Launch
 * Description:
 */
describe("Settings File and Folder Tests", () => {
  beforeEach(testMockFS.beforeEach);
  afterEach(testMockFS.afterEach);

  function before() {
    //fileSystemLib.fetchFullPath(".")
    //let workingPath = path.resolve(".");
    //testMockFS.fileSystemLib.validateFileExist(mockCopy + '\\' + test.txt);
    mockCopy = testMockFS.fileSystemLib.fetchFullPath(".");
    testMockFS.mock({
      mockCopy: {
        "some-file.txt": "file content here",
        settings: {
          "settings.json":
            '{ "nextrun":"null","default":"null","message":"ON","paths": [] }',
        },
        "test.txt": "Some text",
      }, //,
      //'path/to/some.png': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
      //'some/other/path': {/** another empty directory */}
    });
    testMockFS.fileSystemLib.setFileSystem(testMockFS.mock);
  }

  function after() {
    testMockFS.mock.restore();
  }

  it("Always pass", function() {
    return expect(true).to.equal(true);
  });

  /*
    it("Test creation of mock file", function(){
        return expect(testMockFS.fileSystemLib.validateFileExist(testMockFS.fileSystemLib.fetchFullPath(".") + '\\'  + "test.txt")).to.equal(true);
    });

    it("Fail to fetch path compare", function(){
        return expect(testMockFS.fileSystemLib.fetchFullPath(testMockFS.fileSystemLib.fetchFullPath(".") + '\\' + 'test.txt')).to.equal("make fail");
    });
*/
});
