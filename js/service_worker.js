chrome.runtime.onInstalled.addListener(e => {
    if (e.reason == chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({
            url: chrome.runtime.getURL("welcome.html")
        });
    };
});

chrome.runtime.onMessage.addListener((request, sender, send_response) => {
    if(request.type == "open"){
        if(request.url.startsWith("lfe://")){
            if(request.url == "lfe://extension_settings"){
                chrome.tabs.create({
                    url: `chrome://extensions/?id=${chrome.runtime.id}`
                });
            };
        };
    } else if(request.type == "is_allowed_access_file") {
        (async ()=>{
            send_response(await chrome.extension.isAllowedFileSchemeAccess());
        })();
        return true;
    }
});