/*jslint browser: true*/
/*global $, console, key, BIP32, jQuery, alert*/

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

		console.log(index + ": " + childaddr);
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
	if (e.value === "") {
		alert("Please enter a price");
	} else {
		//get current dash price in usd
		$.getJSON("https://api.coinmarketcap.com/v1/ticker/dash/", function (data) {
			var price = data[0].price_usd;

			//get current address index from local storage
			var index = parseInt(localStorage.getItem('indexSource'), 10);

			//get merchants xpub from local storage
			var source_key = localStorage.getItem('xpubKey');

			var merchant = encodeURI(localStorage.getItem('storeName'));
			console.log(merchant);

			//create new key instance
			key = new BIP32(source_key);

			var address = generateAddress("receive", index),
				amount = roundNumber((e.value / price), 8);

			console.log("Dash amount: " + amount);

			if ($(window).width() > 330) {
				//generate qr code
				$('#qrcode').qrcode({
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
					size: 256,

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
			} else {
				//generate qr code
				$('#qrcode').qrcode({
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
					size: 200,

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
				});
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


		});
	}
}