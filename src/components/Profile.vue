<template>
  <div class="profile-container">
    <div class="index-page" v-if="mode === 1">
      <div class="banner">
        <img src="/static/banner_1.jpg">
      </div>
      <div class="header">
        <div class="avater">
          <img src="/static/header.png">
        </div>
        <div class="name">
          胡万祺 <div class="arrow-right"></div>
        </div>
        <div class="record">
          <div class="icon"></div>
          <span>累计学习</span>
          500小时40分钟
        </div>
        <div class="infos">
          <div class="item">
            <div class="value">23天</div>
            <div class="label">加入成长营</div>
          </div>
          <div class="item">
            <div class="value">4个</div>
            <div class="label">报名课程</div>
          </div>
          <div class="item">
            <div class="value">23节</div>
            <div class="label">学习课时</div>
          </div>
        </div>
      </div>
      <div class="row bought" @click="setMode(3)">
        <div class="icon shoppingcar"></div>
        购买记录
        <div class="arrow-right"></div>
      </div>
      <div class="row about" @click="setMode(2)">
        <div class="icon jiudianbang"></div>
        关于成长营
        <div class="arrow-right"></div>
      </div>
      <div class="hr">
        <div class="inner"></div>
      </div>
      <div class="row wechat">
        <div class="icon gongzhonghao"></div>
        关注公众号
        <div class="arrow-right"></div>
      </div>
    </div>
    <div class="page about-page" v-if="mode === 2">
      <div class="logo">
        <img src="/static/logo.png">
      </div>
      <div class="desc">
        一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段一大段
      </div>
      <div class="item contact">
        联系客服
        <div class="arrow-right"></div>
      </div>
      <div class="item coorperating">
        商务合作
        <span>361926890@qq.com</span>
      </div>
    </div>
    <div class="page bought-page" v-if="mode === 3">
      <div class="bought-item">
        <div class="avater">
          <img src="/static/logo.png">
        </div>
        <div class="desc">
          <div class="title">酒店经营法则</div>
          <div class="orderid">订单号：1111111111</div>
          <div class="time">购买时间：2017-06-13</div>
          <div class="price">实付：¥ 199 （优惠：¥ 199）</div>
        </div>
      </div>
      <div class="bought-item">
        <div class="avater">
          <img src="/static/logo.png">
        </div>
        <div class="desc">
          <div class="title">酒店经营法则</div>
          <div class="orderid">订单号：1111111111</div>
          <div class="time">购买时间：2017-06-13</div>
          <div class="price">实付：¥ 199 （优惠：¥ 199）</div>
        </div>
      </div>
      <div class="bought-item">
        <div class="avater">
          <img src="/static/logo.png">
        </div>
        <div class="desc">
          <div class="title">酒店经营法则</div>
          <div class="orderid">订单号：1111111111</div>
          <div class="time">购买时间：2017-06-13</div>
          <div class="price">实付：¥ 199 （优惠：¥ 199）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'profile',
  props: [],
  data () {
    return {
      mode: 1, // 1主页，2aboutus，3购买记录
    }
  },
  created () {
    /**
     * 监听popstate事件，实现页面的前进后退
     */
    window.addEventListener('popstate', () => {
      this.popstate();
    })
  },
  mounted() {
    this.popstate();
  },
  methods: {
    popstate () {
      const mode = +util.getParam('mode');
      this.mode = mode || 1;
      if (mode === 2) {
        document.title = '关于成长营';
        return false;
      } else if (mode === 3) {
        document.title = '购买记录';
        return false;
      }
      document.title = '我';
    },
    setMode(mode) {
      this.mode = mode;
      util.changeURL({ mode: mode })
      this.popstate();
    }
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .profile-container {
    width: 100%;
    height: 100%;
    .index-page {
      .banner {
        width: 100%;
        height: 3.3333rem;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .header {
        width: 100%;
        background: white;
        padding-bottom: 0.26666rem;
        .avater {
          width: 100%;
          text-align: center;
          margin-top: -0.93333rem;
          height: 1.86666rem;
          img {
            height: 1.86666rem;
            border: solid medium white;
            border-radius: 1.86666rem;
          }
        }
        .name {
          margin-top: 0.26666rem;
          font-size: 0.48rem;
          color: #666666;
          text-align: center;
          height: 0.48rem;
          width: 100%;
          .arrow-right {
            position: relative;
            top: 0.04rem;
            margin-left: 0.13333rem;
            width: 0.16rem;
            height: 0.346666rem;
            display: inline-block;
            background-size: 0.16rem 0.346666rem;
            background-position: center;
            background-image: url("/static/arrow-right.svg");
          }
        }
        .record {
          width: 100%;
          height: 0.4rem;
          font-size: 0.4rem;
          color: #666666;
          text-align: center;
          margin-top: 0.8rem;
          vertical-align: center;
          .icon {
            width: 0.4rem;
            height: 0.4rem;
            background-size: 0.4rem auto;
            background-image: url('/static/book.svg');
            background-repeat: no-repeat;
            background-position: center;
            display: inline-block;
            position: relative;
            top: 0.08rem;
            margin-right: 0.13333rem;
          }
          span {
            font-size: 0.293333rem;
            color: #999999;
            margin-right: 0.13333rem;
          }
        }
        .infos {
          width: 100%;
          height: 1.1rem;
          display: flex;
          margin-top: 0.6rem;
          .item {
            flex: 1;
            height: 100%;
            text-align: center;
            border-right: #cccccc solid thin;
            .value {
              font-size: 0.4rem;
              color: #666666;
            }
            .label {
              font-size: 0.293333rem;
              color: #999999;
              margin-top: 0.1rem;
            }
          }
          .item:last-child {
            border-right: none;
          }
        }
      }
      .row {
        width: 100%;
        height: 1.306666rem;
        line-height: 1.306666rem;
        padding: 0 0.4rem 0 1.44rem;
        background: white;
        position: relative;
        font-size: 0.4rem;
        color: #666666;
        .icon {
          width: 0.64rem;
          height: 0.64rem;
          background-size: 0.4rem 0.4rem;
          background-repeat: no-repeat;
          background-position: center;
          position: absolute;
          left: 0.4rem;
          top: 0.3333rem;
          vertical-align: middle;
        }
        .shoppingcar {
          background-color: #f0944b;
          border-radius: 4px;
          background-image: url('/static/shoppingcar.svg');
        }
        .jiudianbang {
          background-size: 0.64rem 0.64rem;
          border-radius: 4px;
          background-image: url('/static/jiudianbang.png');
        }
        .gongzhonghao {
          background-color: #49ab54;
          border-radius: 4px;
          background-image: url('/static/public.svg');
        }
        .arrow-right {
          position: absolute;
          right: 0.4rem;
          width: 0.16rem;
          height: 100%;
          display: inline-block;
          background-size: 0.16rem 0.346666rem;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("/static/arrow-right.svg");
        }
      }
      .bought, .about {
        margin-top: 0.26666rem;
      }
      .hr {
        width: 100%;
        height: 1px;
        background: white;
        padding-left: 1.44rem;
        .inner {
          height: 1px;
          background: #cccccc;
        }
      }
      .page {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 100;
        left: 0;
        top: 0;
      }
    }
    .page.about-page {
      background: #f1f1f1;
      padding-top: 0.93333rem;
      .logo {
        text-align: center;
        img {
          height: 2.13333rem
        }
      }
      .desc {
        padding: 0 0.4rem;
        font-size: 0.4rem;
        color: #666666;
        line-height: 1.8;
        margin-top: 0.6666rem;
        margin-bottom: 0.8rem;
      }
      .item {
        width: 100%;
        height: 1.306666rem;
        line-height: 1.306666rem;
        padding: 0 0.4rem 0 0.4rem;
        background: white;
        position: relative;
        font-size: 0.4rem;
        color: #666666;
        margin-top: 0.26666rem;
        .arrow-right {
          position: absolute;
          right: 0.4rem;
          width: 0.16rem;
          height: 100%;
          display: inline-block;
          background-size: 0.16rem 0.346666rem;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("/static/arrow-right.svg");
        }
        span {
          float: right;
          color: @red;
        }
      }
    }
    .page.bought-page {
      background: #f1f1f1;
      padding-top: 0.26666rem;
      .bought-item {
        background: white;
        padding: 0.26666rem 0.4rem;
        border-top: solid thin #ebebeb;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.26666rem;
        .avater {
          width: 2rem;
          height: 2.6666rem;
          position: relative;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .desc {
          width: 6.8rem;
          height: 2.6666rem;
          padding: 0.13333rem 0;
          .title {
            width: 100%;
            font-size: 0.4rem;
            height: 0.4rem;
            color: #333333;
            font-weight: 600;
          }
          .orderid {
            margin-top: 0.186666rem;
            font-size: 0.346666rem;
            color: #666666;
          }
          .time {
            margin-top: 0.35rem;
            font-size: 0.293333rem;
            color: #999999;
          }
          .price {
            margin-top: 0.05rem;
            color: @red;
            font-size: 0.32rem;
          }
        }
      }
    }
  }
</style>
