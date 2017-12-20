<template>
  <div class="imgpreview-container">
    <div class="cover"></div>
    <div class="container" @click="closePreview">
      <img :src="previewingUrl" @click="preventClosePreview">
    </div>
  </div>
</template>

<script>
export default {
  name: 'imgpreview',
  props: ['previewingUrl'],
  data () {
    return {}
  },
  methods: {
    closePreview: function () {
      this.$parent.previewing = false;
      this.$parent.previewingUrl = null;
    },
    preventClosePreview: function (ev) {
      ev.stopPropagation();
    },
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .imgpreview-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    overflow: scroll;
    .cover {
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.8;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
    }
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      line-height: 400px;
      img {
        max-width: 100%;
        max-height: 100%;
        vertical-align: middle;
      }
    }
  }
</style>
