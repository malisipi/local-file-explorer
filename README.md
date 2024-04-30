# Local File Explorer <!--[![Mozilla Add-on Rating](https://img.shields.io/amo/rating/local-file-explorer?style=plastic&logo=firefox)](https://addons.mozilla.org/en-US/firefox/addon/local-file-explorer/reviews/)-->

### Don't require leave your web browser to look your files!

<center>

!["LFE Extension Showcase"](./assets/showcase.png)

</center>

<a href="https://addons.mozilla.org/addon/local-file-explorer/" target="_blank"><img src="https://blog.mozilla.org/addons/files/2020/04/get-the-addon-fx-apr-2020.svg" height="50px"/></a>

> Local File Explorer is a simple and fast file browser extension for Firefox and Chromium web browsers.

* You can view your folders,
* Preview your images/videos/musics without opening new tab,
* Previews of images in folder view
* Search files in folder,
* Customize folder view (grid/list mode and 5 level zoom option)

## Package the extension

### Firefox

* ```cp -f manifest_firefox.json manifest.json && zip -r LFE.xpi * -x .git -x .gitignore -x \*.xpi -x \*.zip -x \*.crx -x js/service_worker.js -x js/welcome.js -x manifest_chrome.json -x manifest_firefox.json -x welcome.html -x css/welcome.css -x assets_src\* -x assets/showcase.png -x README.md```

### Chrome

* ```cp -f manifest_chrome.json manifest.json && zip -r LFE.crx * -x .git -x .gitignore -x \*.xpi -x \*.zip -x \*.crx -x manifest_chrome.json -x manifest_firefox.json -x assets_src\* -x assets/showcase.png -x README.md```

## License

* This project is licensed by Apache 2.0 License.
* Yaru icons and app icon (`assets` and `assets_src`) is licensed by CC BY SA 4.0 License.
