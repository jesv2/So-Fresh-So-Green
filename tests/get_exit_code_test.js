const expect = require("chai").expect;
const testUtils = require("./utils");

describe("RETRIEVE AND DISPLAYING EXIT CODE TESTS", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  const paramCount = testUtils.configData.params.length;
  const params = testUtils.configData.params;
  let param;

  it("Running the executable with valid arguments; expect exit code to be 0", () => {
    // for ( let i = 0; i < paramCount; i ++ ) {
    //
    //   param = params[i];
    //   let eTemplate = param.element; //I'm using template to refer to what kind of element is generated, like button, input, select, etc.
    //   let eType = param.elementType; //I'm hoping that these two variables will make the code easier to read
    //   let id = param.id;
    //
    //   if ( param.critical ) {
    //     let requiredElement = this.app.client.$( "#" + id );
    //   }
    // }
  });

  it("Running the executable with bogus argument values; expect exit code to be non-zero", () => {});
});
