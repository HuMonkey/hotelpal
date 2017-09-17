<template>
  <div class="profile-container">
    <Error :error="error" v-if="error"></Error>
    <div class="index-page" v-if="mode === 1">
      <div class="banner">
        <img src="/static/profile_bg.png">
      </div>
      <div class="header">
        <div class="avater">
          <div class="img" @click="setMode(4)" :class="{long: userinfo.isLong, short: !userinfo.isLong}">
            <img :src="userinfo.headImg">
          </div>
        </div>
        <div class="name" @click="setMode(4)">
          {{ userinfo.nickname }}<div class="arrow-right"></div>
        </div>
        <div class="record">
          <div class="icon"></div>
          <span>累计学习</span>
          {{ listenedHour }}小时{{ listenedMinute }}分钟
        </div>
        <div class="infos">
          <div class="item">
            <div class="value">{{ age }}天</div>
            <div class="label">加入成长营</div>
          </div>
          <div class="item">
            <div class="value">{{ purchasedCourseCount }}个</div>
            <div class="label">报名课程</div>
          </div>
          <div class="item">
            <div class="value">{{ listenedLessonCount }}节</div>
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
      <div class="row wechat" @click="setMode(5)">
        <div class="icon gongzhonghao"></div>
        关注公众号
        <div class="arrow-right"></div>
      </div>
    </div>
    <div class="page about-page" v-if="mode === 2">
      <div class="logo">
        <div class="version">1.0</div>
        <img src="/static/jiudianbang-big.png">
      </div>
      <div class="slogon">酒店邦成长营 与你一起成长</div>
      <div class="desc">
        酒店邦成长营，为你提供高效、有价值的行业知识服务，帮助你拓宽认知思维与提升实战能力，以取得更好的职业发展。<div></div>我们提倡酒店行业人成为终生学习者，酒店邦成长营愿与你一起成长。
      </div>
      <div class="item contact" @click="setErweimaShow(true)">
        联系客服
        <div class="erweima"></div>
        <div class="arrow-right"></div>
      </div>
      <div class="item coorperating">
        商务合作
        <span>3529653959@qq.com</span>
      </div>
      <div class="erweima-window" v-if="erweimaShow">
        <div class="cover"></div>
        <div class="box">
          <div class="title">
            <div class="text">为你服务</div>
            <div class="time">[ 工作日 10:00 - 18:00 ]</div>
          </div>
          <div class="main">
            <div class="erweima">
              <img src="/static/kefu.jpg">
            </div>
            <div class="tips">长按二维码联系客服</div>
          </div>
        </div>
        <div class="close" @click="setErweimaShow(false)"></div>
      </div>
    </div>
    <div class="page bought-page" v-if="mode === 3">
      <div class="nothing" v-if="courseList && courseList.length === 0">
        <div class="shopping-car"></div>
        <p>你还没有购买课程</p>
        <div class="buy" @click="gotoHome">
          <div class="magnifier"></div>
          发现课程
        </div>
      </div>
      <div v-if="courseList && courseList.length > 0">
        <div class="bought-item" v-for="c in courseList" v-if="c !== null" @click="gotoCourse(c)">
          <div class="avater" :style="{ 'background-image': 'url(\'' + c.headImg + '\')' }"></div>
          <div class="desc">
            <div class="title">{{ c.title }}</div>
            <div class="orderid">订单号：{{ c.tradeNo }}</div>
            <div class="time">购买时间：{{ c.purchaseDate }}</div>
            <div class="price">实付：¥ {{ c.payment / 100 }} <span v-if="c.originalCharge && c.originalCharge != c.payment">（优惠：¥ {{ (c.originalCharge - c.payment) / 100 }}）</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="page name-page" v-if="mode === 4">
      <!-- <div class="welcome">欢迎加入酒店营成长邦！</div> -->
      <div class="avater">
        <div class="img" :class="{long: userinfo.isLong, short: !userinfo.isLong}">
          <img :src="userinfo.headImg" @click="changeHeader">
        </div>
      </div>
      <input class="avater-upload" type="file" @change="uploadAvater"></input>
      <div class="wechat-name">{{ userinfo.adminName }}</div>
      <div class="row name">
        <div class="label">姓名</div>
        <div class="vr"></div>
        <input type="text" name="name" placeholder="请输入您的姓名" v-model="userinfo.nickname">
      </div>
      <div class="row company">
        <div class="label">公司</div>
        <div class="vr"></div>
        <input type="text" name="company" placeholder="请输入您的公司（选填）" v-model="userinfo.company">
      </div>
      <div class="row position">
        <div class="label">职位</div>
        <div class="vr"></div>
        <input type="text" name="position" placeholder="请输入您的职位（选填）" v-model="userinfo.title">
      </div>
      <div class="confirm" @click="submitChange">确认修改</div>
      <!-- <div class="skip">跳过</div> -->
    </div>
    <div class="page gongzhonghao-page" v-if="mode === 5">
      <img class="chahua1" src="/static/chahua1.png">
      <div class="thing">
        <img src="/static/gongzhonghao.jpg" class="erweima">
        <div class="tips">长按二维码</div>
        <div class="tips">关注微信公众号</div>
      </div>
    </div>
    <Bottomer :tag="3" v-if="mode === 1"></Bottomer>
    <div class="change-finish" v-if="changeFinish">
      <div class="cover"></div>
      <div class="box">
        <div class="icon"></div>
        <div class="text">修改成功</div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'
import Bottomer from './Bottomer.vue'
import Error from './Error.vue'

export default {
  name: 'profile',
  props: [],
  data () {
    return {
      mode: 1, // 1主页，2aboutus，3购买记录, 4修改资料， 5公众号
      age: 0,
      listenedHour: 0,
      listenedMinute: 0,
      purchasedCourseCount: 0,
      listenedLessonCount: 0,
      userinfo: {},
      courseList: null,
      error: null,
      errorTimeout: null,
      changeFinish: false,

      erweimaShow: false,
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
    this.getUser();
    this.popstate();
    const dict = {
      title: '酒店邦成长营',
      link: location.href,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    util.updateWechatShare(dict);
  },
  methods: {
    setErweimaShow: function (flag) {
      this.erweimaShow = flag;
    },
    gotoHome: function () {
      location.href = '/';
    },
    setError: function (error) {
      this.error = error;
      this.errorTimeout && clearTimeout(this.errorTimeout)
      this.errorTimeout = setTimeout(() => {
        this.error = null;
      }, 4000);
    },
    gotoCourse: function (course) {
      location.href = '/course?cid=' + course.id;
    },
    popstate () {
      const mode = +util.getParam('mode') || 1;
      this.mode = mode;
      if (mode === 1 || mode === 4) {
        document.title = '我';
      } else if (mode === 2) {
        document.title = '关于成长营';
        return false;
      } else if (mode === 3) {
        document.title = '购买记录';
        this.getPaidCourseList();
        return false;
      } else if (mode === 5) {
        document.title = '公众号';
        return false;
      }
    },
    setMode(mode) {
      this.mode = mode;
      util.changeURL({ mode: mode })
      this.popstate();
    },
    changeHeader: function () {
      document.querySelector('.avater-upload').click();
    },
    uploadAvater: function (ev) {
      const input = ev.target;
      var data = new FormData()
      data.append('file', input.files[0])
      fetch('/hotelpal/image/uploadImg', {
        method: 'POST',
        body: data
      }).then(function(response) {
        return response.json()
      }).then((json) => {
        if (json.code === 0) {
          const imgurl = json.data.imgurl;
          this.userinfo.headImg = imgurl;
          util.isLongImg(imgurl, 1, (isLong) => {
            this.userinfo.isLong = isLong
            this.$forceUpdate();
          })
        } else {
          console.warn('上传图片失败');
        }
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    },
    showChangeFinish () {
      this.changeFinish = true;
      setTimeout(() => {
        this.changeFinish = false;
      }, 2000);
    },
    submitChange: function () {
      const { headImg, nickname, company, title } = this.userinfo;
      if (!nickname) {
        this.setError('昵称不能为空');
        return false;
      }
      util.saveUserProp(headImg, nickname, company, title, (json) => {
        if (json.code === 0) {
          this.showChangeFinish();
          setTimeout(() => {
            // this.setMode(1)
            window.history.go(-1);
          }, 2000);
        } else {
          console.warn('修改用户信息成功！');
        }
      })
    },
    getUser: function () {
      util.getUserStatistics((json) => {
        if (json.code === 0) {
          this.age = json.data.signedDays;
          this.listenedHour = parseInt(json.data.listenedTimeInSecond / 60 / 60);
          this.listenedMinute = parseInt((json.data.listenedTimeInSecond - 60 * 60 * this.listenedHour) / 60);
          this.purchasedCourseCount = json.data.purchasedCourseCount;
          this.listenedLessonCount = json.data.listenedLessonCount;
        } else {
          console.warn('获取用户统计信息失败')
        }
      });
      util.getUserInfo((json) => {
        if (json.code === 0) {
          this.userinfo = json.data;
          util.isLongImg(this.userinfo.headImg, 1, (isLong) => {
            this.userinfo.isLong = isLong
            this.$forceUpdate();
          })
        } else {
          console.warn('获取用户信息失败')
        }
      })
    },
    getPaidCourseList: function () {
      util.getPaidCourseList((json) => {
        if (json.code === 0) {
          this.courseList = json.data.courseList;
        } else {
          console.warn('获取用户信息失败')
        }
      })
    },
  },
  destroyed() {},
  watch: {},
  components: {
    Bottomer, Error
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .profile-container {
    width: 100%;
    height: 100%;
    line-height: 1;
    .change-finish {
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
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: -0.93333rem;
          height: 1.86666rem;
          overflow: hidden;
          .img {
            width: 1.86666rem;
            height: 1.86666rem;
            border-radius: 100%;
            overflow: hidden;
          }
          .img.short {
            img {
              height: 100%;
            }
          }
          .img.long {
            img {
              width: 100%;
            }
          }
        }
        .name {
          margin-top: 0.26666rem;
          font-size: 0.48rem;
          color: #666666;
          text-align: center;
          height: 0.48rem;
          width: 100%;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          .arrow-right {
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
          font-size: 0.4rem;
          color: #666666;
          text-align: center;
          margin-top: 0.8rem;
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
          display: flex;
          margin-top: 0.53333rem;
          .item {
            flex: 1;
            text-align: center;
            border-right: #f5f5f5 solid thin;
            .value {
              font-size: 0.4rem;
              color: #666666;
            }
            .label {
              font-size: 0.293333rem;
              color: #999999;
              margin-top: 0.213333rem;
            }
          }
          .item:last-child {
            border-right: none;
          }
        }
      }
      .row {
        width: 100%;
        height: 1.3rem;
        line-height: 1.3rem;
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
          top: 0.33rem;
          border-radius: 4px;
          vertical-align: middle;
        }
        .shoppingcar {
          background-color: #f0944b;
          background-image: url('/static/shoppingcar.svg');
        }
        .jiudianbang {
          background-size: 0.64rem 0.64rem;
          background-image: url('/static/jiudianbang-big.png');
        }
        .gongzhonghao {
          background-color: #49ab54;
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
          border-top: @border;
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
      padding-top: 1rem;
      .erweima-window {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        align-content: center;
        .cover {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.8;
          z-index: -1;
        }
        .close {
          width: 100%;
          height: 0.8rem;
          background-size: 0.8rem 0.8rem;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("/static/close-circle.svg");
          margin-top: 1.06666rem;
        }
        .box {
          width: 7.86666rem;
          height: auto;
          overflow: hidden;
          border-radius: 10px;
          .title {
            width: 100%;
            background: @red;
            color: white;
            height: 1.86666rem;
            text-align: center;
            padding: 0.4rem 0;
            .text {
              font-size: 0.53333rem;
            }
            .time {
              font-size: 0.23333rem;
              margin-top: 0.15rem;
            }
          }
          .main {
            width: 100%;
            height: 6.6666rem;
            background: white;
            padding: 1.06666rem;
            .erweima {
              width: 3.73333rem;
              height: 3.73333rem;
              margin: auto;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .tips {
              width: 100%;
              margin-top: 0.26666rem;
              font-size: 0.373333rem;
              text-align: center;
            }
          }
        }
      }
      .logo {
        text-align: center;
        .version {
          width: 0.6666rem;
          height: 0.6666rem;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("/static/bubble.svg");
          line-height: 0.6666rem;
          text-align: center;
          color: white;
          margin: auto;
          position: relative;
          top: -0.13333rem;
          left: 1rem;
          font-size: 10px;
        }
        img {
          height: 1.52rem
        }
      }
      .slogon {
        color: #333333;
        font-size: 0.48rem;
        text-align: center;
        line-height: 1;
        width: 100%;
        margin-top: 0.4rem;
        font-weight: 600;
      }
      .desc {
        text-align: justify;
        padding: 0 0.6666rem;
        font-size: 0.4rem;
        color: #666666;
        line-height: 1.8;
        margin-top: 0.6666rem;
        margin-bottom: 0.8rem;
        div {
          margin: 0.3rem 0;
        }
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        .erweima {
          width: 0.48rem;
          height: 0.48rem;
          background-size: 0.48rem 0.48rem;
          background-position: center;
          background-repeat: no-repeat;
          background-image: url("/static/erweima.svg");
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
        span {
          float: right;
          color: @red;
        }
      }
      .item.contact {
        padding-right: 0.8rem;
      }
    }
    .page.bought-page {
      background: #f1f1f1;
      height: 100%;
      padding-top: 0.26666rem;
      .nothing {
        width: 100%;
        height: 100%;
        padding-top: 2rem;
        text-align: center;
        .shopping-car {
          display: inline-block;
          width: 3.3333rem;
          height: 2.6666rem;
          background-size: 3.3333rem 2.6666rem;
          background-image: url('/static/empty1.png')
        }
        p {
          margin-top: 0.8rem;
          font-size: 0.46rem;
          color: #cccccc;
        }
        .buy {
          border: @red solid thin;
          border-radius: 4px;
          color: @red;
          font-size: 0.4rem;
          text-align: center;
          width: 3.53333rem;
          height: 1.146666rem;
          margin-top: 0.53333rem;
          line-height: 1.14rem;
          display: inline-block;
          text-align: center;
          .magnifier {
            display: inline-block;
            width: 0.5rem;
            height: 0.5rem;
            position: relative;
            top: 0.12rem;
            background-size: 0.5rem 0.5rem;
            background-image: url('/static/magnifier.svg');
            margin-right: 0.2rem;
          }
        }
      }
      .bought-item {
        background: white;
        padding: 0.26666rem 0.4rem;
        border-top: solid thin #ebebeb;
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.26666rem;
        line-height: 1;
        .avater {
          width: 2rem;
          height: 2.6666rem;
          position: relative;
          display: flex;
          justify-content: center;
          overflow: hidden;
          border-radius: 4px;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }
        .desc {
          width: 6.8rem;
          height: 2.6666rem;
          padding: 0.13333rem 0;
          .title {
            width: 100%;
            font-size: 0.373333rem;
            color: #333333;
            font-weight: 600;
          }
          .orderid {
            margin-top: 0.186666rem;
            font-size: 0.32rem;
            color: #666666;
          }
          .time {
            margin-top: 0.7rem;
            font-size: 0.293333rem;
            color: #999999;
          }
          .price {
            margin-top: 0.26666rem;
            color: @red;
            font-size: 0.293333rem;
          }
        }
      }
    }
    .page.gongzhonghao-page {
      background-image: url('/static/gongzhonghao_bg.svg');
      background-size: 100% auto;
      background-repeat: repeat-y;
      color: #666666;
      width: 100%;
      height: 100%;
      overflow: auto;
      line-height: 1;
      .chahua1 {
        width: 100%;
      }
      .thing {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 0.6666rem;
        .erweima {
          display: block;
          margin: auto;
          width: 2.4rem;
          // width: 3.73333rem;
        }
        .tips {
          font-size: 0.32rem;
          text-align: center;
          margin-top: 0.32rem;
          color: white;
        }
        .tips:last-child {
          margin-top: 0.13333rem;
        }
      }
    }
    .page.name-page {
      background: white;
      padding-top: 0.53333rem;
      color: #cccccc;
      width: 100%;
      height: 100%;
      .avater-upload {
        display: none;
      }
      .welcome {
        height: 0.48rem;
        font-size: 0.48rem;
        width: 100%;
        color: #666666;
        text-align: center;
      }
      .avater {
        height: 1.92rem;
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 0.6666rem;
        overflow: hidden;
        .img {
          width: 1.92rem;
          height: 1.92rem;
          border-radius: 100%;
          overflow: hidden;
        }
        .img.short {
          img {
            height: 100%;
          }
        }
        .img.long {
          img {
            width: 100%;
          }
        }
      }
      .wechat-name {
        height: 0.4rem;
        width: 100%;
        text-align: center;
        font-size: 0.4rem;
        color: #333333;
        margin-top: 0.26666rem;
        margin-bottom: 0.48rem;
      }
      .row {
        width: 7.86666rem;
        height: 1.173333rem;
        margin: auto;
        margin-bottom: 0.4rem;
        font-size: 0.4rem;
        position: relative;
        .label {
          height: 100%;
          line-height: 1.2rem;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0.4rem;
          color: #666666;
        }
        .vr {
          height: 0.6666rem;
          border-left: @border;
          position: absolute;
          top: 0.26666rem;
          left: 1.46666rem;
          color: #666666;
        }
        input {
          height: 1.173333rem;
          border-radius: 4px;
          border: #ededed solid thin;
          padding: 0 0.4rem 0 1.73333rem;
          display: block;
          width: 100%;
          margin: auto;
          color: #666666;
          -webkit-appearance: none;
        }
      }
      .confirm {
        margin: auto;
        margin-top: 0.53333rem;
        font-size: 0.426666rem;
        width: 7.86666rem;
        background: @red;
        color: white;
        text-align: center;
        line-height: 1.173333rem;
        height: 1.173333rem;
        border-radius: 4px;
      }
      .skip {
        margin: auto;
        margin-top: 0.26666rem;
        font-size: 0.426666rem;
        width: 7.86666rem;
        color: #999999;
        text-align: center;
        line-height: 1.173333rem;
        height: 1.173333rem;
        border-radius: 4px;
      }
    }
  }
</style>
