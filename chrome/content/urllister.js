var UrlLister = {
	addUrlListerToTabContext:function() {
		if(!this.initalized) {
			var tabBarContextMenu = document.getAnonymousElementByAttribute(gBrowser, 'anonid', 'tabContextMenu');
			if (tabBarContextMenu) {
				var menu_item_urllist = document.createElement('menuitem');
				
				menu_item_urllist.setAttribute('label', "URL Lister...");
				menu_item_urllist.setAttribute('tooltiptext', "Shows a list of all open URLs");
				menu_item_urllist.setAttribute('oncommand', 'UrlLister.showMainDialog();');
			
				tabBarContextMenu.insertBefore(menu_item_urllist, tabBarContextMenu.lastChild.previousSibling); //Second last item.
			}
			this.initalized = true;
		}
	},
	
	/**
	 * Copies all the text in the textarea of the dialog to the clipboard.
	 */
	copyUrls: function() {
		Clipboard.set(document.getElementById("url-list").value);
	},
	
	/**
	 * Writes the contents of the clipboard to the Textarea of the dialog.
	 */
	pasteUrls: function() {
		document.getElementById("url-list").value = Clipboard.get();
	},
	
	openUrls:function () {
		openNewTabWith = window.arguments[1];
		var urls = document.getElementById("url-list").value.split("\n");
		NEW_URL_LOOP:
		for(var i=0; i<urls.length; i++) {
			// See if the URL is already open - if so, don't open it again.
			for(var j=0; j<window.tab_list.length; j++) {
				if(window.tab_list[j].url == urls[i]) continue NEW_URL_LOOP;
			}
			
			if(urls[i].match(/^[a-z]{2,7}\:\/\/.+\..+$/)) { //Basic url validation
				openNewTabWith(urls[i]);
			}
		}
		window.close();

	},
	
	getUrls:function () {
 		gBrowser = window.arguments[0];
		var all_tabs = gBrowser.mTabContainer.childNodes;
		var tab_list = [];
		for (var i = 0; i < all_tabs.length; i++ ) {
			var tab = gBrowser.getBrowserForTab(all_tabs[i]).contentDocument;
			tab_list.push({"url":tab.location, "title":tab.title});
		}
		window.tab_list = tab_list;
		
		document.getElementById("url-list").value = UrlLister.getPlainText();
		
		// Set up all the events
		//Event lister for format menu
		document.getElementById("format-popup").addEventListener('popuphidden', function(e) {
			UrlLister.setFormat(document.getElementById("format-menu").selectedIndex);
		}, false);
		
		document.getElementById("button-copy").addEventListener('click', UrlLister.copyUrls, false);
		document.getElementById("button-paste").addEventListener('click', UrlLister.pasteUrls, false);
	},
	
	setFormat: function(format_index) {
		if(format_index == 2) document.getElementById("url-list").value = UrlLister.getLinkedList();
		else if(format_index == 1) document.getElementById("url-list").value = UrlLister.getHtmlAnchors();
		else document.getElementById("url-list").value = UrlLister.getPlainText();
	},
	
	getPlainText: function() {
		return window.tab_list.map(function(ele){return ele.url;}).join("\n");
	},
	getHtmlAnchors: function() {
		return window.tab_list.map(function(ele){return '<a href="'+ele.url+'">'+ele.title+'</a><br />';}).join("\n");
	},
	getLinkedList: function() {
		return "<ul>\n" + window.tab_list.map(function(ele){return '<li><a href="'+ele.url+'">'+ele.title+'</a></li>';}).join("\n") + "\n</ul>";
	},
	
	showMainDialog: function () {
		window.openDialog("chrome://urllister/content/main_dialog.xul", "URL Lister", "chrome,width=600,height=320", gBrowser, openNewTabWith);
	}
}

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

window.addEventListener('load', function(e) {
	UrlLister.addUrlListerToTabContext();
}, false);
