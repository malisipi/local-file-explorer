lfe = async (the_browser) => {
    window.lfe_config = {
        set: async (key, value) => {
            lfe_config[key] = value;
            await chrome.storage.local.set({[key]: value});
            console.log([key, value]);
        },
        get: async key => {
            return (await chrome.storage.local.get([key]))[key];
        }
    };
    lfe_config.folder_view = await lfe_config.get("folder_view") ?? 0; // 0:grid, 1:list
    lfe_config.zoom_level = await lfe_config.get("zoom_level") ?? 2; // 0:tiny, 1:small, 2:medium, 3:large, 4:huge
    lfe_config.use_preview_of_images = await lfe_config.get("use_preview_of_images") ?? false;
    lfe_config.use_native_icons = await lfe_config.get("use_native_icons") ?? false;

    document.addEventListener("keydown", e => {
        if (e.ctrlKey){
            if (e.key == "+") {
                if(lfe_config.zoom_level < 4){
                    lfe_config.set("zoom_level", ++lfe_config.zoom_level);
                    folder_view.set_zoom_level(lfe_config.zoom_level);
                }
            } else if (e.key == "-") {
                if(lfe_config.zoom_level > 0){
                    lfe_config.set("zoom_level", --lfe_config.zoom_level);
                    folder_view.set_zoom_level(lfe_config.zoom_level);
                }
            } else if (e.key == "0") {
                lfe_config.set("zoom_level", 2);
                folder_view.set_zoom_level(lfe_config.zoom_level);
            } else if (e.key == "f") {
                toggle_find_dialog();
            } else {
                return;
            }
            e.preventDefault();
            return false;
        }
    });

    Object.prototype.__filter_keys = function (fn) {
        return Object.keys(this).filter(fn).reduce((obj, key) => {
            obj[key] = this[key];
            return obj;
        },{});
    };

    window.get_human_readable_size = size => {
        let power = Math.floor(Math.log((size > 0) ? size : 1) / Math.log(1024));
        return `${(size / Math.pow(1024, power)).toFixed(Math.min(2, power))} ${["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "BB", "GeB"][power]}`;
    };

    window.get_human_readable_time = time => {
        let date = {date: new Date(time * 1000)};
        date.week_day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.date.getDay()];
        date.day = date.date.getDate();
        date.month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.date.getMonth()];
        date.year = date.date.getFullYear();
        return `${date.day} ${date.month} ${date.year} ${date.week_day}`;
    };

    window.toggle_find_dialog = () => {
        if(window.search_dialog.hasAttribute("visible")){
            window.search_dialog.removeAttribute("visible");
        } else {
            window.search_dialog.setAttribute("visible", true);
            search_file(search_dialog_input.value);
            window.search_dialog.querySelector("input").focus();
        }
    };

    window.get_file_type = (name, is_folder) => {
        if(is_folder) return "folder";

        let extension = name.split(".").at(-1).toLowerCase();
        switch(extension){
            case "png":
            case "jpg":
            case "jpeg":
            case "webp":
            case "gif":
            case "tif":
            case "tiff":
            case "bmp":
            case "ico":
            case "avif":
            case "heic":
                case "heif":
            case "jxl":
            case "jxr":
            case "hdp":
                case "wdp":
                return "image";
            case "svg":
            case "svgz":
                return "vector";
            case "mp3":
            case "m4a":
            case "m4b":
            case "m4p":
            case "ogg":
            case "aac":
            case "flac":
            case "mpc":
            case "mmf":
            case "oga":
            case "mogg":
            case "wav":
            case "wma":
            case "mid":
            case "rmi":
                return "audio";
            case "mp4":
            case "webm":
                case "avi":
            case "ogv":
            case "mkv":
            case "gifv":
            case "wmv":
            case "mov":
            case "qt":
            case "amv":
            case "mpg":
            case "mpeg":
            case "mp2":
            case "mpe":
            case "mpv":
            case "m2v":
            case "m4v":
            case "3gp":
            case "3g2":
            case "flv":
            case "f4v":
            case "f4p":
                case "f4a":
            case "f4b":
                return "video";
            case "txt":
                case "text":
                    return "text";
            case "pdf":
                return "pdf";
            case "psd":
                return "photoshop";
            case "ai":
                return "illustrator";
            case "zip":
                return "archive/zip";
                case "md":
                return "text/markdown";
                case "js":
                return "text/javascript";
            case "css":
                return "text/css";
            case "htm":
            case "html":
                return "text/html";
            case "json":
                return "text/json";
            case "author":
            case "authors":
                return "text/author";
            case "license":
            case "licence":
            case "copy":
                case "copying":
                return "text/license";
                case "doc":
            case "dot":
                case "wbk":
            case "docx":
                case "docm":
            case "dotx":
            case "dotm":
            case "docb":
                return "ms/office/doc";
                case "xls":
                    case "xlt":
            case "xlm":
            case "xlsx":
                case "xlsm":
                    case "xltx":
                        case "xltm":
            case "xlsb":
                case "xlw":
                    return "ms/office/xls";
            case "ppt":
                case "pot":
            case "pps":
            case "pptx":
                case "pptm":
                    case "potx":
            case "potm":
            case "ppsx":
            case "ppsm":
            case "sldx":
            case "sldm":
                return "ms/office/ppt";
                case "accdb":
                    case "accde":
            case "accdt":
            case "accdr":
                return "ms/office/acc";
                case "pub":
                    return "ms/office/pun";
            // ms extensions
            case "wll": // word
            case "wwl": // word
            case "xla": // excel
            case "xlam": // excel
            case "xll": // excel
            case "xll_": // excel
            case "xla_": // excel
            case "xla5": // excel
            case "xla8": // excel
            case "ppa": // powerpoint
            case "ppam": // powerpoint
            case "pa": // powerpoint
            case "accda": // access
            case "accdu": // access
            case "mda": // access
            case "mde": // access
            case "ecf": // outlook
            case "xpi": // firefox
            case "crx": // chrome
                return "extension";
            case "exe":
            case "msi":
            case "dll":
            case "ex_":
            case "msp":
            case "mst":
            case "scr":
                return "ms/executable";
            case "app":
                case "run":
            case "bin":
            case "csh":
            case "ksh":
            case "out":
                case "so":
            case "action":
                case "command":
            case "osx":
            case "workflow":
                return "executable";
            case "sh":
                case "bash":
                return "text/sh";
                case "cur":
            case "ani":
                return "image/cursor";
                case "theme":
                    return "theme";
                    case "obj":
                        case "blend":
            case "3ds":
                case "stl":
            case "ply":
            case "gltf":
            case "off":
                case "3dm":
            case "fbx":
            case "dae":
            case "skp":
                case "skb":
                    case "wrl":
                        case "3mf":
            case "amf":
            case "ifc":
            case "brep":
                case "step":
                    case "iges":
                        case "fcstd":
            case "bim":
                return "3d-model";
            case "py":
            case "pyw":
                return "text/python";
            case "apk":
            case "aab":
                return "android/setup";
            case "xml":
                return "text/xml";
                case "pyc":
                    return "bytecode/python";
                    case "c":
                return "text/c";
            case "php":
                return "text/php";
                case "log":
                    return "text/log";
                    case "iso":
                        return "disk/iso";
            case "ttf":
                case "otf":
                    case "woff":
            case "oef":
                return "font";
                case "v":
                return "text/v";
            default:
                return "unknown";
        }
    }

    window.get_native_icon = (name) => {
        let extension = name.split(".").at(-1).toLowerCase();
        if(the_browser == "firefox"){
            return `moz-icon://.${extension}?size=255`;
        }
        console.error("Native icons is not supported outside Firefox");
        return window.mimetype_prefix + "text-x-preview.png";
    };

    window.get_icon = (file_type) => {
        switch(file_type){
            case "image":
                return window.mimetype_prefix + "image-x-generic.png";
            case "vector":
                return window.mimetype_prefix + "image-svg+xml.png";
            case "audio":
                return window.mimetype_prefix + "audio-x-generic.png";
            case "video":
                return window.mimetype_prefix + "video-x-generic.png";
            case "folder":
                return window.mimetype_prefix + "folder.png";
            case "text":
                return window.mimetype_prefix + "text-x-generic.png";
            case "pdf":
                return window.mimetype_prefix + "application-pdf.png";
            case "photoshop":
                return window.mimetype_prefix + "application-photoshop.png";
            case "illustrator":
                return window.mimetype_prefix + "application-illustrator.png";
            case "archive/zip":
                return window.mimetype_prefix + "application-x-zip.png";
            case "text/markdown":
                return window.mimetype_prefix + "text-markdown.png";
                case "text/javascript":
                return window.mimetype_prefix + "text-x-javascript.png";
                case "text/css":
                return window.mimetype_prefix + "text-css.png";
                case "text/html":
                return window.mimetype_prefix + "text-html.png";
                case "text/json":
                return window.mimetype_prefix + "application-json.png";
            case "ms/office/doc":
                return window.mimetype_prefix + "application-vnd.ms-word.png";
            case "ms/office/xls":
                return window.mimetype_prefix + "application-vnd.ms-excel.png";
                case "ms/office/ppt":
                    return window.mimetype_prefix + "application-vnd.ms-powerpoint.png";
            case "ms/office/acc":
                return window.mimetype_prefix + "application-vnd.ms-access.png";
            case "ms/office/pub":
                return window.mimetype_prefix + "application-vnd.ms-publisher.png";
            case "ms/executable":
                return window.mimetype_prefix + "application-x-ms-dos-executable.png";
            case "executable":
                return window.mimetype_prefix + "application-x-executable.png";
            case "text/author":
                return window.mimetype_prefix + "text-x-authors.png";
            case "text/license":
                return window.mimetype_prefix + "text-x-copying.png";
            case "text/sh":
                return window.mimetype_prefix + "application-x-shellscript.png";
            case "image/cursor":
                return window.mimetype_prefix + "image-x-cursor.png";
            case "theme":
                return window.mimetype_prefix + "application-x-theme.png";
            case "3d-model":
                return window.mimetype_prefix + "application-x-model.png";
            case "text/python":
                return window.mimetype_prefix + "text-x-python.png";
                case "android/setup":
                return window.mimetype_prefix + "application-apk.png";
            case "text/xml":
                return window.mimetype_prefix + "text-xml.png";
            case "bytecode/python":
                return window.mimetype_prefix + "application-x-python-bytecode.png";
            case "text/c":
                return window.mimetype_prefix + "text-x-c.png";
            case "text/php":
                return window.mimetype_prefix + "text-x-php.png";
            case "text/log":
                return window.mimetype_prefix + "text-x-log.png";
            case "extension":
                return window.mimetype_prefix + "application-x-addon.png";
                case "text/v":
                return window.mimetype_prefix + "text-x-v.png";
                case "disk/iso":
                return window.mimetype_prefix + "application-x-cd-image.png";
            case "font":
                return window.mimetype_prefix + "font-x-generic.png";
            default:
                return window.mimetype_prefix + "text-x-preview.png";
        }
    }

    window.search_file = (file_name) => {
        if(file_name == "") return (_search_style.innerHTML = "");
        _search_style.textContent = `.filePreview:not(:is([search_index *= "${file_name?.toLowerCase()}"], [search_index *= "${file_name?.toLocaleLowerCase()}"])) {
            display: none;
        }`;
    };

    window.is_os_windows = (!!navigator.userAgentData) ? navigator.userAgentData.platform == "Windows" : navigator.userAgent.includes("Win");
    window.mimetype_prefix = chrome.runtime.getURL("assets/mimetypes/");

    let new_head = document.createElement("head");
    let _style = document.createElement("style");
    new_head.append(_style);
    window._search_style = document.createElement("style");
    new_head.append(_search_style);
    let _title = document.createElement("title");
    new_head.append(_title);
    let _favicon = document.createElement("link");
    _favicon.setAttribute("rel", "icon");
    _favicon.setAttribute("type", "image/png");
    _favicon.setAttribute("href", chrome.runtime.getURL("assets/icons/drive-harddisk-solidstate.png"));
    new_head.append(_favicon);
    let new_body = document.createElement("body");

    window.control_bar = document.createElement("div");
    control_bar.className = "controlBar actionBar";
    new_body.append(control_bar);

    [
        {
            title: "Preferences",
            icon: "assets/icons/open-menu-symbolic.svg",
            function: () => {
                preferences.show();
            }
        },
        {
            title: "Find",
            icon: "assets/icons/edit-find-symbolic.svg",
            function: toggle_find_dialog,
        },
        {
            title: "Switch View",
            icon: (lfe_config.folder_view == 0) ? "assets/icons/view-list-symbolic.svg" : "assets/icons/view-grid-symbolic.svg",
            function: e => {
                if(folder_view.getAttribute("preview_mode") == "grid") {
                    folder_view.setAttribute("preview_mode", "list");
                    lfe_config.set("folder_view", 1);
                    e.target.querySelector("img").src = chrome.runtime.getURL("assets/icons/view-grid-symbolic.svg");
                } else {
                    folder_view.setAttribute("preview_mode", "grid");
                    lfe_config.set("folder_view", 0);
                    e.target.querySelector("img").src = chrome.runtime.getURL("assets/icons/view-list-symbolic.svg");
                }
            }
        },
        {
            title: "Go Up",
            icon: "assets/icons/go-up-symbolic.svg",
            function: () => {
                location.href = Array.from(navigation_bar.childNodes).at(-2)?.href ?? "#";
            }
        }
    ].forEach((e) => {
        let _control = document.createElement("div");
        _control.className = "control action";
        control_bar.append(_control);
        _control.title = e.title;
        _control.addEventListener("click", e.function);

        let _icon = document.createElement("img");
        _icon.className = "controlIcon";
        _icon.setAttribute("draggable", false);
        _icon.src = chrome.runtime.getURL(e.icon);
        _control.append(_icon);
    });

    window.preferences = document.createElement("dialog");
    new_body.append(preferences);
    preferences._show = preferences.show;
    preferences._close = preferences.close;
    preferences.show = () => {
        preferences.quit_handler = new AbortController();
        document.addEventListener("keydown", e => {
            if(e.key = "Escape") {
                preferences.close();
            };
        }, {signal: preferences.quit_handler.signal});

        [
            {
                "type": "category",
                "title": "General"
            },
            {
                "type": "controls",
                "controls": [
                    {
                        "code": "zoom_level",
                        "type": "dropdown",
                        "values": ["tiny", "small", "medium", "large", "huge"],
                        "title": "Sets zoom level",
                        "live_apply": (size) => {
                            folder_view.set_zoom_level(size);
                        }
                    },
                    {
                        "code": "use_preview_of_images",
                        "type": "switch",
                        "title": "Use images instead of file icon",
                        "details": "Enabling this setting, will slow down loading folders that has a lot of images, high-resolution images or animated images. Also the setting can cause ratio issue on folder view."
                    },
                    {
                        "code": "use_native_icons",
                        "type": "switch",
                        "title": "Use system icons for previews",
                        "targets": ["firefox"]
                    }
                ]
            },
            {
                "type": "category",
                "title": "About"
            },
            {
                "type": "controls",
                "controls": [
                    {
                        "title": "App Version",
                        "type": "info",
                        "info": chrome.runtime.getManifest().version
                    },
                    {
                        "title": "This project is licensed by Apache License 2.0",
                        "type": "button",
                        "button_text": "Read License",
                        "handler": () => {
                            window.open(chrome.runtime.getURL("LICENSE"));
                        }
                    },
                    {
                        "title": "The Yaru icons and the app icon is licensed by CC-BY-SA 4.0",
                        "type": "button",
                        "button_text": "Read License",
                        "handler": () => {
                            window.open(chrome.runtime.getURL("LICENSE_CC_BY_SA_4_0"));
                        }
                    },
                    {
                        "title": "Contact me over GitHub",
                        "type": "button",
                        "button_text": "View Developer in GitHub",
                        "handler": () => {
                            window.open("https://github.com/malisipi/");
                        }
                    },
                    {
                        "title": "Source code of this project is stored on GitHub",
                        "type": "button",
                        "button_text": "View Source Code in GitHub",
                        "handler": () => {
                            window.open("https://github.com/malisipi/local-file-explorer/");
                        }
                    }
                ]
            }
        ].forEach(section => {
            if(section.type == "category") {
                let category = document.createElement("div");
                category.className = "dialogCategory";
                category.innerText = section.title;
                preferences.append(category);
            } else {
                let controls = document.createElement("div");
                controls.className = "dialogOptions";
                preferences.append(controls);
                section.controls.forEach(controller => {
                    // If there's a controller than supports only specific browsers, hide them in other browsers
                    if(!!controller.targets && !controller.targets.includes(the_browser)) return;

                    let container = document.createElement("div");
                    container.className = "dialogOption";
                    controls.append(container);
                    let title = document.createElement("div");
                    title.className = "optionName";
                    let the_title = document.createElement("div");
                    the_title.innerText = controller.title;
                    the_title.className = "optionTitle";
                    title.append(the_title);
                    if(controller.details != undefined) {
                        let the_details = document.createElement("div");
                        the_details.className = "optionDetails"
                        the_details.innerText = controller.details;
                        title.append(the_details);
                    }
                    container.append(title);
                    let input = undefined;
                    if(controller.type == "dropdown"){
                        input = document.createElement("select")
                    } else if(controller.type == "info"){
                        input = document.createElement("div");
                    } else {
                        input = document.createElement("input")
                    }
                    input.className = "optionControl";
                    container.append(input);

                    if(controller.type == "button"){
                        input.type = "button";
                        input.value = controller.button_text;
                    } else if (controller.type == "switch"){
                        input.type = "checkbox";
                        input.checked = lfe_config[controller.code];
                        input.setAttribute("switch_mode", true);
                    } else if (controller.type == "info"){
                        input.innerText = controller.info;
                    } else { // dropdown
                        controller.values.forEach((option, option_index) => {
                            let select_option = document.createElement("option");
                            select_option.innerText = option;
                            select_option.selected = option_index == lfe_config[controller.code];
                            input.append(select_option);
                        });
                    }

                    if(controller.code){
                        input.id = controller.code;
                        if(controller.type == "dropdown") {
                            input.addEventListener("input", (e, live_apply = controller.live_apply) => {
                                lfe_config.set(e.target.id, e.target.selectedIndex);
                                (live_apply ?? (()=>{}))(e.target.selectedIndex);
                            });
                        } else if (controller.type == "switch") {
                            input.addEventListener("input", (e, live_apply = controller.live_apply) => {
                                lfe_config.set(e.target.id, e.target.checked);
                                (live_apply ?? (()=>{}))(e.target.checked);
                            });
                        };
                    } else {
                        input.addEventListener("click", controller.handler);
                    };
                });
            };
        });
        preferences._show();
    };
    preferences.showModal = preferences.show;
    preferences.close = () => {
        preferences.quit_handler.abort();
        preferences.innerText = "";
        preferences._close();
    };

    window.navigation_bar = document.createElement("div");
    window.navigation_bar_scroll = {
        left: undefined,
        right: undefined,
        handler: undefined
    };
    navigation_bar.className = "navigationBar actionBar";
    navigation_bar.addEventListener("mouseenter", e => {
        navigation_bar_scroll.handler = setInterval(() => {
            if(navigation_bar_scroll.left < 20) {
                navigation_bar.scrollBy(-15, 0);
            } else if(navigation_bar_scroll.right < 20) {
                navigation_bar.scrollBy(15, 0);
            }
        }, 50);
    });
    navigation_bar.addEventListener("mousemove", e => {
        let cr = navigation_bar.getBoundingClientRect();
        navigation_bar_scroll.left = e.clientX - cr.x;
        navigation_bar_scroll.right = cr.x+cr.width-e.clientX;
    });
    navigation_bar.addEventListener("mouseleave", e => {
        clearInterval(navigation_bar_scroll.handler);
    });
    new_body.append(navigation_bar);

    window.preview_view = document.createElement("div");
    preview_view.className = "previewView";
    new_body.append(preview_view);

    let preview_title = document.createElement("div");
    preview_title.className = "previewTitle";
    preview_view.append(preview_title);

    window.preview_icon = document.createElement("img");
    preview_icon.setAttribute("draggable", false);
    preview_icon.className = "previewIcon";
    preview_title.append(preview_icon);

    window.preview_name = document.createElement("div");
    preview_name.className = "previewName";
    preview_title.append(preview_name);

    window.preview_viewer = document.createElement("iframe");
    preview_viewer.className = "previewViewer default";
    preview_viewer.setAttribute("sandbox", "");
    preview_view.append(preview_viewer);

    window.preview_media_viewer = document.createElement("video");
    preview_media_viewer.className = "previewViewer media";
    preview_media_viewer.controls = true;
    preview_media_viewer.autoplay = true;
    preview_view.append(preview_media_viewer);

    window.preview_pdf_viewer = document.createElement("iframe");
    preview_pdf_viewer.className = "previewViewer pdf";
    preview_view.append(preview_pdf_viewer);

    window.preview_image_viewer = document.createElement("img");
    preview_image_viewer.className = "previewViewer image";
    preview_image_viewer.setAttribute("draggable", false);
    preview_view.append(preview_image_viewer);

    window.preview_info = document.createElement("div");
    preview_info.className = "previewInfo";
    preview_view.append(preview_info);

    window.folder_view = document.createElement("div");
    folder_view.className = "folderView";
    folder_view.setAttribute("preview_mode", ["grid", "list"][lfe_config.folder_view]);
    folder_view.set_zoom_level = (zoom_level) => {
        folder_view.setAttribute("zoom_level", ["tiny", "small", "medium", "large", "huge"][zoom_level]);
    }
    folder_view.set_zoom_level(lfe_config.zoom_level);
    new_body.append(folder_view);

    window.search_dialog = document.createElement("div");
    search_dialog.className = "dialog search";
    new_body.append(search_dialog);

    window.search_dialog_input = document.createElement("input");
    search_dialog_input.className = "dialogInput";
    search_dialog_input.addEventListener("input", e => {
        search_file(e.target.value);
    });
    search_dialog.append(search_dialog_input);

    let search_dialog_action = document.createElement("div");
    search_dialog_action.className = "dialogAction";
    search_dialog_action.addEventListener("click", () => {
        search_dialog.removeAttribute("visible");
        search_file("");
    });
    search_dialog.append(search_dialog_action);

    let search_dialog_action_icon = document.createElement("img");
    search_dialog_action_icon.className = "dialogActionIcon"
    search_dialog_action_icon.setAttribute("draggable", false);
    search_dialog_action_icon.src = chrome.runtime.getURL("assets/icons/application-exit-symbolic.svg");
    search_dialog_action.append(search_dialog_action_icon);

    let info = {
        path: location.href.replace("file://","")
    };
    if(the_browser == "chrome") {
        info.file_list = Array.from(document.querySelectorAll("tr")).slice(1);
    } else if(the_browser == "firefox") {
        info.file_list = (await (await fetch(location.href)).text()).split("\n").filter(file=>file.startsWith("201:")).map(file=>file.replace(/[0-9]*:/,"").trim().split(" "));
    } else {
        throw Error("Unsupported Browser");
    };
    _title.innerText = decodeURI(info.path);
    info.locations = info.path.match(/[^\/]*\//g);

    _style.innerHTML = `
    * {
        font-family: Ubuntu, "Noto Sans", "Fira Sans", serif;
    }

    body {
        --transition-duration: 100ms;
        --border-radius: 10px;
        --panel-size: clamp(300px, 30%, 600px);
        --hover-color: #CCCCCC;
        --select-color: #AAAAAA;
        --text-color: #333333;
        --bg-color: #EEEEEE;
        --color-scheme: light;

        @media (prefers-color-scheme: dark) {
            --hover-color: #333333;
            --select-color: #555555;
            --text-color: #CCCCCC;
            --bg-color: #111111;
            --color-scheme: dark;
        }

        background: var(--bg-color);
    }

    input[switch_mode="true"] {
        width: 40px;
        appearance: none;
        background: var(--select-color);
        height: 20px;
        min-height: 0;
        border-radius: var(--border-radius);
    }

    input[switch_mode="true"]:after {
        position: absolute;
        content: "";
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background: var(--text-color);
        transform: translate(-10px, -5px);
        transition-duration: var(--transition-duration);
    }

    input[switch_mode="true"]:checked:after {
        transform: translate(20px, -5px);
    }

    .navigationBar {
        position: fixed;
        top: 0;
        left: 220px;
        width: calc(100% - 220px);
        height: 60px;
        padding: 5px 20px;
        box-sizing: border-box;

        .navigationLocation {
            min-width: 50px;
            padding: 0 30px;
            font-size: x-large;
            text-decoration: none;
            color: var(--text-color);
        }
    }

    .controlBar {
        position: fixed;
        top: 0;
        left: 0;
        width: 220px;
        height: 60px;
        padding: 5px;
        box-sizing: border-box;
        justify-content: center;

        .control {
            aspect-ratio: 1;

            .controlIcon {
                aspect-ratio: 1;
                height: 32px;
                pointer-events: none;
            }
        }
    }

    .previewView {
        position: fixed;
        right: 25px;
        top: 85px;
        bottom: 25px;
        width: var(--panel-size);
        background: var(--select-color);
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        user-select: none;

        &:not([open]){
            display: none;
        }

        .previewTitle {
            display: flex;
            align-items: center;
            width: 100%;
            height: 80px;
            user-select: text;

            & * {
                padding: 0 15px;
            }

            .previewIcon {
                height: 64px;
            }

            .previewName {
                color: var(--text-color);
            }
        }

        .previewViewer {
            height: 0;
            flex-grow: 1;
            display: none;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            border: none;
            border-top: 1px var(--text-color) solid;
        }

        .previewInfo {
            color: var(--text-color);
            padding: 8px 20px;
            box-sizing: border-box;
        }

        &[open="media"] .previewViewer.media {
            display: unset;
            color-scheme: var(--color-scheme);
        }

        &[open="image"] .previewViewer.image {
            object-fit: contain;
            image-rendering: pixelated;
            display: unset;
        }

        &[open="pdf"] .previewViewer.pdf {
            object-fit: contain;
            image-rendering: pixelated;
            display: unset;
        }

        &[open="default"] .previewViewer.default {
            display: unset;
        }
    }

    .actionBar {
        display: flex;
        user-select: none;
        overflow-x: auto;

        &::-webkit-scrollbar {
            display: none;
        }

        .action {
            display: flex;
            height: 100%;
            text-wrap: nowrap;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            transition-duration: var(--transition-duration);

            &:first-child {
                border-radius: var(--border-radius) 0 0 var(--border-radius);

                &:last-child {
                    border-radius: var(--border-radius);
                }
            }

            &:last-child {
                border-radius: 0 var(--border-radius) var(--border-radius) 0;
            }

            &:hover {
                background: var(--hover-color);
            }
        }
    }

    .folderView {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        align-content: flex-start;
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-y: auto;
        user-select: none;
        color-scheme: var(--color-scheme);

        :is(body):has(.previewView[open]) & {
            right: calc(var(--panel-size) + 50px);
        }

        .filePreview {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 5px;
            border-radius: var(--border-radius);
            transition-duration: var(--transition-duration);

            &:hover {
                background: var(--hover-color);
            }

            &:focus {
                background: var(--select-color);
            }

            .fileIcon {
                pointer-events: none;
            }

            .fileName {
                flex-grow: 1;
                overflow-wrap: anywhere;
                text-align: center;
                pointer-events: none;
                color: var(--text-color);
            }
        }

        &[preview_mode="list"] .filePreview {
            flex-direction: row;
        }


        &[zoom_level="tiny"] .filePreview {
            width: 60px;

            .fileIcon {
                width: 32px;
            }

            .fileName {
                font-size: x-small;
            }
        }
        &[preview_mode="list"][zoom_level="tiny"] .filePreview {
            width: 120px;
        }


        &[zoom_level="small"] .filePreview {
            width: 80px;

            .fileIcon {
                width: 48px;
            }

            .fileName {
                font-size: small;
            }
        }
        &[preview_mode="list"][zoom_level="small"] .filePreview {
            width: 160px;
        }


        &[zoom_level="medium"] .filePreview {
            width: 100px;

            .fileIcon {
                width: 64px;
            }

            .fileName {
                font-size: medium;
            }
        }
        &[preview_mode="list"][zoom_level="medium"] .filePreview {
            width: 250px;
        }


        &[zoom_level="large"] .filePreview {
            width: 130px;

            .fileIcon {
                width: 64px;
            }

            .fileName {
                font-size: large;
            }
        }
        &[preview_mode="list"][zoom_level="large"] .filePreview {
            width: 325px;
        }


        &[zoom_level="huge"] .filePreview {
            width: 160px;
            .fileIcon {
                width: 128px;
            }

            .fileName {
                font-size: x-large;
            }
        }
        &[preview_mode="list"][zoom_level="huge"] .filePreview {
            width: 400px;
        }
    }

    .dialog {
        position: fixed;
        height: 50px;
        width: auto;
        display: flex;
        flex-wrap: no-wrap;
        background: var(--select-color);
        padding: 5px;
        box-sizing: border-box;
        border-radius: var(--border-radius);

        &:not([visible]) {
            display: none;
        }

        &.search {
            right: 25px;
            top: 0px;
            width: 300px;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
        }

        .dialogInput {
            box-sizing: border-box;
            background: none;
            flex-grow: 1;
            background: none;
            border: none;
            border-radius: var(--border-radius);
            text-size: large;
            color: var(--text-color);
        }

        .dialogAction {
            aspect-ratio: 1;
            margin: 0 3px;
            display: flex;
            justify-content: center;
            align-items: center;

            .dialogActionIcon {
                aspect-ratio: 1;
                height: 32px;
                pointer-events: none;
            }
        }
    }

    dialog {
        position: fixed;
        box-sizing: border-box;
        background: var(--hover-color);
        border-radius: var(--border-radius);
        border: var(--text-color) 1px solid;
        width: 450px;
        height: auto;
        z-index: 9;

        .dialogCategory {
            width: 100%;
            font-size: x-large;
            color: var(--text-color);
        }

        .dialogOptions {
            padding: 20px 0;

            .dialogOption {
                width: 100%;
                min-height: 50px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                background: var(--bg-color);
                box-sizing: border-box;
                padding: 5px 10px;

                &:not(:last-child) {
                    border-bottom: 1px var(--select-color) solid;
                }

                &:first-child {
                    border-radius: var(--border-radius) var(--border-radius) 0 0;

                    &:last-child {
                        border-radius: var(--border-radius);
                    }
                }

                &:last-child {
                    border-radius: 0 0 var(--border-radius) var(--border-radius);
                }

                .optionName {
                    display: flex;
                    flex-direction: column;
                    flex-shrink: 25;

                    .optionTitle {
                        font-size: large;
                        color: var(--text-color);
                    }

                    .optionDetails {
                        font-size: small;
                        color: var(--select-color);
                    }
                }

                .optionControl {
                    color: var(--text-color);

                    &:not(input[type="checkbox"][switch_mode="true"]){
                        min-height: 30px;
                    }

                    &:is(input[type="checkbox"][switch_mode="true"]){
                        transform: translate(-10px, 0);
                    }

                    &:is(div, input[type="button"]) {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    &:is(select, input[type="button"], div) {
                        text-transform: capitalize;
                        border: none;
                        border-radius: var(--border-radius);
                        background: var(--select-color);
                        padding: 0 5px;
                    }
                }
            }
        }
    }

    body:has(dialog[open]) > *:not(dialog[open]) {
        pointer-events: none;
        opacity: 0.4;
    }
    `;

    let __location_helper = "file://";
    if(is_os_windows) __location_helper += "/";
    for(location_index = Number(is_os_windows); location_index < info.locations.length; location_index++){
        let location = info.locations[location_index];
        let navigation_location = document.createElement("a");
        navigation_location.className = "navigationLocation action";
        navigation_location.tabIndex = 0;
        navigation_location.innerText = decodeURI(location);
        __location_helper += location;
        navigation_location.href = __location_helper;
        navigation_bar.append(navigation_location);
    }

    for(file_index=0; file_index < info.file_list.length; file_index++){
        let file_info = {
            __node: info.file_list[file_index]
        };
        if(the_browser == "chrome"){
            file_info.__details = file_info.__node.querySelectorAll("td");
            file_info.__link = file_info.__node.querySelector("a");
            file_info.href = file_info.__link.href;
            file_info.is_folder = file_info.__link.className == "icon dir";
            file_info.name = file_info.__details[0].getAttribute("data-value");
            if(file_info.is_folder) file_info.name = file_info.name.slice(0,-1);
            file_info.size = file_info.__details[1].getAttribute("data-value");
            file_info.time = file_info.__details[2].getAttribute("data-value");
        } else if (the_browser == "firefox") {
            file_info.name = decodeURIComponent(file_info.__node[0]);
            file_info.href = location.href + "/" + file_info.__node[0] + "/";
            file_info.href = file_info.href.replace(/[\/]{2,}/g,"/").replaceAll("./","");
            file_info.is_folder = file_info.__node[3] == "DIRECTORY";
            file_info.time = Number((new Date(decodeURIComponent(file_info.__node[2]))).getTime() / 1000);
            file_info.size = Number(file_info.__node[1]);
        } else {
            throw Error("Unsupported Browser");
        };
        file_info.type = window.get_file_type(file_info.name, file_info.is_folder);
        if(file_info.type != "folder" && the_browser == "firefox" && lfe_config.use_native_icons){
            file_info.icon = window.get_native_icon(file_info.name);
        } else {
            file_info.icon = window.get_icon(file_info.type);
        }

        let file_preview = document.createElement("div");
        file_preview.className = "filePreview";
        file_preview.tabIndex = 0;
        file_preview.setAttribute("properties", JSON.stringify(file_info.__filter_keys(e=>!e.startsWith("__"))));
        file_preview.setAttribute("search_index", file_info.name.toLowerCase() + "." + file_info.name.toLocaleLowerCase());
        file_preview.addEventListener("click", (e) => {
            let details = JSON.parse(e.target.getAttribute("properties"));
            if(details.is_folder) return;
            let mode = "default";
            switch(details.type){
                case "audio":
                case "video":
                    mode = "media";
                    break;
                case "image":
                case "vector":
                    mode = "image";
                    break;
                case "pdf":
                    mode = "pdf";
                    break;
            }
            setTimeout(() => {
                preview_view.setAttribute("open", mode);
            }, 250);
            preview_icon.src = details.icon;
            preview_name.innerText = details.name;
            if(mode == "media") {
                preview_media_viewer.src = details.href;
            } else if(mode == "image") {
                preview_image_viewer.src = details.href;
                if(preview_media_viewer.hasAttribute("src")) preview_media_viewer.removeAttribute("src");
            } else if(mode == "pdf") {
                preview_pdf_viewer.src = details.href;
                if(preview_media_viewer.hasAttribute("src")) preview_media_viewer.removeAttribute("src");
            } else {
				preview_viewer.src = `data:text/html,
                    <img src="${chrome.runtime.getURL('assets/icons/filter-flagged-symbolic.svg')}" draggable="false" />
                    <h1>Preview can not be loaded. It's unsupported file format or unreadable file.</h1>
                    <style>
                        img {
                            position: fixed;
                            top: 25px;
                            left: 50%;
                            transform: translate(-50%, 0);
                            width: 80px;
                        }

                        h1 {
                            position: fixed;
                            top: 125px;
                            left: 25px;
                            right: 25px;
                            font-family: Ubuntu, "Noto Sans", "Fira Sans", serif;
                            font-size: large;
                            text-align: center;
                        }

                        * {
                            user-select: none;
                        }
                    </style>
                    `;
                setTimeout(() => {
                	preview_viewer.src = details.href;
                }, 10);
                if(preview_media_viewer.hasAttribute("src")) preview_media_viewer.removeAttribute("src");
            };
            preview_info.innerText = `Size: ${get_human_readable_size(details.size)}
            Change Time: ${get_human_readable_time(details.time)}`;
        });
        file_preview.addEventListener("mousedown", (e) => {
            if(e.button == 1) {
                window.open(JSON.parse(e.target.getAttribute("properties")).href);
            };
        });
        file_preview.addEventListener("dblclick", (e) => {
            location.href = JSON.parse(e.target.getAttribute("properties")).href;
        });

        let file_icon = document.createElement("img");
        file_icon.className = "fileIcon";
        file_icon.setAttribute("draggable", false);
        if(lfe_config.use_preview_of_images && (file_info.type == "image" || file_info.type == "vector")) {
            file_icon.src = file_info.href;
        } else {
            file_icon.src = file_info.icon;
        }
        file_preview.append(file_icon);

        let file_name = document.createElement("span");
        file_name.className = "fileName";
        file_name.innerText = file_info.name;
        file_preview.append(file_name);

        folder_view.append(file_preview);
    }
    document.head.replaceWith(new_head);
    document.body.replaceWith(new_body);
};

if(!!document.querySelector("#parentDirLinkBox")) lfe("chrome");
if(!!document.querySelector("link[rel='stylesheet'][href*='dirListing']")) lfe("firefox");
