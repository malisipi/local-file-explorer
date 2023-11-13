check_permission = (async () => {
    const response = await chrome.runtime.sendMessage({type: "is_allowed_access_file"});
    if(response){
        document.querySelector(".no-file-permission").style.display = "none";
        document.querySelector("#file-permission .give-permission").style.display = "none";
    };
});

check_permission();

document.querySelector("button.file-permission.give-permission").addEventListener("click", () => {
    chrome.runtime.sendMessage({type: "open", url: "lfe://extension_settings"});
});