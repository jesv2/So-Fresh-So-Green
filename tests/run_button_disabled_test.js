const expect = require("chai").expect;
const testUtils = require("./utils");

describe("TESTS RUN BUTTON BEING DISABLED UNTIL REQUIRED PARAMETERS ARE ENTERED: ", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Tests that the run button is disabled: ", function() {
    const runBtn = this.app.client.$("#runbutton");

    return runBtn.isEnabled().then(enabled => {
      expect(enabled).to.be.equal(false);
    });
  });

  it(
    "Tests that the run button is enabled: " /*, async function() {

  it("Tests that the run button is enabled: ", async function() {
    //const greetDiv = this.app.client.$( "#greet" );
    //const runBtn = this.app.client.$('#runbutton');
    const paramCount = testUtils.configData.params.length;
    const params = testUtils.configData.params;
    let param;

    //Put information into all the appropriate HTML ELEMENTS
    for (let i = 0; i < paramCount; i++) {
      param = params[i];

      let eTemplate = param.element; //I'm using template to refer to what kind of element is generated, like button, input, select, etc.
      let eType = param.elementType; //I'm hoping that these two variables will make the code easier to read
      let id = param.id;

      if (param.critical) {
        let requiredElement = this.app.client.$("#" + id);

        if (eTemplate == "input") {
          if (eType == "checkbox") {
            await requiredElement.click();
          } //end of if statement with eType as conditional
          else if (eType == "text") {
            await requiredElement.click().then(function(value) {
              requiredElement.addValue(value);
            });
            //            requiredElement.addValue( 'RickyBobby' );
            await requiredElement.keys("Enter");
          } //end of else if statement with eType as conditional
        } //end of if statement with eTemplate as conditional
        else if (eTemplate == "select") {
          await requiredElement.selectByIndex(1);
        } //end of else if statement with eTemplate as conditional
        await this.app.client.$("#greet").click(); //Just to make sure a blur event is triggered
      } //end of if statement with param.critical as conditional
    } //end of the for loop


    return this.app.client.$('#runbutton').isEnabled().then( enabled  => {
     expect( enabled ).to.equal( true );
    } );
  },*/,
  );
});
