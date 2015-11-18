$(document).ready(function(){
    $('.checkbox-all').click(function(){
        var checked=$(this)[0].checked;
        if(checked){
            changeCB(true);
        }else{
            changeCB(false);
        }
    });
    $(".checkbox-one").click(function(){
        var checked=$(this)[0].checked;
        if(!checked){
            $('.checkbox-all')[0].checked=false;
        }
    });
})
function changeCB(str){
    $(".checkbox-one").each(function(){
        $(this)[0].checked=str;
    })
}