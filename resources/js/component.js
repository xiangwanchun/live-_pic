/**
 * Created by Administrator on 15-1-19.
 */

//裁剪对象
var jcrop_api;

/**
 * 上传插件封装
 * @btnId 上传按钮Id
 * @progressBarId 上传进度条展现Id
 * @type 上传结果处理的类型
 * @comId 站点ID
 * 提示：需在调用页面添加回调函数 callbackUpload
 */
function uploadComponent(btnId, progressBarId, type, comId, other) {
    var fileTypeDesc = '*.jpg;*.jpeg;*.png;';
    var fileTypeExts = '*.jpg;*.jpeg;*.png;';
    if (btnId == 'btn_local_upload') {
        fileTypeDesc += '*.gif;'
        fileTypeExts += '*.gif;'
    }
    $('#' + btnId).uploadify({
        'swf': myUploadifySwfUrl,
        'uploader': myUploaderUrl,
        'formData': {com_id: comId, ajax: 1},
        'auto': true,
        'fileTypeDesc': fileTypeDesc,
        'fileTypeExts': fileTypeExts,
        'fileSizeLimit': '200KB',
        'queueSizeLimit': 3,
        'queueID': progressBarId,
        'buttonText': '上传图片',
        'height': 30,
        'width': 70,
        'onSelect': function(e, queueId, fileObj) {
        },
        onUploadSuccess: function(file, data, response) { 
             var start = data.indexOf(">");  
             if(start != -1) {  
               var end = data.indexOf("<", start + 1);  
               if(end != -1) {  
                 data = data.substring(start + 1, end);  
                }  
             }  
            var data = $.parseJSON(data);
            if (data.code == 1) {
                callbackUpload(data, btnId, type, other);
            } else {
                $.messager.alert("提示", "上传失败，请重新上传");
            }
        }
    });
}

/**
 * 图片上传回调
 * @param data
 * @param btnId
 * @param type
 */
function callbackUpload(data, btnId, type, other) {
    switch (type) {
        //内容列表图裁剪操作
        case 'setShopPic':
            if ($(jcrop_api).length > 0)
                jcrop_api.destroy();
            $("#img_set_jcrop_list").attr("src", MOYUN_HOST + data.value.name);
            $("#img_set_jcrop_top").attr("src", MOYUN_HOST + data.value.name);
            $("#img_set_jcrop_list").attr("data", data.value.name);
            $("#img_set_jcrop_top").attr("data", data.value.name);
            setTimeout("initJcrop();", 1000);
            break;
        case 'setListTopPic':
            $("#img_content_top").attr('src', MOYUN_HOST + data.value.name);
            $("input[name='content[list_pic]']").val(data.value.name);
            break;

        /*setListTopPicTwo*/
        case 'setListTopPicTwo':
            $("#img_content_top_two").attr('src', MOYUN_HOST + data.value.name);
            $("input[name='content[list_pic_two]']").val(data.value.name);
            break;

            /*setListTopPicThree*/
        case 'setListTopPicThree':
            $("#img_content_top_three").attr('src', MOYUN_HOST + data.value.name);
            $("input[name='content[list_pic_three]']").val(data.value.name);
            break;
        case 'uploadObjPic':
            $("#" + btnId).parent().find(".img-obj").attr("src", "<?php echo Yii::app()->request->baseUrl; ?>" + data.value.name);
            $("#" + btnId).parent().parent().find("input[name='guess[object_toppic][]']").val(data.value.name);
            break;

        case 'setLocalPic':
            $("#" + btnId).parent().find(".img-obj").attr("src", MOYUN_HOST + data.value.name);
            $("#" + btnId).parent().find("input[name='localGoods[topic][]']").val(data.value.name);
            break;
        case 'uploadOptPic':
            $("#" + btnId).parent().find(".img-obj").attr("src", MOYUN_HOST + data.value.name);
            $("#" + btnId).parent().parent().find("input[name='answer_pic[]']").val(data.value.name);
            break;
        case 'uploadOptPic_obj_list':
            $('.list_pic_me').val(data.value.name);
            $("#img_content_top").attr("src", MOYUN_HOST + data.value.name);
            break;
        case 'setAnswersPic':
            $('#answer_img_' + other).attr('src', MOYUN_HOST + data.value.name);
            $('#answer_pic_' + other).val(data.value.name);
            break;
        case 'setGuessPic':
            if (other.type == 'objects') {
                $('#guess_object_img_' + other.code).attr('src', MOYUN_HOST + data.value.name);
                $('#guess_object_pic_' + other.code).val(data.value.name);
            } else if (other.type == 'options') {
                $('#guess_option_img_' + other.code).attr('src', MOYUN_HOST + data.value.name);
                $('#guess_option_pic_' + other.code).val(data.value.name);
                $('#guess_option_img_' + other.code).prev('div').hide();
                if ($.isFunction(img_box_click)) {
                    img_box_click($('#guess_option_img_' + other.code));
                    console.log($('#guess_option_pic_' + other.code).next());
                    var objg = $('#guess_option_pic_' + other.code).next();
                    objg.bind('click', function() {
                        delete_img_btn_click(objg);
                    });
                }
            }
            break;
        case 'setPicPic':
            var html = getContentHtml();
            html = html.replace('{img}', MOYUN_HOST + data.value.name);
            html = html.replace('{picUrl}', data.value.name);
            html = html.replace('{picId}', data.value.pic_id);
            html = html.replace(/\{pic_name\}/g, data.value.title);
            $('#show_content_list').append(html);
            if ($.isFunction(picGroupText)) {
                picGroupText();
            }
            break;
        case 'setBaomingPic':
            $('#baoming_img').attr('src', MOYUN_HOST + data.value.name);
            $('#baoming_pic').val(data.value.name);
            break;
        case "picgroup_upload":
            //语音话题(图组上传)
            addPicWrapper(data);
            break;
        case "catalogPic":
            $('#logo_pic_img').attr('src', MOYUN_HOST + data.value.name);
            $('#logo_pic').val(data.value.name);
            $('#logo_pic').parent().find('div:first').hide(300);
            break;
        case 'setLocalshopUploadPic':
            var htmlPlugs = '<div class="w300px h150px relative mgb15" style="line-height: 150px;"><div class="btn w150px h150px  bge5e5e5 fl"><img src="{imgSrc}" width="150" height="150"></div>\
                <input type="hidden" name="pic_id[]" value="{picId}" /><input type="hidden" name="pic_url[]" value="{picPath}"/>\
                <a class="btn  w50px h25 fl tc cl099acf" style="margin-top: 57px;" onclick="delSimplePic(this)">删除</a>\
                <a class="btn  w50px h25 fl tc cl099acf" style="margin-top: 57px;" onclick="upSimplePic(this)">上移</a>\
                <a class="btn  w50px h25 fl tc cl099acf" style="margin-top: 57px;" onclick="downSimplePic(this)">下移</a></div>';
            htmlPlugs = htmlPlugs.replace('{imgSrc}', MOYUN_HOST + data.value.name);
            htmlPlugs = htmlPlugs.replace('{picId}', data.value.pic_id);
            htmlPlugs = htmlPlugs.replace('{picPath}', data.value.name);
            $('#localshop_pic_box').append(htmlPlugs);
            break;
        case 'bannerpic_upload':
            var num = $("#banner_list .ipt").length;
            var html = '<div class="ipt"><div class="ipt-photo">\
                            <div class="ipt-photo-img">\
                                <img src="' + data.value.name + '"/>\
                                <div class="photo-opacity"></div>\
                                <div class="ipit-control">\
                                    <a id="edit-photo' + num + '" class="btn edit-photo"></a>\
                                    <a class="btn delete-photo"></a>\
                                </div>\
                                <div class="ipit-text"></div>\
                                <input type="hidden" name="banner_summary[]" value="">\
                                <input type="hidden" name="con_id[]" value="">\
                            </div>\
                            <div class="rows bge5e5e5 pd5">\
                                <div class="rows">\
                                    <p class="h25 showText">活动标题</p>\
                                    <input type="hidden" name="banner_text[]" value="活动标题">\
                                </div>\
                                <div class="rows h25">\
                                    <input type="text" name="banner_url[]" class="input w280px" placeholder=""><span class="icon-shape mg0 pd0-10"></span>\
                                </div>\
                            </div>\
                            <input type="hidden"  value="' + data.value.name + '" name="banner_pic[]" />\
                        </div>\
                    </div></div>';
            $(html).appendTo($("#banner_list"));
            editBannerPic("edit-photo" + num, '', 'bannerpic_edit', ComId);
            initPicEvent();
            break;
        case 'bannerpic_edit':
            $("#" + btnId).parents(".ipt-photo-img").children("img").attr("src", data.value.name);
            $("#" + btnId).parents(".ipt-photo-img").siblings("input[name='banner_pic[]']").val(data.value.name);
            break;
        case "block_add":
            $("#block_pic").attr("src", data.value.name);
            $("input[name='block_pic']").val(data.value.name);
            break;

    }

}

/**
 * 打开弹窗
 * @param title     弹窗标题
 * @param url       加载的内容地址
 * @param callback  回调处理函数
 * @param w         弹窗打开的宽
 * @param h         弹窗开打的高
 * @param mode      其它处理参数
 */
function openDialogComponent(title, url, callback, w, h, mode) {
    title = title == '' ? '弹出框' : title;
    var width = (typeof (w) != 'undefined' && w != '') ? w : 750;
    var height = (typeof (h) != 'undefined' && h != '') ? h : 540;
//    var selectMode = (typeof(mode) != 'undefined' && mode != '') ? mode : '';
    var confirmCallback = (typeof (callback) == 'function') ? callback : function() {
        $('#setCouponStaus').window('close');
    };
    if(mode == 'top0')
        var top = 10;
    else
        var top = getViewMiddleTop(height);
    $("body").append('<div id="setCouponStaus" class="dis" style="width:500px; height:395px;z-index: 2001;top:5px;"></div>');
    $('#setCouponStaus').dialog({
        title: title,
        width: width,
        height: height,
        closed: false,
        closable: false,
        top: top,
        border: false,
        cache: false,
        modal: true, //显示遮罩层
        onClose: function() {  //当关闭的时候，清空搜索框内容，下次搜索时，那么每次都是搜索出全部内容
            $("#name_search_1").val('');
        },
        tools: [{
                iconCls: 'panel-tool-close',
                handler: function() {
                    $('#setCouponStaus').window('close');
                }
            }],
        href: url,
        onOpen: function() {
            $("#setCouponStaus").show();
        },
        buttons: [{
                text: '确定',
                iconCls: 'icon-ok',
                handler: function() {
                    if (confirmCallback() != false)
                        $('#setCouponStaus').window('close');
                }
            }, {
                text: '取消',
                handler: function() {
                    $('#setCouponStaus').window('close');
                }
            }]
    });
    //改变样式
    $("#setCouponStaus").parent('.panel').find('.panel-tool').html('<a href="javascript:void(0)" class="panel-tool-close"></a>');
    $("#setCouponStaus").parent('.panel').find('.panel-tool').find('.panel-tool-close').on('click', function() {
        $('#setCouponStaus').window('close');
    });
}
/**
 * 弹出框回调函数
 * @param {string} type
 * @param {string} mode 被点击的对象
 * @returns {Boolean}
 */
function callbackDialogComponent(type, mode) {
    switch (type) {
        case 'setShopPic':  //列表图片，头图片库选择处理结果
            $(".img_box").find("input[name='pic_id[]']:checked").each(function() {
                var pic_url = $(this).parent().find("input[name='pic_url[]']").val();
                if (pic_url) {
                    if ($(jcrop_api).length > 0)
                        jcrop_api.destroy();
                    $("#img_set_jcrop_list").attr("src", MOYUN_HOST + pic_url);
                    $("#img_set_jcrop_top").attr("src", MOYUN_HOST + pic_url);
                    // 初始化图片剪切插件
                    initJcrop();
                    $("#img_set_jcrop_list").attr("data", pic_url);
                    $("#img_set_jcrop_top").attr("data", pic_url);
                }
            });
            break;
        case 'setListTopPic':  //列表图片，头图片库选择处理结果
            $(".img_box").find("input[name='pic_id[]']:checked").each(function() {
                var pic_url = $(this).parent().find("input[name='pic_url[]']").val();
                if (pic_url) {
                    if ($(jcrop_api).length > 0)
                        jcrop_api.destroy();
                    $("#img_content_top").attr('src', MOYUN_HOST + pic_url);
                    $("input[name='content[list_pic]']").val(pic_url);
                }
            });
            break;
            //栏目处理
        case 'setCatalog':
            var arrCatalogId = new Array();
            var nodes = on_check_tree();
            for (var i = 0; i < nodes.length; i++) {
                arrCatalogId.push(nodes[i].id);
            }
            if (!arrCatalogId.length) {
                $.messager.alert("提示", "请选择发布栏目");
                return false;
            }
            //只添加一个栏目
            var catalog_name = nodes[0]['name'];
            var catalog_id = nodes[0]['id'];
            $("#catalog_name").val(catalog_name);
            $("#catalog_id").val(catalog_id);
            break;
        case 'setPrizeList':
            var prizeId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var prizeName = $("#map_depot_wrapper").find("#name_" + prizeId).text();
            $("input[name='content[prize_id]']").val(prizeId);
            $("input[name='content[prize_name]']").val(prizeName);
            break;
            //百度地图
        case 'baiduMap':
            var pos = $(window.frames["baiduMapIframe"].document).find("#input_map_position").val();
            if (pos != "") {
                var arrPos = pos.split(",");
                var baiduApiUrl = 'http://api.map.baidu.com/geocoder/v2/?ak=5238MfA0wP4kQaFwTLeGBbdE&callback=renderReverse&location=' + arrPos[1] + ',' + arrPos[0] + '&output=json&pois=0';
                $.get(baiduApiUrl, function(data) {
                    if (data.status == 0 && data.result.formatted_address) {
                        $('input[name="localGoods[addr][]"]').val(data.result.formatted_address);
                        $('input[name="localGoods[longitude][]"]').val(arrPos[0]);
                        $('input[name="localGoods[latitude][]"]').val(arrPos[1]);
                        $('input[name="localGoods[province][]"]').val(data.result.addressComponent.province);
                        $('input[name="localGoods[city][]"]').val(data.result.addressComponent.city);
                    }
                }, 'jsonp');
            }
            break;
            //本地商家处理多商品处理
        case 'setLocalshopPics':
            disposelocalshopPic();
            break;
            //电商商品处理
        case 'setEcommerceList':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                var name = $("#goods_name_" + id).text();
                var code = $("#goods_serial_" + id).text();
                var price = $("#goods_price_" + id).val();
                var marketprice = $("#goods_marketprice_" + id).val();
                $("input[name='ecommerce[id][]']").val(id);
                $("input[name='ecommerce[name][]']").val(name);
                $("input[name='ecommerce[code][]']").val(code);
                $("input[name='ecommerce[original_price][]']").val(marketprice);
                $("input[name='ecommerce[price][]']").val(price);
            }
            break;
        case 'setLinkUrl':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                //根据id获取详细的信息
                $.post(
                        getChatInfoUrl,
                        {id: id},
                function(date) {
                    if (date.code <= 0) {
                        $.messager.alert('提示', date.message);
                    } else {
                        $("input[name='url']").val(date.url);
                        $("input[name='chat_id']").val(id);
                    }
                },
                        'json'
                        );
            }
            break;
        case 'setContentList':
            $(".cat_list:checked").each(function() {
                var id = $(this).val();
                var thumb = $("#content_listthumb_" + id).val();
                var title = $("#content_title_" + id).text();
                var type = $("#content_type_" + id).text();
                var html = getContentHtml();
                html = html.replace('{img}', MOYUN_HOST + thumb);
                html = html.replace('{title}', title);
                html = html.replace('{type}', type);
                html = html.replace('{id}', id);
                $('#show_content_list').prepend(html);
                is_select = true;
            });
            if ($(".cat_list:checked").length < 1) {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;
        case 'setPicPic':
            $(".img_box").find("input[name='pic_id[]']:checked").each(function() {
                var pic_id = $(this).val();
                var pic_url = $(this).parent().find("input[name='pic_url[]']").val();
                var html = getContentHtml();
                var name = $(this).parent().find("input[name='pic_url[]']").next().html();
                html = html.replace('{img}', MOYUN_HOST + pic_url);
                html = html.replace('{picUrl}', pic_url);
                html = html.replace('{picId}', pic_id);
                html = html.replace(/\{pic_name\}/g, name);
                $('#show_content_list').append(html);
                if ($.isFunction(picGroupText)) {
                    picGroupText();
                }
            });
            break;
        case 'setChouJiangPrizeList':
            var prizeId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var prizeName = $("#map_depot_wrapper").find("#name_" + prizeId).text();
            var prize_total = $("#dialog_prize_total_" + prizeId).val();
            var prize_surplus = $("#dialog_prize_surplus_" + prizeId).val();
            mode.find('input[name="prize_option[prize_id][]"]').val(prizeId);
            mode.find('input[class="prize_id"]').val(prizeId);
            mode.find('.prize_one_info').html(prizeName + '(' + prize_surplus + '/' + prize_total + ')');
            mode.find('.prize_sur').val(prize_surplus);
            mode.find('input[name="prize_option[prize_num][]"]').val(prize_surplus);
            break;
        case 'setFieldsList':
            var html = '<tr><td class="list-c1">字段名称</td><td>是否必填</td></tr>';
            $("input[name='option[]']:checked").each(function() {
                html += '<tr class="options"  data="' + $(this).val() + '"><td class="list-c1">' + $(this).attr("title") + '</td>' +
                        '<input type="hidden" name="act[option][' + $(this).attr("code") + '][have]"  value="1">' +
                        '<td><div  class="ipt-chkbox-bg"><input type="checkbox" checked name="act[option][' + $(this).attr("code") + '][need]"  value="1"></div></td></tr>';
            });
            $(".selectOption").html(html);
            $(".selectOption tbody").sortable({
                stop: function() {
                }
            });
            break;
        case 'setTaskPrizeList':
            var prizeId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var prizeName = $("#map_depot_wrapper").find("#name_" + prizeId).text();
            $("#task_prize_id").val(prizeId);
            $("#task_prize_name").val(prizeName);
            break;
        case 'setTaskChoujiangList':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                var name = $("#content_title_" + id).text(); //被选中的活动名字
                $("#lottery_id").val(id);
                $("#lottery_name").val(name);
            } else {
                $.messager.alert('提示', '请选择活动！');
                return false;
            }
            break;
        case 'setTaskConList2':
            var cat = $(".cat_list:checked");
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                var name = $("#content_title_" + id).text(); //被选中的活动名字
                mode.find("input[name='task[task_content_id]']").val(id);
                mode.find("input[name='task[task_content_name]']").val(name);
            } else {
                $.messager.alert('提示', '请选择活动！');
                return false;
            }
            break;
        case 'setTaskList':
            var taskDescId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var taskDesc = $("#map_depot_wrapper").find("#task_desc_" + taskDescId).val();
            var taskname = $("#map_depot_wrapper").find("#name_" + taskDescId).text();
            $('#task_content').val(taskname);
            UE.getEditor('content_body').setContent(taskDesc);
            document.cookie = "checkedid=" + taskDescId;
            break;
        case 'selectcontent':
            $(".cat_list:checked").each(function() {
                var id = $(this).val();
                var title = $("#name_" + id).html();
                html = addContentOptionHtml();
                html = html.replace('{contentid}', id);
                html = html.replace('{contenttitle}', title);
                $(html).appendTo($("#content_option_wrapper tbody"));
            });
            if ($(".cat_list:checked").length < 1) {
                $.messager.alert("提示", '请选择活动内容');

                return false;
            }
            break;
        case 'setPrize':
            var prizeId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var prizeName = $("#map_depot_wrapper").find("#name_" + prizeId).text();
            $(mode).parent().parent().parent().parent().find("input[name='sp_prizeid[]']").val(prizeId);
            $(mode).parent().parent().parent().parent().find("input[name='sp_prizename[]']").val(prizeName);
            break;
        case 'selectcomment':
            $(".cat_list:checked").each(function() {
                var id = $(this).val();
                var title = $("#content_" + id).html();
                var con_id = $(this).attr("con_id");
                html = addCommentOptionHtml();
                html = html.replace('{commentid}', id);
                html = html.replace('{contentid}', con_id);
                html = html.replace('{commenttitle}', title);
                $(html).appendTo($("#comment_option_wrapper tbody"));
            });
            if ($(".cat_list:checked").length < 1) {
                $.messager.alert("提示", '请选择评价内容');
                return false;
            }
            break;
        case 'selectmember':
            var memberid = $("#map_depot_wrapper").find("input[name='cat_id']:checked").val();
            var membername = $("#map_depot_wrapper").find("#content_title_" + memberid).text();
            $("#username").val(membername);
            break;
        case 'selectradiocontent':
            var contentid = $("#map_depot_wrapper").find("input[name='cat_id']:checked").val();
            var contentname = $("#map_depot_wrapper").find("#content_title_" + contentid).text();
            $("#title").val(contentname);
            $("#con_id").val(contentid);
            break;
        case 'selectlog':
            break;
        case 'setHomeAct':
            $(".cat_list:checked").each(function() {
                var id = $(this).val();
                var title = $("#content_title_" + id).text();
                mode.find('input[name="act_name[]"]').val(title);
                mode.find('input[name="act_id[]"]').val(id);
                mode.find('input[name="act_type[]"]').val(0);
            });
            if ($(".cat_list:checked").length < 1) {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;
        case 'setHomeChat':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                var name = $("#content_title_" + id).text();
                mode.find('input[name="act_name[]"]').val(name);
                mode.find('input[name="act_id[]"]').val(id);
                mode.find('input[name="act_type[]"]').val(1);
            } else {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;
        case 'selectPrize':
            var prizeId = $(".tab").find("input[name='prize_id']:checked").val();
            var prizeName = $(".tab").find("#name_" + prizeId).text();
            $('#prize_id').val(prizeId);
            $('#prize').val(prizeName);
            break;
        case 'selectPrizechar':
            var prizeId = $(".tab").find("input[name='cat_id[]']:checked").val();
            var prizeName = $(".tab").find("#name_" + prizeId).text();
            $(mode).parent().find('input[name="prize[id][]"]').val(prizeId);
            $(mode).parent().find('input[name="prize[name][]"]').val(prizeName);
            break;
        case 'selectarticle':
            var articleId = $("#map_depot_wrapper").find("input[name='cat_id[]']:checked").val();
            var articleTitle = $("#map_depot_wrapper").find("#name_" + articleId).text();
            $("input[name='content[desc_content_id]']").val(articleId);   //对应模板id
            $("input[name='content[desc_content_name]']").val(articleTitle);
            break;
        case 'contentAct':
            var op_name = $("input[name='op_name']").val();
            var id = $("input[name='op_id']").val();
            var arrCatalogId = new Array();
            var nodes = on_check_tree();
            for (var i = 0; i < nodes.length; i++) {
                arrCatalogId.push(nodes[i].id);
            }
            if (!arrCatalogId.length) {
                $.messager.alert("提示", "请选择发布栏目");
                return false;
            }
            if (op_name == 'copy') {
                $.post(
                        MOYUN_HOST + '/content/copy',
                        {'ids': arrCatalogId, 'id': id},
                function(data) {
                    if (data.code < 0) {
                        $.messager.alert("提示", data.message);
                    } else {
                        $.messager.alert("提示", data.message);
                        window.location.reload();
                    }
                },
                        'json'
                        );
            } else if (op_name == 'move') {
                $.post(
                        MOYUN_HOST + '/content/move',
                        {'ids': arrCatalogId, 'id': id},
                function(data) {
                    if (data.code < 0) {
                        $.messager.alert("提示", data.message);
                    } else {
                        $.messager.alert("提示", data.message);
                        window.location.reload();
                    }
                },
                        'json'
                        );
            }
            break;
        case 'setRecommendBannerContent'://处理管理端banner区块选择活动后的事件
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                function(data) {
                    if (data.code < 0) {
                        $.messager.alert("提示", data.message);
                    } else {
                        $(mode).siblings("input[name='banner_url[]']").val(data.url);//设置链接地址
                        $(mode).parents(".ipt-photo").find("input[name='banner_text[]']").val(data.title);//设置隐藏域中的标题
                        $(mode).parents(".ipt-photo").find("p.showText").html(data.title);//设置页面中显示的标题
                        $(mode).parents(".ipt-photo").find("input[name='banner_summary[]']").val(data.summary);//设置隐藏域中图片说明文字
                        $(mode).parents(".ipt-photo").find(".ipit-text").html(data.summary);//设置页面中显示的图片说明文字
                        $(mode).parents(".ipt-photo").find("input[name='con_id[]']").val(data.id);
                        $(mode).parents(".ipt-photo").children("div.ipt-photo-img").children("img").attr("src", data.pic);//设置页面中显示的图片地址
                        $(mode).parents(".ipt-photo").find("input[name='banner_pic[]']").val(data.pic);

//                        if ($(mode).parents(".ipt-photo").children(".ipt-photo-img").children("img").attr("src") == '') {
//                            $(mode).parents(".ipt-photo").children(".ipt-photo-img").children("img").attr("src", data.pic);
//                        }
                    }
                },
                        'json'
                        );
            } else {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;
        case 'addRecommendBannerContent':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                function(data) {
                    if (data.code < 0) {
                        $.messager.alert("提示", data.message);
                    } else {
                        var num = $("#banner_list .ipt").length;
                        var html = '<div class="ipt"><div class="ipt-photo">\
                            <div class="ipt-photo-img">\
                                <img src="' + data.pic + '"/>\
                                <div class="photo-opacity"></div>\
                                <div class="ipit-control">\
                                    <a id="edit-photo' + num + '" class="btn edit-photo"></a>\
                                    <a class="btn delete-photo"></a>\
                                </div>\
                                <div class="ipit-text">' + data.summary + '</div>\
                                <input type="hidden" name="banner_summary[]" value="' + data.summary + '">\\n\
                                <input type="hidden" name="con_id[]" value="' + data.id + '">\
                            </div>\
                            <div class="rows bge5e5e5 pd5">\
                                <div class="rows">\
                                    <p class="h25 showText">' + data.title + '</p>\
                                    <input type="hidden" name="banner_text[]" value="' + data.title + '">\
                                </div>\
                                <div class="rows h25">\
                                    <input type="text" value="' + data.url + '" name="banner_url[]" class="input w280px" placeholder="输入跳转的URL地址"><span class="icon-shape mg0 pd0-10"></span>\
                                </div>\
                            </div>\
                            <input type="hidden"  value="' + data.pic + '" name="banner_pic[]" />\
                        </div>\
                    </div></div>';
                        $(html).appendTo($("#banner_list"));
                        editBannerPic("edit-photo" + num, '', 'bannerpic_edit', ComId);
                        initPicEvent();
                    }
                },
                        'json'
                        );
            } else {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;

        case 'addRecommendContent':
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var arr = new Array();
                $("#recommendList").find("input[name='act_id[]']").each(function() {
                    arr.push($(this).val());
                });
                var isCreate = true;
                var id = cat.eq(0).val();
                if (in_array(id, arr)) {
                    $.messager.confirm("提示", '该活动已在推荐列表中,确定是否继续添加', function(r) {
                        if (r) {
                            var name = $("#content_title_" + id).text();
                            var listThumb = $("#content_listthumb_" + id).val();
                            var html = '<div class="content-c-list">\
                                    <img src="' + listThumb + '"/>\
                                    <p>' + name + '</p>\
                                    <input name="act_id[]" type="hidden" value="' + id + '"/>\
                                    <input name="act_name[]" type="hidden" value="' + name + '"/>\
                                    <a class="btn btn-delete"></a>\
                                </div>';
                            $(html).appendTo($("#recommendList"));
                            init();
                        }
                    });
                } else {
                    var name = $("#content_title_" + id).text();
                    var listThumb = $("#content_listthumb_" + id).val();
                    var html = '<div class="content-c-list">\
                                    <img src="' + listThumb + '"/>\
                                    <p>' + name + '</p>\
                                    <input name="act_id[]" type="hidden" value="' + id + '"/>\
                                    <input name="act_name[]" type="hidden" value="' + name + '"/>\
                                    <a class="btn btn-delete"></a>\
                                </div>';
                    $(html).appendTo($("#recommendList"));
                    init();
                }



            } else {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }

            break;
        case  'setImgContent':
            var type = $('#tab_type').val();
            if(type == 'con'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                        function(data) {
                            if (data.code < 0) {
                                $.messager.alert("提示", data.message);
                            } else {
                                $('#activityType').val('con');
                                var parameter = typeof (data.data) == "object" ? JSON.stringify(data.data) : data.data;
                                parameter = parameter.replace(/!/g, '%21').replace(/\*/g, '%2A').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/'/g, '%27').replace(/~/g, '%7e');
                                $("#link").val("myapp://" + encodeURIComponent('{"method":"gopage","parameter":' + parameter + '}'));
                            }
                        },
                        'json'
                    );
                } else {
                    $.messager.alert("提示", '请选择活动内容');
                    return false;
                }
            }else if(type == 'goods'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    var name = $("#goods_name_" + id).text();
                    var detail_url = $("#goods_detail_" + id).val();
                    $("#link").val(detail_url);
                    $("#title").val(name);
                    $('#activityType').val('goods');
                }
            }
            break;
        case 'setConOrGoods':
            var type = $('#tab_type').val();
            if(type == 'con'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                        function(data) {
                            if (data.code < 0) {
                                $.messager.alert("提示", data.message);
                            } else {
                                $("#text").val(data.title);
                                $("#title").val(data.title);
                                var parameter = typeof (data.data) == "object" ? JSON.stringify(data.data) : data.data;
                                parameter = parameter.replace(/!/g, '%21').replace(/\*/g, '%2A').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/'/g, '%27').replace(/~/g, '%7e');
                                $("#href").val("myapp://" + encodeURIComponent('{"method":"gopage","parameter":' + parameter + '}'));
                                $('#type').val('con');
                            }
                        },
                        'json'
                    );
                } else {
                    $.messager.alert("提示", '请选择活动内容');
                    return false;
                }
            }else if(type == 'goods'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    var name = $("#goods_name_" + id).text();
                    var code = $("#goods_serial_" + id).text();
                    var price = $("#goods_price_" + id).val();
                    var marketprice = $("#goods_marketprice_" + id).val();
                    var image = $("#goods_image_" + id).val();
                    var detail_url = $("#goods_detail_" + id).val();
                    var html = '<p><a href="'+detail_url+'"><img src="'+image+'">'+name+'</a></p>';
//                    UE.getEditor('content_body').execCommand('inserthtml', html, true);
                    $("#href").val(detail_url);
                    $("#text").val(name);
                    $("#title").val(name);
                    $('#type').val('goods');
                }
            }
            break;

        //活动推荐
        case 'setRecommendnConOrGoods':
            var type = $('#tab_type').val();
            if(type == 'con'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    $('#recommend_id').val(id);

                    $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                        function(data) {
                            if (data.code < 0) {
                                $.messager.alert("提示", data.message);
                            } else {
                                $("#recommend_title").val(data.title);
                            }
                        },
                        'json'
                    );

                }
            }else if(type == 'goods'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    $('#recommend_id').val(id);

                }
            }
            break;


        case 'directSetConOrGoods':
            var type = $('#tab_type').val();
            if(type == 'con'){
                var cat = $(".cat_list:checked");

                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                        function(data) {
                            if (data.code < 0) {
                                $.messager.alert("提示", data.message);
                            } else {
                                var html = '<p><a href="javascript:;" onclick="redirectToContentDetail(\'' + data.url + '\', \'' + encodeURIComponent(data.data) + '\')"><img src="' + data.pic + '"><br/>' + data.title + '</a></p>';
                                UE.getEditor('content_body').execCommand('inserthtml', html, true);
                            }
                        },
                        'json'
                    );
                } else {
                    $.messager.alert("提示", '请选择活动内容');
                    return false;
                }
            }else if(type == 'goods'){
                var cat = $(".cat_list:checked");
                if (cat.length > 0) {
                    var id = cat.eq(0).val();
                    var name = $("#goods_name_" + id).text();
                    var code = $("#goods_serial_" + id).text();
                    var price = $("#goods_price_" + id).val();
                    var image = $("#goods_image_" + id).val();
                    var detail_url = $("#goods_detail_" + id).val();
                    var html = '<p><a href="javascript:;" onclick="redirectToShopDetail(\''+detail_url+'\')"><img src="'+image+'"><br />'+name+'</a></p>';
                    UE.getEditor('content_body').execCommand('inserthtml', html, true);
                }
            }
            break;
        case "addAnnuciate":
            var cat = $(".cat_list:checked");
            if (cat.length > 0) {
                var id = cat.eq(0).val();
                $.post(
                        MOYUN_HOST + '/content/getContentInfo',
                        {'id': id},
                function(data) {
                    if (data.code < 0) {
                        $.messager.alert("提示", data.message);
                    } else {
                        $("input[name='act_id']").val(data.id);
                        $("input[name='url']").val(data.url);
                        $("#Annunciate_title").val(data.title);
                        $("#Annunciate_content").val(data.summary);
                    }
                },
                        'json'
                        );
            } else {
                $.messager.alert("提示", '请选择活动内容');
                return false;
            }
            break;
    }
}
//实例化编辑器
function initUediter() {
    UE.getEditor('content_body', {
        //focus时自动清空初始化时的内容
        autoClearinitialContent: false,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        //更多其他参数，请参考editor_config.js中的配置项
        initialFrameWidth: 1010,
        initialFrameHeight: 300,
        initialStyle: 'body{font-size:14px}'
        
    });
    UE.getEditor('content_body').ready(function() {
    this.execCommand( 'lineheight',2);
    });
}

//清空奖品
function cleanSelectedPrize() {
    $("input[name='content[prize_id]']").val("");
    $("input[name='content[prize_name]']").val("");
}


//编辑文件时初始化剪切
function editJcrop() {
    if ($(jcrop_api).length > 0)
        jcrop_api.destroy();
    $("#img_set_jcrop_list").attr("src", MOYUN_HOST + data.value.name);
    $("#img_set_jcrop_top").attr("src", MOYUN_HOST + data.value.name);
    $("#img_set_jcrop_list").attr("data", data.value.name);
    $("#img_set_jcrop_top").attr("data", data.value.name);
    setTimeout("initJcrop();", 1000);
}

/**
 * 图片剪切功能处理
 */
function initJcrop() {
    jcrop_api = $.Jcrop("#img_set_jcrop_list");
    var k = $("#k").val();
    var g = $("#g").val();
    $('#img_set_jcrop_list').Jcrop({
        aspectRatio: 190 / 143,
        onChange: showCoords,
        onSelect: showCoords
    }, function() {
        jcrop_api = this;
        jcrop_api.animateTo([10, 10, 110, 110]);
    });
    jcrop_api.setOptions(this.checked ? {
        aspectRatio: 190 / 143
    } : {
        aspectRatio: 190 / 143
    });
    initSelect = new Array();
    initSelect[0] = 50;
    initSelect[1] = 50;
    initSelect[2] = 200;
    initSelect[3] = 200;
    jcrop_api.setSelect(initSelect);
}

function applySetGoodsPic(bigPic, smallPic, subUrl) {
    var cropX = $("#crop_x").val();
    var cropY = $("#crop_y").val();
    var cropW = $("#crop_w").val();
    var cropH = $("#crop_h").val();
    if (cropX == "" && cropW == "") {
        $("#img_content_big").attr('src', MOYUN_HOST + bigPic);
        $("#img_content_top").attr('src', MOYUN_HOST + smallPic);
        $("input[name='content[top_pic]']").val(bigPic);
        $("input[name='content[list_pic]']").val(smallPic);
    } else {
        var zoomW = $("#img_set_jcrop_list").width();
        var zoomH = $("#img_set_jcrop_list").height();
        $.post(
                subUrl,
                {imgPath: bigPic, crop_x: cropX, crop_y: cropY, crop_w: cropW, crop_h: cropH, zoom_w: zoomW, zoom_h: zoomH},
        function(data) {
            if (data.code <= 0) {
                $.messager.alert('提示', data.message);
            } else {
                $("#img_content_big").attr('src', MOYUN_HOST + bigPic);
                $("#img_content_top").attr('src', MOYUN_HOST + data.data.smallPic);
                $("input[name='content[top_pic]']").val(bigPic);
                $("input[name='content[list_pic]']").val(data.data.smallPic);
            }
        },
                'json'
                );
    }
}

function showCoords(obj) {
    $("#crop_x").val(obj.x);
    $("#crop_y").val(obj.y);
    $("#crop_w").val(obj.w);
    $("#crop_h").val(obj.h);
    if (parseInt(obj.w) > 0) {//计算预览区域图片缩放的比例，通过计算显示区域的宽度(与高度)与剪裁的宽度(与高度)之比得到
        /*var rx = 300 / obj.w;
         var ry = 300 / obj.h;
         //通过比例值控制图片的样式与显示
         $("#img_pic_1").css({
         width: Math.round(rx*$("#img_set_big").width()) + "px", //预览图片宽度为计算比例值与原图片宽度的乘积
         height: Math.round(ry*$("#img_set_big").height()) + "px", //预览图片高度为计算比例值与原图片高度的乘积
         marginLeft: "-" + Math.round(rx * obj.x) + "px",
         marginTop: "-" + Math.round(ry * obj.y) + "px"
         });*/
        var rx = 150 / obj.w;
        var ry = 150 / obj.h;
        //通过比例值控制图片的样式与显示
        $("#img_set_jcrop_top").css({
            width: Math.round(rx * $("#img_set_jcrop_list").width()) + "px", //预览图片宽度为计算比例值与原图片宽度的乘积
            height: Math.round(ry * $("#img_set_jcrop_list").height()) + "px", //预览图片高度为计算比例值与原图片高度的乘积
            marginLeft: "-" + Math.round(rx * obj.x) + "px",
            marginTop: "-" + Math.round(ry * obj.y) + "px"
        });
    }
}

//获取窗口视野范围垂直居中高度
function getViewMiddleTop(height) {
    var top = ($(window).height() - height) * 0.5 + $(document).scrollTop();
    if (top <= 0) {
        var top = 5;
    }
    return top;
}


function moveTrUp(curObj, prevObj) {
    prevObj.insertAfter(curObj);
}

function moveTrDown(curObj, nextObj) {
    nextObj.insertBefore(curObj);
}

function deleteTr(curObj) {
    curObj.remove();
}

