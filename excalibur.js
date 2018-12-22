/*!
 * excalibur.js - Excalibur_ JavaScript Library
 *
 * @license Apache-2.0
 * @see https://github.com/xclbrio/excalibur.js
*/

/*
 * excalibur.js is free software: you can redistribute it and/or modify
 * it under the terms of the Apache-2.0 General Public License.
 * 
 * excalibur.js is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Apache-2.0 General Public License for more details.
 * 
 * You should have received a copy of the Apache-2.0 General Public License
 * along with excalibur.js.
 *
 * @file excalibur.js
 * @authors:
 *   Ilya Solovyanov <ilya@xclbr.io>
 *   Ruslan Vasiliev <ruslan@xclbr.io>
 *   Dmitriy Novikov <dmitriy@xclbr.io>
 * @date 2018
 */

// Import the `Web3` library and it's binding to a constant for working with it
const Web3 = require('web3');
// Import the `Ehereumjs-tx` library and it's binding to a constant for working with it
const EthereumTX = require('ethereumjs-tx');
// Import a configuration file and it's binding to a constant for working with it
const Settings = require("./config/settings.json");


// The `Excalibur` class constructor which includes methods for working with it
function Excalibur(inProviderID, isMainnetAddress = true, isWebsocketProvider = true) {

	// Creating a variable and assigning it the provider ID. The formal parameter should receive as input the actual parameter as a string
	let providerID = inProviderID;
	// Importing the contract address from the `settings.json` file
	let contractAddress = (isMainnetAddress === true) ? Settings.mainnetAddress : Settings.kovanAddress;
	// Creating an object `web3` from the library `Web3`
	let web3 = (isWebsocketProvider === true) ? new Web3(new Web3.providers.WebsocketProvider(providerID)) : new Web3(new Web3.providers.HttpProvider(providerID));
	// Import exchange ABI from `settings.json`
	let exchangeABI = Settings.exchangeABI;
	// Importing token ABI from `settings.json`
	let tokenABI = Settings.tokenABI;
	// Creating a variable that will work with contracts for the exchange contract
	let exchangeContract = new web3.eth.Contract(exchangeABI, contractAddress);
	// Creating a variable that will work with ERC20 contract
	let tokenContract = new web3.eth.Contract(tokenABI, contractAddress);
	// Importing the library version from the file `settings.json`
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

	// Deposit ETH
	this.makeDeposit = async function(fromWhere, depositAmount, callback) {
		await exchangeContract.methods.deposit().send({from: fromWhere, value: depositAmount}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Withdraw ETH
	this.withdrawFunds = async function(fromWhere, withdrawValue, callback) {
		await exchangeContract.methods.withdraw(withdrawValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Token deposit
	this.makeDepositToken = async function(fromWhere, token, tokenDepositValue, callback) {
		let tokenObject = new Object;
		await tokenContract.methods.approve(contractAddress, tokenDepositValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
				tokenObject.approveHash = hash;
			} else {
				callback(error);
				tokenObject.approveHash = error;
			}
		}).then(await exchangeContract.methods.withdrawToken(token, tokenDepositValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
				tokenObject.depositHash = hash;
			} else {
				callback(error);
				tokenObject.depositHash = error;
			}
		}));
		return await tokenObject;
	}

	// Withdraw tokens
	this.withdrawTokens = async function(fromWhere, token, withdrawTokensValue, callback) {
		await exchangeContract.methods.withdrawToken(token, withdrawTokensValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Get wallet balance
	this.getBalance = async function(token, walletAddress, callback) {
		await exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error) {
				callback(cash);
			} else {
				callback(error);
			}
		});
	}

	// Set order
	this.setOrder = async function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		await exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Execute the order
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

	// Cancel order
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
	personalSign = async function(fromWhere, hash, callback) {
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

	// Get order hash
	getOrderHash = function(getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		return web3.utils.soliditySha3(exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
	}

	// Get a signature
	this.getSign = function(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let temporaryObject = {};
		temporaryObject.hash = getOrderHash(getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(temporaryObject.hash);
		personalSign(fromWhere, temporaryObject.hash, function(response) {
			temporaryObject.sign = response;
		});
		return temporaryObject;
	}

	// Give approve for the tokens amount
	this.giveApprove = async function(fromWhere, amountValue, callback) {
		await exchangeContract.methods.approve(contractAddress, amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error) {
				callback(hash);
			} else {
				callback(error);
			}
		});
	}

	// Transfer from another wallet
	this.makeTransfer = async function(startPoint, endPoint, amountValue, callback) {
		await exchangeContract.methods.transferFrom(startPoint, endPoint, amountValue).send({from: startPoint}, function(error, hash) {
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

	// Sign transaction with private key and send this transaction
	signAndSend = function(contractFunction, functionABI, currentContractAddress, account, privateKey, gasPriceValue, inValue, getHash, callback) {
		let estimatedGas, nonce;
		contractFunction.estimateGas({from: account}).then(gasAmount => {
			estimatedGas = gasAmount.toString(16);
			console.log(`Estimated gas: ${estimatedGas}`);
			web3.eth.getTransactionCount(account).then(nonceValue => {
				nonce = nonceValue.toString(16);
				console.log(`Nonce: ${nonce}`);
				let txParameters = {
					gasPrice: gasPriceValue,
					gasLimit: 3000000,
					to: currentContractAddress,
					data: functionABI,
					from: account,
					nonce: '0x' + nonce,
					value: inValue
				};
				let tx = new EthereumTX(txParameters);
				tx.sign(privateKey);
				let txSerialized = tx.serialize();
				web3.eth.sendSignedTransaction('0x' + txSerialized.toString('hex')).once('transactionHash', function(hash) {
					getHash(hash);
					console.log(hash);
				}).then(receipt => {
					callback(receipt);
				}).catch(error => console.log(error));
			});
		});
	}

	// Deposit amount without MetaMask
	this.makeDepositLocal = function(account, privateKey, gasPriceValue, etherValue, getHash) {
		let depositFunction = exchangeContract.methods.deposit();
		let depositABI = depositFunction.encodeABI();
		signAndSend(depositFunction, depositABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash);
	}

	// Withdraw funds without MetaMask
	this.withdrawFundsLocal = function(account, privateKey, gasPriceValue, tokenValue, etherValue, getHash) {
		let withdrawFunction = exchangeContract.methods.withdraw(tokenValue);
		let withdrawABI = withdrawFunction.encodeABI();
		signAndSend(withdrawFunction, withdrawABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash);
	}

	// Deposit tokens without MetaMask
	this.makeDepositTokenLocal = function(token, account, privateKey, gasPriceValue, tokenValue, etherValue, getHash) {
		let approveFunction = tokenContract.methods.approve(contractAddress, tokenValue);
		let approveABI = approveFunction.encodeABI();
		let depositTokenFunction = exchangeContract.methods.depositToken(token, tokenValue);
		let depositTokenABI = depositTokenFunction.encodeABI();
		signAndSend(txValue, approveFunction, approveABI, token, account, privateKey, gasPriceValue, etherValue, getHash, function(response) {
			console.log(response);
			signAndSend(depositTokenFunction, depositTokenABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash, response => console.log(response));
		});
	}

	// Tokens withdraw without MetaMask
	this.withdrawTokensLocal = function(token, account, privateKey, gasPriceValue, tokenValue, etherValue, getHash) {
		let withdrawTokensFunction = exchangeContract.methods.withdrawToken(token, tokenValue);
		let withdrawTokensABI = withdrawTokensFunction.encodeABI();
		signAndSend(withdrawTokensFunction, withdrawTokensABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash, response => console.log(response));
	}

	// Tokens exchange without MetaMask
	this.swapTokensLocal = function(account, privateKey, gasPriceValue, getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, signature, tokenValue, etherValue, tokenPair, getHash) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		let tradeFunction = exchangeContract.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, tokenValue, tokenPair);
		let tradeABI = tradeFunction.encodeABI();
		console.log(tradeFunction);
		signAndSend(tradeFunction, tradeABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash, function(response) {
			console.log(response);
		});
	}

	// Cancel cryptocurrency buy or sell order without MetaMask
	this.cancelOrderLocal = function(account, privateKey, gasPriceValue, getToken, getAmount, giveToken, giveAmount, expires, nonce, signature, etherValue, tokenPair, getHash) {
		let temporaryValue = signature.slice(2);
		let r = '0x' + temporaryValue.slice(0, 64);
		let s = '0x' + temporaryValue.slice(64, 128);
		let v = web3.utils.toDecimal('0x' + temporaryValue.slice(128, 130));
		let cancelOrderFunction = exchangeContract.methods.cancelOrder(getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, tokenPair);
		let cancelOrderABI = cancelOrderFunction.encodeABI();
		signAndSend(cancelOrderFunction, cancelOrderABI, contractAddress, account, privateKey, gasPriceValue, etherValue, getHash);
	}

	// Transform from/to wei
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

	// Information about library version and the versions of the used additions to it
	this.version = function() {
		console.log(`Excalibur_ library:  ver. ${libraryVersion}`);
		console.log(`Web3 library:  ver. ${web3.version}`);
	}

}

// Export library
module.exports = Excalibur;
