/**
 * Created by Administrator on 14-11-26.
 */
$(document).ready(function(){
    var doc=document,
        inputs=doc.getElementsByTagName('input'),
        supportPlaceholder='placeholder'in doc.createElement('input'),

        placeholder=function(input){
            var text=input.getAttribute('placeholder'),
                defaultValue=input.defaultValue,
                type=input.getAttribute('type');
            if(type==='password'){
                input.setAttribute("type","text");
            }
            if(defaultValue==''){
                input.value=text
            }
            input.onfocus=function(){
                if(input.value===text)
                {
                    if(type=="password"){
                        this.setAttribute("type","password");
                    }
                    this.value=''
                }

            };
            input.onblur=function(){
                if(input.value===''){
                    if(type=="password"){
                        this.setAttribute("type","text");
                    }
                    this.value=text
                }

            }
        };

    if(!supportPlaceholder){
        for(var i=0,len=inputs.length;i<len;i++){
            var input=inputs[i],
                text=input.getAttribute('placeholder');
            if(input.type==='text'|| input.type==='password'){
                if(text){placeholder(input)}
            }
        }
    }
});