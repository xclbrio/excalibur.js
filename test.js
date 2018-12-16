let mocha = require("mocha");
let chai = require("assert");

const Excalibur = require("./excalibur.js");
let excalibur = new Excalibur("https://kovan.infura.io", false, false);


describe("TransformWei", function() {
	it("Output data", function() {
		assert.equal(, expected, message);
	});
});


/*
describe("Output versions", function() {
	it("About versions", function() {
		assert.equal(excalibur.versions(), "", "this wil passed");
	});
});
*/