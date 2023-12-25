(() => {
    "use strict";
    const flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
    function addTouchClass() {
        if (isMobile.any()) document.documentElement.classList.add("touch"); else document.documentElement.classList.add("pc");
    }
    function addLoadedClass() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    class Popup {
        constructor(options) {
            let config = {
                logging: true,
                init: true,
                attributeOpenButton: "data-popup",
                attributeCloseButton: "data-close",
                fixElementSelector: "[data-lp]",
                youtubeAttribute: "data-popup-youtube",
                youtubePlaceAttribute: "data-popup-youtube-place",
                setAutoplayYoutube: true,
                classes: {
                    popup: "popup",
                    popupContent: "popup__content",
                    popupActive: "popup_show",
                    bodyActive: "popup-show"
                },
                focusCatch: true,
                closeEsc: true,
                bodyLock: true,
                hashSettings: {
                    location: true,
                    goHash: true
                },
                on: {
                    beforeOpen: function() {},
                    afterOpen: function() {},
                    beforeClose: function() {},
                    afterClose: function() {}
                }
            };
            this.youTubeCode;
            this.isOpen = false;
            this.targetOpen = {
                selector: false,
                element: false
            };
            this.previousOpen = {
                selector: false,
                element: false
            };
            this.lastClosed = {
                selector: false,
                element: false
            };
            this._dataValue = false;
            this.hash = false;
            this._reopen = false;
            this._selectorOpen = false;
            this.lastFocusEl = false;
            this._focusEl = [ "a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])' ];
            this.options = {
                ...config,
                ...options,
                classes: {
                    ...config.classes,
                    ...options?.classes
                },
                hashSettings: {
                    ...config.hashSettings,
                    ...options?.hashSettings
                },
                on: {
                    ...config.on,
                    ...options?.on
                }
            };
            this.bodyLock = false;
            this.options.init ? this.initPopups() : null;
        }
        initPopups() {
            this.popupLogging(`Проснулся`);
            this.eventsPopup();
        }
        eventsPopup() {
            document.addEventListener("click", function(e) {
                const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
                if (buttonOpen) {
                    e.preventDefault();
                    this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
                    this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
                    if (this._dataValue !== "error") {
                        if (!this.isOpen) this.lastFocusEl = buttonOpen;
                        this.targetOpen.selector = `${this._dataValue}`;
                        this._selectorOpen = true;
                        this.open();
                        return;
                    } else this.popupLogging(`Ой ой, не заполнен атрибут у ${buttonOpen.classList}`);
                    return;
                }
                const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
                if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
            }.bind(this));
            document.addEventListener("keydown", function(e) {
                if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
                    e.preventDefault();
                    this.close();
                    return;
                }
                if (this.options.focusCatch && e.which == 9 && this.isOpen) {
                    this._focusCatch(e);
                    return;
                }
            }.bind(this));
            if (this.options.hashSettings.goHash) {
                window.addEventListener("hashchange", function() {
                    if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
                }.bind(this));
                window.addEventListener("load", function() {
                    if (window.location.hash) this._openToHash();
                }.bind(this));
            }
        }
        open(selectorValue) {
            if (bodyLockStatus) {
                this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
                if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
                    this.targetOpen.selector = selectorValue;
                    this._selectorOpen = true;
                }
                if (this.isOpen) {
                    this._reopen = true;
                    this.close();
                }
                if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
                if (!this._reopen) this.previousActiveElement = document.activeElement;
                this.targetOpen.element = document.querySelector(this.targetOpen.selector);
                if (this.targetOpen.element) {
                    if (this.youTubeCode) {
                        const codeVideo = this.youTubeCode;
                        const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
                        const iframe = document.createElement("iframe");
                        iframe.setAttribute("allowfullscreen", "");
                        const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
                        iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
                        iframe.setAttribute("src", urlVideo);
                        if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
                        }
                        this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
                    }
                    if (this.options.hashSettings.location) {
                        this._getHash();
                        this._setHash();
                    }
                    this.options.on.beforeOpen(this);
                    document.dispatchEvent(new CustomEvent("beforePopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.targetOpen.element.classList.add(this.options.classes.popupActive);
                    document.documentElement.classList.add(this.options.classes.bodyActive);
                    if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
                    this.targetOpen.element.setAttribute("aria-hidden", "false");
                    this.previousOpen.selector = this.targetOpen.selector;
                    this.previousOpen.element = this.targetOpen.element;
                    this._selectorOpen = false;
                    this.isOpen = true;
                    setTimeout((() => {
                        this._focusTrap();
                    }), 50);
                    this.options.on.afterOpen(this);
                    document.dispatchEvent(new CustomEvent("afterPopupOpen", {
                        detail: {
                            popup: this
                        }
                    }));
                    this.popupLogging(`Открыл попап`);
                } else this.popupLogging(`Ой ой, такого попапа нет.Проверьте корректность ввода. `);
            }
        }
        close(selectorValue) {
            if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") this.previousOpen.selector = selectorValue;
            if (!this.isOpen || !bodyLockStatus) return;
            this.options.on.beforeClose(this);
            document.dispatchEvent(new CustomEvent("beforePopupClose", {
                detail: {
                    popup: this
                }
            }));
            if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
            this.previousOpen.element.classList.remove(this.options.classes.popupActive);
            this.previousOpen.element.setAttribute("aria-hidden", "true");
            if (!this._reopen) {
                document.documentElement.classList.remove(this.options.classes.bodyActive);
                !this.bodyLock ? bodyUnlock() : null;
                this.isOpen = false;
            }
            this._removeHash();
            if (this._selectorOpen) {
                this.lastClosed.selector = this.previousOpen.selector;
                this.lastClosed.element = this.previousOpen.element;
            }
            this.options.on.afterClose(this);
            document.dispatchEvent(new CustomEvent("afterPopupClose", {
                detail: {
                    popup: this
                }
            }));
            setTimeout((() => {
                this._focusTrap();
            }), 50);
            this.popupLogging(`Закрыл попап`);
        }
        _getHash() {
            if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
        }
        _openToHash() {
            let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
            const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
            if (buttons && classInHash) this.open(classInHash);
        }
        _setHash() {
            history.pushState("", "", this.hash);
        }
        _removeHash() {
            history.pushState("", "", window.location.href.split("#")[0]);
        }
        _focusCatch(e) {
            const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
            const focusArray = Array.prototype.slice.call(focusable);
            const focusedIndex = focusArray.indexOf(document.activeElement);
            if (e.shiftKey && focusedIndex === 0) {
                focusArray[focusArray.length - 1].focus();
                e.preventDefault();
            }
            if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
                focusArray[0].focus();
                e.preventDefault();
            }
        }
        _focusTrap() {
            const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
            if (!this.isOpen && this.lastFocusEl) this.lastFocusEl.focus(); else focusable[0].focus();
        }
        popupLogging(message) {
            this.options.logging ? functions_FLS(`[Попапос]: ${message}`) : null;
        }
    }
    flsModules.popup = new Popup({});
    class ScrollWatcher {
        constructor(props) {
            let defaultConfig = {
                logging: true
            };
            this.config = Object.assign(defaultConfig, props);
            this.observer;
            !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
        }
        scrollWatcherUpdate() {
            this.scrollWatcherRun();
        }
        scrollWatcherRun() {
            document.documentElement.classList.add("watcher");
            this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
        }
        scrollWatcherConstructor(items) {
            if (items.length) {
                this.scrollWatcherLogging(`Проснулся, слежу за объектами (${items.length})...`);
                let uniqParams = uniqArray(Array.from(items).map((function(item) {
                    return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
                })));
                uniqParams.forEach((uniqParam => {
                    let uniqParamArray = uniqParam.split("|");
                    let paramsWatch = {
                        root: uniqParamArray[0],
                        margin: uniqParamArray[1],
                        threshold: uniqParamArray[2]
                    };
                    let groupItems = Array.from(items).filter((function(item) {
                        let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                        let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                        let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                        if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                    }));
                    let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                    this.scrollWatcherInit(groupItems, configWatcher);
                }));
            } else this.scrollWatcherLogging("Сплю, нет объектов для слежения. ZzzZZzz");
        }
        getScrollWatcherConfig(paramsWatch) {
            let configWatcher = {};
            if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`Эмм... родительского объекта ${paramsWatch.root} нет на странице`);
            configWatcher.rootMargin = paramsWatch.margin;
            if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
                this.scrollWatcherLogging(`Ой ой, настройку data-watch-margin нужно задавать в PX или %`);
                return;
            }
            if (paramsWatch.threshold === "prx") {
                paramsWatch.threshold = [];
                for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
            } else paramsWatch.threshold = paramsWatch.threshold.split(",");
            configWatcher.threshold = paramsWatch.threshold;
            return configWatcher;
        }
        scrollWatcherCreate(configWatcher) {
            this.observer = new IntersectionObserver(((entries, observer) => {
                entries.forEach((entry => {
                    this.scrollWatcherCallback(entry, observer);
                }));
            }), configWatcher);
        }
        scrollWatcherInit(items, configWatcher) {
            this.scrollWatcherCreate(configWatcher);
            items.forEach((item => this.observer.observe(item)));
        }
        scrollWatcherIntersecting(entry, targetElement) {
            if (entry.isIntersecting) {
                !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
                this.scrollWatcherLogging(`Я вижу ${targetElement.classList}, добавил класс _watcher-view`);
            } else {
                targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
                this.scrollWatcherLogging(`Я не вижу ${targetElement.classList}, убрал класс _watcher-view`);
            }
        }
        scrollWatcherOff(targetElement, observer) {
            observer.unobserve(targetElement);
            this.scrollWatcherLogging(`Я перестал следить за ${targetElement.classList}`);
        }
        scrollWatcherLogging(message) {
            this.config.logging ? functions_FLS(`[Наблюдатель]: ${message}`) : null;
        }
        scrollWatcherCallback(entry, observer) {
            const targetElement = entry.target;
            this.scrollWatcherIntersecting(entry, targetElement);
            targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
            document.dispatchEvent(new CustomEvent("watcherCallback", {
                detail: {
                    entry
                }
            }));
        }
    }
    flsModules.watcher = new ScrollWatcher({});
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const jump = document.getElementById("jump");
    $(document).ready((function() {
        $(".title").lettering();
    }));
    function animation() {
        var title1 = new TimelineMax;
        title1.staggerFromTo(".title span", .5, {
            ease: Back.easeOut.config(1.7),
            opacity: 0,
            bottom: -80
        }, {
            ease: Back.easeOut.config(1.7),
            opacity: 1,
            bottom: 0
        }, .05);
    }
    jump.addEventListener("click", (() => {
        document.documentElement.classList.add("jump");
        setTimeout((() => {
            animation();
        }), 1e3);
    }));
    window.onload = () => {
        if (window.innerWidth < 1280 || document.documentElement.classList.contains("touch")) setTimeout((() => {
            animation();
        }), 500);
    };
    if (window.innerWidth > 1279 && !isMobile.any()) {
        class Ripples {
            constructor({callback = null, curtains = null, container = null, viscosity = 2, speed = 3.5, size = 1, gui = null, guiParams = null} = {}) {
                if (!curtains) return;
                this.curtains = curtains;
                this.params = {
                    container: this.curtains.container,
                    callback,
                    viscosity,
                    speed,
                    size,
                    gui,
                    guiParams
                };
                this.mouse = {
                    current: {
                        x: 0,
                        y: 0
                    },
                    last: {
                        x: 0,
                        y: 0
                    },
                    velocity: {
                        x: 0,
                        y: 0
                    }
                };
                this.debug();
                this.init();
            }
            debug() {
                if (this.params.gui && this.params.guiParams) {
                    this.params.guiParams.viscosity = this.params.viscosity;
                    this.params.guiParams.speed = this.params.speed;
                    this.params.guiParams.size = this.params.size;
                    this.ripplesGui = this.params.gui.addFolder("Render targets");
                    this.ripplesGui.open();
                    this.guiViscosity = this.ripplesGui.add(this.params.guiParams, "viscosity", 1, 15);
                    this.guiSpeed = this.ripplesGui.add(this.params.guiParams, "speed", 1, 15);
                    this.guiSize = this.ripplesGui.add(this.params.guiParams, "size", .5, 2.5).step(.025);
                    this.guiViscosity.onChange((value => {
                        if (this.ripples) this.ripples.uniforms.viscosity.value = value;
                    }));
                    this.guiSpeed.onChange((value => {
                        if (this.ripples) this.ripples.uniforms.speed.value = value;
                    }));
                    this.guiSize.onChange((value => {
                        if (this.ripples) this.ripples.uniforms.size.value = value;
                    }));
                }
            }
            getCanvasSizes() {
                return this.curtains.getBoundingRect();
            }
            lerp(start, end, amt) {
                return (1 - amt) * start + amt * end;
            }
            onMouseMove(e) {
                if (this.ripples) {
                    this.mouse.last.x = this.mouse.current.x;
                    this.mouse.last.y = this.mouse.current.y;
                    let weblgMouseCoords = this.ripples.mouseToPlaneCoords(this.mouse.last.x, this.mouse.last.y);
                    this.ripples.uniforms.lastMousePosition.value = [ weblgMouseCoords.x, weblgMouseCoords.y ];
                    let updateVelocity = true;
                    if (this.mouse.last.x === 0 && this.mouse.last.y === 0 && this.mouse.current.x === 0 && this.mouse.current.y === 0) updateVelocity = false;
                    if (e.targetTouches) {
                        this.mouse.current.x = e.targetTouches[0].clientX;
                        this.mouse.current.y = e.targetTouches[0].clientY;
                    } else {
                        this.mouse.current.x = e.clientX;
                        this.mouse.current.y = e.clientY;
                    }
                    weblgMouseCoords = this.ripples.mouseToPlaneCoords(this.mouse.current.x, this.mouse.current.y);
                    this.ripples.uniforms.mousePosition.value = [ weblgMouseCoords.x, weblgMouseCoords.y ];
                    if (updateVelocity) this.mouse.velocity = {
                        x: (this.mouse.current.x - this.mouse.last.x) / 16,
                        y: (this.mouse.current.y - this.mouse.last.y) / 16
                    };
                }
            }
            setRipplesShaders() {
                this.ripplesVs = `\n              #ifdef GL_FRAGMENT_PRECISION_HIGH\n              precision highp float;\n              #else\n              precision mediump float;\n              #endif\n      \n              // default mandatory variables\n              attribute vec3 aVertexPosition;\n              attribute vec2 aTextureCoord;\n      \n              uniform mat4 uMVMatrix;\n              uniform mat4 uPMatrix;\n      \n              // custom variables\n              varying vec3 vVertexPosition;\n              varying vec2 vTextureCoord;\n      \n              void main() {\n      \n                  vec3 vertexPosition = aVertexPosition;\n      \n                  gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);\n      \n                  // varyings\n                  vTextureCoord = aTextureCoord;\n                  vVertexPosition = vertexPosition;\n              }\n          `;
                this.ripplesFs = `\n              #ifdef GL_FRAGMENT_PRECISION_HIGH\n              precision highp float;\n              #else\n              precision mediump float;\n              #endif\n      \n              uniform vec2 uResolution;\n              uniform vec2 uMousePosition;\n              uniform vec2 uLastMousePosition;\n              uniform vec2 uVelocity;\n              uniform int uTime;\n              uniform sampler2D uTargetTexture;\n              \n              uniform float uViscosity;\n              uniform float uSpeed;\n              uniform float uSize;\n              \n              varying vec3 vVertexPosition;\n              varying vec2 vTextureCoord;\n              \n              // line distance field\n              float sdLine( vec2 p, vec2 a, vec2 b ){\n                  float velocity = clamp(length(uVelocity), 0.5, 1.5);\n                  vec2 pa = p - a, ba = b - a;\n                  float h = clamp( dot(pa, ba)/dot(ba, ba), 0.0, 1.0 );\n                  return length( pa - ba*h ) / velocity;\n              }\n      \n              \n              void main() {\n                  float velocity = clamp(length(uVelocity), 0.1, 1.0);\n                  vec3 speed = vec3(vec2(uSpeed) / uResolution.xy, 0.0);\n                             \n                  vec2 mouse = (uMousePosition + 1.0) * 0.5;\n                  vec2 lastMouse = (uLastMousePosition + 1.0) * 0.5;            \n      \n                  vec4 color = texture2D(uTargetTexture, vTextureCoord);\n                  \n                  // trick given by Edan Kwan on this codepen: https://codepen.io/edankwan/pen/YzXgxxr\n                  // "It is always better to use line distance field instead of single point distance for ripple drawing. And it is cheap and simple."\n                  //float shade = smoothstep(0.02 * uSize * velocity, 0.0, length(mouse - vTextureCoord));\n                  float shade = smoothstep(0.02 * uSize * velocity, 0.0, sdLine(vTextureCoord, lastMouse, mouse));        \n              \n                  vec4 texelColor = color;\n                  \n                  float d = shade * uViscosity;\n                  \n                  float top = texture2D(uTargetTexture, vTextureCoord - speed.zy, 1.0).x;\n                  float right = texture2D(uTargetTexture, vTextureCoord - speed.xz, 1.0).x;\n                  float bottom = texture2D(uTargetTexture, vTextureCoord + speed.xz, 1.0).x;\n                  float left = texture2D(uTargetTexture, vTextureCoord + speed.zy, 1.0).x;\n                  \n                  d += -(texelColor.y - 0.5) * 2.0 + (top + right + bottom + left - 2.0);\n                  d *= 0.99;\n                  \n                  // skip first frames\n                  d *= float(uTime > 5);\n                  \n                  d = d * 0.5 + 0.5;\n                  \n                  color = vec4(d, texelColor.x, 0.0, 1.0);\n              \n                  gl_FragColor = color;\n              }\n          `;
            }
            swapPasses() {
                var tempFBO = this.readPass;
                this.readPass = this.writePass;
                this.writePass = tempFBO;
                this.ripplesTexture.setFromTexture(this.readPass.textures[0]);
            }
            createRipplesTexture() {
                this.ripplesTexture = this.ripples.createTexture({
                    sampler: "uTargetTexture"
                });
                return new Promise((resolve => {
                    if (this.ripplesTexture) resolve();
                }));
            }
            init() {
                this.readPass = this.curtains.addRenderTarget({
                    clear: false
                });
                this.writePass = this.curtains.addRenderTarget({
                    clear: false
                });
                this.setRipplesShaders();
                let boundingRect = this.getCanvasSizes();
                this.ripplesParams = {
                    vertexShader: this.ripplesVs,
                    fragmentShader: this.ripplesFs,
                    autoloadSources: false,
                    depthTest: false,
                    watchScroll: false,
                    uniforms: {
                        mousePosition: {
                            name: "uMousePosition",
                            type: "2f",
                            value: [ this.mouse.current.x, this.mouse.current.y ]
                        },
                        lastMousePosition: {
                            name: "uLastMousePosition",
                            type: "2f",
                            value: [ this.mouse.current.x, this.mouse.current.y ]
                        },
                        velocity: {
                            name: "uVelocity",
                            type: "2f",
                            value: [ this.mouse.velocity.x, this.mouse.velocity.y ]
                        },
                        resolution: {
                            name: "uResolution",
                            type: "2f",
                            value: [ boundingRect.width, boundingRect.height ]
                        },
                        time: {
                            name: "uTime",
                            type: "1i",
                            value: -1
                        },
                        viscosity: {
                            name: "uViscosity",
                            type: "1f",
                            value: this.params.viscosity
                        },
                        speed: {
                            name: "uSpeed",
                            type: "1f",
                            value: this.params.speed
                        },
                        size: {
                            name: "uSize",
                            type: "1f",
                            value: this.params.size
                        }
                    }
                };
                this.ripples = this.curtains.addPlane(this.params.container, this.ripplesParams);
                if (this.ripples) {
                    this.createRipplesTexture().then((() => {
                        if (this.params.callback) this.params.callback(this.ripplesTexture);
                    }));
                    this.ripples.onReady((() => {
                        window.addEventListener("mousemove", (e => this.onMouseMove(e)));
                        window.addEventListener("touchmove", (e => this.onMouseMove(e)));
                    })).onRender((() => {
                        this.ripples.uniforms.velocity.value = [ this.mouse.velocity.x, this.mouse.velocity.y ];
                        this.mouse.velocity = {
                            x: this.lerp(this.mouse.velocity.x, 0, .1),
                            y: this.lerp(this.mouse.velocity.y, 0, .1)
                        };
                        this.ripples.uniforms.velocity.value = [ this.mouse.velocity.x, this.mouse.velocity.y ];
                        this.ripples.uniforms.time.value++;
                        this.writePass && this.ripples.setRenderTarget(this.writePass);
                    })).onAfterRender((() => {
                        if (this.readPass && this.writePass) this.swapPasses();
                    })).onAfterResize((() => {
                        boundingRect = this.getCanvasSizes();
                        this.ripples.uniforms.resolution.value = [ boundingRect.width, boundingRect.height ];
                    }));
                }
            }
        }
        class RipplesScene {
            constructor({viscosity = 5, speed = 3.5, size = 1, displacementStrength = 4, lightIntensity = 5, shadowIntensity = 2.5} = {}) {
                this.params = {
                    viscosity,
                    speed,
                    size,
                    displacementStrength,
                    lightIntensity,
                    shadowIntensity
                };
                this.init();
            }
            debug() {
                this.sceneGui = this.gui.addFolder("Scene");
                this.sceneGui.open();
                this.guiDisplacement = this.sceneGui.add(this.guiParams, "displacement", 0, 5);
                this.guiLights = this.sceneGui.add(this.guiParams, "lights", .1, 10);
                this.guiShadows = this.sceneGui.add(this.guiParams, "shadows", .1, 10);
                this.guiBlurRipples = this.sceneGui.add(this.guiParams, "blurRipples", true);
                this.guiShowTexture = this.sceneGui.add(this.guiParams, "showTexture", true);
                this.guiTitleColor = this.sceneGui.addColor(this.guiParams, "titleColor");
                this.guiDisplacement.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.displacementStrength.value = value;
                }));
                this.guiLights.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.lightIntensity.value = value;
                }));
                this.guiShadows.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.shadowIntensity.value = value;
                }));
                this.guiBlurRipples.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.blurRipples.value = value ? 1 : 0;
                }));
                this.guiShowTexture.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.showTexture.value = value ? 1 : 0;
                }));
                this.guiTitleColor.onChange((value => {
                    if (this.scenePlane) this.scenePlane.uniforms.titleColor.value = value;
                }));
            }
            init() {
                this.curtains = new Curtains({
                    container: "canvas",
                    alpha: false
                }).onError((() => {
                    document.body.classList.add("no-curtains");
                })).onContextLost((() => {
                    this.curtains.restoreContext();
                }));
                this.setSceneShaders();
                this.sceneElement = document.getElementById("water-ripples");
                this.guiParams = {
                    displacement: this.params.displacementStrength,
                    lights: this.params.lightIntensity,
                    shadows: this.params.shadowIntensity,
                    blurRipples: true,
                    showTexture: true,
                    titleColor: [ 255, 255, 255 ]
                };
                this.gui = new dat.GUI;
                this.ripples = new Ripples({
                    curtains: this.curtains,
                    container: this.sceneElement,
                    viscosity: this.params.viscosity || null,
                    speed: this.params.speed || null,
                    size: this.params.size || null,
                    callback: texture => {
                        this.createScenePlane(texture);
                    },
                    gui: this.gui || null,
                    guiParams: this.guiParams || null
                });
                this.debug();
            }
            setSceneShaders() {
                this.sceneVs = `\n              precision highp float;\n              \n              // default mandatory variables\n              attribute vec3 aVertexPosition;\n              attribute vec2 aTextureCoord;\n              \n              uniform mat4 uMVMatrix;\n              uniform mat4 uPMatrix;\n              \n              // varyings\n              varying vec3 vVertexPosition;\n              varying vec2 vTextureCoord;\n              varying vec2 vPlaneTextureCoord;\n              \n              // textures matrices\n              uniform mat4 planeTextureMatrix;\n      \n              void main() {\n                  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n                  \n                  // varyings\n                  vTextureCoord = aTextureCoord;\n                  vPlaneTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;\n                  vVertexPosition = aVertexPosition;\n              }\n          `;
                this.sceneFs = `\n              precision highp float;\n              \n              // varyings\n              varying vec3 vVertexPosition;\n              varying vec2 vTextureCoord;\n              varying vec2 vPlaneTextureCoord;\n              \n              uniform sampler2D uRippleTexture;\n              uniform sampler2D planeTexture;\n              uniform sampler2D titleTexture;\n              \n              uniform vec2 uResolution;\n              \n              uniform float uDisplacementStrength;\n              uniform float uLightIntensity;\n              uniform float uShadowIntensity;\n              \n              uniform float uBlurRipples;\n              uniform float uShowTexture;\n              uniform vec3 uTitleColor;\n              \n              \n              // Holy fuck balls, fresnel!\n              const float bias = 0.2;\n              const float scale = 10.0;\n              const float power = 10.1;\n              \n              // taken from https://github.com/Jam3/glsl-fast-gaussian-blur\n              vec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n                  vec4 color = vec4(0.0);\n                  vec2 off1 = vec2(1.3333333333333333) * direction;\n                  color += texture2D(image, uv) * 0.29411764705882354;\n                  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;\n                  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;\n                  return color;\n              }\n              \n              float bumpMap(vec2 uv, float height, inout vec3 colormap) {\n                  vec3 shade;\n                  // branching on an uniform is OK\n                  if(uBlurRipples == 1.0) {\n                      shade = blur5(uRippleTexture, vTextureCoord, uResolution, vec2(1.0, 1.0)).rgb;\n                  }\n                  else {\n                      shade = texture2D(uRippleTexture, vTextureCoord).rgb;\n                  }\n                  \n                  return 1.0 - shade.r * height;\n              }\n              \n              float bumpMap(vec2 uv, float height) {\n                  vec3 colormap;\n                  return bumpMap(uv, height, colormap);\n              }\n      \n              // add bump map, reflections and lightnings to the ripples render target texture\n              vec4 renderPass(vec2 uv, inout float distortion) {\n                  vec3 surfacePos = vec3(uv, 0.0);\n                  vec3 ray = normalize(vec3(uv, 1.0));\n      \n                  vec3 lightPos = vec3( 2.0, 3.0, -3.0);\n                  vec3 normal = vec3(0.0, 0.0, -1);\n                  \n                  vec2 sampleDistance = vec2(0.005, 0.0);\n                  \n                  vec3 colormap;\n                  \n                  float fx = bumpMap(sampleDistance.xy, 0.2);\n                  float fy = bumpMap(sampleDistance.yx, 0.2);\n                  float f = bumpMap(vec2(0.0), 0.2, colormap);\n                  \n                  distortion = f;\n                  \n                  fx = (fx - f) / sampleDistance.x;\n                  fy = (fy - f) / sampleDistance.x;\n                  normal = normalize(normal + vec3(fx, fy, 0.0) * 0.2);\n                  \n                  // Holy fuck balls, fresnel!\n                  float shade = bias + (scale * pow(1.0 + dot(normalize(surfacePos - vec3(uv, -3.0)), normal), power));\n                  \n                  vec3 lightV = lightPos - surfacePos;\n                  float lightDist = max(length(lightV), 0.001);\n                  lightV /= lightDist;\n                  \n                  // light color based on light intensity\n                  vec3 lightColor = vec3(1.0 - uLightIntensity / 20.0);\n                  \n                  float shininess = 0.1;\n                  // brightness also based on light intensity\n                  float brightness = 1.0 - uLightIntensity / 40.0;\n                  \n                  float falloff = 0.1;\n                  // finally attenuation based on light intensity as well\n                  float attenuation = (0.75 + uLightIntensity / 40.0) / (1.0 + lightDist * lightDist * falloff);\n                  \n                  float diffuse = max(dot(normal, lightV), 0.0);\n                  float specular = pow(max(dot( reflect(-lightV, normal), -ray), 0.0), 15.0) * shininess;\n                  \n                  vec3 reflect_ray = reflect(vec3(uv, 1.0), normal * 1.0);\n                  vec3 texCol = (vec3(0.5) * brightness);\n                  \n                  float metalness = (1.0 - colormap.x);\n                  metalness *= metalness;\n                  \n                  vec3 color = (texCol * (diffuse * vec3(0.9) * 2.0 + 0.5) + lightColor * specular * f * 2.0 * metalness) * attenuation * 2.0;\n      \n                  return vec4(color, 1.0);\n              }\n      \n      \n              void main() {\n                  vec4 color = vec4(1.0);\n                  \n                  float distortion;\n                  vec4 reflections = renderPass(vTextureCoord, distortion);            \n                  \n                  vec4 ripples = vec4(0.16);            \n                  ripples += distortion * 0.1 - 0.1;\n                  ripples += reflections * 0.7;\n                  \n                  \n                  vec2 textureCoords = vTextureCoord + distortion * (uDisplacementStrength / 250.0);\n                  vec2 planeTextureCoords = vPlaneTextureCoord + distortion * (uDisplacementStrength / 250.0);\n                  \n                  vec4 texture = texture2D(planeTexture, planeTextureCoords);\n                  vec4 title = texture2D(titleTexture, textureCoords);\n                  title.rgb *= vec3(uTitleColor.r / 255.0, uTitleColor.g / 255.0, uTitleColor.b / 255.0);\n                  \n                  // mix texture and title\n                  color = mix(vec4(0.05, 0.05, 0.05, 1.0), texture, uShowTexture);\n                  color = mix(color, title, title.a);\n      \n                  \n                  // add fake lights & shadows\n                  float lights = max(0.0, ripples.r - 0.5);\n                  color.rgb += lights * (uLightIntensity / 10.0);\n                  \n                  float shadow = max(0.0, 1.0 - (ripples.r + 0.5));\n                  color.rgb -= shadow * (uShadowIntensity / 10.0);\n                  \n                  gl_FragColor = color;\n              }\n          `;
            }
            writeTitleCanvas(canvas) {
                const title = document.getElementById("water-ripples-title").querySelector("h1");
                const titleStyle = window.getComputedStyle(title);
                let titleTopPosition = title.offsetTop * this.curtains.pixelRatio;
                titleTopPosition += title.clientHeight * this.curtains.pixelRatio * .1;
                const planeBoundinRect = this.scenePlane.getBoundingRect();
                const htmlPlaneWidth = planeBoundinRect.width;
                const htmlPlaneHeight = planeBoundinRect.height;
                canvas.width = htmlPlaneWidth;
                canvas.height = htmlPlaneHeight;
                let context = canvas.getContext("2d");
                context.width = htmlPlaneWidth;
                context.height = htmlPlaneHeight;
                context.fillStyle = titleStyle.color;
                context.font = parseFloat(titleStyle.fontWeight) + " " + parseFloat(titleStyle.fontSize) * this.curtains.pixelRatio + "px " + titleStyle.fontFamily;
                context.fontStyle = titleStyle.fontStyle;
                context.textAlign = "center";
                context.textBaseline = "top";
                context.fillText(title.innerText, htmlPlaneWidth / 2, titleTopPosition);
                if (this.scenePlane.textures && this.scenePlane.textures.length > 1) {
                    this.scenePlane.textures[1].resize();
                    this.scenePlane.textures[1].needUpdate();
                }
            }
            createScenePlane(rippleTexture) {
                let curtainsBBox = this.curtains.getBoundingRect();
                const params = {
                    vertexShader: this.sceneVs,
                    fragmentShader: this.sceneFs,
                    uniforms: {
                        resolution: {
                            name: "uResolution",
                            type: "2f",
                            value: [ curtainsBBox.width, curtainsBBox.height ]
                        },
                        displacementStrength: {
                            name: "uDisplacementStrength",
                            type: "1f",
                            value: this.params.displacementStrength
                        },
                        lightIntensity: {
                            name: "uLightIntensity",
                            type: "1f",
                            value: this.params.lightIntensity
                        },
                        shadowIntensity: {
                            name: "uShadowIntensity",
                            type: "1f",
                            value: this.params.shadowIntensity
                        },
                        blurRipples: {
                            name: "uBlurRipples",
                            type: "1f",
                            value: 1
                        },
                        showTexture: {
                            name: "uShowTexture",
                            type: "1f",
                            value: 1
                        },
                        titleColor: {
                            name: "uTitleColor",
                            type: "3f",
                            value: [ 255, 255, 255 ]
                        }
                    }
                };
                this.scenePlane = this.curtains.addPlane(this.sceneElement, params);
                if (this.scenePlane) {
                    const canvas = document.createElement("canvas");
                    canvas.setAttribute("data-sampler", "titleTexture");
                    canvas.style.display = "none";
                    this.scenePlane.loadCanvas(canvas);
                    this.scenePlane.onLoading((texture => {
                        texture.shouldUpdate = false;
                        if (this.scenePlane.canvases && this.scenePlane.canvases.length > 0) if (document.fonts) document.fonts.ready.then((() => {
                            this.writeTitleCanvas(canvas);
                        })); else setTimeout((() => {
                            this.writeTitleCanvas(canvas);
                        }), 750);
                    })).onReady((() => {
                        this.scenePlane.createTexture({
                            sampler: "uRippleTexture",
                            fromTexture: rippleTexture
                        });
                    })).onAfterResize((() => {
                        curtainsBBox = this.curtains.getBoundingRect();
                        this.scenePlane.uniforms.resolution.value = [ curtainsBBox.width, curtainsBBox.height ];
                        this.writeTitleCanvas(canvas);
                    }));
                }
            }
        }
        window.addEventListener("load", (() => {
            new RipplesScene({
                viscosity: 5,
                speed: 5,
                size: 1,
                displacementStrength: 1.5,
                lightIntensity: 5,
                shadowIntensity: 2.5
            });
        }));
    }
    window["FLS"] = false;
    isWebp();
    addTouchClass();
    addLoadedClass();
    headerScroll();
})();