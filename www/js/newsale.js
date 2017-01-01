/*jslint browser: true*/
/*global $, console, key, BIP32, jQuery, alert*/

//to change from mainnet to testnet change 'test' to 'prod' in this file
//and change 0x8b to 0x4c in wizard.js
$(document).ready(function () {
	// First, checks if it isn't implemented yet.
	if (!String.prototype.format) {
		String.prototype.format = function () {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function (match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}

	function randHash() {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	// Temp code, spec xPub hash
	var termId = "xPubKeyHashTerm2";
	if (localStorage.xPubKeyHashTerm) {
		termId = localStorage.xPubKeyHashTerm;
	} else {
		termId = randHash();
		localStorage.xPubKeyHashTerm = termId;
	}
	// Temp code, spec xPub hash
	var watchId = "xPubKeyHashWatch2";
	if (localStorage.xPubKeyHashWatch) {
		watchId = localStorage.xPubKeyHashWatch;
	} else {
		watchId = randHash();
		localStorage.xPubKeyHashWatch = watchId;
	}

	var server = localStorage.getItem('server');
	var socket = io.connect(
		server, {
			transports: ['websocket']
		}
	);
	socket.on('connect', function () {
		stat = $('#status');
		stat.attr('class', 'connected');
		socket.emit('term:id', termId, function (data) {
			console.log("term:id:ack: ", data);
			if ("ok" == data) {
				stat = $('#status');
				stat.text('connected');
				stat.attr('class', 'connected');
			} else {
				stat = $('#status');
				// ToDo Disconnect from server
				stat.attr('class', 'notConnected');
				stat.text('not connected');
			}
		});
	});
	socket.on('disconnect', function () {
		stat = $('#status');
		stat.attr('class', 'notConnected');
	});
	//Terminal events
	socket.on('term:final', function (msg) {
		console.log("term:final: ", msg);
		wch = JSON.parse(msg);
		$("#qr").toggleClass("hidden");
		$("#qrConfirm").toggleClass("hidden");
	});
	socket.on('term:partial', function (msg) {
		console.log("term:partial ", msg);
		wch = JSON.parse(msg);
		// Destroy the current entry
		$("#txc-{0}".format(wch.Address)).first().remove();
		// Create a new element for the active watch
		var elm = $().add(
			'<li id="txc-{0}">'.format(wch.Address)
		);
		elm.loadTemplate($("#tpl-watch-curr"), {
			"Total": (wch.Total / 100000000).toFixed(4),
			"Amount": (wch.Amount / 100000000).toFixed(4),
			"Address": wch.Address
		});
		$("#watch-curr").first().append(elm);
	});
	socket.on('term:timeout', function (msg) {
		console.log("term:timeout ", msg);
		//wch = JSON.parse(msg);
		// ToDo Timeout setup
	});
});

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

		Bitcoin.setNetwork('test'); //prod for mainnet and test for testnet //todo

		//create new key instance
		key = new BIP32(source_key);

		var address = generateAddress("receive", index),
			amount = roundNumber((e.value / price), 8);

		console.log(index + ": " + address);
		console.log("Dash amount: " + amount);
		console.log("Store Name: " + merchant);

		// START SOCKET CODE

		var termId = localStorage.getItem('xPubKeyHashTerm');
		var server = localStorage.getItem('server');
		var socket = io.connect(
			server, {
				transports: ['websocket']
			}
		);

		// Verify amount input
		if (isNaN(amount)) {
			// ToDo Warn of error
			console.log("amount is NaN");
			// This is not a valid amount
			return false;
		}
		if (amount > 900719) {
			// ToDo Warn of error
			// Would overflow in dash units
			console.log("af would overflow");
			return false;
		}
		// ToDo Verify Address input
		var wch = {
			// FixMe: Swap this out, rounding errors
			Total: 0,
			Amount: amount * 100000000,
			Address: address,
			Terminal: termId
		};
		data = JSON.stringify(wch);
		socket.emit('watch:add', data, function (res) {
			if ("ok" == res) {
				console.log("watch:add:ack: Passed");
			} else {
				console.log("watch:add:ack: Failed");
				// ToDo Error message
				return false;
			}
		});

		// END SOCKET CODE

		if ($(window).width() > 380) {
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
};