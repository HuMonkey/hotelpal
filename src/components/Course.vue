<template>
  <div class="course-container">
    <div class="free-course-tips" v-if="course && !course.purchased && userinfo && userinfo.freeCourseRemained > 0 && freeTips">
      亲爱的内邀用户，你{{ userinfo.freeCourseRemained < 3 ? '还' : '' }}有{{ userinfo.freeCourseRemained }}次免费学习课程的机会
      <img src="/static/cross.png" @click="closeTips">
    </div>
    <div v-if="course">
      <div class="header">
        <img :src="course.bannerImg && course.bannerImg[0]">
        <div class="desc" v-if="!course.purchased">
          <div class="title">{{ course.title }}</div>
          <div class="sub-title">{{ course.subtitle }}</div>
          <div class="tags" v-if="false">
            <div class="item" v-for="t in course.tag">{{ t.name }}</div>
          </div>
        </div>
        <div class="desc" v-if="course.purchased">
          <div class="title">{{ course.userName }}</div>
          <div class="sub-title">{{ course.company + ' ' + course.userTitle }}</div>
        </div>
        <div class="state coming" v-if="course.status === 0">预告</div>
      </div>
      <div class="content">
        <div class="gotoDetail" v-if="course.purchased" @click="gotoDetail">
          <div class="title">{{ course.title }}</div>
          <div class="sub-title">{{ course.subtitle }}</div>
          <!-- <div class="tags" v-if="course.tag && course.tag.length > 0">
            <div class="item" v-for="t in course.tag">{{ t.name }}</div>
          </div> -->
          <div class="arrow"></div>
        </div>
        <div class="block teacher" v-if="!course.purchased">
          <div class="label">主讲人</div>
          <div class="name">
            <span class="userName">{{ course.userName }}</span>
            <span class="userTitle">{{ course.company + '·' + course.userTitle }}</span>
          </div>
          <div class="intro" v-if="course.speakerDescribe" v-html="course.speakerDescribe || '暂无介绍'"></div>
          <div class="hr"></div>
        </div>
        <div class="block course-intro" v-if="!course.purchased">
          <div class="label">课程介绍</div>
          <div class="intro" :class="{overflow: isIntroOverflow && introOverflow}" v-html="course.introduce || '暂无'"></div>
          <div class="open" v-if="isIntroOverflow" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
          <div class="hr"></div>
        </div>
        <div class="block who" v-if="!course.purchased">
          <div class="label">适宜人群</div>
          <div class="intro">
            <div v-html="course.crowd || '暂无'"></div>
            <!-- 以及那些对酒店创意感兴趣的你 -->
          </div>
          <div class="hr"></div>
        </div>
        <div class="block getting" v-if="!course.purchased">
          <div class="label">你将收获</div>
          <div class="intro" v-html="course.gain || '暂无'"></div>
          <div class="hr"></div>
        </div>
        <div class="block care" v-if="!course.purchased">
          <div class="label">订阅须知</div>
          <div class="intro" v-html="course.subscribe || '暂无'"></div>
          <div class="hr"></div>
        </div>
        <div class="block lessons">
          <div class="label">课时内容</div>
          <div class="list">
            <div class="item" :class="{free: l.freeListen, future: !l.isPublish, finished: l.listenLen && l.listenLen >= l.audioLen}" @click="gotoLesson(l)" v-for="(l, index) in course.lessonList" :id="'lesson-' + l.id">
              <div class="up">
                <span>{{ l.lessonOrder }}</span><span class="vr">|</span><span class="ltitle">{{ l.title }}</span>
                <span class="tag" v-if="l.freeListen">
                  <span>免费试听</span>
                </span>
              </div> 
              <div class="down">
                <p v-if="l.isPublish">
                  <span v-if="l.publishTime">{{ l.publishTime }}</span>
                  <span v-if="l.resourceSize">{{ l.resourceSize }}</span>
                  <span v-if="l.lenStr">{{ l.lenStr }}</span>
                  <span class="over" v-if="l.listenLen && l.listenLen >= l.audioLen">已播完</span>
                  <span class="ing" v-if="l.listenLen && l.listenLen < l.audioLen">已播{{ parseInt(l.listenLen / l.audioLen * 100) }}%</span>
                </p>
                <p v-if="!l.isPublish">
                  尚未发布
                </p>
              </div>
              <div class="arrow" v-if="l.isPublish"></div>
            </div>
          </div>
          <div class="hr"></div>
        </div>
        <div class="block back">
          <div class="box" @click="gotoHome">
            <img src="/static/jiudianbang.png">
            <div class="title">酒店邦成长营</div>
            <div class="desc">为你提供高效、省时的知识服务</div>
            <div class="arrow"></div>
          </div>
        </div>
      </div>
      <div class="btns" v-if="!course.purchased">
        <div class="item free" v-if="hasFree" @click="gotoFree">免费试读</div>
        <div class="item buy" @click="gotoPay">订阅：¥ {{ course.charge / 100 }} / {{ course.lessonCount }}课时</div>
      </div>
      <div class="pay-finish" v-if="payFinish">
        <div class="cover"></div>
        <div class="box">
          <div class="icon"></div>
          <div class="text">支付成功</div>
        </div>
      </div>
    </div>  
  </div>
</template>

<script>
import util from '../util/index';
import moment from 'moment';

const formatDate = function(y, m, d) {
  let year = y == (new Date()).getFullYear() ? '' : y + '-';
  return year + (m.length > 1 ? m : '0' + m) + '-' + (d.length > 1 ? d : '0' + d)
}

export default {
  name: 'course',
  props: [],
  data () {
    return {
      isIntroOverflow: false,
      introOverflow: true,
      course: null,
      userinfo: null,
      payFinish: false,
      freeTips: true,
      paying: false,
    }
  },
  created() {
    // document.title = '加载课程...';
  },
  mounted() {
    const courseId = util.getParam('cid');
    util.getCourse(courseId, (json) => {
      if (json.code === 0) {
        const course = json.data;
        document.title = course.title;
        this.course = {
          ...course,
          lessonList: course.lessonList.map((d, i) => {
            let publishTime = '';
            let lenStr = '';
            let lessonOrder = d.lessonOrder && d.lessonOrder.toString();
            if (d.isPublish === 1) {
              const temp = d.publishTime.split('-');
              publishTime = formatDate(temp[0], temp[1], temp[2]);
              lenStr = moment(d.audioLen * 1000).format('mm:ss');
            }
            if (lessonOrder && lessonOrder.length < 2) {
              lessonOrder = '0' + lessonOrder;
            }
            return {
              ...d,
              publishTime, lenStr, lessonOrder
            }
          })
        };
        let rem = document.body.clientWidth / 10;
        rem = rem > 75 ? 75 : rem;
        let fontSize = rem * 0.4;
        const length = util.textLength(this.course.introduce, fontSize);
        if (length > 9.2 * rem * 8) {
          this.isIntroOverflow = true;
        }
        if (util.getParam('code')) {
          const cid = util.getParam('cid')
          util.changeURL({
            cid
          }, true)
        }
        this.updateShare();
      } else {
        console.warn('获取课程信息失败！')
      }
    })
    util.getUserInfo((json) => {
      if (json.code === 0) {
        this.userinfo = json.data;
      } else {
        console.warn('获取用户信息失败')
      }
    })
  },
  methods: {
    closeTips: function () {
      this.freeTips = false;
    },
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    updateShare: function () {
      const course = this.course;
      util.updateWechatShare({
        title: course.userName + '：' + course.title,
        link: location.href,
        imgUrl: course.headImg,
        desc: util.getHtmlContent(course.introduce),
      })
    },
    gotoLesson: function (lesson) {
      if (!lesson.isPublish) {
        // TODO
        return false;
      }
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '&lid=' + lesson.id + '#/lesson';
    },
    gotoHome: function () {
      location.href = '/#/';
    },
    showPayFinish () {
      this.payFinish = this.replyId ? 2 : 1;
      setTimeout(() => {
        this.payFinish = false;
      }, 2000);
    },
    gotoPay: function () {
      if (!this.userinfo.phone) {
        const redirect = encodeURIComponent('/' + location.search + location.hash);
        location.href = '/?redirect=' + redirect + '#/login';
        return false;
      }
      if (this.paying) {
        return false;
      }
      this.paying = true;
      const cid = util.getParam('cid');
      if (this.userinfo.freeCourseRemained > 0) {
        const useFree = confirm('将使用一次免费获取课程的机会，确认兑换？')
        if (useFree) {
          util.getFreeCourse(cid, (json) => {
            this.paying = false;
            if (json.code === 0) {
              this.showPayFinish();
              this.userinfo.freeCourseRemained--;
              this.course.purchased = true;
            } else {
              console.warn('获取免费课程出现了点问题')
            }
          })
          return false;
        }
      }
      util.createPayOrder(cid, (json) => {
        this.paying = false;
        if (json.code === 0) {
          const { appId, nonceStr, paySign, timeStamp, tradeNo } = json.data;
          wx.chooseWXPay({
            timestamp: timeStamp,
            appId: appId,
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: json.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: (res) => {
              // 支付成功后的回调函数
              this.course.purchased = true;
              util.pay(cid, tradeNo, function (json) {
                // console.log(json)
              });
            },
            error: () => {
              console.warn('支付失败')
            }
          });
        } else {
          console.warn('支付出现了点问题')
        }
      })
    },
    gotoFree: function () {
      const cid = util.getParam('cid');
      const lessonList = this.course.lessonList;
      let lesson;
      for (let i = 0; i < lessonList.length; i++) {
        if (lessonList[i].freeListen && lessonList[i].isPublish) {
          lesson = lessonList[i];
          break;
        }
      }
      if (!lesson) {
        return false;
      }
      document.body.scrollTop = document.querySelector('#lesson-' + lesson.id).getBoundingClientRect().top + document.body.scrollTop;
    },
    gotoDetail: function () {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '#/cousedetail'
    }
  },
  destroyed() {},
  computed: {
    hasFree: function () {
      const lessonList = this.course.lessonList;
      if (!lessonList) {
        return false;
      }
      for (let i = 0; i < lessonList.length; i++) {
        if (lessonList[i].freeListen === 1) {
          return true;
        }
      }
      return false;
    }
  },
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .course-container {
    width: 100%;
    padding: 0 0 1.26666rem 0;
    background: white;
    line-height: 1;
    -webkit-user-select: none;
    .pay-finish {
      width: 100%;
      height: 100%;
      position: fixed;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      top: 0;
      left: 0;
      .cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
      .box {
        border-radius: 10px;
        width: 3.12rem;
        height: 2.293333rem;
        background: white;
        position: relative;
        z-index: 1;
        .icon {
          width: 1rem;
          height: 1rem;
          margin: auto;
          margin-top: 0.4rem;
          background-image: url('/static/finish-arrow.svg');
          background-size: 1rem 1rem;
          background-position: center;
          background-repeat: no-repeat;
        }
        .text {
          font-size: 0.4rem;
          color: #999999;
          width: 100%;
          text-align: center;
          margin-top: 0.13333rem;
        }
      }
    }
    .free-course-tips {
      position: fixed;
      z-index: 99;
      background: @red;
      color: white;
      padding: 0 0.4rem;
      height: 0.8rem;
      width: 100%;
      font-size: 0.32rem;
      display: flex;
      align-items: center;
      img {
        height: 0.32rem;
        position: absolute;
        top: 0.24rem;
        right: 0.32rem;
      }
    }
    .header {
      width: 100%;
      height: 6.6666rem;
      position: relative;
      .state.coming {
        height: 0.426666rem;
        border-radius: 4px;
        padding-left: 0.1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        position: absolute;
        top: 0.26666rem;
        left: -0.1rem;
        font-size: 0.4rem;
        background: #f0944a;
        width: 1.6rem;
        height: 0.8rem;
      }
      img {
        width: 100%;
        height: 100%;
      }
      .desc {
        color: white;
        position: absolute;
        left: 0.4rem;
        bottom: 0.4rem;
        font-weight: 100;
        .title {
          font-weight: 600;
          font-size: 0.56rem;
        }
        .sub-title {
          margin-top: 0.26666rem;
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
      .course-detail {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 101;
      }
      .gotoDetail {
        padding: 0.53333rem 0;
        margin: 0 0.4rem;
        border-bottom: @border;
        position: relative;
        .title {
          font-size: 0.48rem;
          color: #333333;
        }
        .sub-title {
          margin-top: 0.26666rem;
          font-size: 0.4rem;
          color: #999999;
        }
        .tags {
          display: flex;
          margin-top: 0.4rem;
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
        .arrow {
          position: absolute;
          top: 0;
          right: 0;
          width: 0.2rem;
          height: 100%;
          background-image: url('/static/arrow-right.svg');
          background-size: 0.2rem auto;
          background-position: center;
          background-repeat: no-repeat;
        }
      }
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
          border-left: @red 4px solid;
          color: #999999;
          display: flex;
          align-items: center;
          .userName {
            margin: 0 0.26666rem;
            color: black;
            font-size: 0.426666rem;
          }
          .userTitle {
            vertical-align: bottom;
            display: flex;
            align-items: flex-end;
            height: 0.426666rem;
          }
        }
        .intro {
          width: 100%;
          font-size: 0.4rem;
          line-height: 1.8;
          color: #666666;
          margin-top: 0.26666rem;
          text-align: justify;
          p {}
          p:last-child {
            margin-bottom: 0;
          }
          img {
            margin: 0.26666rem 0;
          }
        }
        .open {
          margin-top: 0.4rem;
          font-size: 0.4rem;
          text-align: center;
          color: @red;
        }
        .hr {
          border-top: @border;
          margin-top: 0.4rem;
        }
      }
      .course-intro {
        .intro.overflow {
          overflow: hidden;
          height: 6.4rem;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 8;
          -webkit-box-orient: vertical;
          -webkit-mask-image: linear-gradient(#000 10%,transparent 100%);
          mask-image: linear-gradient(#000 30%,transparent 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }
      }
      .lessons {
        .hr {
          border-top: @border;
          margin-top: 0.53333rem;
        }
        .list {
          .item {
            width: 100%;
            // height: 1.6rem;
            border-radius: 4px;
            border: #ebebeb solid thin;
            margin-bottom: 0.26666rem;
            padding: 0.346666rem 0.4rem;
            position: relative;
            color: #333333;
            line-height: 1;
            .up {
              font-size: 0.373333rem;
              height: 0.373333rem;
              display: flex;
              align-items: center;
              .vr {
                margin: 0 0.13333rem;
              }
              .tag {
                display: flex;
                align-items: center;
                border: @red solid thin;
                color: @red;
                font-size: 0.32rem;
                height: 0.6rem;
                border-radius: 4px;
                padding: 0 0.16rem;
                margin-left: 0.26666rem;
                height: 0.48rem;
                span {
                  display: inline-block;
                  height: 0.48rem;
                  line-height: 0.48rem;
                  transform: scale(0.916666);
                }
              }
              .ltitle {
                display: inline-block;
                max-width: 7rem;
                white-space:nowrap; 
                overflow:hidden;
                text-overflow:ellipsis;
                height: 0.6rem;
                line-height: 0.6rem;
              }
            }
            .down {
              font-size: 0.293333rem;
              margin-top: 0.26666rem;
              color: #bbbbbb;
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
            .up {
              .ltitle {
                max-width: 5rem;
              }
            }
          }
          .item.future {
            background: #f5f5f5;
            color: #cccccc;
          }
          .item.finished {
            color: #999999;
          }
        }
      }
      .back {
        padding: 0.53333rem 0.4rem;
        .box {
          width: 100%;
          background: #ffffff;
          height: 2.13333rem;
          border-radius: 4px;
          border: #ebebeb solid thin;
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
            margin-left: 1.706666rem;
            font-size: 0.4rem;
            color: #666666;
            margin-top: 0.18rem;
          }
          .desc {
            margin-left: 1.706666rem;
            font-size: 0.32rem;
            color: #999999;
            margin-top: 0.32rem;
          }
          .arrow {
            position: absolute;
            top: 0;
            right: 0.4rem;
            width: 0.64rem;
            height: 100%;
            background-image: url('/static/circle-arrow.svg');
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
        border-top: #ebebeb solid thin;
      }
      .buy {
        color: white;
        background: @red;
        border-top: @red solid thin;
      }
    }
  }
</style>
