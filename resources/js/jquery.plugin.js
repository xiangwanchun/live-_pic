$.fn.letmecenter = function(){
	var winHeigt = window.outerHeight;
	var winInnerHeigt = window.innerHeight;
	var docHeight = document.body.offsetHeight;
	var docWidth = document.body.offsetWidth;
	var centerMe = function(){
		var _width = docWidth - $(this).width();
		var _height = winInnerHeigt - $(this).height();
		$(this).css({top:_height/2,left:_width/2,position:"absolute"});
	};
	this.each(function(){
		centerMe.call(this);
	});
};

$.fn.citySelect = function(ops){
	var sops = {
		data:[{cityid:1,name:'成都'},{cityid:2,name:'北京'},{cityid:3,name:'上海'}]
	};
	$.extend(sops,ops);
	this.click(function(e){
		getCityAreas(sops.data,this);
		e.stopPropagation();
	});
	
	function getCityAreas(data,who){
		var citysbox = $('<div style="position: absolute;width: 300px;border: solid 1px #ccc;padding: 10px;background-color: #fff;"></div>');
		$('body').append(citysbox);
		//citysbox.css({})
		//var ul = $('<ul style="list-style: none;"></ul>');
		//citysbox.append(ul);
		$(data).each(function(index, element) {
			var a = $('<a href="#" value="' + this['cityid'] + '" style="margin-right:5px;display:inline-block;padding: 5px 10px;list-style: none;background-color: #D5F7FF;">' + this['name'] + '</a>');
            citysbox.append(a);
			var me = this;
			a.click(function(e){
				e.stopPropagation();
				if(who.value.indexOf(me['name']) > -1){return false;}
				who.value += me['name'];
				return false;
			});
        });
		var pos = $(who).offset();
		citysbox.css({left:pos['left'],top:pos['top'] + $(who).get(0).offsetHeight});
		$("body").click(function(){
			citysbox.hide();
		});
		citysbox.click(function(e){
			e.stopPropagation();
		});
		return citysbox;
	}
};



function getParam(key) {
    var paramArr = location.search.substr(1).split("&");
    var params = {};
    for (var i = 0; i < paramArr.length; i++) {
        var arr = paramArr[i].split("=");
        params[arr[0]] = arr[1] ? arr[1] : "";
    }
    return params[key] ? params[key] : "";
}
var Cookie = {
    cookie: function(name) {
        var cookieArray = document.cookie.split("; ");
        var cookie = new Object();
        for (var i = 0; i < cookieArray.length; i++) {
            var arr = cookieArray[i].split("=");
            if (arr[0] == name){ return unescape(arr[1]);}
        }
        return "";
    },
    delCookie: function(name) {
        document.cookie = name + "=;expires=" + (new Date(0)).toGMTString()
    },
    getCookie: function(objName) {
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == objName){ return unescape(temp[1])}
        }
    },
    addCookie: function(name, value,exp) {
        var Days = 30;
        var expTime = 0;
        if(exp){
            expTime = parseInt(new Date().getTime().toString().substr(0,10)) + exp;
        }
        document.cookie = name + "=" + escape(value) + ";expires=" + expTime;
    },
    getCookie1: function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    },
    delCookie1: function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};
