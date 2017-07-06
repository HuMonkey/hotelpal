<template>
  <div class="lesson-container">
    <div class="paid" v-if="purchased || freeListen">
      <div class="player">
        <audio-player :source="song" :loop="false" :nextId="nextId" :preId="preId" :songLong="songLong"></audio-player>
      </div>
      <div class="main">
        <div class="course-title">{{ lesson.lessonNo }} | {{ lesson.title }}</div>
        <div class="infos">
          <div class="time">{{ lesson.publishTimeStr }}发布</div>
          <div class="other">
            <span><div class="icon time"></div>{{ lesson.lenStr }}</span>
            <span><div class="icon download"></div>{{ lesson.resourceSize || '???MB' }}</span>
            <span><div class="icon read"></div>{{ lesson.commentCount || 0 }}</span>
          </div>
        </div>
        <div class="content">
          <!-- <div class="summary">
            一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆一大堆
          </div>
          <div class="points">
            <div class="title">知识点</div>
            <ul>
              <li>知识点1</li>
              <li>知识点2</li>
              <li>知识点3</li>
            </ul>
          </div> -->
          <div class="article" :class="{overflow: isIntroOverflow && introOverflow}" v-html="lesson.content">
          </div>
          <div class="open" v-if="isIntroOverflow" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
          <div class="hr"></div>
          <div class="course">
            <div class="back">
              <div class="box" @click="gotoCourse">
                <div class="img"><img :src="course.headImg"></div>
                <div class="title">{{ course.title }}</div>
                <div class="desc">{{course.userName}} · {{ course.userTitle }}</div>
                <div class="arrow"></div>
              </div>
            </div>
            <div class="hr"></div>
            <div class="lessons">
              <div class="swiper" :style="{width: swiperWidth + 'rem'}">
                <div class="item" :class="{current: l.id === lesson.id}" v-for="l in course.lessonList" @click="gotoLesson(l.id)">
                  <div class="inner">
                    {{ l.lessonNo }} | {{ l.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="discuss">
          <div class="good" v-if="lesson.eliteCommentList && lesson.eliteCommentList.commentList.length > 0">
            <div class="title">
              讨论
              <span>精选（{{ lesson.eliteCommentList.commentList.length }}）</span>
            </div>
            <div class="comments">
              <div class="item" v-for="comment in lesson.eliteCommentList.commentList">
                <div class="avater">
                  <img src="/static/header.png">
                </div>
                <div class="name">
                  {{ comment.userName }}  {{ comment.userTitle }}<span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
                </div> 
                <div class="content">
                  {{ comment.content }}
                </div>
                <div class="quote" v-for="reply in lesson.eliteCommentList.replyToCommentList" v-if="reply.id === comment.replytoId">
                  {{ reply.userName + '：' + reply.content }}
                </div>
                <div class="bottom">
                  <div class="time">{{ formatTime(comment.creationTime) }}</div>
                  <div class="box">
                    <div class="like" @click="doLike(comment)">
                      <div class="icon" :class="{ liked: comment.liked }"></div>
                      {{ comment.zanCount || 0 }}
                    </div>
                    <div class="comments" @click="gotoReply(comment.id, comment.userName)">
                      回复
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="all" v-if="lesson.commentList">
            <div class="title">
              <span>全部（{{ lesson.commentList.commentList.length }}）</span>
            </div>
            <div class="no-comment" v-if="lesson.commentList.commentList.length === 0">
              尚无讨论，说说你的看法吧！
            </div>
            <div class="comments" v-if="lesson.commentList.commentList.length > 0">
              <div class="item" v-for="comment in lesson.commentList.commentList">
                <div class="avater">
                  <img src="/static/header.png">
                </div>
                <div class="name">
                  {{ comment.userName }}  {{ comment.userTitle }}<span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
                </div> 
                <div class="content">
                  {{ comment.content }}
                </div>
                <div class="quote" v-for="reply in lesson.commentList.replyToCommentList" v-if="reply.id === comment.replytoId">
                  {{ reply.userName + '：' + reply.content }}
                </div>
                <div class="bottom">
                  <div class="time">{{ formatTime(comment.creationTime) }}</div>
                  <div class="box">
                    <div class="like" @click="doLike(comment)">
                      <div class="icon" :class="{ liked: comment.liked }"></div>
                      {{ comment.zanCount || 0 }}
                    </div>
                    <div class="comments" @click="gotoReply(comment.id, comment.userName)">
                      回复
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="comment-box" v-if="!commenting">
        <div class="pen"></div>
        <input type="text" name="comment" placeholder="输入你的评论" @click="gotoComment">
        <!-- <div class="btn">发送</div> -->
      </div>
      <div class="reply-box" v-if="replyId !== null || commenting">
        <div class="cover" @click="cancelReply"></div>
        <div class="box">
          <div class="btns">
            <div class="cancel" @click="cancelReply">取消</div>
            <div class="confirm" @click="submitReply">发布</div>
          </div>
          <textarea v-model="myComment" v-focus="focusStatus" :placeholder="replyId ? `回复${replyName}` : '一起来参与讨论吧！'"></textarea>
        </div>
      </div>
    </div>
    <div class="not-paid" v-if="!purchased && !freeListen">
      <div class="box">
        <div class="top">
          <div class="text">你需要先购买课程<br> <span class="price">¥ {{ course.charge / 100 }} / {{ course.lessonCount }}课时</span></div>
        </div>
        <div class="avater">
          <img :src="course.headImg">
        </div>
        <div class="bottom">
          <div class="name">{{ course.userName }}</div>
          <div class="who">{{ course.userTitle }}</div>
          <div class="course">{{ course.title }}</div>
          <div class="desc">{{ course.subtitle }}</div>
          <div class="btn" @click="gotoPay">购买课程  获取知识</div>
        </div>
      </div>
      <div class="log">你已经购买？点此 <span @click="gotoLogin">登录</span></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import util from '../util/index'
import AudioPlayer from './AudioPlayer.vue'

export default {
  name: 'lesson',
  props: [],
  data () {
    return {
      selectedTab: 0,
      song: null,
      nextId: null,
      preId: null,
      value: 1,
      swiperWidth: 0,
      commentId: 1,
      comments: [],
      commenting: false,
      replyId: null,
      replyName: null,

      purchased: true,
      freeListen: true,

      lesson: {},
      course: {},

      focusStatus: false,
      interval: null,

      isIntroOverflow: false,
      introOverflow: true,

      songLong: '00:00',
      myComment: ''
    }
  },
  created() {},
  mounted() {
    // this.songs = ['/static/test.mp3'];
    const lid = util.getParam('lid');
    const cid = util.getParam('cid');
    this.updateLesson();
    util.getCourse(cid, (json) => {
      if (json.code === 0) {
        this.course = json.data;
        this.purchased = json.data.purchased;
        const lessonList = this.course.lessonList;
        const lessonsNum = lessonList.length;
        this.swiperWidth = (lessonsNum * 300 + (lessonsNum - 1) * 20) / 75;
        const former = lessonList.indexOf(lessonList.find((d) => d.id == lid));
        this.nextId = lessonList[former + 1] && lessonList[former + 1].id;
        this.preId = lessonList[former - 1] && lessonList[former - 1].id;
        const offsetLeft = (former * 320) / 75 * (document.body.clientWidth / 10);
        setTimeout(function () {
          document.querySelector('.lessons').scrollLeft = offsetLeft;
        }, 500)
      } else {
        console.warn('获取课程信息失败！')
      }
    })
  },
  methods: {
    gotoLogin: function () {
      location.href = '/?redirect=' + encodeURIComponent(location.href) + '#/login'
    },
    updateLesson: function () {
      const lid = util.getParam('lid');
      const cid = util.getParam('cid');
      util.getLesson(lid, (json) => {
        if (json.code === 0) {
          document.title = json.data.title;
          this.song = json.data.audio;
          const publishTimeStr = json.data.publishTime && json.data.publishTime.split(' ')[0];
          this.songLong = moment(json.data.audioLen * 1000).format('mm:ss');
          const content = json.data.content;
          this.freeListen = json.data.freeListen;
          this.lesson = {
            ...json.data,
            publishTimeStr,
            lenStr: this.songLong,
          };
          let rem = document.body.clientWidth / 10;
          rem = rem > 75 ? 75 : rem;
          let fontSize = rem * 0.4;
          const length = util.textLength(content, fontSize);
          if (length > 9.2 * rem * 2) {
            this.isIntroOverflow = true;
          }
        } else {
          console.warn('获取课时失败！')
        }
      });
    },
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    gotoComment () {
      this.commenting = true;
      this.focusStatus = true;
    },
    gotoReply (id, name) {
      this.replyId = id;
      this.replyName = name;
      this.focusStatus = true;
    },
    cancelReply () {
      this.replyId = null;
      this.replyName = null;
      this.commenting = false;
      this.focusStatus = false;
    },
    submitReply () {
      const lid = util.getParam('lid');
      if (this.myComment && this.myComment.length < 20) {
        alert('回复至少20字以上');
        return false;
      }
      util.newComment(lid, this.myComment, this.replyId, (json) => {
        this.myComment = null;
        this.cancelReply();
        this.updateLesson();
      });
    },
    gotoLesson (lid) {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '&lid=' + lid + '#/lesson';
    },
    gotoCourse () {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '#/course';
    },
    doLike (comment) {
      if (comment.liked) {
        return false;
      }
      const lid = util.getParam('lid');
      util.addZan(lid, comment.id, (json) => {
        if (json.code === 0) {
          comment.liked = true;
          comment.zanCount = comment.zanCount ? comment.zanCount + 1 : 1;
        } else {
          console.warn('点赞出错！');
        }
      })
    },
    nextLesson () {
      console.log(this.course.lessonList);
    },
    formatTime (time) {
      return util.formatTime(time);
    },
    gotoPay: function () {
      util.checkLogin();
      const cid = util.getParam('cid');
      util.createPayOrder(cid, (json) => {
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
              this.purchased = true;
              util.pay(cid, tradeNo, function (json) {
                console.log(json)
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
  },
  destroyed() {},
  watch: {
    focusStatus() {
      if (this.focusStatus) {
        this.interval = setInterval(function() {
          document.body.scrollTop = document.body.scrollHeight
        }, 100) 
      } else {
        clearInterval(this.interval);
      }
    }
  },
  components: {
    AudioPlayer
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .lesson-container {
    background: #f5f5f5;
    .paid {
      padding-top: 3.226666rem;
      .player {
        width: 100%;
        height: 3.06666rem;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        margin: 0;
        background: white;
        box-shadow: 0px 1px 10px #cccccc;
      }
      .main {
        background: white;
        padding: 1.3333rem 0.4rem 0 0.4rem;
        .course-title {
          font-size: 0.66666rem;
          color: #333333;
          padding-bottom: 1.3333rem;
        }
        .infos {
          font-size: 0.26666rem;
          color: #999999;
          display: flex;
          justify-content: space-between;
          padding-bottom: 0.4rem;
          .other {
            display: flex;
            span {
              margin-left: 0.4rem;
              display: flex;
              align-items: center;
              .text {
                display: inline-block;
              }
              .icon {
                width: 0.32rem;
                height: 0.32rem;
                background-repeat: no-repeat;
                background-size: cover;
                margin-right: 0.13333rem;
                display: inline-block;
              }
              .icon.time {
                background-image: url('/static/time.svg');
              }
              .icon.download {
                background-image: url('/static/download.svg')
              }
              .icon.read {
                background-image: url('/static/read.svg')
              }
              img {
                width: 0.32rem;
                height: 0.32rem;
                margin-right: 0.13333rem;
                vertical-align: middle;
              }
            }
          }
        }
        .content {
          line-height: 1.8;
          font-size: 0.4rem;
          color: #666666;
          .summary {
            padding-bottom: 1rem;
          }
          .title {
            font-weight: 600;
            font-size: 0.56rem;
            color: #333333;
          }
          .points {
            ul {
              margin: 0.4rem 0;
            }
          }
          .article {
            img {
              width: 100%;
              margin: 0.53333rem 0;
            }
            /* p + p {
              margin-top: 1rem;
            } */
          }
          .article.overflow {
            overflow: hidden;
            height: 1.44rem;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .open {
            margin-top: 0.4rem;
            font-size: 0.4rem;
            text-align: center;
            color: @red;
          }
          .hr {
            margin-top: 0.4rem;
            height: 1px;
            background: @hrColor;
          }
          .course {
            .hr {
              background: @hrColor;
              margin-top: 0;
            }
            .back {
              padding: 0.53333rem 0;
              position: relative;
              .box {
                width: 100%;
                height: 1.3333rem;
                position: relative;
                color: #999999;
                .img {
                  width: 1.3333rem;
                  height: 1.3333rem;
                  display: block;
                  float: left;
                  overflow: hidden;
                  border-radius: 1.3333rem;
                  img {
                    width: 100%;
                  }
                }
                .title {
                  margin-left: 1.63333rem;
                  font-size: 0.4rem;
                  color: #666666;
                }
                .desc {
                  margin-left: 1.63333rem;
                  font-size: 0.32rem;
                  color: #999999;
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
            }
            .lessons {
              width: 100%;
              overflow-x: auto;
              padding: 0.4rem 0;
              .swiper {
                width: 1000px;
                display: flex;
                justify-content: space-between;
                .item {
                  color: white;
                  padding: 0.26666rem 0.4rem;
                  background: #f0944a;
                  width: 4rem;
                  height: 100%;
                  border-radius: 4px;
                  font-size: 0.32rem;
                  display: inline-block;
                  .inner {
                    height: 1.2rem;
                    line-height: 1.8;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                  }
                }
                .item.current {
                  background: @red;
                }
              }
            }
          }
        }
      }
      .discuss {
        margin-top: 0.23333rem;
        background: white;
        padding: 0.53333rem 0.4rem 1.3333rem 0.4rem;
        .title {
          line-height: 0.48rem;
          font-size: 0.48rem;
          color: #333333;
          span {
            font-size: 0.4rem;
            color: #999999;
          }
        }
        .no-comment {
          font-size: 0.4rem;
          color: #999999;
          width: 100%;
          text-align: center;
          padding: 1rem 0;
        }
        .item {
          padding-left: 1.06666rem;
          position: relative;
          margin: 0.4rem 0; 
          .avater {
            position: absolute;
            left: 0;
            top: 0;
            img {
              width: 0.8rem;
              height: 0.8rem;
              border-radius: 0.8rem;
            }
          }
          .name {
            height: 0.8rem;
            line-height: 0.8rem;
            font-size: 0.4rem;
            color: #999999;
            .tag {
              margin-left: 0.2rem;
              padding: 0 0.1rem;
              line-height: 0.48rem;
              height: 0.5rem;
              display: inline-block;
              font-size: 0.32rem;
              color: #cccccc;
              border-radius: 2px;
              border: #cccccc solid thin;
            }
          }
          .content {
            font-size: 0.4rem;
            line-height: 1.8;
            color: #333333;
          }
          .quote {
            border-radius: 8px;
            padding: 0.4rem;
            background: #f5f5f5;
            color: #999999;
            font-size: 0.4rem;
            line-height: 1.8;
            margin: 0.23333rem 0;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 0.32rem;
            color: #999999;
            .box {
              display: flex;
              align-items: center;
              .like {
                margin-right: 0.4rem;
                display: flex;
                align-items: center;
                .icon {
                  width: 0.32rem;
                  height: 0.32rem;
                  background-image: url('/static/like.svg');
                  background-size: 0.32rem auto;
                  background-repeat: no-repeat;
                  display: inline-block;
                  vertical-align: top;
                  margin-right: 0.12rem;
                }
                .icon.liked {
                  background-image: url('/static/liked.svg');
                }
                img {
                  width: 0.4rem;
                  vertical-align: middle;
                }
              }
            }
          }
        }
      }
      .comment-box {
        height: 1.3333rem;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        background: white;
        border-top: #ebebeb solid thin;
        display: flex;
        justify-content: space-between;
        padding: 0.2rem 0.4rem;
        z-index: 101;
        ::-webkit-input-placeholder { /* WebKit browsers */ 
          color: #cccccc; 
        } 
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
          color: #cccccc; 
        } 
        ::-moz-placeholder { /* Mozilla Firefox 19+ */ 
          color: #cccccc; 
        } 
        :-ms-input-placeholder { /* Internet Explorer 10+ */ 
          color: #cccccc; 
        } 
        img {
          position: absolute;
          left: 0.6666rem;
          top: 0.4rem;
          width: 0.53333rem;
          height: 0.53333rem;
        }
        .pen {
          position: absolute;
          left: 0.6666rem;
          top: 0.4rem;
          width: 0.53333rem;
          height: 0.53333rem;
          background-image: url('/static/pen.svg');
          background-size: 0.53333rem 0.53333rem;
          background-repeat: no-repeat;
        }
        input {
          display: inline-block;
          height: 0.93333rem;
          border-radius: 4px;
          border: #ebebeb solid thin;
          width: 9.2rem;
          padding: 0 0.26666rem 0 0.93333rem;
          font-size: 0.4rem;
          -webkit-appearance: none;
        }
      }
      .reply-box {
        height: 100%;
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 101;
        .cover {
          position: absolute;
          height: 100%;
          width: 100%;
          background: black;
          opacity: 0.8;
        }
        .box {
          height: 4.53333rem;
          width: 100%;
          position: absolute;
          bottom: 0;
          left: 0;
          background: #f0f0f0;
          padding: 0 0.4rem;
          .btns {
            display: flex;
            justify-content: space-between;
            font-size: 0.426666rem;
            height: 1.2rem;
            align-items: center;
            .cancel {
              color: #666666
            }
            .confirm {
              color: @red;
            }
          }
          textarea {
            width: 100%;
            height: 2.8rem;
            border: #ebebeb solid thin;
            color: #666666;
            font-size: 0.426666rem;
            padding: 0.4rem;
            border-radius: 4px;
          }
        }
        ::-webkit-input-placeholder { /* WebKit browsers */ 
          color: #cccccc; 
        } 
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
          color: #cccccc; 
        } 
        ::-moz-placeholder { /* Mozilla Firefox 19+ */ 
          color: #cccccc; 
        } 
        :-ms-input-placeholder { /* Internet Explorer 10+ */ 
          color: #cccccc; 
        } 
      }
    }
    .not-paid {
      padding: 0.4rem;
      .box {
        border-radius: 4px;
        background: white;
        overflow: hidden;
        position: relative;
        .top {
          height: 4rem;
          background: @red;
          align-items: center;
          display: flex;
          color: white;
          font-size: 0.4rem;
          .text {
            width: 100%;
            text-align: center;
            line-height: 1.8;
            .price {
              font-size: 0.48rem;
              font-weight: 600;
            }
          }
        }
        .avater {
          position: absolute;
          top: 3.06666rem;
          left: 0;
          width: 100%;
          text-align: center;
          img {
            width: 1.92rem;
            height: 1.92rem;
            border-radius: 2rem;
          }
        }
        .bottom {
          background: white;
          padding-bottom: 0.853333rem;
          .name {
            width: 100%;
            text-align: center;
            margin-top: 1.2rem;
            font-size: 0.4rem;
            font-weight: 600;
            color: #666666;
          }
          .who {
            width: 100%;
            text-align: center;
            margin-top: 0.1rem;
            font-size: 0.32rem;
            color: #999999;
          }
          .course {
            width: 100%;
            text-align: center;
            margin-top: 0.6666rem;
            font-size: 0.4rem;
            color: #666666;
          }
          .desc {
            width: 100%;
            text-align: center;
            margin-top: 0.1rem;
            font-size: 0.32rem;
            color: #999999;
          }
          .btn {
            height: 1rem;
            line-height: 1rem;
            width: 8.4rem;
            margin: 0.53333rem auto 0 auto;
            text-align: center;
            background: @red;
            color: white;
            font-size: 0.426666rem;
            border-radius: 4px;
          }
        }
      }
      .log {
        width: 100%;
        margin-top: 0.8rem;
        font-size: 0.4rem;
        text-align: center;
        color: #999999;
        span {
          color: @red;
          margin-left: 0.23333rem;
        }
      }
    }
  }
</style>
