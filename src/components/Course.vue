<template>
  <div class="course-container">
    <div class="error-tips" v-if="error">
      {{ error }}
      <img src="/static/cross.png" @click="closeErrorTips">
    </div>
    <div class="header">
      <img src="/static/banner_1.jpg">
      <div class="desc">
        <div class="title">一个酒店怎么收入过亿呢</div>
        <div class="sub-title">客户最重要，没有客户怎么过亿</div>
        <div class="tags">
          <div class="item">吹牛逼</div>
          <div class="item">创业</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="block teacher">
        <div class="label">主讲人</div>
        <div class="name">
          <span>胡万祺</span>
          酒店邦创始人
        </div>
        <div class="intro">
          <p>一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆</p>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block course-intro">
        <div class="label">课程介绍</div>
        <div class="intro" :class="{overflow: introOverflow}">
          <p>一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆</p>
          <p>一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆</p>
        </div>
        <div class="open" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
        <div class="hr"></div>
      </div>
      <div class="block who">
        <div class="label">适宜人群</div>
        <div class="intro">
          <p>一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆</p>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block getting">
        <div class="label">你将收获</div>
        <div class="intro">
          <p>一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆</p>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block lessons">
        <div class="label">课时</div>
        <div class="list">
          <div class="item" :class="{future: false}">
            <div class="up">
              <span>01</span> | 收入增加的5个秘密
              <span class="tag" v-if="true">免费试听</span>
            </div> 
            <div class="down">
              <p v-if="true">
                <span>04-07</span>
                <span>5.2MB</span>
                <span>12:23</span>
                <span class="over" v-if="false">已播完</span>
                <span class="ing" v-if="true">已播80%</span>
              </p>
              <p v-if="false">
                尚未发布
              </p>
            </div>
            <div class="arrow">

            </div>
          </div>
          <div class="item" :class="{future: true}">
            <div class="up">
              <span>02</span> | 收入增加的5个秘密
              <span class="tag" v-if="false">免费试听</span>
            </div> 
            <div class="down">
              <p v-if="false">
                <span>04-07</span>
                <span>5.2MB</span>
                <span>12:23</span>
                <span class="over" v-if="false">已播完</span>
                <span class="ing" v-if="true">已播80%</span>
              </p>
              <p v-if="true">
                尚未发布
              </p>
            </div>
            <div class="arrow" v-if="false">

            </div>
          </div>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block back">
        <div class="box">
          <img src="/static/logo.png">
          <div class="title">酒店邦成长营</div>
          <div class="desc">发现更多酒店人的必修课</div>
          <div class="arrow"></div>
        </div>
      </div>
    </div>
    <div class="btns">
      <div class="item free">免费试读</div>
      <div class="item buy">订阅：¥ 199 / 10课时</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'course',
  props: [],
  data () {
    return {
      introOverflow: true,
      error: 'wrong wrong',
    }
  },
  created() {},
  mounted() {
    
  },
  methods: {
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    closeErrorTips: function() {
      this.error = null;
    },
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .course-container {
    width: 100%;
    padding: 0 0 1.26666rem 0;
    background: white;
    .error-tips {
      position: fixed;
      z-index: 99;
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
    .header {
      width: 100%;
      height: 6.6666rem;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      .desc {
        color: white;
        position: absolute;
        left: 0.4rem;
        bottom: 0.26666rem;
        font-weight: 100;
        .title {
          font-weight: 600;
          font-size: 0.56rem;
        }
        .sub-title {
          margin-top: 0.16666rem;
          font-size: 0.426666rem;
        }
        .tags {
          display: flex;
          margin-top: 0.26666rem;
          .item {
            height: 0.46666rem;
            padding: 0 0.1rem;
            font-size: 0.26666rem;
            line-height: 0.44rem;
            border: thin solid white;
            border-radius: 2px;
            margin-right: 0.26666rem;
          }
        }
      }
    }
    .content {
      width: 100%;
      position: relative;
      .label {
        width: 100%;
        font-size: 0.48rem;
        margin: 0 0 0.53333rem 0;
      }
      .block {
        padding: 0.53333rem 0.4rem 0 0.4rem;
        .name {
          width: 100%;
          font-size: 0.32rem;
          height: 0.426666rem;
          line-height: 0.426666rem;
          border-left: @red 6px solid;
          color: #999999;
          span {
            margin: 0 0.26666rem;
            color: black;
            font-size: 0.426666rem;
          }
        }
        .intro {
          width: 100%;
          font-size: 0.4rem;
          line-height: 1.8;
          color: #666666;
          margin-top: 0.26666rem;
          p {
            margin-bottom: 1rem;
          }
          p:last-child {
            margin-bottom: 0;
          }
        }
        .open {
          margin-top: 0.4rem;
          font-size: 0.4rem;
          text-align: center;
          color: @red;
        }
        .hr {
          height: 1px;
          background: #cccccc;
          margin-top: 0.4rem;
        }
      }
      .course-intro {
        .intro.overflow {
          overflow: hidden;
          height: 1.44rem;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .lessons {
        .list {
          .item {
            width: 100%;
            height: 1.6rem;
            border-radius: 4px;
            border: #cccccc solid thin;
            margin-bottom: 0.13333rem;
            padding: 0.15rem 0.4rem;
            position: relative;
            color: #999999;
            .up {
              font-size: 0.4rem;
              .tag {
                display: inline-block;
                border: @red solid thin;
                color: @red;
                font-size: 0.2rem;
                height: 0.6rem;
                line-height: 0.6rem;
                border-radius: 4px;
                padding: 0 0.1rem;
                vertical-align: bottom;
                margin-left: 0.26666rem;
              }
            }
            .down {
              font-size: 0.293333rem;
              margin-top: 0.15rem;
              span {
                margin-right: 0.4rem;
              }
              .ing {
                color: @red;
              }
            }
            .arrow {
              position: absolute;
              top: 0;
              right: 0.4rem;
              width: 0.2rem;
              height: 100%;
              background-image: url('/static/arrow-right.svg');
              background-size: 0.2rem auto;
              background-position: center;
              background-repeat: no-repeat;
            }
          }
          .item.free {
            color: #999999;
          }
          .item.future {
            background: #f5f5f5;
            color: #cccccc;
          }
        }
      }
      .back {
        padding: 0.4rem;
        .box {
          width: 100%;
          height: 2.13333rem;
          border-radius: 4px;
          border: #cccccc solid thin;
          padding: 0.15rem 0.4rem;
          position: relative;
          color: #999999;
          padding: 0.346666rem 0.4rem;
          img {
            width: 1.44rem;
            height: 1.44rem;
            float: left;
          }
          .title {
            margin-left: 2.13333rem;
            font-size: 0.4rem;
            color: #666666;
            margin-top: 0.1rem;
          }
          .desc {
            margin-left: 2.13333rem;
            font-size: 0.32rem;
            color: #999999;
            margin-top: 0.2rem;
          }
          .arrow {
            position: absolute;
            top: 0;
            right: 0.4rem;
            width: 0.64rem;
            height: 100%;
            background-image: url('/static/arrow-right.svg');
            background-size: 0.64rem auto;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
      }
    }
    .btns {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1.26666rem;
      display: flex;
      .item {
        flex: 1;
        height: 100%;
        line-height: 1.26666rem;
        text-align: center;
        color: #333333;
        font-size: 0.4rem;
        background: white;
        border: #cccccc solid thin;
      }
      .buy {
        color: white;
        background: @red;
        border: @red solid thin;
      }
    }
  }
</style>
