<template>
  <div class="lesson-container">
    <Error :error="error" v-if="error"></Error>
    <Hongbao v-if="isHongbao === 1"></Hongbao>
    <div v-if="isHongbao === 0">
      <div class="paid" :class="{fromHongbao: fromHongbao == 1}" v-if="purchased || freeListen || fromHongbao == 1">
        <div class="player" :class="{absolute: fromHongbao == 1 && !scrollDown}" v-if="lesson">
          <img class="zshb_banner" src="/static/zshb_banner.png" v-if="fromHongbao == 1 && !scrollDown">
          <audio-player :source="song" :loop="false" :listenLen="lesson.listenLen" :nextId="lesson.nextLessonId" :preId="lesson.previousLessonId" :songLong="songLong" :audioLen="lesson.audioLen"></audio-player>
        </div>
        <div class="main" v-if="lesson">
          <div class="course-title">{{ lesson.lessonOrder }} | {{ lesson.title }}</div>
          <div class="infos">
            <div class="time">{{ lesson.publishTimeStr + ' ' }}发布</div>
            <div class="other">
              <span><div class="icon time"></div>{{ lesson.lenStr }}</span>
              <span><div class="icon download"></div>{{ lesson.resourceSize || '???MB' }}</span>
              <span><div class="icon read"></div>{{ lesson.commentCount || 0 }}</span>
            </div>
          </div>
          <div class="content">
            <div class="article" :class="{overflow: isIntroOverflow && introOverflow}" v-html="lesson.content">
            </div>
            <div class="open" v-if="isIntroOverflow" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
            <div class="hr"></div>
            <div class="course">
              <div class="back">
                <div class="box" @click="gotoCourse">
                  <div class="img"><img :src="course.headImg"></div>
                  <div class="title">{{ course.title }}</div>
                  <div class="desc">{{course.userName}} · {{ course.company + ' ' + course.userTitle }}</div>
                  <div class="arrow"></div>
                </div>
              </div>
              <div class="hr"></div>
              <div class="lessons">
                <div class="swiper" :style="{width: swiperWidth + 'rem'}">
                  <div class="item" :class="{current: l.id === lesson.id}" v-for="l in course.lessonList" @click="gotoLesson(l.id)">
                    <div class="inner">
                      {{ l.lessonOrder }} | {{ l.title }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="discuss" v-if="lesson">
            <div class="good" v-if="lesson.eliteCommentList && lesson.eliteCommentList.commentList.length > 0">
              <div class="title">
                精选讨论
                <!-- <span>精选（{{ lesson.eliteCommentList.commentList.length }}）</span> -->
              </div>
              <div class="comments">
                <div class="item" v-for="comment in lesson.eliteCommentList.commentList">
                  <div class="avater">
                    <img :src="comment.userHeadImg">
                  </div>
                  <div class="name">
                    {{ comment.userName }}  <span v-if="comment.userCompany || comment.userTitle">{{ comment.userCompany + ' ' + comment.userTitle }}</span>
                    <span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
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
            <div class="all">
              <div class="title">
                全部讨论
                <!-- <span>全部（{{ commentList.length }}）</span> -->
              </div>
              <div class="no-comment" v-if="commentList.length === 0">
                尚无讨论，说说你的看法吧！
              </div>
              <div class="comments" v-else>
                <div class="item" v-for="comment in commentList">
                  <div class="avater">
                    <img :src="comment.userHeadImg">
                  </div>
                  <div class="name">
                    {{ comment.userName }}  <span v-if="comment.userCompany || comment.userTitle">{{ comment.userCompany + ' ' + comment.userTitle }}</span>
                    <span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
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
              <infinite-loading :on-infinite="onInfinite" :distance="distance" ref="infiniteLoading">
                <span class="vue-loader weui-loadmore" slot="spinner">
                  <i class="weui-loading"></i>
                  <span class="weui-loadmore__tips">正在加载</span>
                </span>
                <span class="vue-loader" slot="no-results">没有更多信息了</span>
              </infinite-loading>
            </div>
        </div>
        <div class="comment-box" v-if="!commenting" :class="{hongbao: !freeListen && !fromHongbao && lesson.redPacketRemained > 0}">
          <div class="pen"></div>
          <input type="text" name="comment" placeholder="一起来参与讨论吧！" @click="gotoComment">
          <div class="hongbao" v-if="!freeListen && !fromHongbao && lesson.redPacketRemained > 0" @click="showHongbaoTips(true)">
            <img src="/static/hongbao4.png">
          </div>
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
        <div class="hongbaoTips" v-if="hongbaoTips && lesson.redPacketRemained > 0" @click="showHongbaoTips(false)">
          <div class="cover"></div>
          <img class="text" src="/static/hongbaotips.png">
          <img class="pointer" src="/static/pointer.png">
        </div>
        <div class="comment-finish" v-if="commentFinish">
          <div class="cover"></div>
          <div class="box">
            <div class="icon"></div>
            <div class="text">{{commentFinish === 2 ? '回复' : '评论'}}成功</div>
          </div>
        </div>
      </div>
      <div class="not-paid" v-if="!purchased && !freeListen && fromHongbao != 1">
        <div class="pay-finish" v-if="payFinish">
          <div class="cover"></div>
          <div class="box">
            <div class="icon"></div>
            <div class="text">{{ payFinishTips || '支付成功' }}</div>
          </div>
        </div>
        <div class="box">
          <div class="top">
            <div class="text">你需要先购买课程<br> <span class="price">¥ {{ course.charge ? course.charge / 100 : 0 }} / {{ course.lessonCount }}课时</span></div>
          </div>
          <div class="avater">
            <div class="img">
              <img :src="course.headImg">
            </div>
          </div>
          <div class="bottom">
            <div class="name">{{ course.userName }}</div>
            <div class="who">{{ course.company + ' ' + course.userTitle }}</div>
            <div class="course">{{ course.title }}</div>
            <div class="desc">{{ course.subtitle }}</div>
            <div class="btn" @click="gotoPay">购买课程  获取知识</div>
          </div>
        </div>
        <div class="log">你已经购买？<span @click="gotoLogin">绑定其他账号</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import InfiniteLoading from 'vue-infinite-loading';

import util from '../util/index'
import AudioPlayer from './AudioPlayer.vue'
import Error from './Error.vue'
import Hongbao from './Hongbao'

let androidUrl;

export default {
  name: 'lesson',
  props: [],
  data () {
    return {
      selectedTab: 0,
      song: null,
      value: 1,
      swiperWidth: 0,
      commentId: 1,
      comments: [],
      commenting: false,
      replyId: null,
      replyName: null,

      purchased: true,
      freeListen: true,

      lesson: null,
      course: {},

      focusStatus: false,
      interval: null,

      isIntroOverflow: false,
      introOverflow: true,

      songLong: '00:00',
      myComment: '',

      errorTimeout: null,
      error: null,

      hongbaoTips: false,

      isHongbao: 0,
      fromHongbao: 0,

      userInfo: {},

      commentFinish: false,

      scrollDown: false,

      payFinish: false,
      payFinishTips: null,

      distance: 50,
      start: 0, 
      number: 10,
      commentList: [],

      paying: false,
    }
  },
  mounted() {
    androidUrl = location.href;

    window.onscroll = () => {
      const width = document.body.offsetWidth;
      const containerHeight = document.querySelector('.player').offsetHeight;
      const scrollTop = document.body.scrollTop;
      if (scrollTop >= width / 750 * 254) {
        this.scrollDown = true;
      } else {
        this.scrollDown = false;
      }
    }
    
    const lid = util.getParam('lid');
    const cid = util.getParam('cid');
    this.isHongbao = +util.getParam('isHongbao') || 0;
    if (this.isHongbao == 1) {
      return false;
    }
    util.getCourse(cid, (json) => {
      if (json.code === 0) {
        this.course = json.data;
        this.purchased = json.data.purchased;
        let lessonList = this.course.lessonList;
        lessonList.forEach((d) => {
          d.lessonOrder = util.formatNum(d.lessonOrder);
        });
        const lessonsNum = lessonList.length;
        this.swiperWidth = (lessonsNum * 270 + (lessonsNum - 1) * 20) / 75;
        const former = lessonList.indexOf(lessonList.find((d) => d.id == lid));
        const offsetLeft = (former * 290) / 75 * (document.body.clientWidth / 10);
        setTimeout(function () {
          if (document.querySelector('.lessons')) {
            document.querySelector('.lessons').scrollLeft = offsetLeft;
          }
        }, 500)
        this.updateLesson();
      } else {
        console.warn('获取课程信息失败！')
      }
    })

    util.getUserInfo((json) => {
      if (json.code === 0) {
        this.userInfo = json.data;
      } else {
        console.warn('获取课程信息失败！')
      }
    })
  },
  methods: {
    onInfinite: function () {
      const id = util.getParam('lid');
      util.getCommetnList(id, this.start, this.number, (json) => {
        if (json.code === 0) {
          this.start = this.start + this.number;
          if (json.data.hasMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.commentList = this.commentList.concat(json.data.commentList);
        } else {
          console.warn('获取自主课程列表出错！');
        }
      })
    },
    setError: function (error) {
      this.error = error;
      this.errorTimeout && clearTimeout(this.errorTimeout)
      this.errorTimeout = setTimeout(() => {
        this.error = null;
      }, 4000);
    },
    gotoLogin: function () {
      location.href = '/login?force=1&redirect=' + encodeURIComponent(location.href)
    },
    updateLesson: function (updateComment) {
      const lid = util.getParam('lid');
      const cid = util.getParam('cid');
      util.getLesson(lid, (json) => {
        if (json.code === 0) {
          if (updateComment) {
            this.commentList.unshift(json.data.commentList.commentList[0]);
            this.lesson.commentList.replyToCommentList = json.data.commentList.replyToCommentList;
            this.start++;
            return false;
          } else {
            this.commentList = json.data.commentList.commentList.slice(0);
            this.start = this.commentList.length;
          }

          document.title = json.data.title;

          this.song = json.data.audio;

          const publishTimeStr = json.data.publishTime && json.data.publishTime.split(' ')[0];

          this.songLong = moment(json.data.audioLen * 1000).format('mm:ss');

          this.freeListen = json.data.freeListen;

          let lessonOrder = json.data.lessonOrder.toString()
          if (lessonOrder.length < 2) {
            lessonOrder = '0' + lessonOrder;
          }

          this.lesson = {
            ...json.data,
            publishTimeStr, lessonOrder,
            lenStr: this.songLong,
          };
          
          const content = json.data.content;
          let rem = document.body.clientWidth / 10;
          rem = rem > 75 ? 75 : rem;
          let fontSize = 16;
          const length = util.textLength(content, fontSize);
          if (length > 9.2 * rem * 8) {
            this.isIntroOverflow = true;
          }

          const fromHongbao = util.getParam('fromHongbao');
          this.fromHongbao = fromHongbao;
          if (fromHongbao == 1) {
            const redPacketNonce = this.redPacketNonce = util.getParam('redPacketNonce');
            util.changeURL({
              lid, cid,
              isHongbao: 1,
              redPacketNonce 
            }, true);
            this.updateShare(true);
          } else {
            this.updateShare(false);
          }
        } else if (json.code === 40301) {
          this.purchased = false;
          this.freeListen = false;
        } else {
          console.warn('获取课时失败！')
        }
      });
    },
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    updateShare: function (isHongbao) {
      const lesson = this.lesson;
      const course = this.course;
      let dict;
      if (isHongbao) {
        dict = {
          title: course.userName + '：' + lesson.title + '「红包分享」',
          link: location.href,
          imgUrl: course.headImg,
          desc: util.getHtmlContent(lesson.content),
        }
      } else {
        dict = {
          title: course.userName + '：' + lesson.title,
          link: location.href,
          imgUrl: course.headImg,
          desc: util.getHtmlContent(lesson.content),
        }
      }
      dict.originUrl = androidUrl
      dict.callback = () => {
        this.showHongbaoTips(false);
      }
      util.updateWechatShare(dict)
    },
    gotoComment () {
      this.checkPhone(() => {
        this.commenting = true;
        this.focusStatus = true;
      });
    },
    gotoReply (id, name) {
      this.checkPhone(() => {
        this.replyId = id;
        this.replyName = name;
        this.focusStatus = true;
      });
    },
    cancelReply () {
      this.replyId = null;
      this.replyName = null;
      this.commenting = false;
      this.focusStatus = false;
    },
    showCommentFinish () {
      this.commentFinish = this.replyId ? 2 : 1;
      setTimeout(() => {
        this.commentFinish = false;
      }, 2000);
    },
    showPayFinish (payFinishTips) {
      this.payFinish = true;
      // this.payFinishTips = payFinishTips;
      setTimeout(() => {
        this.payFinish = false;
        // this.payFinishTips = null;
      }, 2000);
    },
    submitReply () {
      const lid = util.getParam('lid');
      if (!this.myComment || this.myComment.length < 20) {
        this.setError('回复至少20字以上');
        return false;
      }
      util.newComment(lid, this.myComment, this.replyId, (json) => {
        if (json.code === 0) {
          this.showCommentFinish();
          this.myComment = null;
          this.cancelReply();
          this.updateLesson(true);
          setTimeout(() => {
            const offsetTop = document.querySelector('.discuss').offsetTop;
            const offsetHeight = document.querySelector('.player').offsetHeight;
            document.body.scrollTop = offsetTop - offsetHeight;
          }, 2000);
        } else {
          console.warn('评论错误！')
        }
      });
    },
    gotoLesson (lid) {
      const cid = util.getParam('cid');
      location.href = '/lesson?cid=' + cid + '&lid=' + lid;
    },
    gotoCourse () {
      const cid = util.getParam('cid');
      location.href = '/course?cid=' + cid;
    },
    doLike (comment) {
      this.checkPhone(() => {
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
      });
    },
    nextLesson () {
      // console.log(this.course.lessonList);
    },
    formatTime (time) {
      return util.formatTime(time);
    },
    checkPhone (callback) {
      if (!this.userInfo.phone) {
        const redirect = encodeURIComponent('/' + location.search + location.hash);
        location.href = '/login?redirect=' + redirect;
      } else {
        callback && callback()
      }
    },
    gotoPay: function () {
      this.checkPhone(() => {
        if (this.paying) {
          return false;
        }
        this.paying = true;
        const cid = util.getParam('cid');
        if (this.userInfo.freeCourseRemained > 0) {
          const useFree = confirm('将使用一次免费获取课程的机会，确认兑换？')
          if (useFree) {
            util.getFreeCourse(cid, (json) => {
              this.paying = false;
              if (json.code === 0) {
                let tips = '获取成功';
                this.showPayFinish(tips);
                setTimeout(() => {
                  location.reload();
                }, 2000);
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
                this.showPayFinish();
                setTimeout(() => {
                  location.reload();
                }, 2000);
                // 支付成功后的回调函数
                util.pay(cid, tradeNo, function (json) {});
              },
              error: () => {
                console.warn('支付失败')
              }
            });
          } else {
            console.warn('支付出现了点问题')
          }
        })
      });
    },
    showHongbaoTips (b) {
      this.hongbaoTips = b;
      const cid = util.getParam('cid');
      const lid = util.getParam('lid');
      if (b) {
        const isHongbao = 1;
        const redPacketNonce = this.lesson.redPacketNonce;
        util.changeURL({
          cid, lid, isHongbao, redPacketNonce
        }, true)
        this.updateShare(true);
      } else {
        util.changeURL({
          cid, lid
        }, true)
        this.updateShare(false);
      }
    }
  },
  destroyed() {
    clearInterval(this.interval);
  },
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
    AudioPlayer, Error, Hongbao, InfiniteLoading
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .lesson-container {
    background: #f5f5f5;
    .paid {
      padding-top: 3.226666rem;
      .comment-finish {
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
      .zshb_banner {
        width: 100%;
        position: relative;
        z-index: 1;
      }
      .hongbaoTips {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 9999;
        .cover {
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.8;
          position: absolute;
          top: 0;
          left: 0;
        }
        .text {
          width: 80%;
          position: absolute;
          left: 10%;
          top: 0.8rem;
        }
        .pointer {
          position: absolute;
          right: 0.4rem;
          top: 0.4rem;
          width: 30%;
        }
      }
      .player {
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        margin: 0;
        background: white;
      }
      .player.absolute {
        position: absolute;
      }
      .main {
        background: white;
        padding: 1.3333rem 0.6666rem 0 0.6666rem;
        -webkit-user-select: none;
        .course-title {
          font-size: 0.66666rem;
          color: #333333;
          padding-bottom: 0.53333rem;
          line-height: 1.2;
        }
        .infos {
          font-size: 0.293333rem;
          color: #bbbbbb;
          display: flex;
          justify-content: space-between;
          padding-bottom: 1.06666rem;
          .other {
            display: flex;
            span {
              margin-left: 0.26666rem;
              display: flex;
              align-items: center;
              line-height: 1;
              height: 0.32rem;
              .text {
                display: inline-block;
              }
              .icon {
                width: 0.32rem;
                height: 0.32rem;
                background-repeat: no-repeat;
                background-size: 0.32rem 0.32rem;
                margin-right: 0.08rem;
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
          font-size: 16px;
          color: #444444;
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
            text-align: justify;
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
            height: 252px;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 8;
            -webkit-box-orient: vertical;
            -webkit-mask-image: linear-gradient(#000 10%,transparent 100%);
            mask-image: linear-gradient(#000 30%,transparent 100%);
            -webkit-mask-size: 100% 100%;
            mask-size: 100% 100%;
          }
          .open {
            margin-top: 0.4rem;
            font-size: 0.4rem;
            text-align: center;
            color: @red;
          }
          .hr {
            margin-top: 0.4rem;
            border-top: @border;
          }
          .course {
            .hr {
              border-top: @border;
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
                  display: flex;
                  justify-content: center;
                  float: left;
                  overflow: hidden;
                  border-radius: 1.3333rem;
                  img {
                    height: 100%;
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
                  width: 3.6rem;
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
        padding: 0.53333rem 0.6666rem 1.3333rem 0.6666rem;
        .title {
          line-height: 0.48rem;
          font-size: 0.48rem;
          color: #333333;
          margin-bottom: 0.4rem;
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
          margin-bottom: 0.8rem; 
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
            color: #666666;
            span {
              color: #999999;
            }
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
            line-height: 1.2;
            color: #333333;
            word-break: break-all;
          }
          .quote {
            border-radius: 8px;
            padding: 0.4rem;
            background: #f5f5f5;
            color: #999999;
            font-size: 0.4rem;
            line-height: 1.2;
            margin: 0.23333rem 0;
            word-break: break-all;
          }
          .bottom {
            display: flex;
            justify-content: space-between;
            font-size: 0.32rem;
            color: #999999;
            margin-top: 0.13333rem;
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
        padding: 0.2rem 0.6666rem;
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
        .hongbao {
          margin-left: 0.6666rem;
          position: absolute;
          right: 0.6666rem;
          bottom: 0.2rem;
          height: 1.3333rem;
          width: 0.93333rem;
          animation: shake 1s 2 ease-in-out;
          img {
            height: 100%;
            width: 100%;
          }
        }
        @keyframes rotate {
          from {
            transform: rotate(0);
          }

          25% {
            transform: rotate(-40deg);
          }

          50% {
            transform: rotate(0);
          }

          75% {
            transform: rotate(40deg);
          }

          to {
            transform: rotate(0);
          }

        }
        @keyframes shake {
          10%, 90% {
            transform: translate3d(-1px, 0, 0);
          }
          
          20%, 80% {
            transform: translate3d(2px, 0, 0);
          }

          30%, 50%, 70% {
            transform: translate3d(-4px, 0, 0);
          }

          40%, 60% {
            transform: translate3d(4px, 0, 0);
          }
        }
        .pen {
          position: absolute;
          left: 0.93333rem;
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
      .comment-box.hongbao {
        padding-right: 2.23333rem;
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
    .paid.fromHongbao {
      padding-top: 6.22rem;
    }
    .not-paid {
      padding: 0.4rem;
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
          .img {
            width: 1.92rem;
            height: 1.92rem;
            border-radius: 1.92rem;
            overflow: hidden;
            display: inline-block;
            img {
              width: 1.92rem;
              height: auto;
            }
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
