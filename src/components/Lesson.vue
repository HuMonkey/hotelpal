l.id<template>
  <div class="lesson-container">
    <div class="paid" v-if="true">
      <div class="player">
        <audio-player v-if="songs.length !== 0" :sources="songs" :loop="false"></audio-player>
      </div>
      <div class="main">
        <div class="course-title">{{ lesson.lessonNo }} | {{ lesson.title }}</div>
        <div class="infos">
          <div class="time">{{ lesson.publishTimeStr }}发布</div>
          <div class="other">
            <span><div class="icon time"></div>{{ lesson.lenStr }}</span>
            <span><div class="icon download"></div>{{ lesson.resourceSize }}</span>
            <span><div class="icon read"></div>{{ lesson.commentCount }}</span>
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
          <div class="article" :class="{overflow: isIntroOverflow && introOverflow}">
            {{ lesson.content }}
          </div>
          <div class="open" v-if="isIntroOverflow" @click="switchOverflow">{{ introOverflow ? '查看完整介绍' : '收起完整介绍' }}</div>
          <div class="hr"></div>
          <div class="course">
            <div class="back">
              <div class="box" @click="gotoCourse">
                <img :src="course.headImg">
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
          <div class="good">
            <div class="title">
              讨论
              <span>精选（3）</span>
            </div>
            <div class="comments">
              <div class="item">
                <div class="avater">
                  <img src="/static/header.png">
                </div>
                <div class="name">
                  胡万祺  酒店邦<span class="tag">主讲人</span>
                </div> 
                <div class="content">
                  这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论
                </div>
                <div class="quote">
                  这是引用这是引用这是引用这是引用这是引用这是引用这是引用这是引用这是引用
                </div>
                <div class="bottom">
                  <div class="time">07-18</div>
                  <div class="box">
                    <div class="like" @click="doLike(1)">
                      <div class="icon"></div>
                      111
                    </div>
                    <div class="comments" @click="gotoReply(1, '胡万祺')">
                      回复
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="all">
            <div class="title">
              <span>全部（3）</span>
            </div>
            <div class="no-comment" v-if="comments.length === 0">
              尚无讨论，说说你的看法吧！
            </div>
            <div class="comments" v-if="comments.length !== 0">
              <div class="item">
                <div class="avater">
                  <img src="/static/header.png">
                </div>
                <div class="name">
                  胡万祺  酒店邦<span class="tag">主讲人</span>
                </div> 
                <div class="content">
                  这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论这是评论
                </div>
                <div class="quote">
                  这是引用这是引用这是引用这是引用这是引用这是引用这是引用这是引用这是引用
                </div>
                <div class="bottom">
                  <div class="time">07-18</div>
                  <div class="box">
                    <div class="like">
                      <div class="icon"></div>
                      111
                    </div>
                    <div class="comments">
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
            <div class="confirm">发布</div>
          </div>
          <textarea v-focus="focusStatus" :placeholder="replyId ? `回复${replyName}` : '一起来参与讨论吧！'"></textarea>
        </div>
      </div>
    </div>
    <div class="not-paid" v-if="false">
      <div class="box">
        <div class="top">
          <div class="text">你需要先购买课程<br> <span class="price">¥ 199 / 10课时</span></div>
        </div>
        <div class="avater">
          <img src="/static/logo.png">
        </div>
        <div class="bottom">
          <div class="name">胡万祺</div>
          <div class="who">酒店帮创始人</div>
          <div class="course">什么鬼什么鬼什么鬼</div>
          <div class="desc">介绍介绍</div>
          <div class="btn">购买课程  获取知识</div>
        </div>
      </div>
      <div class="log">你已经购买？点此 <span>登录</span></div>
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
      songs: [],
      value: 1,
      swiperWidth: 0,
      commentId: 1,
      comments: [1],
      commenting: false,
      replyId: null,
      replyName: null,

      lesson: {},
      course: {},

      focusStatus: false,
      interval: null,

      isIntroOverflow: false,
      introOverflow: true,
    }
  },
  created() {},
  mounted() {
    this.songs = ['/static/test.mp3'];

    const lid = util.getParam('lid');
    const cid = util.getParam('cid');
    util.getLesson(lid, (json) => {
      if (json.code === 0) {
        document.title = json.data.title;
        const publishTimeStr = json.data.publishTime && json.data.publishTime.split(' ')[0];
        this.lesson = {
          ...json.data,
          publishTimeStr,
          lenStr: moment(json.data.audioLen * 1000).format('mm:ss')
        };
        let rem = document.body.clientWidth / 10;
        rem = rem > 75 ? 75 : rem;
        let fontSize = rem * 0.4;
        const length = util.textLength(this.lesson.content, fontSize);
        if (length > 9.2 * rem * 2) {
          this.isIntroOverflow = true;
        }
      } else {
        console.warn('获取课时失败！')
      }
    });
    util.getCourse(cid, (json) => {
      if (json.code === 0) {
        this.course = json.data;
        const lessonList = this.course.lessonList;
        const lessonsNum = lessonList.length;
        this.swiperWidth = (lessonsNum * 300 + (lessonsNum - 1) * 20) / 75;
        const former = lessonList.indexOf(lessonList.find((d) => d.id == lid));
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
    switchOverflow: function() {
      this.introOverflow = !this.introOverflow;
    },
    addCurrentTime () {
      const currentTime = this.audio.currentTime;
      this.audio.currentTime = currentTime + 15;
    },
    minusCurrentTime () {
      const currentTime = this.audio.currentTime;
      this.audio.currentTime = currentTime - 15;
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
    gotoLesson (lid) {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '&lid=' + lid + '#/lesson';
    },
    gotoCourse () {
      const cid = util.getParam('cid');
      location.href = '/?cid=' + cid + '#/course';
    },
    doLike (rid) {
      alert('你点了赞！')
    }
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
          color: #999999;
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
            p + p {
              margin-top: 1rem;
            }
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
            background: #cccccc;
          }
          .course {
            .hr {
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
                img {
                  width: 1.3333rem;
                  height: 1.3333rem;
                  border-radius: 1.3333rem;
                  float: left;
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
                  background: @red;
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
                  background: #f0944a;
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
              .like {
                margin-right: 0.4rem;
                .icon {
                  width: 0.4rem;
                  height: 0.4rem;
                  background-image: url('/static/like.svg');
                  background-size: 0.4rem auto;
                  background-repeat: no-repeat;
                  display: inline-block;
                  vertical-align: top;
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
