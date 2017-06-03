const util = {};

/**
 * 判断userAgent的一些方法
 */
util.ua = {
  wechat: userAgent.indexOf('micromessenger') > -1, // 判断是否在微信里
  xinhuashe: userAgent.indexOf('xyapp') > -1, // 判断是否在新华社app里
  iOS: userAgent.indexOf('iphone') > -1, // 判断是否在ios里
  weibo: userAgent.match(/WeiBo/i) == 'weibo', // 判断是否在ios里
  iPhone: userAgent.indexOf('iphone') > -1, // 判断是否在iphone里
  android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('android') > -1 || userAgent.indexOf('Adr') > -1, // 判断是否在android里
  /**
   * 判断是否在PC里
   */
  isPc: function() {  
    var ua = navigator.userAgent,  
      isWindowsPhone = /(?:Windows Phone)/.test(ua),  
      isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,   
      isAndroid = /(?:Android)/.test(ua),   
      isPhone = /(?:iPhone)/.test(ua),  
      isPc = !isPhone && !isAndroid && !isSymbian;  
    return isPc; 
  }
};

/**
 * 环境参数配置
 */
util.config = {
  wechat: {
    appid: 'wx8ecfbf8357e25e45', // live.xinhuaapp.com
  },
  weibo: {
    appid: '847545354', // live.xinhuaapp.com
    redirect: 'http://live.xinhuaapp.com',
  }
}

/**
 * 获取url的hash值
 */
util.getHash = function(name) {
  var url = window.location.href;
  var arr = url.split('#');
  if (arr[1]) {
    return arr[1];
  } else {
    return null;
  }
}

/**
 * 获取url里的参数
 */
util.getParam = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]);
  return null;
}

/**
 * 设置cookie
 */
util.setCookie = function(key, value, extime) {
  var extimeExt = extime.substr(-1);
  var extimeInt = parseInt(extime);
  var extimeSec = {
    "s": 1000,
    "m": 60 * 1000,
    "h": 3600 * 1000,
    "d": 24 * 3600 * 1000
  };
  if (!extimeSec[extimeExt]) extimeExt = 's';
  var sec = extimeInt * extimeSec[extimeExt];
  var exp = new Date();
  exp.setTime(exp.getTime() + sec);
  document.cookie = key + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
}

/**
 * 取得 cookie 中对应 key 的值
 * @param key {String}
 */
util.getCookie = function(key) {
  var cookie_val = document.cookie.match(
    new RegExp('(?:^|;)\\s*' + key + '=([^;]+)')
  );
  return cookie_val ? unescape(cookie_val[1]) : '';
}

/**
 * 设置微信分享信息
 */
util.updateWechatShare = function(wxShareDict) {
  wx.onMenuShareTimeline({
    title: wxShareDict.title, // 分享标题
    link: wxShareDict.link, // 分享链接，该链接域名需在JS安全域名中进行登记
    imgUrl: wxShareDict.imgUrl, // 分享图标
    success: function () { 
      // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
      // 用户取消分享后执行的回调函数
    }
  });
  wx.onMenuShareAppMessage({
    title: wxShareDict.title, // 分享标题
    desc: wxShareDict.desc, // 分享描述
    link: wxShareDict.link, // 分享链接，该链接域名需在JS安全域名中进行登记
    imgUrl: wxShareDict.imgUrl, // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () { 
      // 用户取消分享后执行的回调函数
    }
  });
}

/**
 * 计算一段文字的长度
 */
util.textLength = function(para, fontSize) {
  if (!para) {
    return 0;
  }
  var length = 0;
  for (var i = 0; i < para.length; i++) {
    var ch = para[i];
    if (ch >= 'A' && ch <= 'Z') {
      length += fontSize * 2 / 3;
    } else if (ch >= 'a' && ch <= 'z') {
      length += fontSize / 2;
    } else if (ch >= '0' && ch <= '9') {
      length += fontSize / 2;
    } else if (ch === ',' && ch === ':' && ch === '.' && ch === '?' && ch === '!'
      && ch === '\'' && ch === '"') {
      length += fontSize / 2;
    } else {
      length += fontSize;
    }
  }
  return length;
}

export default util;






