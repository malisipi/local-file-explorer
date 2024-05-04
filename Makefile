all:
	make firefox
	make chrome

firefox:
	cp -f manifest_firefox.json manifest.json
	zip -r LFE.xpi * -x .git -x .gitignore -x \*.xpi -x \*.zip -x \*.crx -x js/service_worker.js \
	-x js/welcome.js -x manifest_chrome.json -x manifest_firefox.json -x welcome.html -x css/welcome.css \
	-x assets_src\* -x assets/showcase.png -x README.md -x Makefile

chrome:
	cp -f manifest_chrome.json manifest.json
	zip -r LFE.crx * -x .git -x .gitignore -x \*.xpi -x \*.zip -x \*.crx \
	-x manifest_chrome.json -x manifest_firefox.json -x assets_src\* -x assets/showcase.png -x README.md  -x Makefile