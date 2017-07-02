<template>
  <div class="jdbsitem-container">
    111
  </div>
</template>

<script>
import util from '../util/index'
import AudioPlayer from './AudioPlayer.vue'

export default {
  name: 'jdbsitem',
  props: [],
  data () {
    return {}
  },
  created() {},
  mounted() {},
  methods: {},
  destroyed() {},
  watch: {},
  components: {
    AudioPlayer
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .jdbsitem-container {
    background: #f5f5f5;
  }
</style>
