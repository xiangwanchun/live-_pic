/**
 * Created by Administrator on 15-1-20.
 */

//域名地址
//MOYUN_HOST = 'http://telive.moyuntv.com:82';
MOYUN_HOST = 'http://www.wayu.cn';

//上传插件地址
myUploadifySwfUrl = MOYUN_HOST + '/resources/js/uploadify/uploadify.swf?ver=' + Math.random();
myUploaderUrl = MOYUN_HOST + '/upload/uploadPic?ver=' + Math.random();

//缩略图切割地址
myThumbSubUrl = MOYUN_HOST + '/picture/thumb';

//uediter地址
window.UEDITOR_HOME_URL = MOYUN_HOST +  '/resources/js/ueditor/';

//弹窗图片库地址
myPicLibUrl = MOYUN_HOST + '/picture/popupList';
//弹窗栏目地址
myCatalogUrl = MOYUN_HOST + '/catalog/getCataByZtree';
//弹窗奖品地址
myPrizeListUrl = MOYUN_HOST + '/prize/getDialogList';
//弹窗电商商品地址
myEcommerceListUrl = MOYUN_HOST + '/goods/asyncGetListSingle';
//语音弹窗
myLinkUrl = MOYUN_HOST + '/chat/asyncGetList';
getChatInfoUrl = MOYUN_HOST + '/chat/getChatInfo';
//活动弹窗
myContentListUrl = MOYUN_HOST + '/content/asyncGetList';
//字段管理弹窗
myFiledsListUrl = MOYUN_HOST + '/Form/popupList';


