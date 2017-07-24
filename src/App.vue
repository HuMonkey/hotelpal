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
      isWechat: false,
      beginRender: false,
    }
  },
  mounted () {
    this.isWechat = util.ua.wechat;
    if (this.isWechat) {
      util.verifyWechat(this);
      util.getWechatSign();
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
  line-height: 1;
}

#app {
  width: 100%;
  height: 100%;
  background: @bg;
  position: relative;
  font: 12px/1.5 tahoma,arial,'Hiragino Sans GB','\5b8b\4f53',sans-serif;
}
</style>
