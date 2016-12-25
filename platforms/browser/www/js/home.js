/*jslint browser: true*/
/*global $, console, jQuery, alert*/

//----- HOME PAGE -----
//get price from coinmarketcap for ticker
$.getJSON("https://api.coinmarketcap.com/v1/ticker/dash/", function (data) {
	//rounding to get 2 decimals
	var price = Math.round(data[0].price_usd * 100) / 100;
	$("div.price").html(function () {
		return "<span>1 dash is currently $</span><span id='dashPrice'>" + price + "</span>";
	});
});

//onclick show new sale screen and hide home
function newSale() {
	$("#home").toggleClass("hidden");
	$("#newSale").toggleClass("hidden");
}

//onclick show recent sales screen and hide home
function recentSales() {
	$("#home").toggleClass("hidden");
	$("#recentSales").toggleClass("hidden");
}

//onclick show settings screen and hide home
function settings() {
	$("#home").toggleClass("hidden");
	$("#settings").toggleClass("hidden");
}
//----- END HOME -----

//----- SETTINGS -----
//onclick show home, hide settings and clear alerts
function settingsBack() {
	$("#home").toggleClass("hidden");
	$("#settings").toggleClass("hidden");
	$('#alert').html("");
	$('#alert').css("background-color", "#ededed");
}

//onclick save xpub key, storename
function settingsSave() {
	var storeName = $('#storeName').val(),
		xpubKey = $('#xpub').val();

	//if the xpub is empty show alert
	if ($("#xpub").val() === '') {
		$('#alert').css("background-color", "#d01540");
		$('#alert').html("<strong>Warning!</strong> You left the public key empty.");
		console.log("xpub Empty!");
		return false;
	}
	if ($("#storeName").val() === '') {
		$('#alert').css("background-color", "#d01540");
		$('#alert').html("<strong>Warning!</strong> You left the store name empty.");
		console.log("storeName Empty!");
		return false;
	}
	//if the xpub key is being resaved show alert
	if (localStorage.getItem('xpubKey') === xpubKey) {
		localStorage.setItem('storeName', storeName);
		$('#alert').css("background-color", "#15d09d");
		$('#alert').html("<strong>Success!</strong> Store name has been updated.");
		console.log("Updated storeName");
		return false;
	}
	//set xpub key, set index to 0 and show sucess alert
	localStorage.setItem('xpubKey', xpubKey);
	localStorage.setItem('indexSource', 0);
	localStorage.setItem('storeName', storeName);
	console.log("index is 0");
	console.log("Store name is: " + storeName);
	$('#alert').css("background-color", "#15d09d");
	$('#alert').html("<strong>Success!</strong> new public key has been saved.");
	console.log("xpub Saved");
}

//if there is an xpub key in localStorage then load it
if (localStorage.getItem('xpubKey')) {
    $('#xpub').val(localStorage.getItem('xpubKey'));
    console.log("xpub Retrieved");
}

//if there is a store name is localStorage then load it
if (localStorage.getItem('storeName')) {
    $('#storeName').val(localStorage.getItem('storeName'));
    console.log("storeName Retrieved");
}
//----- END SETTINGS -----

//----- QR -----
//onclick show home, hide qr, clear qr code and sale value
function qrDone() {
	$("#PINbox").val("");

	$("#home").toggleClass("hidden");
	$("#qr").toggleClass("hidden");

	$("#qrcode").empty();
}
//----- END QR -----