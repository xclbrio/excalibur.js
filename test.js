//Binding a class to a variable
const Excalibur = require("./excalibur.js");
//Create "exchange" object
let excalibur = new Excalibur("https://kovan.infura.io", false);

/*
let balance;
var balance1 = excalibur.getBalance("0x0000000000000000000000000000000000000000", "0xF9d8C6428265Da56613B38af462a8a80A2EA6AFf").then(function(response) {
	balance = transformWei(response, 'from');
	console.log(balance);
	console.log(response);

});

*/

let balance = excalibur.getBalance("0x0000000000000000000000000000000000000000", "0xF9d8C6428265Da56613B38af462a8a80A2EA6AFf").then(function(response) {
	console.log(response);
	console.log(excalibur.transformWei(response, 'from'));
});



//console.log(`Баланс = ${balance}`);

//excalibur.versions();