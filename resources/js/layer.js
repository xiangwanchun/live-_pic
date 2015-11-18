/*
纯js打造超实用通用弹出层
编写人：寒飞
名称：JsLayer
*/
(function () {
    var ALTER = alert;
    window.layer = function (parameter) {
        var layerobj = this;
        this.config = {
            version: "1.0",
            name: "",
            id: "",
            type: 0,
            oclass: { head: "layer-head", body: "layer-body", foot: "layer-foot", bodycontent: { content: "msg", icon: "icon" }, closebtn: "closebtn", footbtn: "btn" },
            oframe: { head: true, body: true, foot: true },
            title: "提示",
            maxmin: true,
            offset: { left: "auto", top: "auto" },
            area: { width: 550, height: 370 },
            border: { show: true, width: 1, color: "#000000", rgba: 0.4 },
            shade: { show: true, color: "#000000", rgba: 0.3, clickClose: false },
            closeBtn: { show: true, icon: null },
            timeout: 0,
            fix: true,
            move: { ismove: true, out: false, obj: null, type: true },
            bgcolor: "#000000",
            zIndex: 999999,
            maxWidth: 1000,
            fadeIn: { isfadeIn: true, time: 300 },
            btns: { btn: ["确定", "取消"], count: 0 },
            dialog: { icon: null, msg: "", success: null },
            iframe: { src: "", scrolling: "auto", success: null },
            page: { html: "" , success: null},
            loading: { icon: null },
            layerdemo: "",
            borderHTML: "",
            shadeHTML: "",
            topHTML: "",
            success: null,
            endsuccess: null,
            err: "no err",
            stop: false
        };
        function EvUpdate(NewObject, OldObject) {
            function clonePrototype() { }
            clonePrototype.prototype = NewObject;
            var obj = new clonePrototype();
            for (var ele in obj) {
                if (typeof (obj[ele]) == "object")
                    EvUpdate(obj[ele], OldObject[ele]);
                else
                    OldObject[ele] = obj[ele];
            }
        };
        this.html = null;
        this.init = function (parameter) {
            if (layerobj.config.type == 1 || layerobj.config.type == 2) {
                layerobj.config.oframe.foot = false;
            }
            if (parameter)
            { EvUpdate(parameter,layerobj.config); }
            var NewDataTime = new Date();
            layerobj.config.id = "layer" + NewDataTime.getTime();
        };
        //初始化参数

        this.init(parameter);
        this.show = function () {
            document.body.appendChild(layerobj.html);
        };
        this.binding = function () {
            var layerCloseBtn = $("." + layerobj.config.oclass.closebtn, layerobj.html);
            if (layerCloseBtn && layerCloseBtn.length > 0) {
                layerobj.bind(layerCloseBtn[0], "click", layerobj.close);
            }
            var btns = $("." + layerobj.config.oclass.footbtn, layerobj.html);
            if (btns && btns.length > 0) {
                if (btns[0]) {
                    if (layerobj.config.dialog.success) {
                        layerobj.bind(btns[0], "click", layerobj.config.dialog.success, "ok");
                    }
                    layerobj.bind(btns[0], "click", layerobj.close);
                }
                if (btns[1]) {
                    layerobj.bind(btns[1], "click", layerobj.close);
                }
            };
            var layerHeadObject = $("." + layerobj.config.oclass.head, layerobj.html);
            if (layerobj.config.move.ismove && layerHeadObject && layerHeadObject.length > 0) {
                new Drag(layerHeadObject[0], layerobj.html, { opacity: 10, keepOrigin: layerobj.config.move.type });
            };
            if (layerobj.config.timeout > 0) {
                setTimeout(layerobj.close, layerobj.config.timeout * 1000);
            };
        }
        this.shade = function () {
            if (layerobj.config.shade.show) {
                var cssString = "z-index:" + (layerobj.config.zIndex - 1) + ";background-color:" + layerobj.config.shade.color + ";opacity:" + layerobj.config.shade.rgba + ";filter: alpha(opacity=" + (parseFloat(layerobj.config.shade.rgba) * 100) + ");";
                var Shadenode = parseNode("<div id=\"" + layerobj.config.id + "-shade\" class=\"layer-shade\" style=\"" + cssString + "\"></div>");
                document.body.appendChild(Shadenode);
                if (layerobj.config.shade.clickClose == true) {
                    layerobj.bind(Shadenode, "click", layerobj.close);
                }
            }
        };
        this.setPosition=function(){
            if (layerobj.config.offset.left == "auto") {
                console.log(layerobj.config.area.width);
                layerobj.config.offset.left = (parseInt(document.documentElement.clientWidth) - layerobj.config.area.width) / 2;
                layerobj.config.offset.top = (parseInt(document.documentElement.clientHeight) - layerobj.config.area.height) / 2;
            }
        };
        this.run = function () {
            if (layerobj.config.layerdemo != null && layerobj.config.layerdemo != "") {
                layerobj.html = layerobj.alert.getDemoHtml();
            }
            else {
                layerobj.html = layerobj.alert.getDefualtHtml();
            }
            layerobj.setPosition();
            layerobj.setLayerHtml();
            layerobj.setlayerStyle();
            layerobj.setBtn();
            layerobj.binding();
            layerobj.shade();
            layerobj.show();
            if (layerobj.config.success) {
                layerobj.config.success(layerobj); //弹出层加载成功后的回调函数。
            }
        };
        this.bind = function (object, type, fn) {
            var temparguments = [].slice.apply(arguments);
            var temparry = [];
            if (temparguments.length > 3) {
                temparry = temparguments.slice(3, temparguments.length);
            }
            if (object.attachEvent) {
                object.attachEvent("on" + type, (function () {
                    return function (event) {
                        window.event.cancelBubble = true;
                        object.attachEvent = [fn.apply(object, temparry)];
                    }
                })(object), false);
            } else if (object.addEventListener) {
                object.addEventListener(type, function (event) {
                    event.stopPropagation();
                    fn.apply(this, temparry)
                });
            }
        }
        //设置layer骨架,移除头尾骨架
        this.setLayerHtml = function () {
            if (!layerobj.config.oframe.head) {
                layerobj.html.removeChild($("." + layerobj.config.oclass.head, layerobj.html)[0]);
                var layerBodyObject = $("." + layerobj.config.oclass.body, layerobj.html)[0];
                layerBodyObject.style.top = "0px";
            }
            if (!layerobj.config.oframe.foot) {
                layerobj.html.removeChild($("." + layerobj.config.oclass.foot, layerobj.html)[0]);
                var layerBodyObject = $("." + layerobj.config.oclass.body, layerobj.html)[0];
                layerBodyObject.style.bottom = "0px";
            }
        };
        //设置layer的样式
        this.setlayerStyle = function () {
            var csstext = "";
            csstext += "width:" + layerobj.config.area.width + "px;";
            csstext += "height:" + layerobj.config.area.height + "px;";
            csstext += "z-index:" + layerobj.config.zIndex + ";";
            var positiontext = layerobj.config.fix ? "fixed" : "absolute";
            csstext += "position:" + positiontext + ";top:" + layerobj.config.offset.top + "px;left:" + layerobj.config.offset.left + "px;";
            if (layerobj.config.border.show == true) {
                csstext += "border:" + layerobj.config.border.width + "px solid " + layerobj.config.border.color + ";";
                csstext += "border:" + layerobj.config.border.width + "px solid " + layerobj.config.border.color.colorRgb(layerobj.config.border.rgba) + ";";
            }
            layerobj.html.style.cssText = csstext;
        };
        this.setBtn = function () {
            if (layerobj.config.closeBtn.show) {
                var closeBtn = "<div class=\"" + layerobj.config.oclass.closebtn + "\" title=\"关闭\">×</div>";
                var lhead = $("." + layerobj.config.oclass.head, layerobj.html);
                if (lhead) {
                    lhead[0].appendChild(parseNode(closeBtn));
                };
            }
            if (layerobj.config.type == 0) {
                if (typeof (layerobj.config.dialog.icon) == "number") {
                    var iconObject = $("." + layerobj.config.oclass.bodycontent.icon, layerobj.html)[0];
                    var msgObject = $("." + layerobj.config.oclass.bodycontent.content, layerobj.html)[0];
                    var footObject = $("." + layerobj.config.oclass.foot + " .foot", layerobj.html);
                    if (footObject && footObject.length > 0) {
                        footObject = footObject[0];
                    }
                    iconObject.appendChild(parseNode("<i class=\"icon-" + layerobj.config.dialog.icon + "\"></i>"));
                    for (var i = 1; i < layerobj.config.btns.count + 1; i++) {
                        if (footObject) {
                            footObject.appendChild(parseNode("<span class=\"btnbg btnbg-no\"><button class=\"" + layerobj.config.oclass.footbtn + " btnbg\">" + layerobj.config.btns.btn[i - 1] + "</button></span>"))
                        }
                    }
                    iconObject.style.width = "50px";
                    msgObject.style.width = (parseInt(layerobj.config.area.width) - 75) + "px";
                }
            }
            else if (layerobj.config.type == 1) {
                var layerBodyObject = $("." + layerobj.config.oclass.body, layerobj.html)[0];
                layerBodyObject.innerHTML = layerobj.config.page.html;
            }
            else if (layerobj.config.type == 2) {
                var layerBodyObject = $("." + layerobj.config.oclass.body, layerobj.html)[0];
                if (layerobj.config.iframe.src.indexOf("?") != -1) {
                    layerobj.config.iframe.src += "&layer-id=" + layerobj.config.id;
                }
                else {
                    layerobj.config.iframe.src += "?layer-id=" + layerobj.config.id;
                }
                layerBodyObject.innerHTML = "<iframe src=\"" + layerobj.config.iframe.src + "\" style=\"width:100%;height:100%;border:none\"></iframe>";
                layerBodyObject.style.overflow = "none";
            }
        }
        this.win = function (parameter, src, callback) {
            if (typeof (parameter) == "object") {
                layerobj.init(parameter);
            }
            else {
                layerobj.config.title = parameter;
            }
            
            layerobj.config.iframe.src = src;
            layerobj.config.iframe.success = callback;
            if (layerobj.config.iframe.success) {
                window["layergofunc" + layerobj.config.id] = layerobj.config.iframe.success;
            }
            layerobj.config.type = 2;
            layerobj.config.btns.count = 0;
            layerobj.config.oframe.foot = false;
            layerobj.run();
            return layerobj;
        }
        this.page = function (parameter, html) {
            if (typeof (parameter) == "object") {
                layerobj.init(parameter);
            }
            else {
                layerobj.config.title = parameter;
                layerobj.config.page.html = html;
            }
            layerobj.config.type = 1;
            layerobj.config.btns.count = 0;
            layerobj.config.oframe.foot = false;
            layerobj.run();
            return layerobj;
        };
        this.alert = function (msg, icon, callback) {
            console.log("alert");
            layerobj.config.btns.count = 1;
            layerobj.config.dialog.msg = msg;
            layerobj.config.dialog.icon = icon;
            if (callback) {
                layerobj.config.dialog.success = callback;
            }
            layerobj.config.area.width = 230; layerobj.config.area.height = 160;
            layerobj.run();
            return layerobj;
        };
        this.confirm = function (msg, icon, callback) {
            console.log("confirm");
            layerobj.config.btns.count = 2;
            if (msg) {
                layerobj.config.dialog.msg = msg;
            }
            if (icon) {
                layerobj.config.dialog.icon = icon;
            }
            if (callback) {
                layerobj.config.dialog.success = callback;
            }
            layerobj.config.area.width = 230; layerobj.config.area.height = 160;
            layerobj.run();
            return layerobj;
        };
        this.alert.getDemoHtml = function () {
            var tempDemo = parseNode(layerobj.config.layerdemo);
            var layerbody = $("." + layerobj.config.oclass.body, tempDemo);
            if (layerbody) {
                layerbody[0].appendChild(parseNode("<div class=\"content\"><div class=\"icon\"></div><div class=\"msg\"><p>" + layerobj.config.dialog.msg + "</p></div><div class=\"clear\"></div></div>"));
                return tempDemo;
            }
            else {
                layerobj.config.err = "自定义UI中未定义包含 class=layer-body元素，layer将无法创建";
                layerobj.config.stop = true;
                return null;
            }
        };
        this.alert.getDefualtHtml = function () {
            var strHTML = "<div id=\"" + layerobj.config.id + "\" class=\"layer\"><div class=\"layer-head\"><div class=\"title\">" + layerobj.config.title + "</div></div><div class=\"layer-body\"></div><div class=\"layer-foot\"><div class=\"foot\"></div></div></div>";
            var tempDemo = parseNode(strHTML);
            var layerbody = $("." + layerobj.config.oclass.body, tempDemo);
            if (layerbody) {
                layerbody[0].appendChild(parseNode("<div class=\"content\"><div class=\"icon\"></div><div class=\"msg\"><p>" + layerobj.config.dialog.msg + "</p></div><div class=\"clear\"></div></div>"));
                return tempDemo;
            }
            else {
                layerobj.config.err = "自定义UI中未定义包含 class=layer-body元素，layer将无法创建";
                layerobj.config.stop = true;
                return "";
            }
        };
        this.close = function () {
            document.body.removeChild(document.getElementById(layerobj.config.id));
            if (layerobj.config.shade.show) {
                document.body.removeChild(document.getElementById(layerobj.config.id + "-shade"));
            }
            if (window["layergofunc" + layerobj.config.id]) {
                window["layergofunc" + layerobj.config.id] = null;
            }
            if (layerobj.config.endsuccess) {
                layerobj.config.endsuccess(layerobj); //弹出层关闭后的函数。
            }
        };
        return this;
    };
    layer.alert = function (msg, icon, callback) {
        return new layer().alert(msg, icon, callback);
    };
    layer.confirm = function (msg, icon, callback) {
        return new layer().confirm(msg, icon, callback);
    };
    layer.page = function (parameter, html) {
        return new layer().page(parameter, html);
    };
    layer.win = function (parameter, src, callback) {
        return new layer().win(parameter, src, callback);
    };
    layer.callData = function (layerid) {
        if (layerid && layerid.indexOf("http:") != -1) {
            layerid = arguments[0].substring(arguments[0].indexOf("layer-id"), arguments[0].length).split("&")[0].split("=")[1];
        }
        var temparguments = [].slice.apply(arguments);
        var temparray = [];
        if (temparguments.length > 1) {
            temparray = temparguments.slice(1, temparguments.length);
        }
        window["layergofunc" + layerid](temparray);
    };
    layer.close = function (layerid) {
        if (layerid && layerid.indexOf("http:") != -1) {
            layerid = arguments[0].substring(arguments[0].indexOf("layer-id"), arguments[0].length).split("&")[0].split("=")[1];
        }
        if (window["layergofunc" + layerid]) {
            window["layergofunc" + layerid] = null;
        }
        if (document.getElementById(layerid)) {
            document.body.removeChild(document.getElementById(layerid));
        }
        if (document.getElementById(layerid + "-shade")) {
            document.body.removeChild(document.getElementById(layerid + "-shade"));
        }
    };
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    String.prototype.colorRgb = function (tmValue) {
        var sColor = this.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "rgba(" + sColorChange.join(",") + "," + tmValue + ")";
        } else {
            return sColor;
        }
    };
    var Common = {
        getEvent: function () {
            if (document.all) {
                return window.event;
            }
            func = getEvent.caller;
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },
        getMousePos: function (ev) {
            if (!ev) {
                ev = this.getEvent();
            }
            if (ev.pageX || ev.pageY) {
                return {
                    x: ev.pageX,
                    y: ev.pageY
                };
            }
            if (document.documentElement && document.documentElement.scrollTop) {
                return {
                    x: ev.clientX + document.documentElement.scrollLeft - document.documentElement.clientLeft,
                    y: ev.clientY + document.documentElement.scrollTop - document.documentElement.clientTop
                };
            }
            else if (document.body) {
                return {
                    x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                    y: ev.clientY + document.body.scrollTop - document.body.clientTop
                };
            }
        },
        getItself: function (id) {
            return "string" == typeof id ? document.getElementById(id) : id;
        },
        getViewportSize: { w: (window.innerWidth) ? window.innerWidth : (document.documentElement && document.documentElement.clientWidth) ? document.documentElement.clientWidth : document.body.offsetWidth, h: (window.innerHeight) ? window.innerHeight : (document.documentElement && document.documentElement.clientHeight) ? document.documentElement.clientHeight : document.body.offsetHeight },
        isIE: document.all ? true : false,
        setOuterHtml: function (obj, html) {
            var Objrange = document.createRange();
            obj.innerHTML = html;
            Objrange.selectNodeContents(obj);
            var frag = Objrange.extractContents();
            if (obj.parentNode) {
                obj.parentNode.insertBefore(frag, obj);
                obj.parentNode.removeChild(obj);
            }
        }
    };
    var Class = {
        create: function () {
            return function () { this.init.apply(this, arguments); }
        }
    };
    var Drag = Class.create();
    Drag.prototype = {
        init: function (titleBar, dragDiv, Options) {
            //设置点击是否透明，默认不透明
            titleBar = Common.getItself(titleBar);
            dragDiv = Common.getItself(dragDiv);
            this.dragArea = { maxLeft: 0, maxRight: Common.getViewportSize.w - dragDiv.offsetWidth - 2, maxTop: 0, maxBottom: Common.getViewportSize.h - dragDiv.offsetHeight - 2 };
            if (Options) {
                this.opacity = Options.opacity ? (isNaN(parseInt(Options.opacity)) ? 100 : parseInt(Options.opacity)) : 100;
                this.keepOrigin = Options.keepOrigin ? ((Options.keepOrigin == true || Options.keepOrigin == false) ? Options.keepOrigin : false) : false;
                if (this.keepOrigin) { this.opacity = 50; }
                if (Options.area) {
                    if (Options.area.left && !isNaN(parseInt(Options.area.left))) { this.dragArea.maxLeft = Options.area.left };
                    if (Options.area.right && !isNaN(parseInt(Options.area.right))) { this.dragArea.maxRight = Options.area.right };
                    if (Options.area.top && !isNaN(parseInt(Options.area.top))) { this.dragArea.maxTop = Options.area.top };
                    if (Options.area.bottom && !isNaN(parseInt(Options.area.bottom))) { this.dragArea.maxBottom = Options.area.bottom };
                }
            }
            else {
                this.opacity = 100, this.keepOrigin = false;
            }
            this.originDragDiv = null;
            this.tmpX = 0;
            this.tmpY = 0;
            this.moveable = false;
            var dragObj = this;
            titleBar.onmousedown = function (e) {
                var ev = e || window.event || Common.getEvent();
                //只允许通过鼠标左键进行拖拽,IE鼠标左键为1 FireFox为0
                if (Common.isIE && ev.button == 0 || Common.isIE && ev.button == 1 || !Common.isIE && ev.button == 0) {
                }
                else {
                    return false;
                }
                if (dragObj.keepOrigin) {
                    dragObj.originDragDiv = document.createElement("div");
                    dragObj.originDragDiv.style.cssText = dragDiv.style.cssText;
                    dragObj.originDragDiv.style.width = dragDiv.offsetWidth;
                    dragObj.originDragDiv.style.height = dragDiv.offsetHeight;
                    //dragObj.originDragDiv.innerHTML = dragDiv.innerHTML;
                    dragObj.originDragDiv.innerHTML = "";
                    dragDiv.parentNode.appendChild(dragObj.originDragDiv);
                }
                dragObj.moveable = true;
                dragDiv.style.zIndex = dragObj.GetZindex() + 1;
                var downPos = Common.getMousePos(ev);
                dragObj.tmpX = downPos.x - dragDiv.offsetLeft;
                dragObj.tmpY = downPos.y - dragDiv.offsetTop;

                titleBar.style.cursor = "move";
                if (Common.isIE) {
                    dragDiv.setCapture();
                } else {
                    window.captureEvents(Event.mousemove);
                }
                dragObj.SetOpacity(dragDiv, dragObj.opacity);
                //FireFox 去除容器内拖拽图片问题
                if (ev.preventDefault) {
                    ev.preventDefault();
                    ev.stopPropagation();
                }
                document.onmousemove = function (e) {
                    if (dragObj.moveable) {
                        var ev = e || window.event || Common.getEvent();
                        //IE 去除容器内拖拽图片问题
                        if (document.all) //IE
                        {
                            ev.returnValue = false;
                        }
                        var movePos = Common.getMousePos(ev);
                        dragDiv.style.left = Math.max(Math.min(movePos.x - dragObj.tmpX, dragObj.dragArea.maxRight), dragObj.dragArea.maxLeft) + "px";
                        dragDiv.style.top = Math.max(Math.min(movePos.y - dragObj.tmpY, dragObj.dragArea.maxBottom), dragObj.dragArea.maxTop) + "px";

                    }
                };
                document.onmouseup = function () {
                    if (dragObj.keepOrigin) {
                        if (Common.isIE && dragObj.originDragDiv.outerHTML) {
                            dragObj.originDragDiv.outerHTML = "";
                        }
                        else {
                            Common.setOuterHtml(dragObj.originDragDiv, "");
                        }
                    }
                    if (dragObj.moveable) {
                        if (Common.isIE) {
                            dragDiv.releaseCapture();
                        }
                        else {
                            window.releaseEvents(dragDiv.mousemove);
                        }
                        dragObj.SetOpacity(dragDiv, 100);
                        titleBar.style.cursor = "default";
                        dragObj.moveable = false;
                        dragObj.tmpX = 0;
                        dragObj.tmpY = 0;
                    }
                };
            }
        },
        SetOpacity: function (dragDiv, n) {
            if (Common.isIE) {
                if (dragDiv.filters && dragDiv.filters.alpha) {
                    dragDiv.filters.alpha.opacity = n;
                }
            }
            else {
                dragDiv.style.opacity = n / 100;
            }
        },
        GetZindex: function () {
            var maxZindex = 0;
            var divs = document.getElementsByTagName("div");
            for (z = 0; z < divs.length; z++) {
                maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
            }
            return maxZindex;
        }
    };
    function parseNode(arg) { var objE = document.createElement("div"); objE.innerHTML = arg; return objE.childNodes[0]; };
    function parseHTML(dom) { var objE = document.createElement("div"); objE.appendChild(dom); return objE.innerHTML; };
    //q查询表达式 o父对象
    function $(q, o) {
        if (typeof (q) !== 'string' || q == '') {
            return [];
        }
        var ss = q.split(' ');
        var attr = '';
        var s = ss[0].split(':')[0];
        if (s != ss[0]) {
            attr = ss[0].split(':')[1];
        }
        var val = s.split('[')[0];
        if (val != s)
        { val = s.split('[')[1].replace(/[",\]]/g, ''); }
        else
        { val = ''; }
        s = s.split('[')[0];
        var obj = [];
        var sObj = null;
        o = o || document;
        switch (s.charAt(0)) {
            case '#':
                sObj = document.getElementById(s.substr(1));
                if (sObj) obj.push(sObj);
                break;
            case '.':
                var l = o.getElementsByTagName('*');
                var c = s.substr(1);
                for (var i = 0; i < l.length; i++)
                    if (l[i].className.search('\\b' + c + '\\b') != -1) obj.push(l[i]);
                break;
            default:
                obj = o.getElementsByTagName(s);
                break;
        }
        if (val) {
            var l = [];
            var a = val.split('=');
            for (var i = 0; i < obj.length; i++) {
                if (a.length == 2 && obj[i][a[0]] == a[1]) { l.push(obj[i]) };
            }
            obj = l;
        }
        if (attr) {
            var l = [];
            for (var i = 0; i < obj.length; i++) {
                if (obj[i][attr]) { l.push(obj[i]); }
            }
            obj = l;
        }

        if (ss.length > 1) {
            var l = [];
            for (var i = 0; i < obj.length; i++) {
                var ll = arguments.callee(q.substr(ss[0].length + 1), obj[i]);
                if (ll.tagName) { l.push(ll); }
                else
                { for (var j = 0; j < ll.length; j++) { l.push(ll[j]); } }
            }
            obj = l;
        }
        if (sObj && ss.length == 1) {
            //当为ID选择器时，直接返回对象。
            obj = sObj;
            if (obj) { obj.length = 1; }
        } else {
            //去除数组中重复元素
            var l = [];
            for (var i = 0; i < obj.length; i++)
            { obj[i].$isAdd = false; }
            for (var i = 0; i < obj.length; i++) {
                if (!obj[i].$isAdd) {
                    obj[i].$isAdd = true;
                    l.push(obj[i]);
                }
            }
            obj = l;
        }
        if (obj.length == 0) {
            return null;
        }
        else {
            return obj;
        }
    };
})();