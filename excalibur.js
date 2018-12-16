/*
	-----------------------------------------------------
	|			   Decentralized Exchange	 			|
	-----------------------------------------------------
	|		  Exchange smart contract methods			|
	|		 		 Module Description					|
	|													|
	| This class allows you to create a smart contract, |
	|	and also provides methods for working with it.	|
	-----------------------------------------------------
 */


// Import the "Web3" library and it's binding to a constant for working with it
const Web3 = require('web3');
// Import a configuration file and it's binding to a constant for working with it
const Settings = require("./config/settings.json");


// The "Excalibur" class constructor which includes methods for working with it
function Excalibur(inProviderID, isMainnetAddress = true, isWebsocketProvider = true) {

	// Creating a variable and assigning it the provider ID. The formal parameter should receive as input the actual parameter as a string
	let providerID = inProviderID;
	// Importing the contract address from the "settings.json" file
	let contractAddress = (isMainnetAddress === true) ? Settings.mainnetAddress : Settings.kovanAddress;
	// Creating an object "web3" from the library "Web3"
	let web3 = (isWebsocketProvider === true) ? new Web3(new Web3.providers.WebsocketProvider(providerID)) : new Web3(new Web3.providers.HttpProvider(providerID));
	// Import ABI exchange from the file "settings.json"
	let exchangeABI = Settings.exchangeABI;
	// Importing an ABI token from the file "settings.json"
	let tokenABI = Settings.tokenABI;
	// Creating a variable that will work with contracts for the exchange (Exchange Contract)
	let exchangeContract = new web3.eth.Contract(exchangeABI, contractAddress);
	// Creating a variable that will work with contracts for a token (Token Contract)
	let tokenContract = new web3.eth.Contract(tokenABI, contractAddress);
	// Importing the library version from the file "settings.json"
	let libraryVersion = Settings.libraryVersion;


	// Getting an account by it's index
	this.getAccount = async function(accountIndex, callback) {
		await web3.eth.getAccounts(function(error, array) {
			if (!error) {
				callback(array[accountIndex]);
			} else {
				callback(error);
			}
		});
	}

	// Deposit some amount
	this.makeDeposit = async function(fromWhere, depositAmount, callback) {
		await exchangeContract.methods.deposit().send({from: fromWhere, value: depositAmount}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Withdraw funds
	this.withdrawFunds = async function(fromWhere, amountValue, callback) {
		await exchangeContract.methods.withdraw(amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Add some tokens
	this.makeDepositToken = async function(fromWhere, spender, token, amountValue, callback) {
		let tokenObject = new Object;
		await tokenContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
				tokenObject.approveHash = hash;
			} else {
				callback(error);
			}
		}).then(await exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
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
	this.withdrawTokens = async function(fromWhere, token, amountValue, callback) {
		await exchangeContract.methods.withdrawToken(token, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Request a balance in the user account
	this.getBalance = async function(token, walletAddress, callback) {
		await exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error) {
				callback(cash);
			} else {
				callback(error);
			}
		});
	}

	// Get a cryptocurrency buy or sell order
	this.getOrder = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		await exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// To exchange tokens
	this.swapTokens = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, amountValue, tokenPair, signature, callback) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		await exchangeContract.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, tokenPair).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Cancel cryptocurrency buy or sell order
	this.cancelOrder = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, tokenPair, signature, callback) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		await exchangeContract.methods.cancelOrder(getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, tokenPair).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Personal signature
	this.personalSign = async function(fromWhere, hash, callback) {
		await web3.eth.personal.sign(hash, fromWhere, function(error, result) {
			if (!error) {
				callback(result);
			} else {
				callback(error);
			}
		});
	}

	// Perform signature verification
	this.checkSign = async function(hash, signature, callback) {
		await web3.eth.personal.ecRecover(hash, signature, function(error, result) {
			if (!error) {
				callback(result);
			} else {
				callback(error);
			}
		});
	}

	// Get a hash order
	this.getOrderHash = function(getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		return web3.utils.soliditySha3(exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
	}

	// Get a signature
	this.getSign = function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let hash = getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(hash);
		return personalSign(fromWhere, hash);
	}

	// Get approve to use the funds
	this.getFundsApprove = async function(fromWhere, spender, amountValue, callback) {
		await exchangeContract.methods.approve(spender, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Make a transfer of a some amount
	this.makeTransfer = async function(fromWhere, startPoint, endPoint, amountValue, callback) {
		await exchangeContract.methods.transferFrom(startPoint, endPoint, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Event creation order
	this.orderEvent = async function(callback) {
		await exchangeContract.events.Order({fromBlock: 0}, function(error, event) {
			if (!error) {
				callback(event);
			} else {
				callback(error);
			}
		});
	}

	// Transform Wei
	this.transformWei = function(transformValue, transformType = 'from', unit = 'ether') {
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
			return web3.utils.toWei(newValue, unit);
		} else if (transformType === 'from') {
			return web3.utils.fromWei(newValue, unit);
		} else {
			console.log(`Transfrom type ${transformType} is not define.`);
			return newValue;
		}
	}

	// Information about the version of the library and the versions of the used additions to it
	this.versions = function() {
		console.log(`Excalibur_ library:  ver. ${libraryVersion}`);
		console.log(`Web3 library:  ver. ${web3.version}`);
	}

}

// Exporting the library for use in other projects
module.exports = Excalibur;