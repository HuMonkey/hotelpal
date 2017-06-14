<template>
  <div class="audio-player">
    <div class="top">
      <div class="progress">
        <div class="current">{{ current }}</div>
        <div class="bar" @touchmove="moveDrag" @touchend="endDrag">
          <div class="duration">
            <div class="inner" :style="{ width: progress * 100 + '%' }"></div>
          </div>
          <div class="dot" :style="{ left: progress * 100 + '%' }" @touchstart="startDrag"></div>
        </div>
        <div class="left">{{ left }}</div>
      </div>
      <div @click="setGoOn" class="go-on" :class="{clicked: goOn}">连续听</div>
    </div>
    <div class="bottom">
      <div class="previous-15" @click="previous15">
        <div class="bg"></div>
        15
      </div>
      <div class="previous"></div>
      <div class="switch" :class="{playing: playing}" @click="playOrPause"></div>
      <div class="next"></div>
      <div class="next-15" @click="next15">
        <div class="bg"></div>
        15
      </div>
    </div>
    <!--<span>Total duration: {{ duration }} seconds</span>
    <span>Progress: {{ (progress * 100) }}%</span>
    <button @click="togglePlayback">{{ playing ? 'Pause' : 'Play' }}</button>
    <button @click="stop">Stop</button>-->
  </div>
</template>

<script>
  import VueHowler from 'vue-howler';
  import debounce from 'debounce';
  
  const formatTime = function(seconds, ceil) {
    const fun = ceil ? Math.ceil : Math.floor;
    const m = Math.floor(seconds / 60);
    const s = fun(seconds % 60);
    return (m > 9 ? m : '0' + m) + ':' + (s > 9 ? s : '0' + s)
  }

  let dragging = false;

  export default {
    mixins: [VueHowler],
    data() {
      return {
        goOn: false,
        interval: null,
        current: '00:00',
        left: '00:00',
      }
    },
    mounted() {
      console.log(this)
    },
    methods: {
      setGoOn() {
        this.goOn = !this.goOn;
      },
      updateTime() {
        this.current = formatTime(this.progress * this.duration, true);
        this.left = formatTime(this.duration - this.progress * this.duration, false);
      },
      clickProgress(ev) {
        if (!this.playing) {
          return false;
        }
        // this.setProgress(ev.offsetX / this.duration);
      },
      playOrPause() {
        if (this.playing) {
          this.pause();
          this.interval && clearInterval(this.interval);
        } else {
          this.play();
          this.updateTime();
          this.interval = setInterval(this.updateTime, 1000)
        }
      },
      startDrag(ev) {
        dragging = true;
        this.mute();
        this.interval && clearInterval(this.interval);
      },
      moveDrag(ev) {
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
        this.setProgress(p);
      },
      debounceMove(ev) {
        return debounce(() => {
          this.moveDrag(ev);
        }, 200);
      },
      endDrag(ev) {
        dragging = false;
        this.unmute();
        this.interval = setInterval(this.updateTime, 1000)
      },
      next15() {
        if (!this.playing) {
          return false;
        }
        let p = (this.duration * this.progress + 15) / this.duration;
        if (p < 0) {
          p = 0;
        } 
        if (p > 1) {
          p = 1;
        }
        this.setProgress(p);
        setTimeout(this.updateTime, 200);
      },
      previous15() {
        if (!this.playing) {
          return false;
        }
        let p = (this.duration * this.progress - 15) / this.duration;
        if (p < 0) {
          p = 0;
        } 
        if (p > 1) {
          p = 1;
        }
        this.setProgress(p);
        setTimeout(this.updateTime, 200);
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
        .current, .left {
          height: 0.4rem;
          line-height: 0.4rem;
          width: 0.8rem;
          text-align: center;
        }
        .bar {
          width: 5.6rem;
          height: 0.4rem;
          position: relative;
          display: flex;
          align-items: center;
          .duration {
            width: 100%;
            height: 4px;
            background: #cccccc;
            .inner {
              width: 50%;
              height: 100%;
              background: @red;
            }
          }
          .dot {
            position: absolute;
            top: 0;
            left: 2.8rem;
            width: 0.4rem;
            height: 0.4rem;
            border-radius: 0.4rem;
            background: @red;
          }
        }
      }
      .go-on {
        width: 1.4rem;
        height: 0.63rem;
        background-image: url('/static/goon-grey.svg');
        background-size: 1.4rem 0.63rem;
        text-align: center;
        line-height: 0.50rem;
        transform: scale(0.8);
        margin-top: 0.1rem;
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
      .switch {
        width: 1.28rem;
        height: 1.28rem;
        background-image: url('/static/play.svg');
        background-size: 1.26rem 1.26rem;
        background-position: center;
        background-repeat: no-repeat;
      }
      .switch.playing {
        background-image: url('/static/stop.svg');
      }
    }
  }
</style>