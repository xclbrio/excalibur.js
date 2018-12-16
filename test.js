let mocha = require("mocha");
let assert = require("assert");

const Excalibur = require("./excalibur.js");
let excalibur = new Excalibur("https://kovan.infura.io", false, false);


describe("Transform from/to Wei", function() {

	describe("From wei to ether", function() {
		
		it("Output value 1", function() {
			assert.strictEqual(excalibur.transformWei(1E18, 'from'), "1", "This will passed");
		});

		it("Output value 2", function() {
			assert.strictEqual(excalibur.transformWei(1E10, 'from'), "0.00000001", "This will passed");
		});

		it("Output value 3", function() {
			assert.strictEqual(excalibur.transformWei("31138", 'from'), "0.000000000000031138", "This will passed");
		});

		it("Output value 4", function() {
			assert.strictEqual(excalibur.transformWei(31138, 'from'), "0.000000000000031138", "This will passed");
		});

	});

	describe("From ether to wei", function() {
		
		it("Output value 1", function() {
			assert.strictEqual(excalibur.transformWei(1E-18, 'to'), "1", "This will passed");
		});

	});

});