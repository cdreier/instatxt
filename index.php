<html>
	<head>
	  <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
	  <title>instaTxt</title>
	  
	  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	  <script type="text/javascript" src="http://<?php echo $_SERVER["HTTP_HOST"];  ?>:1337/socket.io/socket.io.js"></script>
	  <script type="text/javascript">
	  	var hostname = "<?php echo $_SERVER["HTTP_HOST"];  ?>";
	  </script>
	  <script src="script.js" type="text/javascript" charset="utf-8"></script>
	  
	  <link type="text/css" rel="stylesheet" href="style.css" />
	  
	</head>
	
	<body >
		
		<a href=""><img src="txt.png" id="logo" /></a>
		<br />
		<input type="text" id="hash"/>
		<br />
		<textarea id="txt" ></textarea>
	  
	</body>
	
</html>