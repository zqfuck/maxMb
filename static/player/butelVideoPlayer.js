// JavaScript Document
function zVideoPlayerInit( divName, paramObject ){
	
	paramObjectForReset = paramObject;
	butelVideoH5PlayerInit( divName, paramObject );
}
var butelPlayerName;
function butelVideoPlayerBarrage( txt ){
	//var butelVideoPlayer = eval( "liveStream" );
	liveStream.barrageText( txt );
}

var isDebugMode = true;//调试模式

var butelPlayerLoadTime = new Date();

function butelVideoH5PlayerInit( divName, paramObject ){
	var playerContainer = document.getElementById( divName );
	if( !playerContainer )return;
	butelPlayerName = divName;
	setAttributes( paramObject );
	initPlayerDiv( paramObject.width, paramObject.height ,paramObject.videoposter);
	try{
		if( paramObject.playerReportUrl )reportLoad( paramObject );
	}
	catch( e ){
		showLog( "汇报加载事件异常" );
	}
	playMovie();	
}

function butelVideoResetSource( url ){
	var playerContainer = document.getElementById( butelPlayerName );
	playerContainer.innerHTML = "";
	paramObjectForReset.HD = null;
	delete paramObjectForReset.HD;
	paramObjectForReset.LD = null;
	delete paramObjectForReset.LD;
	paramObjectForReset.SD = url
	butelVideoSettings = {};
	zVideoPlayerInit( butelPlayerName, paramObjectForReset );
}

var butelVideoSettings = {};
var isM3u8;
var paramObjectForReset;

function initPlayerDiv( videowidth, videoheight ,videoposter){
	var divForPlayer = document.getElementById( butelPlayerName );
	
	if( !videowidth ){
		showLog( "必填参数缺损" );
		return;
	}
	var str = '<video id="liveStream" style="background-color:#000000;object-fit: fill" ';
	if(  ( typeof( videowidth ) == "string" ) ){
		str += 'width="' + videowidth + '" ';
		str += 'height="' + videoheight + '" ';
	}
	else{
		str += 'width="' + videowidth + 'px" ';
		str += 'height="' + videoheight + 'px" ';
	}
	str += 'src = "' + butelVideoSettings.usingUrl + '" ';
	str += 'poster = "' + videoposter + '" ';
	isM3u8 = butelVideoSettings.usingUrl.toLocaleLowerCase().indexOf( ".m3u8" ) >= 0;
	if( isM3u8 ){
		str += 'type="application/x-mpegURL" ';
	}
	else{
		str += 'type="video/mp4" webkit-playsinline ';
	}
	if( butelVideoSettings.autoplay )str += 'autoplay ';
	str += 'controls   onpause="onVideoPause()" onplay="onVideoPlay(butelVideoSettings.usingUrl)" x5-playsinline="" playsinline="" webkit-playsinline=""></video>';
	divForPlayer.innerHTML = str;
}

function haveIsTrue( value, defaultValue ){//根据传入值，得到一个符合要求的布尔值
	if( value === true || value == "true" )return true;
	else if( value === false || value == "false" )return false;
	else if( defaultValue === true )return true;
	return false;
}

function showLog( str ){
	console.log( str );
}

function setAttributes( obj ){	
	butelVideoSettings.fsButton = haveIsTrue( obj.fsButton, true );
	butelVideoSettings.logoButel = haveIsTrue( obj.logoButel, true );
	butelVideoSettings.dbClick = haveIsTrue( obj.dbClick );
	
	if( obj.AD ){//广告
		butelVideoSettings.AD = obj.AD;
		butelVideoSettings.adTime = 30;
		if( obj.adTime > 0 )butelVideoSettings.adTime = obj.adTime;
		butelVideoSettings.allowSkipAD = haveIsTrue( obj.allowSkipAD );
	}
	
	butelVideoSettings.HD = obj.HD;
	butelVideoSettings.SD = obj.SD;
	butelVideoSettings.LD = obj.LD;
	
	butelVideoSettings.firstChoise = 0;
	if( obj.firstChoise == 1 || obj.firstChoise == 2 ) butelVideoSettings.firstChoise = obj.firstChoise;
	
	butelVideoSettings.ctype = 3;
	if( obj.ctype == 1 || obj.ctype == 2 )butelVideoSettings.ctype = obj.ctype;
	
	butelVideoSettings.autoplay = haveIsTrue( obj.autoplay, true );
	butelVideoSettings.loop = haveIsTrue( obj.loop );
	
	butelVideoSettings.waterMark = obj.waterMark;
	
	//butelVideoSettings.playerName = "ButelPlayer";
	//if( obj.playerName )butelVideoSettings.playerName = obj.playerName;
	
	butelVideoSettings.playerReportUrl = obj.playerReportUrl;	
	if( obj.reportCurrentTime )butelVideoSettings.reportCurrentTime = obj.reportCurrentTime;
	
	chooseUsingUrl();
	if( isDebugMode )showLogAll( obj );
}

function showLogAll( obj ){
	showLog( "打印配置项：" );
	showLog( "width：传入值＝" + obj.width );
	showLog( "height：传入值＝" + obj.height );
	showLog( "AD：传入值＝" + obj.AD + ",生效值＝" + butelVideoSettings.AD );
	showLog( "adTime：传入值＝" + obj.adTime + ",生效值＝" + butelVideoSettings.adTime );
	showLog( "allowSkipAD：传入值 = " + obj.allowSkipAD + ",生效值＝" + butelVideoSettings.allowSkipAD );
	showLog( "SD：传入值＝" + obj.SD + ",生效值＝" + butelVideoSettings.SD );
	showLog( "HD：传入值＝" + obj.HD + ",生效值＝" + butelVideoSettings.HD );
	showLog( "LD：传入值＝" + obj.LD + ",生效值＝" + butelVideoSettings.LD );
	showLog( "firstChoise：传入值＝" + obj.firstChoise + ",生效值＝" + butelVideoSettings.firstChoise );
	showLog( "ctype：传入值＝" + obj.ctype + ",生效值＝" + butelVideoSettings.ctype );
	showLog( "autoplay：传入值＝" + obj.autoplay + ",生效值＝" + butelVideoSettings.autoplay );
	showLog( "loop：传入值＝" + obj.loop + ",生效值＝" + butelVideoSettings.loop );
	showLog( "dbClick：传入值＝" + obj.dbClick + ",生效值＝" + butelVideoSettings.dbClick );
	showLog( "fsButton：传入值＝" + obj.fsButton + ",生效值＝" + butelVideoSettings.fsButton );
	showLog( "logoButel：传入值＝" + obj.logoButel + ",生效值＝" + butelVideoSettings.logoButel );
	showLog( "renderAccelerate：传入值＝" + obj.renderAccelerate + ",生效值＝" + butelVideoSettings.renderAccelerate );
	showLog( "waterMark：传入值＝" + obj.waterMark + ",生效值＝" + butelVideoSettings.waterMark );
	showLog( "playerName：传入值＝" + obj.playerName + ",生效值＝" + butelVideoSettings.playerName );
	showLog( "playerReportUrl：传入值＝" + obj.playerReportUrl + ",生效值＝" + butelVideoSettings.playerReportUrl );
	showLog( "retryStream：传入值＝" + obj.retryStream + ",生效值＝" + butelVideoSettings.retryStream );
	showLog( "reportCurrentTime：传入值＝" + obj.reportCurrentTime + ",生效值＝" + butelVideoSettings.reportCurrentTime );
	showLog( "***********************************" );
}

function chooseUsingUrl(){
	var urlCount;
	if( butelVideoSettings.SD ){
		urlCount ++;
		butelVideoSettings.usingUrl = butelVideoSettings.SD;
	}
	if( butelVideoSettings.HD ){
		urlCount ++;
		if( !butelVideoSettings.usingUrl )butelVideoSettings.usingUrl = butelVideoSettings.HD;
	}
	if( butelVideoSettings.LD ){
		urlCount ++;
		if( !butelVideoSettings.usingUrl )butelVideoSettings.usingUrl = butelVideoSettings.LD;
	}
	if( urlCount == 1 ){
		butelVideoSettings.hasOnlyUrl = true;
		return;
	}

	if( butelVideoSettings.firstChoise == 0 && butelVideoSettings.SD ) butelVideoSettings.usingUrl = butelVideoSettings.SD;
	else if( butelVideoSettings.firstChoise == 1 && butelVideoSettings.HD ) butelVideoSettings.usingUrl = butelVideoSettings.HD;
	else if( butelVideoSettings.firstChoise == 2 && butelVideoSettings.LD ) butelVideoSettings.usingUrl = butelVideoSettings.LD;
	
	//对于传了两个地址用逗号拼接的情况，在手机上优先选m3u8
	if( butelVideoSettings.usingUrl.indexOf( "," ) >= 0 ){
		var urlsArray = butelVideoSettings.usingUrl.split( "," );
		for( var i = 0; i < urlsArray.length; i++ ){
			if( urlsArray[i].toLowerCase().indexOf( ".mp4" ) > 0 ){
				butelVideoSettings.usingUrl = urlsArray[i];
			}
			else if( urlsArray[i].toLowerCase().indexOf( ".m3u8" ) > 0 ){
				butelVideoSettings.usingUrl = urlsArray[i];
				break;
			}
		}
	}
}

function playMovie(){
	if( isM3u8 ){
		//listStreams(teststreams, butelPlayerName );
		document.getElementById('liveStream').play();
		/*document.getElementById('liveStream').mediaelementplayer({
			success: function(media, node, player) {
				$('#' + node.id + '-mode').html('mode: ' + media.pluginType);
				player.play();
			}
		});*/
	}
	else{
		MediaElement( "liveStream", {success: function(me) {
			if( butelVideoSettings.autoplay ){
				beginPlayTime = new Date();
				me.play();
			}
			me.addEventListener('timeupdate', function() {
				
			}, false);
			/*document.getElementById('pp')['onclick'] = function() {
				if (me.paused)
					me.play();
				else
					me.pause();
			};*/
		}});
	}
}

function listStreams(list, container) {
	for(var i=0; i<list.length; i++) { var entry = document.createElement("li");
		entry.innerHTML = "<a href='#' onclick='return loadStream(\""+list[i].file+"\")'>"+list[i].title+"</a>";
		document.getElementById(container).appendChild(entry);
	}
}
function userSubmit() {
   loadStream(document.getElementById('userInput').value);
}
function loadStream(url) {
	$('video')[0].player.setSrc(url);
	$('video')[0].player.play();
}

/**************************************************************************************************************************************/
//以下，为统计汇报相关

var host = "https://livet.v114.com";
var hostApi = "https://livetapi.v114.com";
var url_live = host+'/mediacloud/default/online-data';
//var url_live = 'http://live.v114.com/mediacloud/default/online-data';
var online_id = 0;      //数据返回id
var timeHz = 1;         //时间频率
var mid = 0;            //视频id
var t,playingReportTimeoutId;
var playPvUp = true;

/**
 * 点击播放;
 */
var playingReportTimeoutId;

function onVideoPlay(videoUrl) {
    //asdasd
    var obj = {};
    obj.url = videoUrl;
    obj.playPvUp = playPvUp;
   // reportToServer(obj);
    playPvUp = false;
    playingReportTimeoutId = setTimeout(onVideoPlay, 60000,videoUrl);
}
/**
 * 点击暂停;
 */
function onVideoPause(){
    clearTimeout(playingReportTimeoutId);
}
/**
 * 服务器接口
 */

