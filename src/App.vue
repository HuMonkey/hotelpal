<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view v-if="isWechat"></router-view>
    <div v-if="!isWechat">请到微信打开此网页！</div>
  </div>
</template>

<script>
import util from './util/index';

export default {
  name: 'app',
  data () {
    return {
      // isWechat: util.ua.wechat
      isWechat: true
    }
  },
  mounted () {
    if (this.isWechat) {
      setTimeout(function () {
        util.getSign(document.URL.split('#')[0], function (json) {
          if (json.code === 0) {
            console.log(1);
            const { appid, noncestr, sign, timeStamp } = json.data;
            util.configWechat(appid, timeStamp, noncestr, sign, function () {
              console.log('wechat ready!')
            })
          } else {
            console.warn('获取微信签名失败');
          }
        })
      }, 1200);
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
