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
			assert.strictEqual(excalibur.transformWei("1000000000000000000", 'from'), "1", "This will passed");
		});		

		it("Output value 3", function() {
			assert.strictEqual(excalibur.transformWei(1E10, 'from'), "0.00000001", "This will passed");
		});

		it("Output value 4", function() {
			assert.strictEqual(excalibur.transformWei("31138", 'from'), "0.000000000000031138", "This will passed");
		});

		it("Output value 5", function() {
			assert.strictEqual(excalibur.transformWei(31138, 'from'), "0.000000000000031138", "This will passed");
		});

	});

	describe("From ether to wei", function() {
		
		it("Output value 1", function() {
			assert.strictEqual(excalibur.transformWei(1E-18, 'to'), "1", "This will passed");
		});

		it("Output value 2", function() {
			assert.strictEqual(excalibur.transformWei("0.000000000000000001", 'to'), "1", "This will passed");
		});		

		it("Output value 3", function() {
			assert.strictEqual(excalibur.transformWei(1E-10, 'to'), "100000000", "This will passed");
		});

		it("Output value 4", function() {
			assert.strictEqual(excalibur.transformWei("31138", 'to'), "31138000000000000000000", "This will passed");
		});

		it("Output value 5", function() {
			assert.strictEqual(excalibur.transformWei(31138, 'to'), "31138000000000000000000", "This will passed");
		});

	});

	describe("From wei to kwei", function() {
		
		it("Output value 1", function() {
			assert.strictEqual(excalibur.transformWei(1E3, 'from', 'kwei'), "1", "This will passed");
		});

		it("Output value 2", function() {
			assert.strictEqual(excalibur.transformWei("10000", 'from', 'kwei'), "10", "This will passed");
		});		

		it("Output value 3", function() {
			assert.strictEqual(excalibur.transformWei(1E10, 'from', 'kwei'), "10000000", "This will passed");
		});

		it("Output value 4", function() {
			assert.strictEqual(excalibur.transformWei("31138", 'from', 'kwei'), "31.138", "This will passed");
		});

		it("Output value 5", function() {
			assert.strictEqual(excalibur.transformWei(31138, 'from', 'kwei'), "31.138", "This will passed");
		});

	});

	describe("From kwei to wei", function() {
		
		it("Output value 1", function() {
			assert.strictEqual(excalibur.transformWei(1E-3, 'to', 'kwei'), "1", "This will passed");
		});

		it("Output value 2", function() {
			assert.strictEqual(excalibur.transformWei("10000", 'to', 'kwei'), "10000000", "This will passed");
		});		

		it("Output value 3", function() {
			assert.strictEqual(excalibur.transformWei(1E-1, 'to', 'kwei'), "100", "This will passed");
		});

		it("Output value 4", function() {
			assert.strictEqual(excalibur.transformWei("31138", 'to', 'kwei'), "31138000", "This will passed");
		});

		it("Output value 5", function() {
			assert.strictEqual(excalibur.transformWei(31138, 'to', 'kwei'), "31138000", "This will passed");
		});

	});

});

/*
describe("Get information about library versions", function() {

	it("About versions:", function() {
		assert.
	});

});
*/