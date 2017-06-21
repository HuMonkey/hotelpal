<template>
  <div class="course-container">
    <div class="error-tips" v-if="error">
      {{ error }}
      <img src="/static/cross.png" @click="closeErrorTips">
    </div>
    <div class="header">
      <img src="/static/banner_1.jpg">
      <div class="desc">
        <div class="title">{{ course.title }}</div>
        <div class="sub-title">{{ course.subtitle }}</div>
        <div class="tags">
          <div class="item" v-for="t in course.tag">{{ t }}</div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="block teacher">
        <div class="label">主讲人</div>
        <div class="name">
          <span>{{ course.userName }}</span>
          {{ course.userTitle }}
        </div>
        <div class="intro" v-if="course.speakerDescribe">
          <p>{{ course.speakerDescribe || '暂无介绍' }}</p>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block course-intro">
        <div class="label">课程介绍</div>
        <div class="intro" :class="{overflow: isIntroOverflow && introOverflow}">
          {{ course.introduce || '暂无' }}
        </div>
        <div class="open" v-if="isIntroOverflow" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
        <div class="hr"></div>
      </div>
      <div class="block who">
        <div class="label">适宜人群</div>
        <div class="intro">
          {{ course.crowd || '暂无' }}
        </div>
        <div class="hr"></div>
      </div>
      <div class="block getting">
        <div class="label">你将收获</div>
        <div class="intro">
          {{ course.gain || '暂无' }}
        </div>
        <div class="hr"></div>
      </div>
      <div class="block lessons">
        <div class="label">课时</div>
        <div class="list">
          <div class="item" :class="{future: false}" @click="gotoLesson(l.id)" v-for="(l, index) in course.lessonList">
            <div class="up">
              <span>{{ l.lessonNo }}</span> | {{ l.title }}
              <span class="tag" v-if="false">免费试听</span>
            </div> 
            <div class="down">
              <p v-if="true">
                <span>{{ l.publishTime }}</span>
                <span>{{ l.resourceSize || '10.23MB' }}</span>
                <span>{{ l.lenStr }}</span>
                <span class="over" v-if="false">已播完</span>
                <span class="ing" v-if="false">已播80%</span>
              </p>
              <p v-if="false">
                尚未发布
              </p>
            </div>
            <div class="arrow"></div>
          </div>
        </div>
        <div class="hr"></div>
      </div>
      <div class="block back">
        <div class="box" @click="gotoHome">
          <img src="/static/jiudianbang.png">
          <div class="title">酒店邦成长营</div>
          <div class="desc">发现更多酒店人的必修课</div>
          <div class="arrow"></div>
        </div>
      </div>
    </div>
    <div class="btns" v-if="!course.purchased">
      <div class="item free">免费试读</div>
      <div class="item buy" @click="gotoPay">订阅：¥ 199 / 10课时</div>
    </div>
  </div>
</template>

<script>
import util from '../util/index';
import moment from 'moment';

console.log(moment)

export default {
  name: 'course',
  props: [],
  data () {
    return {
      isIntroOverflow: false,
      introOverflow: true,
      error: 'wrong wrong',
      course: {}
    }
  },
  created() {},
  mounted() {
    const courseId = util.getParam('cid');
    util.getCourse(courseId, (json) => {
      if (json.code === 0) {
        const course = json.data;
        document.title = course.title;
        this.course = {
          ...course,
          tag: ['标签标签111', '标签2'],
          lessonList: course.lessonList.map((d, i) => {
            let publishTime = '';
            let lenStr = '';
            if (d.isPublish === 1) {
              publishTime = moment(d.publishTime).format('MM-DD');
              lenStr = moment(d.audioLen * 1000).format('mm:ss');
            }
            return {
              ...d,
              publishTime, lenStr
            }
          })
        };
        let rem = document.body.clientWidth / 10;
        rem = rem > 75 ? 75 : rem;
        let fontSize = rem * 0.4;
        const length = util.textLength(this.course.introduce, fontSize);
        if (length > 9.2 * rem * 2) {
          this.isIntroOverflow = true;
        }
      } else {
        console.warn('获取课程信息失败！')
      }
    })
  },
  methods: {
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    closeErrorTips: function() {
      this.error = null;
    },
    gotoLesson: function (lessonId) {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '&lid=' + lessonId + '#/lesson';
    },
    gotoHome: function () {
      location.href = '/#/';
    },
    gotoPay: function () {
      const cid = util.getParam('cid');
      util.createPayOrder(cid, (json) => {
        if (json.code === 0) {
          const { appId, nonceStr, paySign, timeStamp } = json.data;
          wx.chooseWXPay({
            timestamp: timeStamp,
            appId: appId,
            nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
            package: json.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
            }
          });
        } else {
          console.warn('支付出现了点问题')
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
                font-size: 0.26666rem;
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
          background: #f5f5f5;
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
