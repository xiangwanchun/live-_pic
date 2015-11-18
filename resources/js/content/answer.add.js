var Answers = {
    getMaxOptions:8,
    getMaxQues:400,
    getMinOptions:2,
    init:function(){
        this.addQues();
        this.selectedAnswer();
        this.deleteOptions();
        this.deleteAnswer();
    },
    getEngCode:function(){
        var code = new Array('A','B','C','D','E','F','G','H','I','J');
        return code
    },
    checkQuesNum:function(){
        //检查题数据是否超过限定
        var quesNum = $('.answers_one').length;
        if(quesNum < this.getMaxQues)
            return true;
        return false;
    },
    checkOptionsNum:function(dom){
        //检查当前题选项是否超过限定
        var optionNum = dom.children('div').length;
        if(optionNum < this.getMaxOptions)
            return true;
        return false;
    },
    addQues:function(){
        //增加题
        $('#answers_add_question').on('click',function(){
            if(Answers.checkQuesNum()){
                var quesNum = $('.answers_one').length;
                var quesHtml = Answers.getQuesHtmlStr();
                var quesNextNum = quesNum + 1;
                quesHtml = quesHtml.replace(/\{ques_index\}/g, quesNextNum);
                quesHtml = quesHtml.replace(/\{ques_option_index\}/g, quesNum);
                $('#answers_box').append(quesHtml);
                //绑定事件
                $('#answers_box').find('.answers_add_option:last').bind('click', Answers.addOptions());
                $('.icon-sure-no').bind('click', Answers.selectedAnswer());
                $('#answers_box').find('.answers_add_option:last').find('.icon-sure-del').bind('click', Answers.deleteOptions());
                //初始化上传控件
                uploadComponent('btn_local_upload_qu'+quesNextNum, 'img_ques_probar_'+(quesNextNum), 'setAnswersPic', ComId, quesNextNum);
                //让选择图片按钮显示在最上层
                $('#btn_local_upload_qu'+quesNextNum).css({'z-index':'9999'});
            }else{
                $.messager.alert('提示', '您已超出题目的最大新建数！');
            }
            return false;
        });
    },
    addOptions:function(ele, is_first){
        if (is_first) {
            quesNum = $(ele).parent().parent().parent().find('.lab > span').html();
        } else {
            quesNum = $(ele).parent().parent().find('.lab > span').html()
        }
        var ansParentDom = $(ele).parent('.answers_options');
        var optionNowNum = ansParentDom.children('div').length;
        if (Answers.checkOptionsNum(ansParentDom)) {
            var optionHtml = Answers.getOptionHtmlStr();
            var endCode = Answers.getEngCode();
            optionHtml = optionHtml.replace('{option_code}', endCode[optionNowNum]);
            optionHtml = optionHtml.replace('{option_index}', quesNum - 1);
            ansParentDom.append(optionHtml);
            //绑定事件
            $(ele).parent().find('.selected_confirm_answer').bind('click', Answers.selectedAnswer());
            $(ele).parent().find('.icon-sure-del').unbind().bind('click', Answers.deleteOptions());
        } else {
            $.messager.alert('提示', '您已超出题目选项的最大新建数！');
        }
        return false;
    },
    selectedAnswer:function(){
        //正确答案处理
        $('.selected_confirm_answer').on('click', function(){
            //当前题Dom
            var answersNewDom = $(this).parents('.answers_one');
            //当前题在所有题中的索引
            var boxIndex = $('.answers_one').index(answersNewDom);
            //更改正确定答案值
            $('#answer_confirm_val_'+(boxIndex + 1)).val($(this).prev().val());
            //样式设置，选中后变样式
            answersNewDom.find('.selected_confirm_answer').removeClass('icon-sure-answers').addClass('icon-sure-no');
            $(this).removeClass('icon-sure-no').addClass('icon-sure-answers');
        });
    },
    deleteOptions:function(){
        //删除选项
        // 先解绑 在绑定
        $('.icon-sure-del').unbind().on('click', function(){
            //数量判断
            var optionsDom = $(this).parents('.answers_options');
            var optionsNum = optionsDom.children('div').length;
            if(optionsNum <= Answers.getMinOptions){
                $.messager.alert('提示', '选项不能少于'+ Answers.getMinOptions + '个');
                return false;
            }
            //如果删除的是选中项   那么则清除答案
            if($(this).prev().hasClass('icon-sure-answers')){
                var i = $('.answers_one').index($(this).parents('.answers_one'))+1;
                $('#answer_confirm_val_' +i).val('');
            }
            //清除该选项
            var oneOptionDom = $(this).parent().parent().parent().remove();
            //修改编号
            var engCode = Answers.getEngCode();
            optionsDom.children('div').each(function(index , dom){
                $(this).find('label').html('选项' + engCode[index]);
            });
        });
    },
    deleteAnswer:function(){
        $('#clear_answers').on('click', function(){
            if($('#answers_box').find('.answers_one').length <= 1){
                $.messager.alert('提示', '问题不能少于1个');
                return false;
            }
            $('#answers_box').find('.answers_one:last').remove();
        });
    },
    checkAnswerForm:function(){
        //问题表单验证
        var status = true;
        var msg = '';
        $('input[name="title[]"]').each(function(index){
            console.log('sdfsdfsdf');
            if($(this).val() == ''){
                status = false;
                msg = '请填写第'+ (index + 1) +'题的标题';
                return false;
            }
        });
        $('input[name="answer_pic[]"]').each(function(index){
            if($(this).val() == ''){
                status = false;
                msg = '请上传第'+ (index + 1) +'题的图片';
                return false;
            }
        });
        $('input[name="answer[]"]').unbind().each(function(index){
            if($(this).val() == ''){
                status = false;

                msg = '请选择第'+ (index + 1) +'题答案';
                return false;
            }
        });
        $('.answers_one').each(function(index){
            $(this).find('input[name="options['+ index +'][]"]').each(function(i){
                if($(this).val() == ''){
                    status = false;
                    msg = '请填写第'+ (index+1) +'题第'+ (i+1) +'选项的说明';
                    return false;
                }
            });
        });
        // 排除重复值
        $('.answers_one').each(function(index) {
            $(this).find('div.answers_options').each(function(i) {
                optionArr = new Array();
                $(this).find(":text").each(function (j) {
                        ov = $.trim($(this).val());
                        if ($.inArray(ov, optionArr) > -1) {
                            status = false;
                            msg = '第' + (index + 1) + '题有重复值\'' + ov+'\'';
                            return false;
                        }
                        optionArr.push(ov);
                    }
                );
            });
        });

        var rtn = {code:status, msg:msg};
        return rtn;
    },
    getOptionHtmlStr:function(){
        var str = ' <div class="h30 wr100">\
                <label class="lab_s ">选项{option_code}：</label>\
            <div class="rows-auto-right">\
                <div class="right-auto_s">\
                <input type="text" class="input h25 w260px" name="options[{option_index}][]">\
                <span class="icon-sure icon-sure-no selected_confirm_answer" title="勾选正确答案"></span>\
            <span class="icon-sure icon-sure-del" title="删除该项选项"></span>\
            </div>\
            </div>\
            </div>';
        return str;
    },

    getQuesHtmlStr:function(){
        var str = '<div class="answers_one">\
                <div class="rows-auto h40">\
                <label class="lab">互动问题<span>{ques_index}</span>：</label>\
            <div class="rows-auto-right">\
                <div class="right-auto">\
                <p class="hint-p">推荐尺寸400*300</p>\
            </div>\
            </div>\
            </div>\
            <div class="rows-auto pt10 mgb15">\
                            <label class="lab">问答标题：</label>\
                            <div class="rows-auto-right">\
                                <div class="right-auto">\
                                    <div class="w300px fl">\
                                        <input type="text" class="input h25 w300px" name="title[]" datatype="*10-200" errormsg="请填写问题标题，建议字符10-200！">\
                                        <span class="Validform_checktip"></span>\
                                    </div>\
                                    <div class="w300px fl pdl20">\
                                    <!--<a class="btn btn-style h25 w70px fl">选择已有</a>-->\
                                    <!--<input type="checkbox" class="input h25 w15px fl mgl10 bdnonoe" id="toupiao-title"><label class="mgl2" for="toupiao-title">创建完成后单独保存活动</label>-->\
                                </div>\
                                <div class="clear"></div>\
                            </div>\
                        </div>\
                </div>\
               <div class="rows-auto pt10 mgb15">\
                            <label class="lab">问答描述：</label>\
                            <div class="rows-auto-right">\
                                <div class="right-auto">\
                                    <div class="w300px fl">\
                                        <textarea name="answer_desc[]" style="width: 560px; height: 80px; border: solid 1px #ccc; border-radius: 7px;" class="text"></textarea>\
                                    </div>\
                                    <div class="clear"></div>\
                                </div>\
                            </div>\
               </div>\               \
            <div class="rows-auto mgb10">\
                <div class="w300px h150px bge5e5e5 relative fl">\
                    <a class="btn btn-style w70px h25  marginleft10" id="btn_local_upload_qu{ques_index}" readonly="readonly" style="z-index: 9999">上传图片</a>\
                    <img src="" width="300" height="150" style="position: absolute;top: 0; left: 0;; z-index: 1" id="answer_img_{ques_index}">\
                    <input type="hidden" name="answer_pic[]" id="answer_pic_{ques_index}" />\
                    <input type="hidden" name="answer[]" id="answer_confirm_val_{ques_index}"/>\
                </div>\
            </div>\
            <div class="w480px fr relative answers_options">\
                <div class="h30 wr100">\
                <label class="lab_s ">选项A：</label>\
            <div class="rows-auto-right">\
                <div class="right-auto_s">\
                <input type="text" class="input h25 w260px" name="options[{ques_option_index}][]">\
                <span class="icon-sure icon-sure-no selected_confirm_answer" title="勾选正确答案"></span>\
            <span class="icon-sure icon-sure-del" title="删除该项选项"></span>\
            </div>\
            </div>\
            </div>\
            <div class="h30 wr100">\
                <label class="lab_s ">选项B：</label>\
            <div class="rows-auto-right">\
                <div class="right-auto_s">\
                <input type="text" class="input h25 w260px" name="options[{ques_option_index}][]">\
                <span class="icon-sure icon-sure-no selected_confirm_answer" title="勾选正确答案"></span>\
            <span class="icon-sure icon-sure-del" title="删除该项选项"></span>\
            </div>\
            </div>\
            </div>\
            <a class="w70px h25 btn btn-style btn_wenda_add_select answers_add_option" onclick="Answers.addOptions(this)" >增加选项</a>\
            </div>\
            <div class="clear"></div>\
            </div>\
            <div style="width:580px;" id="img_ques_probar_{ques_index}"></div>\
            <div class="clear"></div>\
            </div>';
        return str;
    }

};