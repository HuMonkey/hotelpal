<template>
  <div class="error-container" v-show="error && show">
    {{ error }}
    <img src="/static/cross.png" @click="closeErrorTips">
  </div>
</template>

<script>
export default {
  name: 'error',
  props: ['error'],
  data () {
    return {
      show: true
    }
  },
  methods: {
    closeErrorTips: function () {
      this.show = false;
    },
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .error-container {
    position: fixed;
    z-index: 9999;
    background: @red;
    color: white;
    padding: 0 0.4rem;
    height: 0.8rem;
    width: 100%;
    font-size: 0.4rem;
    line-height: 0.8rem;
    img {
      height: 0.4rem;
      position: absolute;
      top: 0.2rem;
      right: 0.4rem;
    }
  }
</style>
