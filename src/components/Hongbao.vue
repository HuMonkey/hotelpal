<template>
  <div class="hongbao-container">
    <div v-if="data && !data.alreadyOpened">
      <div v-if="data.redPacketRemained > 0">
        <div class="aavater">
          <div class="img"><img :src="data.userHeadImg"></div>
        </div>
        <div class="name">{{ data.userName + '请你学知识' }}</div>
      </div>
      <div class="over-tips" v-if="data.redPacketRemained === 0">
        知识红包已抢完，<span @click="gotoHome">去查看更多课程</span><div class="icon"></div>    
      </div>
      <div class="hr"></div>
      <div class="hongbao" v-if="data.redPacketRemained !== null">
        <img class="hongbao-bg" src="/static/hongbao.png">
        <div class="box">
          <div class="avater">
            <img :src="data.speakerHeadImg">
          </div>
          <div class="desc">
            <div class="title">{{ data.lessonTitle }}</div>
            <!-- <div class="title">{{ lessonTitle }}</div> -->
            <div class="who">{{ data.speakerName }}<br />{{ data.speakerCompany + ' ' + data.speakerTitle }}</div>
          </div>
        </div>
        <div class="btn" :class="{over: data.redPacketRemained === 0}" @click="openRedPacket">{{ data.redPacketRemained > 0 ? '抢' : '抢完了' }}</div>
        <div class="tips" v-if="data.redPacketRemained > 0">限量{{ data.redPacketRemained }}个名额，快来领取</div>
        <div class="tips" v-if="data.redPacketRemained === 0">名额已抢完</div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'hongbao',
  props: [],
  data () {
    return {
      course: {},
      lesson: {},

      userName: '',
      userHeader: '',
      lessonTitle: '',
      redPacketNonce: '',
      redPacketRemained: '',

      notPurchased: false,

      data: null,
      
    }
  },
  created() {},
  mounted() {
    const lid = util.getParam('lid');
    const cid = util.getParam('cid');

    const redPacketNonce = util.getParam('redPacketNonce');

    this.redPacketNonce = decodeURIComponent(redPacketNonce);

    util.getRedPacketRemained(this.redPacketNonce, (json) => {
      if (json.code === 0) {
        this.data = json.data;
        if (this.data.alreadyOpened) {
          location.href = '/?redPacketNonce=' + this.redPacketNonce + '&cid=' + cid + '&lid=' + lid + '&fromHongbao=1#/lesson';
        }
      } else {
        console.warn('获取红包报错');
      }
    })
  },
  methods: {
    gotoHome: function () {
      location.href = '/';
    },
    openRedPacket: function () {
      util.openRedPacket(this.redPacketNonce, (json) => {
        if (json.code === 0 || json.code === 40001) {
          const lid = util.getParam('lid');
          const cid = util.getParam('cid');
          location.href = '/?redPacketNonce=' + this.redPacketNonce + '&cid=' + cid + '&lid=' + lid + '&fromHongbao=1#/lesson'
        } else {
          console.warn('拆红包失败！')
        }
      })
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
    overflow: hidden;
    line-height: 1;
    .hr {
      width: 80%;
      margin: auto;
      margin-top: 0.6666rem;
      margin-bottom: 1.0666rem;
      border-top: #cccccc solid thin;
    }
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
    .aavater {
      margin-top: 0.8rem;
      overflow: hidden;
      .img {
        width: 1.3rem;
        height: 1.3rem;
        border-radius: 1.3rem;
        margin: auto;
        display: block;
        overflow: hidden;
        text-align: center;
        img {
          width: 1.3rem;
        }
      }
    }
    .name {
      font-size: 0.4rem;
      height: 0.4rem;
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
      // margin-top: 1.3333rem;
      padding: 1px;
      width: 100%;
      height: 8.93333rem;
      text-align: center;
      position: relative;
      .hongbao-bg {
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
        .avater {
          width: 1.2rem;
          height: 1.73333rem;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          border-radius: 4px;
          img {
            height: 100%;
          }
        }
        .desc {
          font-size: 0.32rem;
          width: 2.53333rem;
          height: 1.73333rem;
          padding: 0.1rem 0;
          color: #666666;
          text-align: left;
          margin-left: 0.4rem;
          .title {
            width: 100%;
            overflow: hidden;
            line-height: 1.2;
            height: 0.7rem;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 0.06666rem;
          }
          .name, .who {
            color: #999999;
            margin-top: 0.1rem;
            line-height: 1.2;
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
