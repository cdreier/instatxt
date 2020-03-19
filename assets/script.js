(() => {

	const textInput = document.getElementById("txt")
	const hashInput = document.getElementById("hash")

	hashInput.value = getRandomHexColor()
	checkHash()
	setHash()
	applyBackground()

	var socket = new WebSocket(`${location.protocol.replace('http', 'ws')}//${location.host}/ws?room=${hashInput.value}`)
	socket.onopen = e => console.log("opened")
	socket.onclose = e => console.log("closed")

	socket.onmessage = e => {
		const msg = JSON.parse(e.data)
		switch(msg.type){
			case "change":
				textInput.value = msg.data
				break
			case "sync":
				socket.send(JSON.stringify({
					type: "change",
					data: textInput.value,
				}))
				break
		}
	}

	textInput.addEventListener("keyup", e => {
		socket.send(JSON.stringify({
			type: "change",
			data: e.target.value,
		}))
	})

	hashInput.addEventListener("keypress", e => {
		if(e.keyCode == 13 && isValidColor(hashInput.value)){
			setHash()
			location.reload()
		}
	});


	function setHash(){
		location.hash = hashInput.value
	}
	
	function checkHash(){
		if(location.hash != ""){
			hashInput.value = location.hash.substring(1)
		}
	}
	
	function applyBackground(){
		if(isValidColor()){
			document.body.style = "background: linear-gradient(135deg,  #000000 0%, #"+hashInput.value+" 50%, #000000 100%)"
		}
	}
	
	/**
	 * HELPERS 
	 */
	function isValidColor(){
		return /^[0-9A-F]{6}$/i.test(hashInput.value)
	}
	 
	function getRandomHexColor(){
		return RGBtoHex(randomRange(10, 200), randomRange(10, 200), randomRange(10, 200))
	}
	
	function randomRange(from, to) {
		return Math.floor(Math.random() * (to - from + 1) + from)
	}
	
	function RGBtoHex(R, G, B) {
		return toHex(R) + toHex(G) + toHex(B)
	}
	
	function toHex(N) {
		if (N == null)
			return "00"
		N = parseInt(N)
		if (N == 0 || isNaN(N))
			return "00"
		N = Math.max(0, N)
		N = Math.min(N, 255)
		N = Math.round(N)
		return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16)
	}
		
})()

	


