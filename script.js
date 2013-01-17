var socket = io.connect('http://'+hostname+':1337', {
	'reconnect' : true,
	'reconnection delay' : 500,
	'max reconnection attempts' : 10
});

/**
 * SOCKET LISTENERS 
 */
socket.on("update", function(data){
	$("#txt").val(data.txt);
});
socket.on("someoneJoined", function(data){
	sync();
});

/**
 * JQUERY JS
 */
$(function(){
	
	$("#hash").val(getRandomHexColor());
	checkHash();
	setHash();
	applyBackground();
	start();
	
	/**
	 * Listeners
	 */
	$("#hash").keypress(function(e) {
		if(e.keyCode == 13){
			start();
			setHash();
			applyBackground();
			$("#txt").focus();
		}
	});
	
	$("#txt").keyup(function(){
		sync();
	});
	
});


function sync(){
	socket.emit("sync", {
		room : $("#hash").val(),
		txt : $("#txt").val()
	});
}

function start(){
	socket.emit("start", {
		room : $("#hash").val()
	});
}

function setHash(){
	location.hash = $("#hash").val();
}

function checkHash(){
	if(location.hash != ""){
		$("#hash").val(location.hash.substring(1));
	}
}

function applyBackground(){
	if(isValidColor()){
		$("body").css("background", "linear-gradient(135deg,  #000000 0%, #"+$("#hash").val()+" 50%, #000000 100%)");
		$("body").css("background", "-webkit-linear-gradient(-45deg,  #000000 0%, #"+$("#hash").val()+" 50%, #000000 100%)");
	}
}


/**
 * HELPERS 
 */
function isValidColor(){
	return /^[0-9A-F]{6}$/i.test($("#hash").val());
}
 
function getRandomHexColor(){
	return RGBtoHex(randomRange(10, 200), randomRange(10, 200), randomRange(10, 200));
}

function randomRange(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}

function RGBtoHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B)
}

function toHex(N) {
	if (N == null)
		return "00";
	N = parseInt(N);
	if (N == 0 || isNaN(N))
		return "00";
	N = Math.max(0, N);
	N = Math.min(N, 255);
	N = Math.round(N);
	return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}