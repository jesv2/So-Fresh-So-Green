const expect = require("chai").expect;
const testUtils = require("./utils");

// TESTING THE RUN BUTTON'S EVENT HANDLER TO EXECUTE THE SST //

describe("TEST RUN BUTTON'S EVENT HANDLER", () => {
  beforeEach(testUtils.beforeEach);

  it("Executing the SST does not throw an error", function() {
    //this.app.client.renderer = require( "../renderer.js" );
    //this.app.client.renderer.SetCmd( [ "PDFAlchemist", "PDF Alchemist User Guide.pdf", "." ] );

    const runBtn = this.app.client.$("#runbutton");
    //this.app.client.cmd = [ "PDFAlchemist", "PDF Alchemist User Guide.pdf", "." ]
    expect(runBtn.click).to.not.throw();
  });

  it("Executing the SST throws an error", function() {
    //const renderer = require( "../renderer.js" );
    //let renderer = require( "../renderer.js" );
    //renderer.SetCmd( [ "PDFAlchemist" ] );

    const runBtn = this.app.client.$("#runbutton");
    //this.app.client.cmd = [ "PDFAlchemist", "PDF Alchemist User Guide.pdf", "." ]
    expect(runBtn.click).to.throw();
  });

  afterEach(testUtils.afterEach);
});
