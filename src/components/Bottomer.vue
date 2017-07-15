<template>
  <div class="bottomer-container">
    <div class="footer">
      <div class="item" :class="{selected: tag === 1}" @click="gotoHome()">
        <div class="img"></div>
        发现
      </div>
      <div class="item" :class="{selected: tag === 2}" @click="gotoBought()">
        <div class="img"></div>
        已购课程
      </div>
      <div class="item" :class="{selected: tag === 3}" @click="gotoProfile()">
        <div class="img"></div>
        我的
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'bottomer',
  props: ['tag'],
  data () {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    gotoHome: function () {
      location.href = '/#/';
    },
    gotoBought: function () {
      if (util.getCookie('isLogin') != 1) {
        location.href = '/?redirect=' + encodeURIComponent('/#/bought') + '#/login';
        return false;
      }
      location.href = '/#/bought';
    },
    gotoProfile: function () {
      if (util.getCookie('isLogin') != 1) {
        location.href = '/?redirect=' + encodeURIComponent('/#/profile') + '#/login';
        return false;
      }
      location.href = '/#/profile';
    }
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .bottomer-container {
    line-height: 1;
    .footer {
      width: 100%;
      height: 1.28rem;
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      z-index: 999;
      font-size: 0.32rem;
      justify-content: space-between;
      border-top: #ebebeb solid thin;
      background: white;
      padding: 0.16rem 1.253333rem;
      .item {
        height: 1.28rem;
        text-align: center;
        color: #666666;
        .img {
          width: 0.48rem;
          height: 0.48rem;
          margin: auto;
          margin-bottom: 0.16rem;
          background-size: 0.48rem 0.48rem;
          background-position: center;
        }
      }
      .item:first-child {
        .img {
          background-image: url('/static/footer-1.svg');
        }
      }
      .item.selected:first-child {
        .img {
          background-image: url('/static/footer-1-selected.svg');
        }
      }
      .item:nth-child(2) {
        .img {
          background-image: url('/static/footer-2.svg');
        }
      }
      .item.selected:nth-child(2) {
        .img {
          background-image: url('/static/footer-2-selected.svg');
        }
      }
      .item:nth-child(3) {
        .img {
          background-image: url('/static/footer-3.svg');
        }
      }
      .item.selected:nth-child(3) {
        .img {
          background-image: url('/static/footer-3-selected.svg');
        }
      }
      .item.selected {
        color: @red;
      }
    }
  }
</style>
