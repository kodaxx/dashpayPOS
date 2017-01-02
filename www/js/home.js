/*jslint browser: true*/
/*global $, console, jQuery, alert*/
$.ajaxSetup({
    async: false
});
//----- HOME PAGE -----
function showhide(id){
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
		xpubKey = $('#xpub').val(),
		server = $('#server').val();
	
	//if the xpub is empty show alert
	if ($("#xpub").val() === '') {
		$('#alert').css("background-color", "#ff3c41");
		$('#alert').html("<strong>Warning!</strong> You left the public key empty.");
		console.log("xpub Empty!");
		return false;
	}
	if ($("#storeName").val() === '') {
		$('#alert').css("background-color", "#ff3c41");
		$('#alert').html("<strong>Warning!</strong> You left the store name empty.");
		console.log("storeName Empty!");
		return false;
	}
	//if the xpub key is being resaved show alert
	if (localStorage.getItem('xpubKey') === xpubKey) {
		localStorage.setItem('storeName', storeName);
		localStorage.setItem('server', server);
		$('#alert').css("background-color", "#47cf73");
		$('#alert').html("<strong>Success!</strong> Business name has been updated.");
		console.log("Updated storeName");
		return false;
	}
	//set xpub key, set index to 0 and show sucess alert
	localStorage.setItem('xpubKey', xpubKey);
	localStorage.setItem('indexSource', 0);
	localStorage.setItem('storeName', storeName);
	console.log("index is 0");
	console.log("Store name is: " + storeName);
	$('#alert').css("background-color", "#47cf73");
	$('#alert').html("<strong>Success!</strong> New public key has been saved.");
	console.log("xpub Saved");
}

//if there is an xpub key in localStorage then load it
if (localStorage.getItem('xpubKey')) {
    $('#xpub').val(localStorage.getItem('xpubKey'));
    console.log("xpub Retrieved");
}

//if there is a store name in localStorage then load it
if (localStorage.getItem('storeName')) {
    $('#storeName').val(localStorage.getItem('storeName'));
    console.log("storeName Retrieved");
}

if (localStorage.getItem('server')) {
    $('#server').val(localStorage.getItem('server'));
    console.log("server Retrieved");
}
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
//----- END QR -----