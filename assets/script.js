(() => {

	const dmp = new diff_match_patch()
	const textInput = document.getElementById("txt")
	const hashInput = document.getElementById("hash")
	const stateLabel = document.getElementById("state")
	var text = ""
	var cursorPos = {
		start: 0,
		end: 0,
	}

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
				var patches = dmp.patch_fromText(msg.data)
				var results = dmp.patch_apply(patches, textInput.value)
				textInput.value = results[0]
				textInput.setSelectionRange(cursorPos.start, cursorPos.end)
				text = results[0]
				results = results[1]
				var ok = results.filter(ok => ok).length
				var failed = results.filter(ok => !ok).length
				console.log(`${ok} OK, ${failed} failed`)
				break
			case "sync":
				socket.send(JSON.stringify({
					type: "change",
					data: getPatchText("", textInput.value),
				}))
				break
		}
	}

	textInput.addEventListener("keyup", e => {
		var patch_text = getPatchText(text, e.target.value)
		if (patch_text == "") {
			return
		}
		socket.send(JSON.stringify({
			type: "change",
			data: patch_text,
		}))
		text = e.target.value

		cursorPos.start = e.target.selectionStart
		cursorPos.end = e.target.selectionEnd
		console.log(cursorPos)
	})

	hashInput.addEventListener("keypress", e => {
		if(e.keyCode == 13 && isValidColor(hashInput.value)){
			setHash()
			location.reload()
		}
	});


	function getPatchText(text1, text2) {
		var diff = dmp.diff_main(text1, text2, true)
		if (diff.length > 2) {
			dmp.diff_cleanupSemantic(diff)
		}
		var patch_list = dmp.patch_make(text1, text2, diff)
		return dmp.patch_toText(patch_list)
	}

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

	


