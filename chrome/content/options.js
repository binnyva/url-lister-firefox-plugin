var UrlListerOptions = {
	"readOptions": function() {
		document.getElementById("default-format-menu").selectedIndex = Preference.get("extensions.urllister.defaultFormat");
		document.getElementById("auto-copy-checkbox").checked = Preference.get("extensions.urllister.autoCopy");
		document.getElementById("open-on-paste-checkbox").checked = Preference.get("extensions.urllister.openOnPaste");
		
		var os = Preference.get("extensions.urllister.delimiter");
		document.getElementById(os+"-delimiter-radio").setAttribute("selected", true);
	},
	
	"saveOptions": function() {
		Preference.set("extensions.urllister.defaultFormat", document.getElementById("default-format-menu").selectedIndex);
		Preference.set("extensions.urllister.autoCopy", document.getElementById("auto-copy-checkbox").checked);
		Preference.set("extensions.urllister.openOnPaste", document.getElementById("open-on-paste-checkbox").checked);
		
		var selected_delimiter = 0;
		if(document.getElementById("linux-delimiter-radio").selected) selected_delimiter = 1;
		else if(document.getElementById("mac-delimiter-radio").selected) selected_delimiter = 2;
		
		var delimiters = ["windows", "linux", "mac"];
		Preference.set("extensions.urllister.delimiter", delimiters[selected_delimiter]);
	}
}
