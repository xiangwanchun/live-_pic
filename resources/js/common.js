
var HOST_URL = '';
// 处理tr上下移动和删除
function moveTrUp(curObj, prevObj) {
    prevObj.insertAfter(curObj);
}

function moveTrDown(curObj, nextObj) {
    nextObj.insertBefore(curObj);
}

function deleteTr(curObj) {
    curObj.remove();
}

function addTr(objTbody, html) {
    $(objTbody).append(html);
}

function appendTr(objTable, html) {
    $(html).appendTo(objTable);
}

// 弹出框信息检测提示
function showCheckedPrompt(code, message) {
    if (code == 1) {
        $(".checked_prompt").find("img").attr("src", HOST_URL + "/images/ico_success.png");
        $(".checked_prompt").find("div").html(message);
    } else {
        $(".checked_prompt").find("img").attr("src", HOST_URL + "/images/ico_error.png");
        $(".checked_prompt").find("div").html(message);
    }
    $(".checked_prompt").show();
}

/*+++++++++++++++++++++++++++++++++++++++++++++*/
/* 下面是视频上传js                            */
/*+++++++++++++++++++++++++++++++++++++++++++++*/

//清空上传列表
function removefileList()
{
    document.getElementById("Uploader").removeFileList();
}

//分别取消每个文件的上传 ---传入id
function CancelUpload()
{
    var obj = document.getElementById("Uploader").getFileList();
    if (obj != [])
    {
        var b = JSON.parse(obj);
        document.getElementById("Uploader").cancelUpload(b[0].id);
    }
}

//取得当前上传文件的进度 需要点击上传后才能生效(不支持断点续传,一个文件一个文件的上传)
function onFileProgressChangge(obj)
{
    var width = parseInt(144 * parseFloat(obj.uploadedBytes / obj.size)) + 'px';
    var prompt = obj.instantSpeed + "/s";
    $("#progressbar_" + obj.id).css("width", width);
    $("#upload_prompt_" + obj.id).html(prompt);
}

//添加文件,添加完成事件
function onFileListChange()
{
    var obj = document.getElementById("Uploader").getFileList();
    data = JSON.parse(obj);
    for (var i = 0; i < data.length; i++) {
        if ($("#progressbar_" + data[i].id).length == 0) {
            makeUploadHtml(data[i]);
        }
    }
}

//当前状态改变触发
function onStateChange(id, type, data)
{
    isAllComplete = false;
    if (type == "Start") {
        $("#btn_removeUpload_" + id).html("取消");
    }
    if (type == "Completed") {
        $("#upload_prompt_" + id).html("上传完成");
        $("#btn_removeUpload_" + id).parent().html("&nbsp;");
        updateMiniWinUploadMsg();
        $("#tb_upload_list").find("tr").each(function() {
            var prompt = $(this).find(".upload_prompt").html();
            if (prompt != "上传完成") {
                isAllComplete = false;
                return false;
            } else {
                isAllComplete = true;
            }
        });
        if (isAllComplete) {
            $.messager.alert('消息', '上传完成', '', function() {
                // videoListReload();
                window.location.reload();
            });
            closeUploadWindow();
        }

//        if (typeof (videoListReload) == 'function') {
//            // 上传成功刷新
//             videoListReload();
//        }
    } else if (type == "Error") {
        $("#upload_prompt_" + id).html("上传失败");
        updateMiniWinUploadMsg();
    }

}



//如果上传失败报错
function onUploadError(id, data)
{
    if (data.des != "用户取消") {
        //$.messager.alert("提示", data.des);
        $.messager.alert("提示", '上传失败，请稍后再试！');
    }
}

// 生成上传视频每列代码
function makeUploadHtml(obj) {
    var fileSize = (obj.size / 1024) > 1024 ? (obj.size / 1024 / 1024).toFixed(2) + 'M' : (obj.size / 1024).toFixed(2) + 'KB';

    var html = '\
        <tr onmouseover="showUploadModifyBtn(this)" onmouseout="hideUploadModifyBtn(this)">\
            <td class="head_td" width="240">\
                <div style="height:24px;line-height:24px;"><span class="sp_img_ico"><img src="' + HOST_URL + '/resources/images/video_icon.png" /></span><div class="f_l" style="max-width:140px;overflow: hidden; margin-right:5px;"><input type="hidden" name="videoUpload_id[]" value="' + obj.id + '" /><input type="text" name="videoUpload_title[]" value="' + obj.fileName.replace(obj.fileType, '') + '" onblur="setUploadVideoTitle(this)" style="display:none;color:#222;font-size:14px;" /><span class="videoUpload_title" style="color:#222;font-size:14px;display: inline-block;width:140px;height: 24px;line-height: 24px;overflow: hidden;text-overflow: ellipsis;">' + obj.fileName.replace(obj.fileType, '') + '</span></div><span class="f_l btn_videoModify dis" style="width:15px; margin-right:5px;"><img src="' + HOST_URL + '/resources/images/ico_edit.png" width="15" height="15" style="margin-top:4px" onclick="showUploadModifyInput(this)" class="pointer"></span>(<span class="fileSize">' + fileSize + '</span>)\
                </div>\
                <div style="margin-top:14px;">\
                    <div class="upload_progressbar" style = "background: url(' + HOST_URL + '/resources/images/up_bg.png) no-repeat scroll 0 0 transparent; width:144px;">\
                    <img class ="update_jd" id="progressbar_' + obj.id + '" src="' + HOST_URL + '/resources/images/up_pross.png" style="border: 0 none currentcolor;vertical-align: top;height:9px;display:none;"/></div>\
                    <span class="upload_prompt" id="upload_prompt_' + obj.id + '">等待上传</span>\
                </div>\
            </td>\
            <!--<td width="110" align="center">\
                <input type="button" class="but_downs btn_select_catalog pointer" style="background: url(../images/btn_dropselect.png) no-repeat scroll 0 0 transparent; width:101px;" name="videoUpload_tags[]"  value="互动素材" />\
                <div class="c_fw_zt dis" style="*top:155px;*margin-left: -65px;">\
                    <div class="c_fw_con_zt" style="height:auto; width:105px;">\
                        <div class="c_fw_con_one_zt"><a href="javascript:void(0);" onclick="setUploadVideoTags(this)" style="padding-right:20px;">互动素材</a></div>\
                        <div class="c_fw_con_one_zt"><a href="javascript:void(0);" onclick="setUploadVideoTags(this)" style="padding-right:20px;">素材集</a></div>\
                    </div>\
                </div>\
            </td>-->\
            <td width="60" align="center">\
                <a href="javascript:void(0);" id="btn_removeUpload_' + obj.id + '" class="pointer btn_removeUpload" onclick="removeUploadVideo(this)">删除</a>\
            </td>\
        </tr>\
    ';
    $(html).appendTo($("#tb_upload_list"));
    $(".btn_select_catalog").click(function() {
        $(this).parent().find(".c_fw_zt").show();
        $(this).focus();
    }).blur(function() {
        $(".c_fw_zt").fadeOut(500);
    });

    $("#update_video").css("color", "#000000");
    $("#update_video").bind("click", function() { //点击上传按钮事件
        var catalogid = $("input[name=catagory]").val();  //获取栏目id
        $("#videoUpload_catalogId").val(catalogid);
        saveUploadVideo();
        $(".update_jd").css({
            "display": "block",
            "width": "0px"
        })

    });
}

var $uploadVideoWin;

// 生成上传视频弹出框代码
function makeUploadWindowHtml() {
    var html = '\
<!--弹出框-->\
<div id="video-upload-window" data-options="closed:true,tools:\'#btn-video-upload-window\',width:500,height:500" class="easyui-window">\
    <div class="upload_wrapper">\
        <div class="upload_btn_wrapper">\
            <div class="btns">\
                <div id="flashContent"></div>\
            </div>\
            <input type="button" value="选择上传素材" /> 上传期间不要关闭本页面\
            <input id="combox_lm" value="请选择栏目" name="catagory" />\
        </div>\
        <div class="upload_list">\
            <table id="tb_upload_list" style="table-layout: fixed;">\
            </table>\
        </div>\
    </div>\
    <div style="border-bottom:solid 1px #ccc; width:100%; height:1px; line-height:1px"></div>\
    <div style="width:100% height:30px; margin-top:10px;">\
        <input class="but_w f_r" type="button" value="上传" id="update_video" style="width:60px;margin-right:20px;">\
        <input class="but_w f_r" type="button" value="取消" style="width:60px;margin-right:20px;" onclick="cancelUploadVideo()">\
    </div>\
</div>\
<div id="btn-video-upload-window" style="display:none;">\
    <input type="button" onclick="minimizeUploadWindow()" title="最小化" class="but_fanhui" style="background: url(../images/btn-icon.png) no-repeat scroll 0 0 transparent; width:10px; height:10px; margin: 10px 10px 0;" value="最小化" />\
    <input type="button" onclick="closeUploadWindow()" title="关闭" class="but_b" style="background: url(../images/btn-icon.png) no-repeat scroll -22px 0 transparent; width:10px; height:10px; padding:0; margin-right:20px;" value="关闭" />\
</div>\
    ';
    // 重新加载页面时 须销毁已经存在的对象 这里销毁对象后报错
    /*if($($uploadVideoWin).length > 0) {
     $uploadVideoWin.window("destroy");
     }*/
    // 上传对象存在时不清空对象
    var isUploadObject = $("#video-upload-window").length;
    if (isUploadObject == 0) {
        $(html).appendTo($("body"));
        //$("#video-upload-window").parent().remove();
    }
    $(document).ready(function(e) {
        // 没有上传对象时 才隐藏弹出框，否则隐藏弹出框后，上传将会中断
        if (isUploadObject == 0) {
            var top = ($(window).height() - 500) / 2;
            if (top < 0) {
                top = 0;
            }
            $uploadVideoWin = $("#video-upload-window").window({
                title: "上传节目",
                modal: false,
                closed: true,
                closable: false,
                collapsible: false,
                maximizable: false,
                minimizable: false,
                shadow: false,
                resizable: false,
                modal: true, //显示遮罩

                top: top,
                tools: "#btn-video-upload-window"
            });

        }
    });
}

function saveUploadVideo() {
    var siteid = $("#videoUpload_siteId").val();
    var catalogid = $("#videoUpload_catalogId").val();
    var transCodeId = $("#videoUpload_transCodeId").val();
    var type = $('#vms_type :selected').attr('status');

    var isPublish = 1;//0;不发布 1发布
    //0,表示只填入一个数据,所有上传都传递这一个数据;1,标识填入上传长度个数据,每个上传对应一个数据
    var datatype = 1;
    var data = '';
    var valid = true;
    var error = true;
    $("#tb_upload_list").find("tr").each(function() {
        var id = $(this).find("input[name='videoUpload_id[]']").val();
        var title = $(this).find("input[name='videoUpload_title[]']").val();
        //var tags = $(this).find("input[name='videoUpload_tags[]']").val();
        if (title == "") {
            valid = false;
            return false;
        }

        if (/\"/.test(title)) {
            error = false;
            return false;
        }
        if ($(this).find(".upload_prompt").html() == "等待上传") {
            if (data == '') {
                // 暂时取消title参数，由于vms那边第一次获取的title编码是正确的，
                // 而后会判断参数里title,如果有则覆盖之前的就会出现乱码，估计是flash包装
                // 参数出了问题
                //data += '[{"transcodeGroup":'+transCodeId+',"catalogId":'+catalogid+',"description":"'+title+'","id":"'+id+'","title":"'+title+'","tags":""}';
                data += '[{"transcodeGroup":' + transCodeId + ',"catalogId":' + catalogid + ',"description":"' + title + '","id":"' + id + '","tags":"","title":"' + title + '"}';
            } else {
                //data += ',{"transcodeGroup":'+transCodeId+',"catalogId":'+catalogid+',"description":"'+title+'","id":"'+id+'","title":"'+title+'","tags":""}';
                data += ',{"transcodeGroup":' + transCodeId + ',"catalogId":' + catalogid + ',"description":"' + title + '","id":"' + id + '","tags":"","title":"' + title + '"}';
            }
        }
    });

    /** gq**/
    var obj = $(".fileSize");  //判断是否有0kb的文件
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].innerHTML == "0.00KB") {
            $.messager.alert('消息', '上传文件大小不能为0kb');
            return false;
            break;
        }
    }

    if (!error) {
        $.messager.alert('消息', '素材名称含有非法字符');
        return false;
    }
    if (catalogid == "请选择栏目") {
        $.messager.alert("提示", "请选择栏目！");
        return false;
    }
    ;
    /** gq**/

    if (data == '') {
        $.messager.alert("提示", "请至少选择一个素材！");
        return false;
    }

    if (!valid) {
        $.messager.alert("提示", "素材标题不能为空！");
        return false;
    }
    data += ']';
    // alert('siteid='+siteid+' type='+type+' datatype='+datatype+' data='+data);
    try {
        document.getElementById("Uploader").startUpload(siteid, type, datatype, data, isPublish);
    } catch (e) {
        $.messager.alert("提示", "上传出错了");
        return false;
    }
    // 屏蔽修改视频属性，保存后不能修改视频属性
    $("#tb_upload_list").find("tr").each(function() {
        $(this).find(".btn_videoModify").html('');
        $(this).find(".btn_select_catalog").unbind("click");
    });
    $("#update_video").css("color", "#777777");
    $("#update_video").unbind("click");

}

function closeUploadWindow() {
    var isUpload = false;
    $("#tb_upload_list").find("tr").each(function() {
        var prompt = $(this).find(".upload_prompt").html();
        if (prompt != "上传完成" && prompt != "上传失败" && prompt != "等待上传") {
            isUpload = true;
            return false;
        }
    });
    if (isUpload) {
        $.messager.alert("提示", "文件正在上传，不能关闭窗口");
        return false;
    }
    removefileList();
    $("#tb_upload_list").find("tr").each(function() {
        $(this).remove();
    });
    $uploadVideoWin.window("close");
}

function cancelUploadVideo() {
    var isUpload = false;
    $("#tb_upload_list").find("tr").each(function() {
        var prompt = $(this).find(".upload_prompt").html();
        if (prompt != "上传完成" && prompt != "上传失败") {
            isUpload = true;
            return false;
        }
    });
    if (isUpload) {
        $.messager.confirm('提示', '确认要取消正在上传的素材吗？', function(r) {
            if (r) {
                removefileList();
                $("#tb_upload_list").find("tr").each(function() {
                    var prompt = $(this).find(".upload_prompt").html();
                    if (prompt != "上传完成") {
                        $(this).remove();
                    }
                });
            }
        });
    }
    //关闭窗口
    closeUploadWindow();
}

function minimizeUploadWindow() {
    var width = $(window).width();
    var height = $(window).height();
    if ($("#mini-video-upload-window").length == 0) {
        var html = '\
            <div id="mini-video-upload-window" style="position:absolute;z-index:9999;left:' + (width - 240) + 'px;top:' + (height - 35) + 'px; background: url(../images/bg_minwin.png) no-repeat scroll 0 0 transparent; width:203px; height:33px;padding:0 4px; display:none;">\
            <span class="maximize" style="float:right;cursor:pointer;background: url(../images/btn_maxwin.png) no-repeat scroll 0 0 transparent; width:16px;height:11px; margin-top:4px;" onclick="maximizeUploadWindow()" title="最大化">&nbsp;</span>\
            <div style="height:33px; width:178px; font-size:14px;"><span id="mini-video-upload-msg" style="padding-left:74px;font-size:14px;color:#FFBB33;height:33px;line-height:33px;"></span></div>\
            </div>\
        ';
        $(html).appendTo($("body"));
    }
    $("#video-upload-window").parent().animate({left: (width - 130) + "px", top: (height - 30) + "px", height: "0px", width: "0px"}, 500, "swing", function() {
        updateMiniWinUploadMsg();
        $("#mini-video-upload-window").show();
        // 弹出框不能隐藏，隐藏后视频停止上传
        //$("#video-upload-window").parent().hide();
    });
}

function maximizeUploadWindow() {
    var width = ($(window).width() - 500) / 2;
    var height = ($(window).height() - 500) / 2;
    if (height < 0) {
        height = 0;
    }
    $("#mini-video-upload-window").hide();
    $("#video-upload-window").parent().animate({left: width + "px", top: height + "px", height: "500px", width: "500px"}, 500, "swing", function() {
    });
}

function showUploadWindow() {
    if ($("#mini-video-upload-window").is(":visible")) {
        maximizeUploadWindow();
    }

    var type = $('#vms_type :selected').attr('status');
    //栏目下拉菜单
    $('#combox_lm').combobox({
        url: '/videoInter/getCatagory?vmsResType=' + type,
        valueField: 'id',
        textField: 'text',
        onSelect: function(rec) {  //当选中对应的栏目后，把对应的上传栏目id改变
            $("#videoUpload_catalogId").val(rec.id);
        },
        onLoadSuccess: function() {
            if ($(".combobox-item").length > 0) {
                $('#combox_lm').combobox('setValue', $(".combobox-item").eq(0).val());
            }

        }
    });
    $uploadVideoWin.window("open");
}

function removeUploadVideo(obj) {
    var tips = $(obj).html();
    if (tips == "取消") {
        $.messager.confirm('提示', '确认要取消正在上传的素材吗？', function(r) {
            if (r) {
                var uploadId = $(obj).parent().parent().find("input[name='videoUpload_id[]']").val();
                document.getElementById("Uploader").cancelUpload(uploadId);
                $(obj).parent().parent().remove();
            }
        });
    } else if (tips == "删除") {
        $.messager.confirm('提示', '确认要删除准备上传的素材吗？', function(r) {
            if (r) {
                var uploadId = $(obj).parent().parent().find("input[name='videoUpload_id[]']").val();
                document.getElementById("Uploader").cancelUpload(uploadId);
                $(obj).parent().parent().remove();
            }
        });
    }
}

function setUploadVideoTags(obj) {
    $(obj).parent().parent().parent().parent().find("input[name='videoUpload_tags[]']").val($(obj).html());
}

function showUploadModifyBtn(obj) {
    $(obj).css("background-color", "#EEEEEE");
    $(obj).find(".btn_videoModify").css("display", "block");
}

function hideUploadModifyBtn(obj) {
    $(obj).css("background-color", "#FFFFFF");
    $(obj).find(".btn_videoModify").css("display", "none");
}

function showUploadModifyInput(obj) {
    $(obj).parent().parent().find(".videoUpload_title").hide();
    $(obj).parent().parent().find("input[name='videoUpload_title[]']").show().focus();
}

function setUploadVideoTitle(obj) {
    var title = $(obj).parent().parent().find("input[name='videoUpload_title[]']").val();
    $(obj).parent().parent().find("input[name='videoUpload_title[]']").hide();
    $(obj).parent().parent().find(".videoUpload_title").html(title).show();
}

// 更新最小化窗口上传信息
function updateMiniWinUploadMsg() {
    var msg = "没有节目上传";
    var uploaded = 0;
    var witeUpload = 0;
    var totalUpload = 0;
    $("#tb_upload_list").find("tr").each(function() {
        totalUpload++;
        var prompt = $(this).find(".upload_prompt").html();
        if (prompt == "等待上传") {
            witeUpload++;
        } else if (prompt == "上传完成" || prompt == "上传失败") {
            uploaded++;
        }
    });
    if (witeUpload < totalUpload) {
        if (uploaded == totalUpload) {
            msg = "节目上传完成";
        } else {
            msg = "正在上传：" + (uploaded + 1) + "/" + totalUpload;
        }
    }
    $("#mini-video-upload-msg").html(msg);
}

jQuery.fn.inputBoxDefault = function(type) {
    this.each(function() {
        if ($.trim($(this).val()) == '') {
            if ($(this).attr('type') == 'password') {
                $(this).attr('type', 'text');
                $(this).attr('ispwd', 1);
            }
            $(this).val($(this).attr('title'));
            $(this).css('color', '#AAAAAA');
        } else {
            $(this).css('color', 'black');
        }

        $(this).focus(function() {
            $(this).css('color', 'black');
            $(this).addClass("focus");
            if ($.trim($(this).val()) == $(this).attr('title')) {
                $(this).val('');
            }
            if ($(this).attr('ispwd') == 1) {
                $(this).attr('type', 'password');
            }
        }).blur(function() {
            $(this).removeClass("focus");
            var v = $.trim($(this).val());
            $(this).val(v);
            if (v == '' || v == $(this).attr('title')) {
                $(this).val($(this).attr('title'));
                $(this).css('color', '#AAAAAA');
                if ($(this).attr('ispwd') == 1) {
                    $(this).attr('type', 'text');
                }
            }
        });
    });
}


// 点击返回按钮提示
function returnBackConfirm(obj) {
    $.messager.confirm('提示', '确定要返回吗？返回后当前编辑的内容将不会保存！', function(r) {
        if (r) {
            //window.location.href = $(obj).attr("href");
            console.log($(obj).attr("href"));
            frame_load($(obj).attr("href"), true);
        }
        return false;
    });
    return false;
}

function getViewMiddleTop(height) {
    var top = ($(window).height() - height) * 0.5 + $(document).scrollTop();
    if (top <= 0) {
        var top = 5;
    }
    return top;
}

function in_array(stringToSearch, arrayToSearch) {
    for (s = 0; s < arrayToSearch.length; s++) {
        thisEntry = arrayToSearch[s].toString();
        if (thisEntry == stringToSearch) {
            return true;
        }
    }
    return false;
}
