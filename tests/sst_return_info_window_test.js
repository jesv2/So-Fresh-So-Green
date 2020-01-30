const expect = require("chai").expect;
const testUtils = require("./utils");

/*
 * Test Group Name: SST Return Info Window
 * Description:
 */
describe("SST RETURN INFO WINDOW", () => {
  beforeEach(testUtils.beforeEach);
  afterEach(testUtils.afterEach);

  it("Should pass if window exists.", function() {
    return this.app.client.isExisting("#returnInfo").then(window => {
      expect(window).to.equal(true);
    });
  });

  it("Should pass if window label is correct.", function() {
    return this.app.client.getText("#retInfoLabel").then(text => {
      expect(text).that.includes("SST Info");
    });
  });

  it("Should pass if window has correct text.", function() {
    return this.app.client.getText("#returnInfo").then(text => {
      expect(text).to.equal("");
    });
  });

  /*
    //This test needs to be rewritten with the knowledge that the run button is grayed out until critical parameters are filled
    // once window is loaded click on the run button to run PDF2Print without a PDF file
    it('Should pass if the SST window shows return error for PDFAlchemist.', function(){
        const runBtn = this.app.client.$('#runbutton');
        //test.pdf
        //NoWhere
        runBtn.click();
        return this.app.client.waitUntilTextExists('#returnInfo','Error: Command failed: PDFAlchemist');    
    });
*/
});
