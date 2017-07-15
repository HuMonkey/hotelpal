<template>
  <div class="audio-player">
    <audio :src="source" controls="controls" preload="load"></audio>
    <div class="top" v-if="audio">
      <div class="progress">
        <div class="current">{{ current }}</div>
        <div class="bar" @touchmove="moveDrag" @touchend="endDrag">
          <div class="duration">
            <div class="inner" :style="{ width: audio.currentTime / audioLen * 100 + '%' }"></div>
          </div>
          <div class="dot" :style="{ left: audio.currentTime / audioLen * 94 + '%' }" @touchstart="startDrag"></div>
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
      <div class="switch" :class="{playing: playing}" @click="playOrPause"></div>
      <div class="next" @click="nextLesson" :class="{empty: !nextId}"></div>
      <div class="next-15" @click="next15">
        <div class="bg"></div>
        15
      </div>
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

  let dragging = false;

  export default {
    props: ['source', 'nextId', 'preId', 'songLong', 'type', 'listenLen', 'audioLen'],
    data() {
      return {
        goOn: false,
        interval: null,
        current: '00:00',
        left: null,
        audio: null,
        playing: false,
        record: false,
        saveInterval: null,
      }
    },
    mounted() {
      this.audio = document.querySelector('.audio-player audio');
      console.log(this.listenLen)
      if (this.listenLen && this.listenLen < this.audioLen) {
        this.audio.currentTime = this.listenLen;
        this.updateTime();
      }
      if (util.getParam('goon') == 1) {
        this.goOn = true;
        setTimeout(this.playOrPause, 2000);
      }
    },
    methods: {
      setGoOn () {
        if (!this.nextId) {
          alert('已经是最后一个课时啦！');
          return false;
        }
        this.goOn = !this.goOn;
      },
      updateTime () {
        const audio = this.audio;
        this.current = formatTime(audio.currentTime || 0, true);
        if (!audio.duration) {
          this.left = this.songLong;
        } else {
          this.left = formatTime(audio.duration - audio.currentTime, false);
        }
        if (audio.ended) {
          this.current = formatTime(0, true);
          this.left = this.songLong;
          this.audio.currentTime = 0;
          this.playOrPause();
          if (this.goOn) {
            if (!this.nextId) {
              return false;
            }
            if (this.type == 1) {
              location.href = '/?goon=1&id=' + this.nextId + '#/jdbsitem';
              return false;
            }
            const cid = util.getParam('cid');
            location.href = '/?goon=1&cid=' + cid + '&lid=' + this.nextId + '#/lesson'
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
        const lid = util.getParam('lid');
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
          this.interval = setInterval(this.updateTime, 1000)
        }
        this.playing = !this.playing;
      },
      startDrag (ev) {
        dragging = true;
        this.audio.muted = true;
        this.interval && clearInterval(this.interval);
      },
      moveDrag (ev) {
        const audio = this.audio;
        if (!dragging || !this.playing) {
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
        audio.currentTime = p * audio.duration;
        this.updateTime();
      },
      endDrag (ev) {
        dragging = false;
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
          location.href = '/?id=' + this.preId + '#/jdbsitem';
          return false;
        }
        const cid = util.getParam('cid');
        location.href = '/?cid=' + cid + '&lid=' + this.preId + '#/lesson';
      },
      nextLesson () {
        if (!this.nextId) {
          return false;
        }
        if (this.type == 1) {
          location.href = '/?id=' + this.nextId + '#/jdbsitem';
          return false;
        }
        const cid = util.getParam('cid');
        location.href = '/?cid=' + cid + '&lid=' + this.nextId + '#/lesson';
      },
      setInterval () {
        this.saveInterval && clearInterval(this.saveInterval);
        this.saveInterval = setInterval(() => {
          let current = Math.ceil(this.audio.currentTime);
          if (current > this.audio.duration) {
            current = Math.ceil(this.audio.duration);
          }
          const lid = util.getParam('lid');
          util.recordListenPos(lid, current, (json) => {
            if (json.code === 0) {
              console.log(json)
            } else {
              console.warn('记录听的位置出错！');
            }
          })
        }, 1000)
      }
    },
    destroyed() {
      this.interval && clearInterval(this.interval);
    },
    watch: {}
  }
</script>

<style lang="less">
  @import '../variable.less';

  .audio-player {
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
            top: 0;
            left: 0;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 0.4rem;
            background: @red;
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
      .previous.empty, .next.empty {
        background: none;
      }
      .switch {
        width: 1.28rem;
        height: 1.28rem;
        background-image: url('/static/play.svg');
        background-size: 1.2rem 1.2rem;
        background-position: center;
        background-repeat: no-repeat;
      }
      .switch.playing {
        background-image: url('/static/stop.svg');
      }
    }
  }
</style>