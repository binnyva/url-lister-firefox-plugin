var TabUrlCopier = {
	
	onLoad: function() {
		if (!this.initialized)
		{
			var tabContextMenu = document.getAnonymousElementByAttribute(gBrowser, 'anonid', 'tabContextMenu');
			if (tabContextMenu)
			{
				var menuseparator = document.createElement('menuseparator');
				var menuitemcopy = document.createElement('menuitem');
				
				menuitemcopy.setAttribute('label', document.getElementById('bundle_taburlcopier').getString('taburlcopier-menuCopy.label'));
				menuitemcopy.setAttribute('tooltiptext', document.getElementById('bundle_taburlcopier').getString('taburlcopier-menuCopy.tooltiptext'));
				menuitemcopy.setAttribute('class', 'menu-iconic menuitem-iconic listcopy');
				menuitemcopy.setAttribute('oncommand', 'TabUrlCopier.copyAddresses();');

				var menuitempaste = document.createElement('menuitem');
				
				menuitempaste.setAttribute('label', document.getElementById('bundle_taburlcopier').getString('taburlcopier-menuPaste.label'));
				menuitempaste.setAttribute('tooltiptext', document.getElementById('bundle_taburlcopier').getString('taburlcopier-menuPaste.tooltiptext'));
				menuitempaste.setAttribute('class', 'menu-iconic menuitem-iconic listpaste');
				menuitempaste.setAttribute('oncommand', 'TabUrlCopier.pasteAddresses();');
				
				var insertAt = tabContextMenu.lastChild.previousSibling;
				tabContextMenu.insertBefore(menuitemcopy, insertAt);
				tabContextMenu.insertBefore(menuitempaste, insertAt);
				tabContextMenu.insertBefore(menuseparator, menuitemcopy);
				this.initialized = true;
			}
		}
	},
	
	copyAddresses: function() {
		var clipboard = Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper);
		var tabs = gBrowser.mTabContainer.childNodes;
		var settings = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('taburlcopier.');
		var delimiter = (settings.getCharPref('delimiter'))?settings.getCharPref('delimiter'):'windows';
		var showtotal = settings.getBoolPref('showtotal');
		var stringToCopy = '';
		var i = 0;
		
		if ( tabs.length == 1 && gBrowser.getBrowserForTab(tabs[0]).contentDocument.location == 'about:blank' )
		{
			alert(document.getElementById('bundle_taburlcopier').getString('taburlcopier-nothingtocopy'));
			return;
		}

		var delimitstring;

		switch ( delimiter )
		{
			case 'windows':
				delimitstring = '\r\n';
				break;
			case 'nix':
				delimitstring = '\n';
				break;
			case 'mac' :
				delimitstring = '\r';
				break;
			default:
				break;
		}
		
		
		for ( i = 0; i < tabs.length; i++ )
		{
			stringToCopy += gBrowser.getBrowserForTab(tabs[i]).contentDocument.location + delimitstring;
		}
		
		if ( showtotal )
		{
			var replaceString = ((i==1) ? document.getElementById('bundle_taburlcopier').getString('taburlcopier-totaltext.singular') : document.getElementById('bundle_taburlcopier').getString('taburlcopier-totaltext.plural') );
												
			stringToCopy += '\n' + replaceString.replace('%n',i);
		}
		else
		{
			//stringToCopy = stringToCopy.substring(0,stringToCopy.length);
		}
		
		clipboard.copyString(stringToCopy);
	},

	pasteAddresses: function()
	{
		var settings = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch('taburlcopier.');
		var delimiter = (settings.getCharPref('delimiter'))?settings.getCharPref('delimiter'):'windows';

		var clip  = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
		if (!clip) return false;

		var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
		if (!trans) return false;
		trans.addDataFlavor("text/unicode");
		
		clip.getData(trans, clip.kGlobalClipboard);

		var str       = new Object();
		var strLength = new Object();

		trans.getTransferData("text/unicode", str, strLength);
		
		if (str) str       = str.value.QueryInterface(Components.interfaces.nsISupportsString);
		if (str) pastetext = str.data.substring(0, strLength.value / 2);

		var delimitstring;

		switch ( delimiter )
		{
			case 'windows':
				delimitstring = '\r\n';
				break;
			case 'nix':
				delimitstring = '\n';
				break;
			case 'mac' :
				delimitstring = '\r';
				break;
		}
		

		var urls = pastetext.split(delimitstring);
		var validurl = /^[a-zA-Z]+:\/\//; // Only the most basic vaidation, but it's something
		for ( url in urls )
		{
			if ( validurl.test(urls[url]) )
			{
				openNewTabWith(urls[url]);
			}
			else
			{
				//alert(urls[url] + ' is not a valid url and will not be loaded');
			}
		}
	}
};

window.addEventListener('load', function(e) { TabUrlCopier.onLoad(e); }, false);
