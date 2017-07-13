<template>
  <div class="hongbao-container">
    <div v-if="number > 0">
      <div class="aavater">
        <div class="img"><img :src="userHeader"></div>
      </div>
      <div class="name">{{ userName + '请你学知识' }}</div>
    </div>
    <div class="over-tips" v-if="number === 0">
      知识红包已抢完，<span @click="gotoHome">去查看更多课程</span><div class="icon"></div>    
    </div>
    <div class="hongbao" v-if="number !== null">
      <img class="hongbao-bg" src="/static/hongbao.png">
      <div class="box">
        <div class="avater">
          <img :src="course.headImg">
        </div>
        <div class="desc">
          <div class="title">{{ course.title }}</div>
          <div class="title">{{ lesson.title }}</div>
          <div class="who">{{ course.userName }}<br />{{ course.company }}</div>
        </div>
      </div>
      <div class="btn" :class="{over: number == 0}" @click="openRedPacket">{{ number > 0 ? '抢' : '抢完了' }}</div>
      <div class="tips" v-if="number > 0">限量三个名额，快来领取</div>
      <div class="tips" v-if="number === 0">名额已抢完</div>
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
      number: null,
      course: {},
      lesson: {},

      userName: '',
      userHeader: '',
    }
  },
  created() {},
  mounted() {
    const lid = util.getParam('lid');
    const cid = util.getParam('cid');
    const userName = util.getParam('userName');
    const userHeader = util.getParam('userHeader');

    this.userName = decodeURIComponent(userName);
    this.userHeader = decodeURIComponent(userHeader);

    util.getCourse(cid, (json) => {
      if (json.code === 0) {
        this.course = json.data;
      } else {
        console.warn('获取课程信息失败！')
      }
    })

    util.getLesson(lid, (json) => {
      if (json.code === 0) {
        this.lesson = json.data;
        this.number = json.data.redPacketRemained;
      } else {
        console.warn('获取课时失败！')
      }
    });
  },
  methods: {
    gotoHome: function () {
      location.href = '/';
    },
    openRedPacket: function () {
      if (this.number == 0) {
        return false;
      }
      util.openRedPacket(this.lesson.redPacketNonce, (json) => {
        if (json.code === 0) {
          console.log(json);
          const lid = util.getParam('lid');
          const cid = util.getParam('cid');
          location.href = '/?cid=' + cid + '&lid=' + lid + '&fromHongbao=1#/lesson'
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
