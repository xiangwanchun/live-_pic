/**
 * Created with JetBrains PhpStorm.
 * User: luowei
 * Date: 14-7-31
 * Time: 上午10:11
 * To change this template use File | Settings | File Templates.
 */
(function($){
    //调用 $.showToast("文字",多少秒,function)
    $.showToast = function(text,time,afterHide){
        var _show = time || 2;
        var _text = text || "";
        _show = _show * 1000;
        var _toast = $("<div  style='font-size:26px;position:fixed;bottom:60px;color:#fff;padding: 15px 20px;background: #000;z-index: 99999;'>"+_text+"</div>");
        $("body").append(_toast);
        var left = ($('body').width() - _toast.width()) / 2;
        _toast.css("left",left);
        setTimeout(function(){
            $(_toast).remove();
            if(typeof afterHide == "function"){
                afterHide.call(this);
            }
        }, _show);
        return false;
    };
    $.isnumber=function(v){
        if(!isNaN(v)){
            return true;
        }{
            return false;
        }
    };
    $.isemail=function(mail) {
        var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (filter.test(mail)) return true;
        else {
            return false;}
    };
    $.isphone=function(phone) {
        if(phone.length==0)
        {
            return false;
        }
        if(phone.length!=11)
        {
            return false;
        }

        var myreg = /^(((1[3-8][0-9]{1}))+\d{8})$/;
        if(!myreg.test(phone)){
            return false;
        }{
            return true;
        }
    };
    /* menu 菜单 二级菜单 */
    var menu=function(ele,options){
        var _this=this;
        this.opts=options;
        this.$ele=ele;
        this.more= this.opts.more || true;
        $(this.$ele).find(".dropdown").children("a").on("click",function(){
            _this.clickELE=this.parentElement;
            _this.hasOpen();
        });
    };

    menu.prototype={
        show:function(){
            this.dc.slideDown(400);
        },
        close:function(){
            this.dc.slideUp(400);
        },
        pa:function(){
            if(this.opts.position=="absolute"){
                return true;
            }else{
                return false;
            }
        },
        hasOpen:function(){
            this.dc=$(this.clickELE).children(".dropdown-child");
            if(this.pa()){
                $(this.clickELE).css("position","relative")
                this.dc.css({position:"absolute",top:"100%",left:"0",right:"0"});
            }
            var prev=$(this.dc).prev();
            if(prev.hasClass("dropdown-close")){
                this.close();
                prev.addClass("dropdown-open");
                prev.removeClass("dropdown-close");
                return true;
            }else{
                if(!this.opts.more){
                    $(this.$ele).find(".dropdown-close").next().slideUp(400);
                    $(this.$ele).find(".dropdown-close").removeClass("dropdown-close");
                }
                this.show();
                prev.addClass("dropdown-close");
                prev.removeClass("dropdown-open");
                return false;
            }
        }
    }
    $.fn.showNav=function(options){
        var m =  new menu(this, options);
        //return menu;
    }
    $.wpLoading=function(opts,call){
        this.opts=opts;
        var d=new Date();
        var time=d.getFullYear()+""+d.getHours() +""+ d.getMinutes()+""+ d.getMilliseconds();
        var id=time;
        this.opacity=$("<div class='confirm-opacity' style='position: fixed;left:0;right: 0;top:0;bottom: 0;background: #000;z-index: 1000;opacity: 0.4'></div>");
        top.$("body").append(this.opacity);
        this.opacity.attr("id","opacity"+id);
        this.html=$("<div style='position: fixed;top: 0;right: 0;left: 0;bottom: 0;z-index: 1001'><p class='wp_ploading'></p><p class='wp_ploading'></p><p class='wp_ploading'></p><p class='wp_ploading'></p></div>");
        this.html.children("p").css({
            position:"absolute",
            left:"-20px",
            top:"48%",
            display:"block",
            width:"5px",
            height:"5px",
            background:"#ff9900"
        });
        top.$("body").append(this.html);
        this.html.attr("id","loading"+id);
        if(typeof call=="function"){
            call.call(this,id);
        }
        this.close=function(){
            $("#"+"loading"+id).remove();
            $("#"+"opacity"+id).remove();
        };
        var _this=this;
        var intVal=4000;
        _this.html.children("p").each(function(index){
            var _this=this;
            var setTo=index*200;
            setTimeout(function(){
                $(_this).animate({
                    left:"50%"
                },1500,function(){
                    $(this).animate({
                        left:"110%"
                    },1500,function(){
                        $(this).css("left","-20px");
                        if(index==3){
                        }
                    })
                });
            },setTo);
        });
        setInterval(function(){
            _this.html.children("p").each(function(index){
                var _this=this;
                var setTo=index*200;
                setTimeout(function(){
                    $(_this).animate({
                        left:"50%"
                    },1500,function(){
                        $(this).animate({
                            left:"110%"
                        },1500,function(){
                            $(this).css("left","-20px");
                            if(index==3){
                            }
                        })
                    });
                },setTo);
            });
        },intVal);
    };
    // 验证表单
    var validateform=function(ele,opts,call){
        this.ele=ele;
        this.opts=opts;
        this.call=call;
        this.val=[];
        this.init()
    };
    validateform.prototype={
        init:function(){
            var _this=this;
            //为该表单下面的所有input 增加提示语
            $(this.ele).find("input").each(function(){
                if($(this).attr("title") != undefined){
                    $(this).val($(this).attr("title"));
                    $(this).focus(function(){
                        _this.focus(this);
                    });
                    $(this).blur(function(){
                        _this.blur(this);
                    });
                }
            });
            //为必须项时，做出改变后  JS做出判断
            $(this.ele).find("[need='need']").change(function(){
                _this.change(this);
            });
            //点击提交
            $(this.ele).find("input[val='submit']").click(function(){
                //验证错误，提示错误
               $(_this.ele).find("[submit='submit']").each(function(){
                   _this.change(this);
               });
                //是否有错误提示
               var iserror=$(_this.ele).find(".input-error-log").length;
               if(iserror>0){
                    return false
               }else{
                   _this.val="";
                   $(_this.ele).find("[submit='submit']").each(function(){
                       _this.data(this);
                   });
                   var v="{"+_this.val+"}";
                   //发送ajax 请求
                   $.send(_this.opts.url,v,_this.call);
               }
            });
            //submit
        },
        focus:function(obj){
            //鼠标聚焦的时候 取消input的提示信息
            var val=$(obj).val();
            var title=$(obj).attr("title");
            if(val==title){
                if($(obj).attr("t")=="password"){
                    $(obj).attr("type","password")
                }
                $(obj).val("");
            }
        },
        data:function(obj){
            //点击提交后组装值
            var v=$(obj).val();
            var n=$(obj).attr("name");
            if(this.val== ""){
                this.val=n+":"+v;
            }else{
                this.val+=","+n+":"+v;
            }

        },
        blur:function(obj){
            //当取消输入的时候，input的val为它的属性title
            var val=$(obj).val();
            var title=$(obj).attr("title");
            if(val==""){
                if($(obj).attr("t")=="password"){
                    $(obj).attr("type","text")
                }
                $(obj).val(title);
            }
        },
        change:function(obj,re){
            //re 为判断是否需要 返回  默认为false
            var r=re || false;
            if($(obj).attr("type")=="button"){
                return false;
            }
            if($(obj).attr("need")==undefined){
                return false;
            }
            var type=$(obj).attr("val");
            var title=$(obj).attr("title");
            var val=$(obj).val();

            var text="";
            var at=false;
            //此处为扩展验证的方法
            switch (type){
                case "number":
                    if(!$.isnumber(val)){
                       text="请输入数字";
                       at=true;
                    }
                    break;
                case "email":
                    if(!$.isemail(val)){
                        text="请输入正确的邮箱地址";
                        at=true;
                    }
                    break;
                case "phone":
                    if(!$.isphone(val)){
                        text="请输入正确的手机号码";
                        at=true;
                    }
                    break;
                default :
                    if(val==title){
                        text="你还没有输入值";
                        at=true;
                    }
                    break;
            }
            if(at){
                this.addtext(obj,text);
                if(re){
                    return false;
                }
            }else{
                this.removeText(obj);
                if(re){
                    return true;
                }
            }
        },
        removeText:function(obj){
            //输入值真确，取消错误提示
            $(obj).next().remove();
        },
        addtext:function(obj,text){
            //错误提示
            var text= text || "输入不正确";
            var nextDom=$(obj).next();
            if(nextDom.length>0){
                $(nextDom).text(text);
            }else{
                var parent=$(obj).parent();
                var width=$(obj).width();
                var height=$(obj).height();
                parent.css("position","relative");
                var p=$("<p class='input-error-log' style='position: absolute;line-height: "+height+"px;left: 0px;top: 30px;bottom: 0;font-size: 16px;color: #ff0000'>"+text+"</p>");
                parent.append(p);
            }
        }
    };
    $.fn.showform=function(options,call){
        var f=new validateform(this,options,call);
    };
    // ajax 发送
    $.send=function(url,data,call){
        $.ajax({
            type: "POST",
            url: url,
            data:data,
            dataType: "json",
            success: function(data){
                if(typeof call=="function"){
                    call.call(this,data);
                }else{
                    if(data.code==0){
                        $.showToast(data.msg,3);
                        setTimeout(function(){
                            location.reload();
                        },2500)
                    }else{
                        $.showToast(data.msg,3);
                    }
                }
            }
        })
    }
    $.dialog={
        alert:function(opts){
            this.opts=opts;
            this.create("alert");
        },
        create:function(str){
            var _this=this;
            this.opacity=$("<div class='confirm-opacity'></div>");
            this.footer=$('<div class="dialog-footer"></div>');
            this.html=$('<div class="confirm-main"><div class="dialog-header"><p class="dialog-title"></p><a class="dialog-close" title="关闭对话框"></a></div><div class="dialog-main"><div class="dialog-content"></div></div></div>');
            $(this.html).find(".dialog-content").html(this.opts.html);
            $(this.html).find(".dialog-title").text(this.opts.title);

            $(this.html).find(".dialog-close").on("click",function(){
                _this.opacity.remove();
                _this.html.remove();
            });
            switch (str){
                case "alert":
                    var btn=$("<a class='btn dialog-btn-list'>"+this.opts.text+"</a>");
                    $(this.footer).append(btn);
                    $(this.html).find(".dialog-main").append(this.footer);
                    btn.on("click",function(){
                        if(typeof  _this.opts.call == "function"){
                            _this.opts.call.call(this,_this);
                        }else{
                            _this.opacity.remove();
                            _this.html.remove();
                        }
                    });
                    break;
                case "confirm":
                    if(this.opts.btns.length>0){
                        for(var b in this.opts.btns){
                            var btn=$("<a class='btn dialog-btn-list'>"+this.opts.btns[b].text+"</a>");
                            btn.attr("index",b);
                            btn.on("click",function(){
                                var index=$(this).attr("index");
                                if(typeof  _this.opts.btns[index].call=="function"){
                                    _this.opts.btns[index].call.call(this,_this);
                                }
                            });
                            $(this.footer).append(btn);
                        }
                        $(this.html).find(".dialog-main").append(this.footer);
                    }
                    break;
                case "prompt":
                    if(this.opts.btns.length>0){
                        for(var b in this.opts.btns){
                            var btn=$("<a class='btn dialog-btn-list'>"+this.opts.btns[b].text+"</a>");
                            btn.attr("index",b);
                            btn.on("click",function(){
                                _this.opts.data=[];
                                $(".dialog-content").find("input").each(function(){
                                    var name=$(this).attr("name");
                                    var val=$(this).val();
                                    _this.opts.data[name]=val;
                                });
                                var index=$(this).attr("index");
                                if(typeof  _this.opts.btns[index].call=="function"){
                                    _this.opts.btns[index].call.call(this,_this);
                                }
                            });
                            $(this.footer).append(btn);
                        }
                        $(this.html).find(".dialog-main").append(this.footer);
                    }
                    break;
                default :
                    break;
            }
            $("body").append(this.opacity);
            $("body").append(this.html);
            this.opacity.on("click",function(){
                _this.opacity.remove();
                _this.html.remove();
            });
            this.resize(this);
            window.onresize=function(){
                _this.resize(_this);
            }
        },
        confirm:function(opts){
            this.opts=opts;
            this.create("confirm");
        },
        prompt:function(opts){
            this.opts=opts;
            this.create("prompt");
        },
        setDom:function(){
            var d=new Date();
            var time=d.getFullYear()+""+d.getHours() +""+ d.getMinutes()+""+ d.getMilliseconds();
            var id=this.opts.id || time;
            this.html.attr("id","dialog-"+id);
            this.opacity.attr("id","opacity-"+id);
            $(this.ele).attr("opacity","opacity-"+id);
            $(this.ele).attr("dialog","dialog-"+id);
            if(this.opts.width != undefined){
                this.html.css("width",this.opts.width);
            }
            if(this.opts.height != undefined){
                this.html.css("height",this.opts.height);
            }
        },
        resize:function(obj){
            var winWidth=$(window).width();
            var winHeight=$(window).height();
            var _left=parseInt(winWidth-obj.html.width())/2;
            var _top=parseInt(winHeight-obj.html.height())/2;
            obj.html.css({left:_left,top:_top});
        }
    };
    /*
    $.dialog=function(ele,options){
        var _this=this;
        this.ele=ele;
        this.opts=options;
        this.init();
    };
    $.dialog.prototype={
        alert:function(){
            alert(1);
        },
        init:function(){
            var _this=this;
            this.opacity=$("<div class='confirm-opacity'></div>");
            this.footer=$('<div class="dialog-footer"></div>')
            this.html=$('<div class="confirm-main"><div class="dialog-header"><p class="dialog-title"></p><a class="dialog-close" title="关闭对话框"></a></div><div class="dialog-main"><div class="dialog-content"></div></div></div>');
            $(this.html).find(".dialog-content").html(this.opts.html);
            $(this.html).find(".dialog-title").text(this.opts.title);
            if(this.opts.btns.length>0){
                for(var b in this.opts.btns){
                    var btn=$("<a class='btn dialog-btn-list'>"+this.opts.btns[b].text+"</a>");
                    btn.attr("index",b);
                    $(this.footer).append(btn);
                }
                $(this.html).find(".dialog-main").append(this.footer);
            }
            if(this.opts.opacity){
                $("body").append(this.opacity);
            }
            $("body").append(this.html);
            this.setDom();
            $(".dialog-btn-list").on("click",function(){
                _this.control(this);
            });
            $(this.html).find(".dialog-close").on("click",function(){
                _this.opacity.remove();
                _this.html.remove();
            });
            this.resize(this);
            window.onresize=function(){
                _this.resize(_this);
            }
        },
        setDom:function(){
            var d=new Date();
            var time=d.getFullYear()+""+d.getHours() +""+ d.getMinutes()+""+ d.getMilliseconds();
            var id=this.opts.id || time;
            this.html.attr("id","dialog-"+id);
            this.opacity.attr("id","opacity-"+id);
            $(this.ele).attr("opacity","opacity-"+id);
            $(this.ele).attr("dialog","dialog-"+id);
            if(this.opts.width != undefined){
                this.html.css("width",this.opts.width);
            }
            if(this.opts.height != undefined){
                this.html.css("height",this.opts.height);
            }
        },
        resize:function(obj){
            var winWidth=$(window).width();
            var winHeight=$(window).height();
            var _left=parseInt(winWidth-obj.html.width())/2;
            var _top=parseInt(winHeight-obj.html.height())/2;
            obj.html.css({left:_left,top:_top});
        },
        control:function(obj){
            var index=$(obj).attr("index");
            var link=this.opts.btns[index].link;
            switch (this.opts.type){
                case "ajax":
                    if(link!= undefined){
                        $.send(link,this.opts.data,this.opts.btns[index].call);
                    }
                    break;
                case "href":
                    if(link!= undefined){
                        window.open(link,"_self");
                    }
                    break;
                default :
                    if(typeof  this.opts.btns[index].call=="function"){
                        this.opts.btns[index].call.call(this,obj);
                    }
                    break;
            }
        }
    };
    /*
    $.fn.showdialog=function(options){
        var f=new dialog(this,options);
    };
    /* menu 菜单 二级菜单 */

})(jQuery);
$(function(){
    /*  JS来判断奇数偶数  css中已用css来表示，如果浏览器在IE9及以上可不要    */
    $(".tr-each").each(function(index){
        if((index%2)==1){
            $(this).addClass("color-e5edf0");
        }
    });
});

/**
 * 选择奖品.
 *
 * @param curObj 当前点击对象.
 * @param prize_type 奖品类型.
 */
function selectPrize(curObj,prize_type) {
    $("#record_opmap_type").val('setChouJiangPrizeList');
    var url = myPrizeListUrl;
    if (prize_type == undefined) {
        url += '?selectMode=simple';
    } else {
        url += '?selectMode=simple&type=' + prize_type;
    }
    var dom = $(curObj).parent().parent();
    openDialogComponent('选择奖品', url, function(){
        if(callbackDialogComponent($("#record_opmap_type").val(), dom) === false)
            return false;
    },600,450)
}