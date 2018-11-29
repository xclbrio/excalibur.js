/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|				    Version 0.0.1			  		|
	|		 		  Module Description				|
	|													|
	|		 There will be a description of the 		|
	|	arguments of the methods for the class to work	|	
	-----------------------------------------------------
 */


//This’s main class of anything related Ethereum
//Binding a class "Web3" to a constant
const Web3 = require("web3");
//Binding a file "settings.json"
//<script src = "./settings.js"> </script>/
//Announcement of the constant "providerID", you can use your provider ID value
const providerID = "wss://kovan.infura.io/ws";
//Creating "web3" constant from class "Web3"
const web3 = new Web3(new Web3.providers.HttpProvider(providerID));





//Class "Exchange", which includes methods for working with it
class Exchange {


	//Class constructor
	constructor() {
		//Create ABI (Application Binary Interface) constant for Exchnage
		this.exchangeABI = Settings.exchangeABI;
		//Create Contract Adress constant for Exchange
		this.exchangeAdress = Settings.exchangeAdress;
		//This object-variable stores the Smart Contract created by "web3.js"
		this.exchangeContract = new web3.eth.Contract(this.exchangeABI, this.exchangeAdress);
		//This variable stores the library version
		this.libraryVersion = Settings.libraryVersion;
	}


	//Get account details
	getAccount() {

	}



	//Information about the use of the library and it's variables and function's arguments
	usageInformation() {
		console.log(`To use the library, you must associate the "excalibur.js" file with a constant characterizing the imported class.`);
		console.log(`Then you should call the constructor for your variable that inherits all the methods and properties of the class.`);
		console.log(`Initialization successful, your variable has access to the methods of this class.`);
		console.log(`Now all the methods and fields of the class are available to your object; for further use you should read library description.`);
	}



	//About versions of this library and Web3 library
	aboutLibraryAndUseExtensionVersion() {
		console.log(`'excalibur.js' version: ${this.libraryVersion}`);
		console.log(`'web3.js' version: ${web3.version}`);
	}
}


module.exports = Exchange;





