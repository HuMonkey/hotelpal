import 'whatwg-fetch'

const api = {
  getCourse: '/hotelpal/course/getCourse',
  getCourseList: '/hotelpal/course/getCourseList',
  getMainBanner: '/hotelpal/course/getMainBanner',
  
  getSign: '/hotelpal/user/getSign',
  sendCaptcha: '/hotelpal/user/sendCaptcha',
  verifyPhone: '/hotelpal/user/verifyPhone',
  getUserInfo: '/hotelpal/user/getUserInfo',
  getUserStatistics: '/hotelpal/user/getUserStatistics',
  getPaidCourseList: '/hotelpal/user/getPaidCourseList',
  createPayOrder: '/hotelpal/user/createPayOrder',
  saveUserProp: '/hotelpal/user/saveUserProp',
  newInvitedUser: '/hotelpal/user/newInvitedUser',
  getFreeCourse: '/hotelpal/user/getFreeCourse',

  getLesson: '/hotelpal/lesson/getLesson',
  getInternalLessonList: '/hotelpal/lesson/getInternalLessonList',
  newComment: '/hotelpal/user/newComment',
  addZan: '/hotelpal/user/addZan',
  recordListenTime: '/hotelpal/user/recordListenTime',
  recordListenPos: '/hotelpal/user/recordListenPos',
  pay: '/hotelpal/user/pay',
  openRedPacket: '/hotelpal/user/openRedPacket',
  getRedPacketRemained: '/hotelpal/user/getRedPacketRemained',

  receiveRedirect: '/hotelpal/WeChat/receiveRedirect',

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
  // host: 'http://116.62.247.1:8080', // 测试
  // host: 'http://192.168.0.14:8082', // 测试
  host: 'http://hotelpal.cn', // 线上
  appId: 'wxfe666ebbf0e42897'
}

/**
 * 获取课程列表
 */
util.getCourseList = function (callback) {
  fetch(util.getUrl(util.config.host + api.getCourseList))
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
  fetch(util.getUrl(util.config.host + api.getCourse + '?courseId=' + id))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取微信签名
 */
util.getSign = function (url, callback) {
  fetch(util.getUrl(util.config.host + api.getSign + '?url=' + url))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.warn('parsing failed', ex)
    })
}

/**
 * 获取验证码
 */
util.sendCaptcha = function (phone, callback) {
  fetch(util.getUrl(util.config.host + api.sendCaptcha + '?phone=' + phone))
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
  fetch(util.getUrl(util.config.host + api.verifyPhone + '?phone=' + phone + '&code=' + code))
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
  fetch(util.getUrl(util.config.host + api.getPaidCourseList))
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
  fetch(util.getUrl(util.config.host + api.getUserInfo))
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
  fetch(util.getUrl(util.config.host + api.getUserStatistics))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 邀请注册
 */
util.newInvitedUser = function (callback) {
  fetch(util.getUrl(util.config.host + api.newInvitedUser))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

util.getRedPacketRemained = function (redPacketNonce, callback) {
  fetch(util.getUrl(util.config.host + api.getRedPacketRemained + '?nonce=' + redPacketNonce))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取免费课程
 */
util.getFreeCourse = function (cid, callback) {
  fetch(util.getUrl(util.config.host + api.getFreeCourse + '?courseId=' + cid))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取课时信息
 */
util.getLesson = function (lessonId, callback) {
  fetch(util.getUrl(util.config.host + api.getLesson + '?lessonId=' + lessonId))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 添加评论
 */
util.newComment = function (lessonId, comment, replyToCommentId, callback) {
  let url = util.getUrl(util.config.host + api.newComment + '?lessonId=' + lessonId + '&comment=' + encodeURIComponent(comment));
  if (replyToCommentId) {
    url += '&replyToCommentId=' + replyToCommentId
  }
  fetch(url)
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 点赞
 */
util.addZan = function (lessonId, commentId, callback) {
  let url = util.getUrl(util.config.host + api.addZan + '?lessonId=' + lessonId + '&commentId=' + commentId);
  fetch(url)
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
  fetch(util.getUrl(util.config.host + api.getPaidCourseList))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 记录已听时长
 */
util.recordListenTime = function (lessonId, callback) {
  const url = util.config.host + api.recordListenTime + '?lessonId=' + lessonId;
  fetch(util.getUrl(url))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 记录听的位置
 */
util.recordListenPos = function (lessonId, pos, callback) {
  const url = util.config.host + api.recordListenPos + '?lessonId=' + lessonId + '&recordPos=' + pos;
  fetch(util.getUrl(url))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 创建微信支付订单
 */
util.createPayOrder = function (cid, callback) {
  fetch(util.getUrl(util.config.host + api.createPayOrder + '?courseId=' + cid))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/** 
 * 支付成功
 */
util.pay = function (cid, tradeNo, callback) {
  fetch(util.getUrl(util.config.host + api.pay + '?courseId=' + cid
    + '&tradeNo=' + tradeNo + '&gift=0'))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

util.openRedPacket = function (nonce, callback) {
  fetch(util.getUrl(util.config.host + api.openRedPacket + '?nonce=' + nonce))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 
 */
util.receiveRedirect = function (code, callback) {
  fetch(util.getUrl(util.config.host + api.receiveRedirect + '?code=' + code))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 修改用户信息
 */
util.saveUserProp = function (headImg, nickname, company, title, callback) {
  fetch(util.getUrl(util.config.host + api.saveUserProp + '?headImg=' + headImg + '&nickname=' + nickname + '&company=' + company + '&title=' + title))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取自主课程
 */
util.getInternalLessonList = function (start, number, order, callback) {
  let url = util.config.host + api.getInternalLessonList;
  if (start !== null && number !== null) {
    url += '?start=' + start + '&n=' + number + '&order=' + order;
  }
  fetch(util.getUrl(url))
    .then(function(response) {
      return response.json()
    }).then(callback).catch(function(ex) {
      console.log('parsing failed', ex)
    })
}

/**
 * 获取首页banner
 */
util.getMainBanner = function (callback) {
  fetch(util.getUrl(util.config.host + api.getMainBanner))
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

util.removeParam = function (key) {
  var sourceURL = location.href.split('#')[0];
  var hash = location.href.split('#')[1];
  var rtn = sourceURL.split("?")[0],
    param,
    params_arr = [],
    queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        params_arr.splice(i, 1);
      }
    }
    rtn = rtn + "?" + params_arr.join("&");
  }
  if (hash) {
    rtn = rtn + "#" + hash;
  }
  history['replaceState']({}, '', rtn)
}

/**
 * 修改URL
 */
util.changeURL = function(options, replaceMode, hash) {
  var url = location.href;
  var arr1 = url.split('#')
  var arr2 = arr1[0].split('?')
  var prefix = arr2[0];

  var paramsArr = [];
  Object.keys(options).forEach((j) => {
    if (options[j] != null) {
      paramsArr.push(j + '=' + encodeURIComponent(options[j]))
    }
  })
  var paramsString = paramsArr.join('&')

  var result = prefix;
  if (paramsString) {
    result += '?' + paramsString;
  }

  var fragment = arr1.slice(1).join('#')
  if (fragment) {
    result += '#' + fragment;
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

/**
 * 为了使用微信分享功能，需要在微信中使用 `wx.config` 来进行签名
 * 如果 URL 发生变动，则需要重新签名
 */
util.configWechat = function(appId, timestamp, nonceStr, signature, callback) {
  try {
    if (!util.ua.wechat) {
      return;
    }
    console.log(appId, timestamp, nonceStr, signature)
    wx.config({
      appId, timestamp, nonceStr, signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'chooseImage',
        'previewImage'
      ]
    });
    wx.ready(callback)
  } catch (e) {
    alert(e);
  } 
}

/**
 * 数字前面补0
 */
util.formatNum = function (num) {
  return num > 9 ? num : '0' + num;
}

/**
 * 格式化时间戳
 */
util.formatTime = function (time) {
  if (!time) {
    return null;
  }
  var date = new Date(time.replace(/\-/g, "/"));
  var now = new Date();
  var diff = now.getTime() - date.getTime();
  var M_DAY = 24 * 60 * 60 * 1000;
  var M_HOUR = 60 * 60 * 1000;
  var days = Math.floor(diff / M_DAY)
  diff = diff - days * M_DAY;
  var hours = Math.floor(diff / M_HOUR)
  diff = diff - hours * M_HOUR;
  var minutes = Math.floor(diff / 60 / 1000);
  var result;
  if (days > 0) {
    if (days > 30) {
      var month = Math.floor(days / 30)
      result = `${month}个月前`
    } else {
      result = `${days}天前`
    }
  } else if (hours > 0) {
    result = `${hours}小时前`
  } else if (minutes > 0) {
    result = `${minutes}分钟前`
  } else {
    result = '刚刚'
  }
  return result;
}

util.getUrl = function (url) {
  const token = util.getCookie('token');
  if (!token) {
    return url;
  }
  let result = url.split('?')[0] + '?token=' + token;
  if (url.split('?')[1]) {
    result += '&' + url.split('?')[1]
  }
  return result;
}

util.processDateStr = function (date) {
  const temp = date.split('-');
  for (let i = 0; i < temp.length; i++) {
    if (temp[i].length === 1) {
      temp[i] = '0' + temp[i]
    }
  }
  return temp.join('-');
}

util.getWechatSign = function (callback) {
  // 如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。
  util.getSign(encodeURIComponent(location.href.split('#')[0]), (json) => {
    if (json.code === 0) {
      const { appid, noncestr, sign, timestamp } = json.data;
      util.configWechat(appid, timestamp, noncestr, sign, () => {
        console.log('微信sdk初始化成功！')
        callback && callback();
      })
    } else {
      console.warn('获取微信签名失败');
    }
  })
}

util.verifyWechat = function (app) {
  const code = util.getParam('code');
  const token = util.getCookie('token');
  if (token != '') {
    app.beginRender = true;
    return false;
  }
  if (!code) {
    sessionStorage.gotoVerify = true;
    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + util.config.appId + '&redirect_uri=' + encodeURIComponent(document.URL) +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
  } else {
    if (!sessionStorage.gotoVerify) {
      sessionStorage.gotoVerify = true;
      location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + util.config.appId + '&redirect_uri=' + encodeURIComponent(document.URL) +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    }
    util.receiveRedirect(code, (json1) => {
      if (json1.code === 0) {
        util.setCookie('token', json1.data.token, '12d');
        app.beginRender = true;
      } else {
        console.warn('verify fail');
      }
    })
  }
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

util.isLongImg = function (imgUrl, radio, callback) {
  var img = new Image(); 
  img.src = imgUrl;
  img.onload = function () {
    callback(img.width / img.height < radio);
  };
}

util.getHtmlContent = function (str) {
  return str.replace(/<[^>]*>/g, "");
}

export default util;






