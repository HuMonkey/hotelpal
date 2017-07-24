<template>
  <div class="error-container" v-show="error && show">
    <span>{{ error }}</span>
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
    top: 0;
    left: 0;
    z-index: 9999;
    background: @red;
    color: white;
    padding: 0 0.4rem;
    height: 0.8rem;
    width: 100%;
    font-size: 0.32rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      height: 0.32rem;
    }
  }
</style>
