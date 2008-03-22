
var Preference = {
	"get": function(name) {
		var preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		
		if(preferences.getPrefType(name) == preferences.PREF_BOOL) return preferences.getBoolPref(name);
		else if(preferences.getPrefType(name) == preferences.PREF_STRING) return preferences.getCharPref(name);
		else if(preferences.getPrefType(name) == preferences.PREF_INT) return preferences.getIntPref(name);
	},
	"set": function(name, value) {
		var preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		
		if(preferences.getPrefType(name) == preferences.PREF_BOOL) return preferences.setBoolPref(name, value);
		else if(preferences.getPrefType(name) == preferences.PREF_STRING) return preferences.setCharPref(name, value);
		else if(preferences.getPrefType(name) == preferences.PREF_INT) return preferences.setIntPref(name, value);
	}
}
 
/**
 * The clipboard library - hopefully, from the next versino we will be able to use FUEL.
 */
var Clipboard = {
	"set": function(text) {
		var clipboard = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
		clipboard.copyString(text);
	},
	
	"get": function() {
		// Yeah - its a bit weird
		// http://www.xulplanet.com/tutorials/mozsdk/clipboard.php
		var clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
		if (!clipboard) return false;
		
		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		if(!trans) return false; 
		trans.addDataFlavor("text/unicode");
		clipboard.getData(trans,clipboard.kGlobalClipboard);
		
		var str = new Object();
		var strLength = new Object();
		trans.getTransferData("text/unicode",str,strLength);
		var pastetext;
		if (str) str = str.value.QueryInterface(Components.interfaces.nsISupportsString); 
		if (str) pastetext = str.data.substring(0,strLength.value / 2);
		
		return pastetext;
	}
}

