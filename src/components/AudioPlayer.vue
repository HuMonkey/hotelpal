<template>
  <div class="audio-player">
    <div class="wrapper">
      <audio id="my-audio" :src="source" :autoplay="goOn ? 'autoplay' : ''" controls="controls" preload="auto"></audio>
      <div class="top" v-if="audio">
        <div class="progress">
          <div class="current">{{ current }}</div>
          <div class="bar" @touchmove="moveDrag" @touchend="endDrag">
            <div class="duration">
              <div class="inner" :style="{ width: currentTime / audioLen * 100 + '%' }"></div>
            </div>
            <div class="dot" :style="{ left: currentTime / audioLen * 94 + '%' }" @touchstart="startDrag"><div class="dot-inner"></div></div>
          </div>
          <div class="left">{{ left || songLong }}</div>
        </div>
        <div @click="setGoOn" class="go-on" :class="{clicked: goOn}">连续听</div>
      </div>
      <div class="bottom" v-if="audio">
        <div class="previous-15" @click="previous15">
          <div class="bg"></div>
          15
        </div>
        <div class="previous" @click="preLesson" :class="{empty: !preId}"></div>
        <div class="switch playOrPause" :class="{loading: loading && playing, playing: playing}" @click="playOrPause">
          <div class="border-solid"></div>
        </div>
        <div class="next" @click="nextLesson" :class="{empty: !nextId}"></div>
        <div class="next-15" @click="next15">
          <div class="bg"></div>
          15
        </div>
      </div>
    </div>
    <div class="countdown" v-if="nextId && playing && goOn && countingDown && !dragging">
      <div class="tips">{{ countingDown }}s后将自动为你播放</div>
      <div class="lesson-title">{{ nextLessonTitle }}</div>
      <div class="btn" @click="cancelGoOn">取消自动播放</div>
    </div>
  </div>
</template>

<script>
  import util from '../util/index';
  
  const formatTime = function(seconds, ceil) {
    const fun = ceil ? Math.ceil : Math.floor;
    const m = Math.floor(seconds / 60);
    const s = fun(seconds % 60);
    return (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s)
  }

  export default {
    props: ['source', 'nextId', 'preId', 'songLong', 'type', 'listenLen', 'audioLen'],
    data() {
      return {
        goOn: false,
        interval: null,
        current: '00:00',
        currentTime: 0,
        left: null,
        audio: null,
        playing: false,
        record: false,
        saveInterval: null,
        loading: true,
        countingDown: null,
        nextLessonTitle: null,
        dragging: false,
      }
    },
    mounted() {
      this.audio = document.querySelector('.audio-player audio');
      this.audio.oncanplay = () => {
        this.loading = false;
      };
      if (util.getParam('goon') == 1) {
        this.goOn = true;
        if (util.ua.iOS) {
          util.getWechatSign(this.playOrPause); // ios需要在wx.ready中播放音频
        } else {
          this.playOrPause();
        }
      } else {
        this.audio.removeAttribute('autoplay');
      }
      if (this.listenLen && this.listenLen < this.audioLen) {
        this.currentTime = this.listenLen;
        this.current = formatTime(this.currentTime || 0, true);
        this.audio.currentTime = this.listenLen;
        this.updateTime();
      }
      this.nextId && util.getLesson(this.nextId, (json) => {
        if (json.code === 0) {
          this.nextLessonTitle = json.data.title;
        } else {
          console.warn('获取课程信息失败！')
        }
      })
    },
    methods: {
      setGoOn () {
        // if (!this.nextId) {
        //   // alert('已经是最后一个课时啦！');
        //   return false;
        // }
        this.goOn = !this.goOn;
      },
      cancelGoOn () {
        this.goOn = false;
      },
      updateTime () {
        const audio = this.audio;
        if (!audio.duration) {
          this.left = this.songLong;
          if (util.ua.iOS) {
            audio.onloadeddata = () => {
              if (this.listenLen < this.audioLen) {
                audio.currentTime = this.listenLen || 0;
              }
            };
          }
          return false;
        } else {
          let left = parseInt(audio.duration - audio.currentTime);
          if (left < 0) {
            left = 0;
          }
          this.left = formatTime(left, false);
          if (left < 16) {
            this.countingDown = left;
          }
        }
        this.current = formatTime(this.currentTime || 0, true);
        this.currentTime = Math.ceil(audio.currentTime);
        // 音频结束
        if (audio.duration == audio.currentTime) {
          // 打个点
          let current = this.audioLen;
          const lid = util.getParam('lid') || util.getParam('id');
          util.recordListenPos(lid, current, (json) => {
            if (json.code === 0) {
              // console.log(json)
            } else {
              console.warn('记录听的位置出错！');
            }
          })

          // 重置下音频
          this.current = formatTime(0, true);
          this.currentTime = 0;
          this.left = this.songLong;
          this.audio.currentTime = 0;
          this.playOrPause();

          // 连续播
          if (this.goOn) {
            if (!this.nextId) {
              return false;
            }
            if (this.type == 1) {
              location.href = '/jdbsitem?goon=1&id=' + this.nextId;
              return false;
            }
            const cid = util.getParam('cid');
            location.href = '/lesson?goon=1&cid=' + cid + '&lid=' + this.nextId
          }
        }
      },
      clickProgress (ev) {
        if (this.paused) {
          return false;
        }
        // TODO 
      },
      playOrPause () {
        const audio = this.audio;
        const lid = util.getParam('lid') || util.getParam('id');
        if (this.playing) {
          audio.pause();
          this.saveInterval && clearInterval(this.saveInterval);
          this.interval && clearInterval(this.interval);
        } else {
          if (!this.record) {
            this.record = true;
            util.recordListenTime(lid, (json) => {
              if (json.code === 0) {
                console.log('记录已听时长成功！')
              } else {
                console.warn('记录已听时长出错。')
              }
            })
          }
          audio.play();
          this.updateTime();
          this.setInterval();
          this.interval = setInterval(this.updateTime, 1000);
        }
        this.playing = !this.playing;
      },
      startDrag (ev) {
        ev.stopPropagation();
        this.dragging = true;
        this.audio.muted = true;
        !this.playing && this.playOrPause();
        this.interval && clearInterval(this.interval);
      },
      moveDrag (ev) {
        ev.stopPropagation();
        const audio = this.audio;
        if (!this.dragging) {
          return false;
        }
        const total = this.$el.querySelector(".bar").offsetWidth;
        const progress = ev.touches[0].clientX - this.$el.querySelector(".bar").offsetLeft;
        let p = progress / total;
        if (p < 0) {
          p = 0;
        } 
        if (p > 1) {
          p = 1;
        }
        audio.currentTime = this.currentTime = parseInt(p * audio.duration);
        this.updateTime();
      },
      endDrag (ev) {
        ev.stopPropagation();
        this.dragging = false;
        this.audio.muted = false;
        this.interval = setInterval(this.updateTime, 1000);
      },
      next15 () {
        const audio = this.audio;
        if (!this.playing) {
          return false;
        }
        audio.currentTime = audio.currentTime + 15;
        setTimeout(this.updateTime, 200);
      },
      previous15 () {
        const audio = this.audio;
        if (!this.playing) {
          return false;
        }
        audio.currentTime = audio.currentTime - 15;
        setTimeout(this.updateTime, 200);
      },
      preLesson () {
        if (!this.preId) {
          return false;
        }
        if (this.type == 1) {
          location.href = '/jdbsitem?id=' + this.preId;
          return false;
        }
        const cid = util.getParam('cid');
        location.href = '/lesson?cid=' + cid + '&lid=' + this.preId;
      },
      nextLesson () {
        if (!this.nextId) {
          return false;
        }
        if (this.type == 1) {
          location.href = '/jdbsitem?id=' + this.nextId;
          return false;
        }
        const cid = util.getParam('cid');
        location.href = '/lesson?cid=' + cid + '&lid=' + this.nextId;
      },
      setInterval () {
        this.saveInterval && clearInterval(this.saveInterval);
        this.saveInterval = setInterval(() => {
          let current = this.currentTime < this.audioLen ? this.currentTime : this.audioLen;
          const lid = util.getParam('lid') || util.getParam('id');
          util.recordListenPos(lid, current, (json) => {
            if (json.code === 0) {
              // console.log(json)
            } else {
              console.warn('记录听的位置出错！');
            }
          })
        }, 4000)
      }
    },
    destroyed() {
      this.interval && clearInterval(this.interval);
    },
  }
</script>

<style lang="less">
  @import '../variable.less';

  .audio-player {
    position: relative;
    top: -4px;
    .wrapper {
      position: relative;
      padding-bottom: 0.53333rem;
      box-shadow: 0 0 5px #cccccc;
      audio {
        display: none;
      }
      .top {
        width: 100%;
        padding: 0.4rem 0.4rem;
        color: #999999;
        font-size: 0.26666rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .progress {
          width: 7.5rem;
          display: flex;
          justify-content: space-between; 
          align-items: center;
          .current, .left {
            height: 0.4rem;
            width: 0.8rem;
            text-align: center;
            display: flex;
            align-items: center;
          }
          .bar {
            width: 5.6rem;
            height: 0.4rem;
            position: relative;
            display: flex;
            align-items: center;
            .duration {
              width: 100%;
              height: 3px;
              background: #cccccc;
              .inner {
                width: 0;
                height: 100%;
                background: @red;
              }
            }
            .dot {
              position: absolute;
              top: -0.4rem;
              left: 0;
              width: 1.2rem;
              height: 1.2rem;
              border-radius: 0.4rem;
              overflow: hidden;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: -0.4rem;
              .dot-inner {
                width: 0.4rem;
                height: 0.4rem;
                border-radius: 0.4rem;
                background: @red;
              }
            }
          }
        }
        .go-on {
          width: 1.4rem;
          height: 0.8rem;
          background-image: url('/static/goon-grey.svg');
          background-size: 1.4rem 0.8rem;
          transform: scale(0.8);
          display: flex;
          justify-content: center;
          line-height: 0.7rem;
        }
        .go-on.clicked {
          color: @red;
          background-image: url('/static/goon-red.svg');
        }
      }
      .bottom {
        width: 100%;
        height: 1.28rem;
        padding: 0 0.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999999;
        .previous-15, .next-15 {
          width: 0.8rem;
          height: 0.8rem;
          position: relative;
          font-size: 0.32rem;
          text-align: center;
          line-height: 0.8rem;
          transform: scale(0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          .bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-image: url('/static/15.svg');
            background-size: 0.75rem 0.75rem;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
        .previous-15 {
          padding-left: 0.1rem;
          .bg {
            -moz-transform:scaleX(-1);
            -webkit-transform:scaleX(-1);
            -o-transform:scaleX(-1);
            transform:scaleX(-1);
          } 
        }
        .next-15 {
          padding-right: 0.1rem;
        }
        .previous, .next {
          width: 0.53333rem;
          height: 0.53333rem;
          background-image: url('/static/previous.svg');
          background-size: 0.52333rem 0.52333rem;
          background-position: center;
          background-repeat: no-repeat;
        }
        .next {
          background-image: url('/static/next.svg');
        }
        .previous.empty {
          background-image: url('/static/previous-grey.svg');
        }
        .next.empty {
          background-image: url('/static/next-grey.svg');
        }
        .switch {
          width: 1.28rem;
          height: 1.28rem;
          background-image: url('/static/loading-play.svg');
          background-size: auto 0.53333rem;
          background-position: 0.5rem center;
          background-repeat: no-repeat;
          .border-solid {
            width: 1.28rem;
            height: 1.28rem;
            background-image: url('/static/play-border.svg');
            background-size: 1.2rem 1.2rem;
            background-position: center;
            background-repeat: no-repeat;
          }
        }
        .switch.loading {
          .border-solid {
            background-image: url('/static/loading.png');
            animation: transform 5s infinite linear;
          }
        }
        .switch.playing {
          background-image: url('/static/pause.svg');
          background-position: center;
        }
      }
    }
    .countdown {
      width: 100%;
      height: 1.3333rem;
      background: @red;
      color: white;
      position: absolute;
      bottom: -1.3333rem;
      left: 0;
      font-size: 0.32rem;
      padding: 0.26666rem 0.53333rem;
      line-height: 1;
      .tips {
        font-size: 0.37rem;
      }
      .lesson-title {
        margin-top: 0.13333rem;
      }
      .btn {
        display: inline-block;
        border: white solid thin;
        padding: 0 0.186666rem;
        height: 0.48rem;
        line-height: 0.42rem;
        border-radius: 4px;
        position: absolute;
        right: 0.26666rem;
        top: 0.4rem;
      }
    }
  }
  @keyframes transform {
    from {
      transform: rotate(0);
    }

    50% {
      transform: rotate(180deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
</style>