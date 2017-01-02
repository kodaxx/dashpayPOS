/*jslint browser: true*/
/*global $, console, jQuery, alert*/
$.ajaxSetup({
	async: false
});
//----- HOME PAGE -----
function showhide(id) {
	$(".hideable").addClass("hidden");
	$(id).removeClass("hidden")
}

function showPage(page) {
	if ($(page).hasClass("hidden") !== true) {
		return true;
	}
	showhide(page);
}

var price;

$.getJSON("https://api.coinmarketcap.com/v1/ticker/dash/", function (data) {
	//rounding to get 2 decimals
	price = Math.round(data[0].price_usd * 100) / 100;
});

$("div.price").html("<span>1 dash is currently $</span><span id='dashPrice'>" + price + "</span>");

//----- END HOME -----

//----- SETTINGS -----
//onclick clear alerts
function settingsClear() {
	$('#alert').html("");
	$('#alert').css("background-color", "#ededed");
}

//onclick save xpub key, storename
function settingsSave() {
	var storeName = $('#storeName').val(),
		xpubKey = $('#xpubKey').val(),
		server = $('#server').val(),
		alert = $('#alert');

	//if the xpub is empty show alert //todo: REDO THIS SECTION TO SOMETHING THAT MAKES MORE SENSE! JEEZ!
	if (xpubKey === '') {
		alert.css("background-color", "#ff3c41");
		alert.html("<strong>Warning!</strong> You left the public key empty.");
		console.log("xpub Empty!");
		return false;
	} else if (storeName === '') {
		alert.css("background-color", "#ff3c41");
		alert.html("<strong>Warning!</strong> You left the store name empty.");
		console.log("storeName Empty!");
		return false;
	} else if (server === '') {
		alert.css("background-color", "#ff3c41");
		alert.html("<strong>Warning!</strong> You left the server empty.");
		console.log("server Empty!");
		return false;
	} else if (xpubKey === localStorage.getItem('xpubKey') && server === localStorage.getItem('server') && storeName !== localStorage.getItem('storeName')) {
		localStorage.setItem('storeName', storeName);
		alert.css("background-color", "#47cf73");
		alert.html("<strong>Success!</strong> Business name has been updated.");
		console.log("Updated storeName");
		return false;
	} else if (xpubKey === localStorage.getItem('xpubKey') && server !== localStorage.getItem('server') && storeName === localStorage.getItem('storeName')) {
		localStorage.setItem('server', server);
		alert.css("background-color", "#47cf73");
		alert.html("<strong>Success!</strong> Server has been updated.");
		console.log("Updated server");
		return false;
	} else if (xpubKey !== localStorage.getItem('xpubKey') && server === localStorage.getItem('server') && storeName === localStorage.getItem('storeName')) {
		localStorage.setItem('xpubKey', xpubKey);
		localStorage.setItem('indexSource', 0);
		alert.css("background-color", "#47cf73");
		alert.html("<strong>Success!</strong> Public key has been updated.");
		console.log("Updated xpubKey");
		return false;
	} else {

		//set xpub key, set index to 0 and show sucess alert
		localStorage.setItem('xpubKey', xpubKey);
		localStorage.setItem('indexSource', 0);
		localStorage.setItem('storeName', storeName);
		localStorage.setItem('server', server);
		console.log("index is 0");
		console.log("Store name is: " + storeName);
		$('#alert').css("background-color", "#47cf73");
		$('#alert').html("<strong>Success!</strong> All settings have been saved.");
		console.log("xpub Saved");
	}
}

function getSettings(key) {
	if (localStorage.getItem(key)) {
		$('#' + key).val(localStorage.getItem(key));
		console.log(key + " Retrieved");
	}
}

getSettings('xpubKey');
getSettings('storeName');
getSettings('server');

if (localStorage.getItem('xPubKeyHashTerm')) {
	console.log("Term ID: " + localStorage.getItem('xPubKeyHashTerm'));
}
//----- END SETTINGS -----

//----- QR -----
//onclick clear qr and value input
function qrClear() {
	$("#PINbox").val("");
	$("#qrcode").empty();
}

function cancelTX() {
	var termId = localStorage.getItem('xPubKeyHashTerm'),
		addressStore = localStorage.getItem('address'),

		// ToDo Verify Address input
		ctx = {
			Address: addressStore,
			Terminal: termId
		};
		data = JSON.stringify(ctx);
		terminal.socket.emit('watch:cancel', data, function (res) {
			if ("ok" == res) {
				console.log("watch:unsub:ack: Passed");
			} else {
				console.log("watch:unsub:ack: Failed");
				// ToDo Error message
				return false;
			}
		});
	addressStore = localStorage.removeItem('address');
}
//----- END QR -----