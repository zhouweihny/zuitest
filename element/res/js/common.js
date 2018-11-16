var conf = 0; //控制服务，0表示本地假数据，1表示远程服务器数据
var srvMap = (function(){
  //var srcPref = ["ui/json/", "http://localhost:8080/wgw/"];//本机
  // var srcPref = ["ui/json/", "http://192.168.96.68:8080/"];//
  var srcPref = ["json/", ""];//  远程服务器配置为空即可
  var dataArray = [
		{

		},
		{

		}
  ];
  
  return {
    add: function(uid, mockSrc, srvSrc) {
      dataArray[0][uid] = srcPref[conf] + mockSrc;
      dataArray[1][uid] = srcPref[conf] + srvSrc;
    },
    get: function(uid) {
      return dataArray[conf][uid];
    },
    getAppPath:function(){
      return srcPref[conf];
    },
    dataArrays:function(){
      return dataArray[conf];
    }
  };
})(jQuery);
window.dataArray = srvMap.dataArrays();

function dom (id) {
	return document.getElementById(id);
}
function domClass (searchClass,node,tag) {
	var classElements = new Array(); 
	if ( node == null ) 
		node = document; 
	if ( tag == null ) 
		tag = '*'; 
	var els = node.getElementsByTagName(tag); 
	var elsLen = els.length; 
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"); 
	for (var i = 0, j = 0; i < elsLen; i++) { 
		if ( pattern.test(els[i].className) ) { 
			classElements[j] = els[i]; 
			j++; 
		} 
	} 
	return classElements; 
}

(function($){
  $.extend({
    /*
    * post方式提交数据，适用于大数据提交。返回的JSON要符合规范。
    * 引号不能去掉。完整写法：{"key" , "value"}
    */
    PostJson: function(url, datas , callback) {
      $.ajax({
        url: url,
        type: "POST",
        data : datas +"&_=" + (new Date()).getTime(),
        cache: false,
        dataType: "json",
        timeout: 60000,
        beforeSend: function (xhr) {
          xhr.overrideMimeType("text/plain; charset=utf-8");
        },
        success: function(json) {
          callback("success", json);
        },
        error: function(e) {
          if(e.statusText == 'timeout'){
            callback("error", {"rtnCode": "-100", "rtnMsg": "连接超时！"});
          }else if(e.status == 500){
            callback("error", null);
            alert(0, "服务器错误");
          }else if(e.statusText == 'error'){
            alert("系统错误，请稍后再试！");
            callback("error", null);
          }else if(e.statusText.indexOf("NetworkError") !== -1){
            alert("网络连接错误，请稍后再试！");
          }else{
            callback("error", null);
          }
        },
        complete:function(XMLHttpRequest,status){ 
          var sessionstatus = XMLHttpRequest.getResponseHeader("sessionstatus");
          if(sessionstatus && sessionstatus == "timeout") {
            //如果超时就处理 ，指定要跳转的页面(比如登陆页)
            setTimeout(function(){
              alert("连接超时，请重新登录！");
            }, 1000)
            window.location.href = common_js_basPath+"/login.do";
          }
        }
      });
    },
		AjaxHtml: function(url, datas , callback) {
		  $.ajax({
		    url: url,
		    type: "GET",
		    data : datas +"&_=" + (new Date()).getTime(),
		    cache: false,
		    dataType: "html",
		    timeout: 60000,
		    beforeSend: function (xhr) {
		      xhr.overrideMimeType("text/plain; charset=utf-8");
		    },
		    success: function(html) {
		      if(window.conf == 0){
		        setTimeout(function(){
		          callback("success", html);
		        }, 1000)
		      }else{
		        callback("success", html);
		      }
		    },
		    error: function(e) {
		      if(e.statusText == 'timeout'){
		        callback("error", {"rtnCode": "-100", "rtnMsg": "连接超时！"});
		      }else{
		        callback("error", null);
		      }
		    },
		    complete:function(XMLHttpRequest,status){ 
		        
		    }
		  });
		}
  });
})(jQuery);

/*
handlebars扩展
eg:
$('#content').temp( $('#template'),  { name: "Alan" } );
$('#content').temp( 'string' ,  { name: "Alan" } );
*/
;(function($){
var compiled = {};
$.fn.temp = function(template, data) {
  if(template instanceof jQuery){
    template = template.val();
  }
  compiled[template] = Handlebars.compile(template);
  this.html(compiled[template](data));
  return this;
};

$.fn.tempAppend = function(template, data) {
  if(template instanceof jQuery){
    template = template.val();
  }
  compiled[template] = Handlebars.compile(template);
  this.append(compiled[template](data));
  return this;
};

$.fn.tempPrepend = function(template, data) {
  if(template instanceof jQuery){
    template = template.val();
  }
  compiled[template] = Handlebars.compile(template);
  this.prepend(compiled[template](data));
  return this;
};
})(jQuery);

//阻止事件冒泡
function stopEvent(e){
  if(e && e.stopPropagation ){
    e.stopPropagation();
  }else{
    window.event.cancelBubble = true;
  }
}

//加法
function zuiaccAdd(arg1,arg2){
  var r1,r2,m;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2))
  return (arg1*m+arg2*m)/m;
}
//减法
function zuisubtr(arg1,arg2){
  var r1,r2,m,n;
  try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
  try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
  m=Math.pow(10,Math.max(r1,r2));
  n=(r1>=r2)?r1:r2;
  return ((arg1*m-arg2*m)/m).toFixed(n);
}
//除法函数，用来得到精确的除法结果  
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。  
//调用：accDiv(arg1,arg2)  
//返回值：arg1除以arg2的精确结果  
function zuiaccDiv(arg1,arg2){  
  var t1=0,t2=0,r1,r2;  
  try{t1=arg1.toString().split(".")[1].length}catch(e){}  
  try{t2=arg2.toString().split(".")[1].length}catch(e){}  
  with(Math){  
    r1=Number(arg1.toString().replace(".",""));  
    r2=Number(arg2.toString().replace(".",""));  
    return (r1/r2)*pow(10,t2-t1);  
  }
}
//说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。  
function zuiaccMul(arg1,arg2) {  
  var m=0,s1=arg1.toString(),s2=arg2.toString();  
  try{m+=s1.split(".")[1].length}catch(e){}  
  try{m+=s2.split(".")[1].length}catch(e){}  
  return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);  
}  

/*
 * 智能机浏览器版本信息:
 *
 */
var zuiBrowser = {
  versions: function() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return { //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('iPad') > -1, //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

// 设置指定url中param的值，返回处理后的url
function zchangeURLPar(url,param,value){
  if(url.indexOf('?') != -1){  
    var p = new RegExp("(\\?|&"+param+")=[^&]*");
    if(p.test(url)){
      url = url.replace(p,"$1="+value);
    }else{
      url = url+'&'+param+'='+value;
    }
  }else{
		url = url+'?'+param+'='+value;
  }
  return url;
}
/**
 * 删除url某个参数
 * redirect = delUrlParam(redirect, 'clearsession');
**/
function delUrlParam(url, ref){
  // 如果不包括此参数
  if (url.indexOf(ref) == -1)
    return url;
  var arr_url = url.split('?');
  var base = arr_url[0];
  var arr_param = arr_url[1].split('&');
  var index = -1;

  for (i = 0; i < arr_param.length; i++) {
    var paired = arr_param[i].split('=');
    if (paired[0] == ref) {
      index = i;
      break;
    }
  }
  if (index == -1) {
    return url;
  } else {
    arr_param.splice(index, 1);
    return base + "?" + arr_param.join('&');
  }
}
/**
 * 获取微信url参数
 * var code =  getQueryString("code") ? getQueryString("code") : "";
**/
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var url = decodeURI(window.location);
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}
/*
 * 获取url参数，多个参数
 * //Get object of URL parameters
 * var allVars = $.getUrlVars();
 * //Getting URL var by its nam
 * var getName = $.getUrlVar('name');
 */
(function($){
  $.extend({
    getUrlVars: function(){
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++){
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    getUrlVar: function(name){
      return $.getUrlVars()[name];
    }
  });
})(jQuery)

var NiceTools = {
  /*
   * 功能:删除数组元素.
   * 参数:dx删除元素的下标.
   * 返回:在原数组上删除后的数组
   */
  removeByIndex : function(arrays , dx){
    if(isNaN(dx)||dx>arrays.length){return false;}
    for(var i=0,n=0;i<arrays.length;i++){
      if(arrays[i]!=arrays[dx]){
        arrays[n++]=arrays[i]
      }
    }
    arrays.length-=1
    return arrays;
  },
  //删除指定的item,根据数组中的值
  removeByValue : function(arrays, item ){
    for( var i = 0 ; i < arrays.length ; i++ ){
      if( item == arrays[i] ){
        break;
      }
    }
    if( i == arrays.length ){
      return;
    }
    for( var j = i ; j < arrays.length - 1 ; j++ ){
      arrays[ j ] = arrays[ j + 1 ];
    }
    arrays.length--;
    return arrays;
  }
}

;(function($){
	// data.formatDD( "yyyy-MM-DD hh:mm:ss");
	Date.prototype.formatDD = function( formatStr){ 
		var date = this;
		var str = formatStr; 
		str=str.replace(/yyyy|YYYY/,date.getFullYear()); 
		str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():"0" + (date.getYear() % 100)); 
		str=str.replace(/MM/,date.getMonth()>8?(date.getMonth()+1).toString():"0" + (date.getMonth()+1)); 
		str=str.replace(/M/g,date.getMonth()+1); 
		str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():"0" + date.getDate()); 
		str=str.replace(/d|D/g,date.getDate()); 
		str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():"0" + date.getHours()); 
		str=str.replace(/h|H/g,date.getHours()); 
		str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():"0" + date.getMinutes()); 
		str=str.replace(/m/g,date.getMinutes()); 
		str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():"0" + date.getSeconds()); 
		str=str.replace(/s|S/g,date.getSeconds()); 
		return str; 
	}
})(jQuery);

/**
 * 获取当前时间
 * type为true表示带时分秒
**/
function getCurDate(cDate, type){
  if(type && type == '2'){
    cDate = cDate.formatDD( "yyyy-MM-DD hh:mm:ss");
  }else if(type){
    cDate = cDate.formatDD( "yyyy-MM-DD hh:mm");
  }else{
    cDate = cDate.formatDD( "yyyy-MM-DD");
  }
  return cDate;
}
/**
 * 毫秒转日期
 *format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss')
**/
var format = function(time, format){
  var t = new Date(time);
  var tf = function(i){return (i < 10 ? '0' : '') + i};
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
    switch(a){
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
		}
  })
}

function createLoading(txt){
  
}

function unblockLoading(callback){
  
}

function zuiTotast(txt, type, callback){
  
}

function zuiToptip(txt, type, callback){

}

function zuiAlert(txt, callback){

}

function zuiConfirm(txt, succ, erro){

}

window.Util = {};
Util.lStorage = {
  /*
  localStorage只支持字符串，如果要放json，请先使用JSON.stringify()转换
  读取使用JSON.parse()读取
  */
  setParam: function(name, value) {
    localStorage.setItem(name, value);
  },
  getParam: function(name) {
    return localStorage.getItem(name);
  },
  removeParam:function(name){
    localStorage.removeItem(name);
  },
  clearParam:function(){
    //清除所有的存储，谨慎使用
    localStorage.clear();
  },
  paramSize:function(){
    return localStorage.length;
  }
}

//获取token
Util.getlSToken = function(){
  var token = Util.sStorage.getParam("userToken") || "";
  if(token)
    return token;
  else
    return null;
}

;(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function(){
      var clientWidth = docEl.clientWidth;
      if(clientWidth<=640 && clientWidth>=320){ //判断最小320 屏幕，最大640，当然也可以不加 
        if(!clientWidth) return;
        docEl.style.fontSize = 20 * (clientWidth / 320) + "px";
      }else{
        docEl.style.fontSize = "40px";
      }
    };
  if(!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

$(function(){

})