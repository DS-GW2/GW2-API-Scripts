xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");

var _supportedLanguages = ["en", "fr", "de", "es"];
var _worldNames = _mapNames = _eventNames = null;

function GW2EVENTS()
{
    	this.EventNames = getEventNames;
	this.MapNames = getMapNames;
	this.WorldNames = getWorldNames;
	this.Events = getEvents;
	this.IsUSWorld = IsUSWorld;
	this.IsEuropeWorld = IsEuropeWorld;
	this.WorldName = getWorldName;
	this.MapName = getMapName;
	this.EventName = getEventName;

	function IsUSWorld(worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		return (worldId.charAt(0) == '1');
	}

	function IsEuropeWorld(worldId)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		return (worldId.charAt(0) == '2');
	}

	function getEventName (eventId, lang)
	{
		eventId = typeof eventId == "object" ? eventId.id : eventId;
		var eventNames = getEventNames(lang);
		if (eventNames)
		{
			return getName(eventNames, eventId);
		}
		return false;
	}
	
        function getEventNames()
	{
		lang = typeof lang !== 'undefined' ? lang : 'en';
        	if (IsSupportedLanguage(lang))
        	{
        		if (!_eventNames || _eventNames.lang != lang)
        		{
        			_eventNames = new Object();
        			_eventNames.data = _request('event_names.json?', "lang=" + lang);
        			_eventNames.lang = lang;
        		}
        		return _eventNames.data;	
        	}
	       return false;
	}

	function getMapName (mapId, lang)
	{
		mapId = typeof mapId == "object" ? mapId.id : mapId;
		var mapNames = getMapNames(lang);
		if (mapNames)
		{
			return getName(mapNames, mapId);
		}
		return false;
	}
	
	function getMapNames(lang)
	{
		lang = typeof lang !== 'undefined' ? lang : 'en';
        	if (IsSupportedLanguage(lang))
        	{
        		if (!_mapNames || _mapNames.lang != lang)
        		{
        			_mapNames = new Object();
        			_mapNames.data = _request('map_names.json?', "lang=" + lang);
        			_mapNames.lang = lang;
        		}
        		return _mapNames.data;	
        	}
   		return false;
	}
	
	function getWorldName (worldId, lang)
	{
		worldId = typeof worldId == "object" ? worldId.id : worldId;
		var worldNames = getWorldNames(lang);
		if (worldNames)
		{
			return getName(worldNames, worldId);
		}
		return false;
	}

        function getWorldNames(lang)
        {
        	lang = typeof lang !== 'undefined' ? lang : 'en';
        	if (IsSupportedLanguage(lang))
        	{
        		if (!_worldNames || _worldNames.lang != lang)
        		{
        			_worldNames = new Object();
        			_worldNames.data = _request('world_names.json?', "lang=" + lang);
        			_worldNames.lang = lang;
        		}
        		return _worldNames.data;	
        	}
		return false;
        }

	function getEvents(worldId, eventId, mapId)
	{
		var param = "", param1 = "", param2 = "";

		if (typeof worldId == "undefined") {
			worldId = 1009;
		}
		param = "world_id=" + worldId;
		
		switch (arguments.length)
		{
			case 0: // Fall through!
			case 1:
				return _request('events.json?', param).events;
				break;
				
			case 2:
				return _request('events.json?', param, "event_id=" + eventId).events;
				break;
				
			default:
				return _request('events.json?', param, "event_id=" + eventId, "map_id=" + mapId).events;
				break;
		}
	}
	
	function IsSupportedLanguage(lang)
	{		
		for(var i = 0; i < _supportedLanguages.length; i++) {
			if(_supportedLanguages[i] === lang) {
				return true;
			}
		}
		return false;
	}
	
	function getName(list, id)
	{
		for (var i in list) {
			if (list[i].id == id) return list[i].name;
		}
		return "Unknown";
	}
	
	function _request(arg1)
	{
		var args;
		if (arguments.length > 1)
			args = Array.prototype.slice.call(arguments, 1);

		try {
			_HttpGet(arg1, args);
		}
		catch (e)
		{	
			WScript.Echo ("Error: " + e.number);	
                        WScript.Echo ("Retrying...");

			try {
				_HttpGet(arg1, args);
			}
			catch (e)
			{
				WScript.Echo ("Error: " + e.number);
			}	
		}
			
		//WScript.Echo (xmlhttp.getAllResponseHeaders());
		//WScript.Echo (xmlhttp.responseText);
		try {
			var outputString = _JSONParse();
		}
		catch(e) 
		{
			//WScript.Echo ("JSON parsing error!  String: " + parseString);
			WScript.Echo ("JSON parsing error!  Retrying...");
			_HttpGet(arg1, args);
			var outputString = _JSONParse();
		}
         	return(outputString);
	}

	function _HttpGet(arg1, args)
	{
		xmlhttp.open("GET", "https://api.guildwars2.com/v1/" + arg1 + args.join("&"), false);				
		xmlhttp.send();	
	}

	function _JSONParse()
	{
		//var start = xmlhttp.responseText.indexOf("[");
		//var parseString = xmlhttp.responseText.substr(start);
		var parseString = xmlhttp.responseText;
		return JSON.parse(parseString);
	}
}
