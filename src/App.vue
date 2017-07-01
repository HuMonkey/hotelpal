<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view v-if="isWechat && beginRender"></router-view>
    <div v-if="!isWechat">请到微信打开此网页！</div>
  </div>
</template>

<script>
import util from './util/index';

export default {
  name: 'app',
  data () {
    return {
      isWechat: util.ua.wechat,
      beginRender: false,
    }
  },
  mounted () {
    
    if (this.isWechat) {
      // 如果是html的静态页面在前端通过ajax将url传到后台签名，前端需要用js获取当前页面除去'#'hash部分的链接（可用location.href.split('#')[0]获取,而且需要encodeURIComponent），因为页面一旦分享，微信客户端会在你的链接末尾加入其它参数，如果不是动态获取当前链接，将导致分享后的页面签名失败。
      util.getSign((location.href.split('#')[0]), (json) => {
        if (json.code === 0) {
          const { appid, noncestr, sign, timeStamp } = json.data;
          util.configWechat(appid, timeStamp, noncestr, sign, () => {
            const code = util.getParam('code');
            const wxLogin = sessionStorage.wxLogin;
            if (wxLogin == 1) {
              this.beginRender = true;
              return false;
            }
            if (!code) {
              location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + encodeURIComponent(document.URL) +'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
            } else {
              util.receiveRedirect(code, (json1) => {
                if (json1.code === 0) {
                  sessionStorage.sessionId = json1.data.sessionId;
                  sessionStorage.wxLogin = 1;
                  this.beginRender = true;
                } else {
                  console.warn('verify fail');
                }
              })
            }
          })
        } else {
          console.warn('获取微信签名失败');
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './variable.less';

* {
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}

#app {
  width: 100%;
  height: 100%;
  background: @bg;
  position: relative;
}
</style>
