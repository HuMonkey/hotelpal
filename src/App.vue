<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view v-if="!isPc"></router-view>
    <div v-if="isPc">请到微信打开此网页！</div>
  </div>
</template>

<script>
import util from './util/index';

export default {
  name: 'app',
  data () {
    return {
      isPc: util.ua.isPc()
    }
  },
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
