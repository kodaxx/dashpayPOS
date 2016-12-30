/*jslint browser: true*/
/*global $, console, key, BIP32, jQuery, alert*/

//to change from mainnet to testnet change 'test' to 'prod' in this file
//and change 0x8b to 0x4c in wizard.js
//$(document).ready(function () {
//
//	var server = localStorage.getItem('server');
//	var termId = "xPubUniqueTerm";
//	var socket = io(server);
//
//	socket.on('connect', function () {
//		stat = $('#status');
//		stat.text("connected");
//		stat.attr('class', 'connected');
//		socket.emit('term:id', termId, function (data) {
//			console.log("term:id:ack: ", data);
//		});
//	});
//	socket.on('disconnect', function () {
//		stat = $('#status');
//		stat.text("not conneted");
//		stat.attr('class', 'notConnected');
//	});
//});

//gernerate QR codes with Dash URI
function generateQR(div, px, address, amount, merchant) {
	$(div).qrcode({
				render: 'canvas',

				// version range somewhere in 1 .. 40
				minVersion: 1,
				maxVersion: 40,

				// error correction level: 'L', 'M', 'Q' or 'H'
				ecLevel: 'L',

				// offset in pixel if drawn onto existing canvas
				left: 0,
				top: 0,

				// size in pixel
				size: px,

				// code color or image element
				fill: '#000',

				// background color or image element, null for transparent background
				background: null,

				// dash uri with 'use instantsend' checked TODO: add label with store name
				text: "dash:" + address + "?amount=" + amount + "&label=" + merchant + "&is=1",

				// corner radius relative to module width: 0.0 .. 0.5
				radius: 0.2,

				// quiet zone in modules
				quiet: 0,

				// modes
				// 0: normal
				// 1: label strip
				// 2: label box
				// 3: image strip
				// 4: image box
				mode: 0,

				mSize: 0.1,
				mPosX: 0.5,
				mPosY: 0.5,

				label: 'no label',
				fontname: 'sans',
				fontcolor: '#000',

				image: null
			})
}

//precision (8 decimal) rounding for dash
function roundNumber(num, dec) {
	return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}


//function to generate HD addresses
var chain = null;

function generateAddress(chain, index) {

	chain = key.derive_child(0);

	if (chain) {
		var childkey = chain.derive_child(index),
			childaddr = childkey.eckey.getBitcoinAddress().toString();
		return childaddr;

	} else {
		console.log("something went wrong");
	}
}

//add number to input
function addNumber(e) {
	//document.getElementById('PINbox').value = document.getElementById('PINbox').value+element.value;
	var v = $("#PINbox").val();
	$("#PINbox").val(v + e.value);
}

//clear input
function clearForm(e) {
	//document.getElementById('PINbox').value = "";
	$("#PINbox").val("");
}

//function to cancel sale
function goBack() {
	$("#PINbox").val("");
	$("#home").toggleClass("hidden");
	$("#newSale").toggleClass("hidden");
}

//when 'enter' is clicked on newsale pad
function submitForm(e) {
	//if input is empty. todo: change from alert to something more fancy
	if (e.value === "" || e.value == 0) {
		alert("Please enter a price");
	} else {
		//get current dash price in usd
		$.getJSON("https://api.coinmarketcap.com/v1/ticker/dash/", function (data) {
			//rounding to get 2 decimals
			price = Math.round(data[0].price_usd * 100) / 100;
		});

		//get address index, xpub, storeName from local storage
		var index = parseInt(localStorage.getItem('indexSource'), 10),
			source_key = localStorage.getItem('xpubKey'),
			merchant = encodeURI(localStorage.getItem('storeName'));

		Bitcoin.setNetwork('test'); //prod for mainnet and test for testnet

		//create new key instance
		key = new BIP32(source_key);

		var address = generateAddress("receive", index),
			amount = roundNumber((e.value / price), 8);
		
		console.log(index + ": " + address);
		console.log("Dash amount: " + amount);
		console.log("Store Name: " + merchant);

//		var server = localStorage.getItem('server'),
//			termId = "xPubUniqueTerm",
//			socket = io(server);
//
//		// Verify amount input
//		af = parseFloat(amount);
//		if (isNaN(af)) {
//			// ToDo Warn of error
//			// This is not a valid amount
//			return false;
//		}
//		if (af > 900719) {
//			// ToDo Warn of error
//			// Would overflow in dash units
//			return false;
//		}
//		// ToDo Verify Address input
//		data = JSON.stringify({
//			amount: Math.ceil(af * 100000000),
//			address: address,
//			terminal: termId
//		});
//
//		socket.emit('watch:add', data, function (data) {
//			console.log("watch:add:ack: ", data);
//		});
//		return false;
//
//		socket.on('term:watch:end', function (msg) {
//			console.log("term:watch:end: ", msg);
//			// ToDo Add end transaction
//		});

		if ($(window).width() > 330) {
			//generate qr code
			generateQR('#qrcode', 256, address, amount, merchant);
		} else {
			//generate qr code
			generateQR('#qrcode', 200, address, amount, merchant);
		}

		//increment address index by one
		var newIndex = index + 1;

		//store new index in local storage
		localStorage.setItem('indexSource', newIndex);

		//set dash/cash prices
		$("#cashFinal").text(e.value);
		$("#dashFinal").text(Math.round(amount * 100) / 100);

		//hide input pad and show qr screen
		$("#newSale").toggleClass("hidden");
		$("#qr").toggleClass("hidden");

	}
}