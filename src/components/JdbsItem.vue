<template>
  <div class="jdbsitem-container">
    <Error :error="error" v-if="error"></Error>
    <div class="top-wrap" v-if="lesson" :class="{fixed: scrollDown}">
      <div class="goback" @click="goback" v-if="lesson && !scrollDown">
        <img src="/static/jiudianbang.png">
        <span>酒店邦说</span>
        <div class="arrow-right"></div>
      </div>
      <div class="player">
        <div class="banner" v-if="lesson && !scrollDown">
          <img :src="lesson.coverImg">
        </div>
        <audio-player :source="song" :loop="false" :nextId="lesson.nextLessonId" type="1" :preId="lesson.previousLessonId" :songLong="songLong" :audioLen="lesson.audioLen" :listenLen="lesson.listenLen"></audio-player>
      </div>
    </div>
    <div v-if="lesson">
      <div class="main">
        <div class="course-title">{{ lesson.title }}</div>
        <div class="infos">
          <div class="time">{{ lesson.publishTimeStr }}发布</div>
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
                  {{ comment.userName }}  {{ comment.userCompany + '·' + comment.userTitle }}<span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
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
                  {{ comment.userName }}  {{ comment.userCompany + '·' + comment.userTitle }}<span class="tag" v-if="comment.isTheSpeaker === 1">主讲人</span>
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
      <div class="comment-finish" v-if="commentFinish">
        <div class="cover"></div>
        <div class="box">
          <div class="icon"></div>
          <div class="text">{{commentFinish === 2 ? '回复' : '评论'}}成功</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import util from '../util/index'
import AudioPlayer from './AudioPlayer.vue'
import Error from './Error.vue'

export default {
  name: 'jdbsitem',
  props: [],
  data () {
    return {
      song: null,

      commentId: 1,
      comments: [],
      commenting: false,
      replyId: null,
      replyName: null,

      lesson: null,
      isIntroOverflow: false,
      introOverflow: true,

      focusStatus: false,
      interval: null,

      songLong: '00:00',
      myComment: '',

      errorTimeout: null,
      error: null,

      commentFinish: false,

      scrollDown: false,
    }
  },
  created() {},
  mounted() {
    this.updateLesson();
    document.body.onscroll = () => {
      const width = document.body.offsetWidth;
      const scrollTop = document.body.scrollTop;
      console.log(scrollTop, width / 10 * (1.173333 + 5.46666))
      if (scrollTop >= width / 10 * (1.173333 + 5.46666)) {
        this.scrollDown = true;
      } else {
        this.scrollDown = false;
      }
    }
  },
  methods: {
    showCommentFinish () {
      this.commentFinish = this.replyId ? 2 : 1;
      setTimeout(() => {
        this.commentFinish = false;
      }, 2000);
    },
    updateLesson: function () {
      const id = util.getParam('id')
      util.getLesson(id, (json) => {
        if (json.code === 0) {
          document.title = json.data.title;
          this.song = json.data.audio;
          const publishTimeStr = json.data.publishTime && json.data.publishTime.split(' ')[0];
          this.songLong = moment(json.data.audioLen * 1000).format('mm:ss');
          const content = json.data.content;
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
          this.updateShare();
        } else {
          console.warn('获取课时失败！')
        }
      });
    },
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    updateShare: function () {
      const lesson = this.lesson;
      util.updateWechatShare({
        title: lesson.title,
        link: location.href,
        imgUrl: lesson.coverImg,
        desc: '酒店邦自主课程',
      })
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
    setError: function (error) {
      this.error = error;
      this.errorTimeout && clearTimeout(this.errorTimeout)
      this.errorTimeout = setTimeout(() => {
        this.error = null;
      }, 4000);
    },
    submitReply () {
      const id = util.getParam('id');
      if (!this.myComment || this.myComment.length < 20) {
        this.setError('回复至少20字以上');
        return false;
      }
      util.newComment(id, this.myComment, this.replyId, (json) => {
        if (json.code === 0) {
          this.showCommentFinish();
          this.myComment = null;
          this.cancelReply();
          this.updateLesson();
        } else {
          console.warn('评论错误！')
        }
      });
    },
    doLike (comment) {
      if (comment.liked) {
        return false;
      }
      const lid = util.getParam('id');
      util.addZan(lid, comment.id, (json) => {
        if (json.code === 0) {
          comment.liked = true;
          comment.zanCount = comment.zanCount ? comment.zanCount + 1 : 1;
        } else {
          console.warn('点赞出错！');
        }
      })
    },
    formatTime (time) {
      return util.formatTime(time);
    },
    goback () {
      location.href = '/#/jdbs'
    }
  },
  destroyed() {},
  watch: {},
  components: {
    AudioPlayer, Error
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .jdbsitem-container {
    background: #f5f5f5;
    padding-top: 9.93333rem;
    .top-wrap {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 9999;
      .goback {
        width: 100%;
        height: 1.173333rem;
        background: white;
        padding: 0.186666rem 0.4rem;
        display: flex;
        align-items: center;
        position: relative;
        img {
          width: 0.8rem;
          height: 0.8rem;
          border-radius: 4px;
        }
        span {
          font-size: 0.4rem;
          color: #333333;
          margin-left: 0.26666rem;
        }
        .arrow-right {
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
      .player {
        width: 100%;
        margin: 0;
        background: white;
        padding-bottom: 0.4rem;
        .banner {
          width: 100%;
          height: 5.46666rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .top-wrap.fixed {
      position: fixed;
      box-shadow: 0px 1px 10px #cccccc;
    }
    .main {
      background: white;
      padding: 1.3333rem 0.4rem 0.4rem 0.4rem;
      margin-top: 0.26666rem;
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
              background-size: 0.32rem 0.32rem;
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
          border-top: @border;
          background: @hrColor;
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
          word-break: break-all;
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
          margin-top: 0.1.3333rem;
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
  }
</style>
