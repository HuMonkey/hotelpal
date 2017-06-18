import 'whatwg-fetch'

const api = {
  getCourse: '/hotelpal/course/getCourse',
  getCourseList: '/hotelpal/course/getCourseList',
  
  sendCaptcha: '/hotelpal/user/sendCaptcha',
  verifyPhone: '/hotelpal/user/verifyPhone',
  getPaidCourseList: '/hotelpal/user/getPaidCourseList',
  getUserInfo: '/hotelpal/user/getUserInfo',
  getUserStatistics: '/hotelpal/user/getUserStatistics',
  getPaidCourseList: '/hotelpal/user/getPaidCourseList',

  getLessonProp: '/hotelpal/lesson/getLessonProp',
  getLessonContent: '/hotelpal/lesson/getLessonContent',
};

const util = {};

/**
 * 判断userAgent的一些方法
 */
const userAgent = navigator.userAgent.toLowerCase();
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
    const ua = navigator.userAgent,  
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
// http://116.62.247.1:8080/hotelpal/course/getcourse?courseId=2
util.config = {
  host: 'http://192.168.0.14:8082',
  wechat: {
    appid: 'wx8ecfbf8357e25e45', // live.xinhuaapp.com
  },
  weibo: {
    appid: '847545354', // live.xinhuaapp.com
    redirect: 'http://live.xinhuaapp.com',
  }
}

/**
 * 获取课程列表
 */
util.getCourseList = function (callback) {
  fetch(util.config.host + api.getCourseList)
    .then(function(res) {
      return res.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取课程
 */
util.getCourse = function (id, callback) {
  fetch(util.config.host + api.getCourse + '?courseId=' + id)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取验证码
 */
util.sendCaptcha = function (phone, callback) {
  fetch(util.config.host + api.sendCaptcha + '?phone=' + phone)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 验证手机
 */
util.verifyPhone = function (phone, code, callback) {
  fetch(util.config.host + api.verifyPhone + '?phone=' + phone + '&code=' + code)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取已购课程
 */
util.getPaidCourseList = function (callback) {
  fetch(util.config.host + api.getPaidCourseList)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取用户信息
 */
util.getUserInfo = function (callback) {
  fetch(util.config.host + api.getUserInfo)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取用户统计信息
 */
util.getUserStatistics = function (callback) {
  fetch(util.config.host + api.getUserStatistics)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取课时属性
 */
util.getLessonProp = function (lessonId, callback) {
  fetch(util.config.host + api.getLessonProp + '?lessonId=' + lessonId)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取课时信息
 */
util.getLessonContent = function (lessonId, callback) {
  fetch(util.config.host + api.getLessonContent + '?lessonId=' + lessonId)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取已购课程
 */
util.getPaidCourseList = function (callback) {
  fetch(util.config.host + api.getPaidCourseList)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取url的hash值
 */
util.getHash = function() {
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
 * 修改URL
 */
util.changeURL = function(options, replaceMode, hash) {
  var url = location.href;
  var arr1 = url.split('#')
  var arr2 = arr1[0].split('?')
  var prefix = arr2[0];

  var params = {}
  if (arr2[1]) {
    var temp = arr2[1].split('&')
    temp.forEach((item) => {
      var kv = item.split('=');
      if (kv[0]) {
        params[kv[0]] = kv[1] ? decodeURIComponent(kv[1]) : ''
      }
    })
  }
  options = options || {};

  Object.keys(options).forEach((i) => {
    params[i] = options[i]
  })

  var paramsArr = [];
  Object.keys(params).forEach((j) => {
    if (params[j] != null) {
      paramsArr.push(j + '=' + encodeURIComponent(params[j]))
    }
  })
  var paramsString = paramsArr.join('&')

  var result = prefix;
  if (paramsString) {
    result += '?' + paramsString;
  }

  var fragment = arr1.slice(1).join('#')
  if (hash) {
    result += '#' + hash;
  } else {
    if (fragment) {
      result += '#' + fragment;
    }
  }

  var method = replaceMode ? 'replaceState' : 'pushState'
  window.history[method]({}, '', result)
  return result;
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
  if (!para || !fontSize) {
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






