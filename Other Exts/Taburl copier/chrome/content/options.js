
function onLoad() {
	var settings 		= Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('taburlcopier.');
	var chkshowtotal	= document.getElementById('chkshowtotal');
	
	chkshowtotal.setAttribute('checked', settings.getBoolPref('showtotal'));
	
	var delimiter		= (settings.getCharPref('delimiter'))?settings.getCharPref('delimiter'):'windows';

	switch ( delimiter )
	{
		case 'windows':
			document.getElementById('windows').setAttribute('selected', true);
			break;
		case 'nix':
			document.getElementById('nix').setAttribute('selected', true);
			break;
		case 'mac' :
			document.getElementById('mac').setAttribute('selected', true);
			break;
		default:
			break;
	}
	
	this.initialized	= true;
}

function saveSettings() {
	var settings 		= Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('taburlcopier.');
	var chkshowtotal 	= document.getElementById('chkshowtotal');
	
	settings.setBoolPref('showtotal', (chkshowtotal.getAttribute('checked') == 'true') ? true:false);

	switch ( true )
	{
		case document.getElementById('windows').selected:
			settings.setCharPref('delimiter', 'windows');
			break;
		case document.getElementById('nix').selected:
			settings.setCharPref('delimiter', 'nix');
			break;
		case document.getElementById('mac').selected:
			settings.setCharPref('delimiter', 'mac');
			break;
	}
	
	window.close();
}

