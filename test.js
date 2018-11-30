//Binding a class to a variable
const Exchange = require("./excalibur.js");
//Create "exchange" object
let exchange1 = new Exchange(false, false);

let exchange2 = new Exchange(false, true);

let exchange3 = new Exchange(true, false);

let exchange4 = new Exchange(true, true);


exchange1.getUserBalance(token, user);
exchange1.getUserBalance(token, user);
exchange3.getUserBalance(token, user);
exchange4.getUserBalance(token, user);


exchange1.usageInformation();


//Get information about this library and extension version
exchange1.aboutUsedVersion();
