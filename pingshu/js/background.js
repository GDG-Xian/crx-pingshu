chrome.tabs.getSelected(null, function(tab) {
    // When the browser action is clicked, set the popup for |tab|.
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.tabs.create({ url: 'http://www.5ips.net', active: true });
    });
});
