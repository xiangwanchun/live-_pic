


// 创建子菜单

$.fn.build_menu = function(parentid) {
    var url;
    $('#daohang_lan li').find("a").removeClass('current');
    $('#menu_' + parentid).find("a").addClass('current');
    var menu_html = '<div class="left">'+
        '<div class="panel" style="display: block;">'+
        '<div class="easyui-panel panel-body panel-body-noheader" style="padding: 5px; width: 161px;" title="">'+
        '<ul class="easyui-tree tree">';
    for(i in menus.data){
        if(menus.data["m_"+parentid].url == menus.data[i].url){
           url  = menus.data[i].url ;                  
        }
        if(menus.data[i].parent_id == parentid){
            var a_html = '';
            if(menus.data[i].id==18){
                a_html = 'target="frame_body" onclick="cookiejilu(this,'+parentid+')"  href="'+menus.data[i].url+'"';
                menu_html += '<li data-options="state:\'closed\'"><span><a '+a_html+'>'+menus.data[i].name+'</a></span><ul>'+get_catalog(0, 3)+'</ul></li>';   
            }else if(menus.data[i].url&&!menus.data[i].childids){
                a_html = 'target="frame_body" onclick="cookiejilu(this,'+parentid+')"   href="'+menus.data[i].url+'"';
                menu_html += '<li><a '+a_html+'>'+menus.data[i].name+'</a></li>';    
            }
            else if(menus.data[i].childids && menus.data[i].childids.length > 0){
                menu_html += '<li><span>'+menus.data[i].name+'</span><ul>'+get_sub_menu(menus.data[i].id, 3)+'</ul></li>';   
            }else{
            
            }                                       
        }
    } 
    menu_html +="</ul</div></div></div>";   
    $(this).html(menu_html);
    $('.easyui-tree').tree({    
    }); 

    $(".easyui-tree").children("li").find(".tree-title").children("a").each(function(i){
        if(i == 0){
            $(this).css('color', '#333333');
//            $(this).parent('.tree-node').addClass('tree-node-selected');
        }
        if($(this).attr("href")==url){
            $(this).parents(".tree-node").addClass("tree-node-selected");
            $(".second_level").text($(this).html());
        }
    });
       $(".tree-title").click(function(){
           var url = $(this).children("a").attr("href");
           $('#frame_body').attr('src',url);
           $(this).parents('.easyui-tree').find('.tree-title').find('a').removeAttr('style');
           $(this).find('a').css('color', '#333');
       });

    // level 菜单级数 默认顶部为1级
    function get_sub_menu(parentid, level){
        var html = '';
        data = menus.data;     
        for(var key in data){
            if (data[key].parent_id == parentid && data[key].display==1) {
                var a_html = "";
                if(data[key].url){
                    a_html = 'target="frame_body" onclick="cookiejilu(this, '+parentid+')"  href="'+menus.data[key].url+'"';
                }
                html +=  '<li><a '+a_html+'>'+data[key].name+'</a></li>'
            }
        }
        return html;
    }

    // level 菜单级数 默认顶部为1级
    function get_catalog(parentid, level){
        var html = '';
        data = catalogs.data;
        for(var key in data){
            if (data[key].parent_id == parentid) {             
                var a_html = "";
                if(data[key].childids && data[key].childids.length > 0){
                    a_html = 'target="frame_body" onclick="cookiejilu(this,18)"  href="'+data[key].url+'"';
                    html += '<li data-options="state:\'closed\'"><span><a '+a_html+'>'+data[key].name+'</a></span><ul>'+get_catalog(data[key].id, 2)+'</ul></li>';   
                }                  
                else if(data[key].url){
                    a_html = 'target="frame_body"  onclick="cookiejilu(this,18)"  href="'+data[key].url+'"';
                    html +=  '<li><a '+a_html+'>'+data[key].name+'</a></li>'   
                }                
            }
        }
        return html;
    }



function callbackSetCatalogIcon(obj, catalogId){
    if ($('#catalog_'+catalogId).is(":visible")) {
        $(obj).removeClass("cunfold");
    } else {
        $(obj).addClass("cunfold");
    }
}

//左侧导航
$.fn.tabs = function() {
	$(this).children().click(function() {
	$(this).addClass(".current").siblings().removeClass(".current");
        var hash_url = $(this).find("a").attr("href");
        var nowid = '';
        for(i in menus.data){
            if(menus.data[i].parent_id == 0 && menus.data[i].url == hash_url){
                nowid = menus.data[i].id;
                $(".one_level").text(menus.data[i].name);              
                break;
            }
        }
        $('#left').build_menu(nowid);            
        // $("_easyui_tree_"+)
        $(".tree-title").click(function(){
                var isopen=$(this).children("a").length;
                if(isopen==1){
                    $(".one_level").text($(".nav.current").text());
                    $(".second_level").text($(this).text());
                }
            });
            return true;
	});
}

}

$.fn.bigPicPreview = function (host) {

	if(typeof($('#bigPicPreview').html()) == 'undefined'){
		$('body').append('<div id="bigPicPreview" style="max-width:310px;max-height:310px;position:absolute;padding:3px;background-color: white;border:2px solid #ddd;display:none;z-index: 1001;"><div style="position:absolute;top:0;left:0;width:400px;height:400px;opacity:0.5;filter:alpha(opacity=50);"></div></div>');
	}
	$(this).each(function(){
		$(this).mouseover(function(){
			if($(this).val() == '')
			    return;
		    var img = '<img src= "'+host+$(this).val() + '" style="max-width:300px;max-height:300px;"/>';
			$('#bigPicPreview img').remove();
			$('#bigPicPreview').append(img);
            $('#bigPicPreview').show();
		});
		$(this).mousemove(function(e){
			var iWidth = document.documentElement.offsetWidth - e.pageX;
			$('#bigPicPreview').css('top', e.pageY + 20 + "px");
			$('#bigPicPreview').css('left', (iWidth < $('#bigPicPreview').width() + 10 ? e.pageX - $('#bigPicPreview').width() - 10 : e.pageX + 10) + "px");
		});

		$(this).mouseout(function(){
                $('#bigPicPreview').hide();
		});
	});
    }