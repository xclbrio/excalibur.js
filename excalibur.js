/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|		 		 Module Description					|
	|													|
	|		 There will be a description of the 		|
	|   arguments of the methods for the class to work	|	
	-----------------------------------------------------
 */


// Import the "Web3" library and it's binding to a constant for working with it
const Web3 = require('web3');
// Import a configuration file and it's binding to a constant for working with it
const Settings = require("./config/settings.json");


// The "Excalibur" class which includes methods for working with it
class Excalibur {

	// Class constructor 
	constructor(inProviderID, isMainnetAddress = true, isWebsocketProvider = true) {
		// Creating a variable and assigning it the provider ID. The formal parameter should receive as input the actual parameter as a string
		this.providerID = inProviderID;
		// Importing the contract address from the "settings.json" file
		this.contractAddress = (isMainnetAddress === true) ? Settings.mainnetAddress : Settings.kovanAddress;
		// Creating an object "web3" from the library "Web3"
		this.web3 = (isWebsocketProvider === true) ? new Web3(new Web3.providers.WebsocketProvider(this.providerID)) : new Web3(new Web3.providers.HttpProvider(this.providerID));
		// Import ABI exchange from the file "settings.json"
		this.exchangeABI = Settings.exchangeABI;
		// Importing an ABI token from the file "settings.json"
		this.tokenABI = Settings.tokenABI;
		// Creating a variable that will work with contracts for the exchange (Exchange Contract)
		this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.contractAddress);
		// Creating a variable that will work with contracts for a token (Token Contract)
		this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.contractAddress);
		// Importing the library version from the file "settings.json"
		this.libraryVersion = Settings.libraryVersion;
	}

	// Getting an account by it's index
	async getAccount(accountIndex, callback) {
		await this.web3.eth.getAccounts(function(error, array) {
			if (!error) {
				callback(array[accountIndex]);
			} else {
				callback(error);
			}
		});
	}

	// Deposit some amount
	async makeDeposit(fromWhere, depositAmount, callback) {
		await this.exchangeContract.methods.deposit().send({from: fromWhere, value: depositAmount}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Withdraw funds
	async withdrawFunds(fromWhere, amountValue, callback) {
		await this.exchangeContract.methods.withdraw(amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Add some tokens
	async makeDepositToken(fromWhere, spender, token, amountValue, callback) {
		let tokenObject = new Object;
		await this.tokenContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
				tokenObject.approveHash = hash;
			} else {
				callback(error);
			}
		}).then(await this.exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
				tokenObject.depositHash = hash;
			} else {
				callback(error);
			}
		}));
		return await tokenObject;
	}

	// Withdraw tokens
	async withdrawTokens(fromWhere, token, amountValue, callback) {
		await this.exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Request a balance in the user account
	async getBalance(token, walletAddress, callback) {
		await this.exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error) {
				callback(cash);
			} else {
				callback(error);
			}
		});
	}

	// Get a cryptocurrency buy or sell order
	async getOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		await this.exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// To exchange tokens
	async swapTokens(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, amountValue, tokenPair, signature, callback) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = this.web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		await this.exchangeContract.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, tokenPair).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Cancel cryptocurrency buy or sell order
	async cancelOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, tokenPair, signature, callback) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = this.web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		await this.exchangeContract.methods.cancelOrder(getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, tokenPair).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Personal signature
	async personalSign(fromWhere, hash, callback) {
		await this.web3.eth.personal.sign(hash, fromWhere, function(error, result) {
			if (!error) {
				callback(result);
			} else {
				callback(error);
			}
		});
	}

	// Perform signature verification
	async checkSign(hash, signature, callback) {
		await this.web3.eth.personal.ecRecover(hash, signature, function(error, result) {
			if (!error) {
				callback(result);
			} else {
				callback(error);
			}
		});
	}

	// Get a hash order
	getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		return this.web3.utils.soliditySha3(this.exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
	}

	// Get a signature
	getSign(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let hash = this.getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(hash);
		return this.personalSign(fromWhere, hash);
	}

	// Get approve to use the funds
	async getFundsApprove(fromWhere, spender, amountValue, callback) {
		await this.exchangeContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Make a transfer of a some amount
	async makeTransfer(fromWhere, startPoint, endPoint, amountValue, callback) {
		await this.exchangeContract.methods.transferFrom(startPoint, endPoint, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash)
			} else {
				callback(error);
			}
		});
	}

	// Event creation order
	async orderEvent(callback) {
		await this.exchangeContract.events.Order({fromBlock: 0}, function(error, event) {
			if (!error) {
				callback(event);
			} else {
				callback(error);
			}
		});
	}

	// Transform Wei
	transformWei(transformValue, transformType = 'to', unit = 'ether') {
		let newValue = transformValue;
		if (typeof(newValue) !== "string") {
			newValue = String(newValue);
		}
		newValue = newValue.toUpperCase();
		if (~newValue.indexOf("E")) {
			let firstSlice = newValue.slice(0, newValue.indexOf("E", 0));
			let secondSlice = newValue.slice(newValue.indexOf("E", 0) + 1);
			if (+secondSlice > 0) {
				newValue = firstSlice + ".";
				for (let i = 0; i < +secondSlice; i++) {
					newValue = newValue + "0";
				}
			} else if (+secondSlice < 0) {
				if (firstSlice.length > -(+secondSlice)) {
					newValue = firstSlice.slice(0, firstSlice.length - -(+secondSlice)) + "." + firstSlice.slice(firstSlice.length - -(+secondSlice));
				} else {
					newValue = "0.";
					for (let i = 0; i < (-(+secondSlice) - firstSlice.length); i++) {
						newValue = newValue + "0";
					}
					newValue = newValue + firstSlice;
				}
			} else {
				newValue = firstSlice;
			}
		}
		if (transformType === 'to') {
			return this.web3.utils.toWei(newValue, unit);
		} else if (transformType === 'from') {
			return this.web3.utils.fromWei(newValue, unit);
		} else {
			console.log(`Transfrom type ${transformType} is not define.`);
			return newValue;
		}
	}

	// Information about the version of the library and the versions of the used additions to it
	versions() {
		console.log(`Excalibur library:  ver. ${this.libraryVersion}`);
		console.log(`Web3 library:  ver. ${this.web3.version}`);
	}
	
}

// Importing a library for use in other projects
module.exports = Excalibur;