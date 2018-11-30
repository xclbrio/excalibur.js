/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|				    Version 0.0.5			  		|
	|		 		  Module Description				|
	|													|
	|		 There will be a description of the 		|
	|	arguments of the methods for the class to work	|	
	-----------------------------------------------------
 */


//This’s main class of anything related Ethereum

// Importing and binding a class "Web3" to a constant
const Web3 = require("web3");
// Importing and binding a class to a constant
const Settings = require("./settings.json");


// Class "Exchange", which includes methods for working with it
class Exchange {

	// Exchange class constructor
	constructor(inProviderID, inExchangeAddress) {
		
		// The "inProviderID" parameter has only two states, true or false. This parameter decides which ID provider will be used.
		if (inProviderID === true) {
			// Announcement of the variable "providerID"
			this.providerID = Settings.firstProviderID;
		} else {
			// Announcement of the variable "providerID"
			this.providerID = Settings.secondProviderID;
		}

		// The "inExchangeAddress" parameter has only two states, true or false. This parameter decides which address will be used.
		if (inExchangeAddress === true) {
			// Announcement of the variable "exchangeAddress"
			this.exchangeAddress = Settings.firstExchangeAddress;
		} else {
			// Announcement of the variable "exchangeAddress"
			this.exchangeAddress = Settings.secondExchangeAddress;
		}


		// For debugging
		console.log(this.providerID);
		console.log(this.exchangeAddress);


		// Creating "web3" constant from class "Web3" with your provider ID value
		this.web3 = new Web3(new Web3.providers.HttpProvider(this.providerID));

		// Importing an exchnageABI structure from "settings.json"
		this.exchangeABI = Settings.exchangeAbi;

		// Importing an tokenABI structure from "settings.json"
		this.tokenABI = Settings.tokenAbi;

		// Importing an pairsABI structure from "settings.json"
		this.pairsABI = Settings.pairs;

		// This object-variable stores the Smart Contract created by "web3.js" (Exchange Contract) 
		this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.exchangeAddress);

		// This object-variable stores the Smart Contract created by "web3.js" (Token Contract) 
		this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.exchangeAddress);

		// Importing a variable holding the library version from "settings.json"
		this.libraryVersion = Settings.libraryVersion;
		
	}


	// Get account details (not working (optional async/await))
	async getAccount(accountIndex) {
		let account = [];
		await web3_.eth.getAccounts();
		return account[accountIndex_];
	}


	// Make a deposit
	async makeDeposit(fromWhere_, amount_, CALLBACK) {
		let temporaryValue;
		await this.exchangeContract.methods.deposit().send({from: fromWhere, value: amount},
			function(error, hash) {
				if (!error) {
					temporaryValue = hash;
					CALLBACK(hash);
				}
			});
		return await temporaryValue;
	}


	// Request a wallet balance
	async getUserBalance(token_, user_) {
		let temporaryValue;
		await this.exchangeContract.methods().balanceOf(token_, user_).call(
			function(error, result) {
				if (!error) {
					temporaryValue = result;
				}
			});
		return await temporaryValue;
	}




	// Information about the use of the library and it's variables and function's arguments
	usageInformation() {
		console.log(`To use the library, you must associate the "excalibur.js" file with a constant characterizing the imported class.`);
		console.log(`Then you should call the constructor for your variable that inherits all the methods and properties of the class.`);
		console.log(`Initialization successful, your variable has access to the methods of this class.`);
		console.log(`Now all the methods and fields of the class are available to your object; for further use you should read library description.`);
	}



	// About versions of this library and Web3 library
	aboutLibraryAndUseExtensionVersion() {
		console.log(`'excalibur.js' version: ${this.libraryVersion}`);
		console.log(`'web3.js' version: ${this.web3.version}`);
	}
}

// Importing module for other projects
module.exports = Exchange;





