<template>
  <div class="hongbao-container">
    <div class="avater" v-if="false">
      <img src="/static/header.png">
    </div>
    <div class="name" v-if="false">名字名字名字名字名字名</div>
    <div class="over-tips">
      知识红包已抢完，<span @click="gotoHome">去查看更多课程</span><div class="icon"></div>    
    </div>
    <div class="hongbao">
      <img src="/static/hongbao.png">
      <div class="box">
        <div class="avater">
          <img src="/static/header.png">
        </div>
        <div class="desc">
          <div class="title">标题标题标题标题标题标题</div>
          <div class="who">胡万祺<br />浙江大学</div>
        </div>
      </div>
      <div class="btn over">抢完了</div>
      <div class="tips">文案文案文案呢文案呢文案呢</div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'hongbao',
  props: [],
  data () {
    return {}
  },
  created() {},
  mounted() {},
  methods: {
    gotoHome: function () {
      location.href = '/';
    }
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';
  .hongbao-container {
    .over-tips {
      position: relative;
      text-align: center;
      height: 3.3333rem;
      line-height: 3.3333rem;
      font-size: 0.48rem;
      color: #666666;
      span {
        color: @red;
      }
      .icon {
        margin-left: 0.3rem;
        display: inline-block;
        width: 0.2rem;
        height: 0.4rem;
        background-image: url('/static/red-arrow-right.svg');
        background-size: 0.2rem auto;
        background-position: center;
        background-repeat: no-repeat;
      }
    }
    .avater {
      text-align: center;
      img {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 1.3rem;
      }
    }
    .name {
      font-size: 0.4rem;
      text-align: center;
      color: #666666;
      width: 4.3rem;
      margin: auto;
      margin-top: 0.263333rem;
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis;
    }
    .hongbao {
      margin-top: 1.3333rem;
      padding: 1px;
      width: 100%;
      height: 8.93333rem;
      text-align: center;
      position: relative;
      img {
        height: 100%;
      }
      .box {
        width: 4.93333rem;
        height: 4.8rem;
        position: absolute;
        left: 2.55rem;
        top: 1.2rem;
        transform: rotate(-6deg);
        padding: 0.4rem 0.4rem;
        display: flex;
        justify-content: space-between;
        .avater {
          width: 1.2rem;
          height: 1.73333rem;
          position: relative;
          img {
            width: 100%;
          }
        }
        .desc {
          font-size: 0.32rem;
          width: 3.33333rem;
          height: 1.73333rem;
          padding: 0.1rem 0;
          color: #666666;
          text-align: left;
          margin-left: 0.4rem;
          .title {
            height: 0.64rem;
            line-height: 1.2;
          }
          .name, .who {
            height: 0.64rem;
            line-height: 1.2;
            color: #999999;
            margin-top: 0.263333rem;
          }
        }
      }
      .btn {
        font-size: 0.56rem;
        width: 2.2rem;
        height: 2.2rem;
        line-height: 2.2rem;
        border-radius: 2.2rem;
        background: #f2ba49;
        color: white;
        position: absolute;
        left: 3.9rem;
        top: 5rem;
      }
      .btn.over {
        background: #cccccc;
      }
      .tips {
        color: white;
        font-size: 0.32rem;
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0.4rem;
      }
    }
  }
</style>
