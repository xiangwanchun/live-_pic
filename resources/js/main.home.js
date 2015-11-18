$(document).ready(function(e) {
    $(".nav_item .nav_name").click(function(){
		var icon = $(this).find(".icon");
		if(icon.hasClass("open")){
			icon.removeClass("open");	
		}else{
			icon.addClass("open");	
		}
        $(".nav_name").removeClass("current");
        $(this).addClass("current");
		$(this).next().animate({height: 'toggle', opacity: 'toggle'}, "slow");
		//return false;
	});
	$(".nav_item").find("ul>li>a").click(function(){
		$(".nav_item").find("a").removeClass("checked");
		$(this).addClass("checked");
	});
	var username = getParam("username");
	if(username == "admin"){
		//$(".other_panel").hide();
	}else{
		//$(".admin_panel").hide();		
	}
});
function showBg(){
	$('body').append('<div id="hide_top"></div>')
	$('body').append('<div id="hide_left"></div>')
}
function hideBg(){
	$("#hide_top,#hide_left").remove();
}