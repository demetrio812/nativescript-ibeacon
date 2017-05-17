var NativescriptIbeacon = require("nativescript-ibeacon").NativescriptIbeacon;
var nativescriptIbeacon = new NativescriptIbeacon();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(nativescriptIbeacon.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(nativescriptIbeacon.functionname()).toEqual(jasmine.any(Promise));
  });
});