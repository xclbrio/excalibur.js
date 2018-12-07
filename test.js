//Binding a class to a variable
const Excalibur = require("./excalibur.js");
//Create "exchange" object
let exchange = new Excalibur("wss://infura.io/ws", true);

exchange.versions();
