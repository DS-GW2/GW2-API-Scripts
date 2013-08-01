xmlhttp = new ActiveXObject("Msxml2.XMLHTTP.6.0");

	function _request(args)
	{
		try {
			_HttpGet(args);
		}
		catch (e)
		{	
			WScript.Echo ("Error: " + e.message);	
		}
		var outputString = xmlhttp.responseText;		
		
         	return(outputString);
	};

	function _HttpGet(args)
	{
		WScript.Echo("https://api.guildwars2.com/v1/items.json");
		xmlhttp.open("GET", "https://api.guildwars2.com/v1/items.json", false);				
		xmlhttp.send();	
	};


var itemJSONString = _request("traits");
fso = new ActiveXObject("Scripting.FileSystemObject");
s = fso.CreateTextFile("itemsnew.json", true);
s.write(itemJSONString);
s.Close();
