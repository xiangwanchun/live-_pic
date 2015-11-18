

$(function(){

	$("#pagination").css({
	    'float':'right',
	})

	$(".page #page_number").css({
	    'color':'#999',
	})


	$("#pagination").css({
	    'color':'#099acf',
	})

	$("#pagination a").css({
	    'color':'#099acf',
	})

	$("#pagination").find(".current").css({
	    'color':'green',
	})

    function frame_load(url, refresh) {
        // 链接锚点
        if (refresh) {
            ajax_load('page_right_inner', url);
        } else {
            var re = /^http:\/\/([\w-]+\.)+[:\w-]+[^\/]/;
            url = url.replace(re, '');
            window.location = location.pathname + "#" + url;
            return false;
        }
    }


    // 下拉菜单js
    $('.son_ul').hide(); //初始ul隐藏
    $('.select_box span').click(function(){ //鼠标移动函数
        $(this).parent().find('ul.son_ul').slideDown();  //找到ul.son_ul显示
        $(this).parent().find('li').hover(
	        function(){$(this).addClass('hoverselect')},
	        function(){$(this).removeClass('hoverselect')}
        ); //li的hover效果
        $(this).parent().hover(
            function(){},
            function(){
                 $(this).parent().find("ul.son_ul").slideUp();
            }
        );
    });
    $('.son_ul li').click(function(){
        var title = $(this).html();
        var status = $(this).attr('status');
        var obj = $(this).parent().parent().find('span');
        obj.attr('status',status);
        obj.html(title);

    });


	// // 选中
	// $(".chk_tr").click(function(){

	// 	$("tr").css({
	// 		"background":"none"
	// 	});
	// 	$(this).css({
	// 		"background":"#576C76"
	// 	});
	// });

	// //选择  chk_tr以外的事件
	// $(".chk_tr").click(function(e) {
	//     e.stopPropagation();
	// });
	// $(document).click(function() {
	//     if (!$(".chk_tr").hasClass("hide")) {
	// 	     $("tr").css({
	// 			"background":"none"
	// 		});
	//     }
	// });



})

