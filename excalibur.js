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


// Класс "Excalibur" для работы со смарт-контрактами.

// Импорт билиотеки "Web3" и ее связывание с константой для работы с ней.
const Web3 = require('web3');
// Импортирование конфигурационного файла и его связывание с константой для работы с ним.
const Settings = require("./config/settings.json");


// Класс "Excalibur", который включает методы для работы с ним.
class Excalibur {

	// Конструктор класса
	constructor(inProviderID, inContractAddress) {
		// Создание переменной и присваивание ей идентификатор провайдера. Формальный параметр должен получать на вход фактический параметр в виде строки.
		this.providerID = inProviderID;
		// Формальный параметр "inExchangeAddress" должен иметь одно из двух состояний: 'true' или 'false'. Позволяет выбрать адрес биржи к которому необходимо подсоединиться.
		// Импортирование адреса контракта из файла "settings.json".
		this.contractAddress = ((inContractAddress === true) ? Settings.firstContractAddress : Settings.secondContractAddress);
		// Создание объекта "web3" от библиотеки "Web3".
		this.web3 = new Web3(new Web3.providers.WebsocketProvider(this.providerID));
		// Импортирование ABI биржи из файла "settings.json".
		this.exchangeABI = Settings.exchangeABI;
		// Импортирование ABI токена из файла "settings.json".
		this.tokenABI = Settings.tokenABI;
		// Создание переменной, которая будет осуществлять работу с контрактами для биржи (Exchange Contract).
		this.exchangeContract = new this.web3.eth.Contract(this.exchangeABI, this.contractAddress);
		// Создание переменной, которая будет осуществлять работу с контрактами для токена (Token Contract).
		this.tokenContract = new this.web3.eth.Contract(this.tokenABI, this.contractAddress);
		// Импортирование версии библиотеки из файла "settings.json".
		this.libraryVersion = Settings.libraryVersion;
	}


	// Получение аккаунта по его индексу
	async getAccount(accountIndex) {
		let arrayAccounts;
		await web3.eth.getAccounts(function(error, array) {
			if (!error)
				arrayAccounts = array;
		});
		return await arrayAccounts[accountIndex];
	}


	// Внести некоторую сумму
	async makeDeposit(fromWhere, depositAmount, callback) {
		let depositValue;
		await this.exchangeContract.methods.deposit().send({from: fromWhere, value: depositAmount}, function(error, hash) {
			if (!error)
				depositValue = hash;
			callback(hash);
		});
		return await depositValue;
	}


	// Вывестти средства
	async withdrawalFunds(fromWhere, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdraw(amountValue).send({from: fromWhere}, function(error, hash) {
			if (!error)
				withdrawalValue = hash;
			callback(hash);
		});
		return await withdrawalValue;
	}


	// Внести некоторое количество токенов
	async makeDepositToken() {

	}


	// Вывести токены
	async withdrawalTokens(fromWhere, token, amountValue, callback) {
		let withdrawalValue;
		await this.exchangeContract.methods.withdrawToken(token, amount).send({from: fromWhere}, function(error, hash) {
			if (!error)
				withdrawalValue = hash;
			callback(hash);
		});
		return await withdrawalValue;
	}


	// Запросить баланс
	async getBalance(token, walletAddress) {
		let balanceValue;
		await this.exchangeContract.methods.balanceOf(token, walletAddress).call(function(error, cash) {
			if (!error)
				balanceValue = cash;
		});
		return await balanceValue;
	}


	// Ордер на покупку/продажу криптовалюты
	async getOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce) {
		let temporaryValue;
		await this.exchangeContract.methods.order(getToken, getAmount, giveToken, giveAmount, expires, nonce).send({from: fromWhere}, function(error, hash) {
			if (!error)
				temporaryValue = hash;
		});
		return await temporaryValue;
	}


	// Обменять токены
	async swapTokens(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, pairTokens, callback) {
		let temporaryValue;
		await this.exchangeContract.methods.trade(getToken, getAmount, giveToken, giveAmount, expires, nonce, walletAddress, v, r, s, amountValue, pairTokens).send({from: fromWhere}, function(error, hash) {
			if (!error)
				temporaryValue = hash;
			callback(hash);
		});
		return await temporaryValue;
	}


	// Отменить ордер на покупку/продажу криптовалюты
	async cancelOrder(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, amountValue, pairTokens, callback) {
		let temporaryValue;
		await this.exchangeContract.methods.cancelOrder(getToken, getAmount, giveToken, giveAmount, expires, nonce, v, r, s, amountValue, pairTokens).send({from: fromWhere}, function(error, hash) {
			if (!error)
				temporaryValue = hash;
			callback(hash);
		});
		return await temporaryValue;
	}


	// Персональная подпись
	async personalSign(fromWhere, hash) {
		let signResult;
		await this.web3.eth.personal.sign(hash, fromWhere, function(error, result) {
			if (!error)
				signResult = result;
		});
		return await signResult;
	}


	// Проверить подпись
	async checkSign(hash, signature) {
		let checkResult;
		await this.web3.personal.ecRecover(hash, signature, function(error, result) {
			if (!error)
				checkResult = result;
		});
		return await checkResult;
	}


	// Получить подпись (какой контракт сюда передается)
	getSign(fromWhere, getToken, getAmount, giveToken, giveAmount, expires, nonce, callback) {
		let hash = this.orderHash(this.web3, this.exchangeContract, getToken, getAmount, giveToken, giveAmount, expires, nonce);
		callback(hash);
		return this.sign(this.web3, fromWhere, hash);
	}


	// Information about the use of the library and it's variables and function's arguments
	usageInformation() {
		console.log(`To use the library, you must associate the "excalibur.js" file with a constant characterizing the imported class.`);
		console.log(`Then you should call the constructor for your variable that inherits all the methods and properties of the class.`);
		console.log(`Initialization successful, your variable has access to the methods of this class.`);
		console.log(`Now all the methods and fields of the class are available to your object; for further use you should read library description.`);
	}


	// Информация о версии библиотеки и о версиях используемых дополнениях к ней
	aboutVersions() {
		console.log(`Excalibur library:  ver. ${this.libraryVersion}`);
		console.log(`Web3 library:  ver. ${this.web3.version}`);
	}
}

// Импортирование библиотеки для использования в других проектах
module.exports = Excalibur;





