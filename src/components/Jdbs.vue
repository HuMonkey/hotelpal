<template>
  <div class="jdbs-container">
    <div class="header">
      <img src="/static/jdbs-banner.png">
      <!-- <div class="cover"></div> -->
      <!-- <div class="desc">
        <div class="title"> <span>酒店邦说</span> <span class="tag">免费</span> </div>
        <div class="sub-title">[酒店邦说]是一档酒店邦自主生产内容的栏目</div>
      </div> -->
    </div>
    <div class="toolbar">
      <div class="tips">已更新{{ total }}条</div>
      <div class="sort" @click="reOrder"><div class="icon"></div>倒序</div>
    </div>
    <ul class="list">
      <li class="item" :class="{disable: !l.isPublish, finished: l.listenLen && l.listenLen >= l.audioLen}" @click="GotoJdbsItem(l)" v-for="l in lessonList" :id="'lesson-' + l.id">
        <div class="name">
          <div class="arrow"></div>
          <span>{{ l.title }}</span>
        </div>
        <div class="infos" v-if="l.isPublish">
          <span>{{ l.publishTime }}</span>
          <span>{{ l.resourceSize }}</span>
          <span>{{ l.audioLenStr }}</span>
          <span class="over" v-if="l.listenLen && l.listenLen >= l.audioLen">已播完</span>
          <span class="ing" v-if="l.listenLen && l.listenLen < l.audioLen">已播{{ parseInt(l.listenLen / l.audioLen * 100) }}%</span>
        </div>
        <div class="infos" v-if="!l.isPublish">
          <span>尚未发布</span>
        </div>
        <div class="arrow-right"></div>
      </li>
      <infinite-loading :on-infinite="onInfinite" :distance="distance" ref="infiniteLoading">
        <span class="vue-loader weui-loadmore" slot="spinner">
          <i class="weui-loading"></i>
          <span class="weui-loadmore__tips">正在加载</span>
        </span>
        <span class="vue-loader" slot="no-results">没有更多信息了</span>
      </infinite-loading>
    </ul>
    <div class="btns">
      <div class="item home" @click="gotoHome"><div class="icon"></div><span>首页</span></div>
      <div class="item left" @click="gotoNew" v-if="notListenNum > 0"><div class="icon"></div>{{ notListenNum }}条未听</div>
      <div class="item left empty" v-if="notListenNum === 0">全部听完</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import util from '../util/index'
import InfiniteLoading from 'vue-infinite-loading';

export default {
  name: 'jdbs',
  props: [],
  data () {
    return {
      lessonList: [],
      start: 0, 
      number: 10,
      distance: 20,
      order: 'desc',
      total: 0,
    }
  },
  created() {
    document.title = '酒店邦说';
  },
  mounted() {},
  methods: {
    onInfinite: function () {
      util.getInternalLessonList(this.start, this.number, this.order, (json) => {
        if (json.code === 0) {
          this.total = json.data.total;
          this.start = this.start + this.number;
          if (json.data.hasMore) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.lessonList = this.lessonList.concat(json.data.lessonResponseList.map((d) => {
            return {
              ...d,
              audioLenStr: moment(d.audioLen * 1000).format('mm:ss')
            }
          }));
        } else {
          console.warn('获取自主课程列表出错！');
        }
      })
    },
    gotoHome: function () {
      location.href = '/#/';
    },
    gotoNew: function () {
      if (!this.notListenLesson) {
        return false;
      }
      location.href = '/?id=' + this.notListenLesson.id + '#/jdbsitem';
      // document.body.scrollTop = document.querySelector('#lesson-' + this.notListenLesson.id).getBoundingClientRect().top + document.body.scrollTop;
    },
    GotoJdbsItem: function (lesson) {
      if (!lesson.isPublish) {
        return false;
      }
      location.href = '/?id=' + lesson.id + '#/jdbsitem'
    },
    reOrder: function () {
      this.start = 0;
      if (this.order === 'desc') {
        this.order = 'asc';
      } else {
        this.order = 'desc';
      }
      this.lessonList = [];
      this.onInfinite();
    },
    updateShare: function () {
      util.updateWechatShare({
        title: '酒店邦说自主内容',
        link: location.href,
        imgUrl: 'http://hotelpal.cn/static/jiudianbang.png',
        desc: '酒店邦自主内容',
      })
    },
  },
  computed: {
    notListenNum: function () {
      return this.lessonList.filter((d) => d.listenLen === null || d.listenLen === 0).length;
    },
    notListenLesson: function () {
      const lessons = this.lessonList.filter((d) => d.listenLen === null || d.listenLen === 0);
      return lessons.length > 0 ? lessons[0] : null;
    }
  },
  destroyed() {},
  watch: {},
  components: {
    InfiniteLoading
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .jdbs-container {
    width: 100%;
    min-height: 100%;
    padding: 0 0 1.2rem 0;
    line-height: 1;
    background: white;
    .header {
      width: 100%;
      height: 3.3333rem;
      position: relative;
      .cover {
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.1;
        position: absolute;
        left: 0;
        top: 0;
      }
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .desc {
        width: 100%;
        height: 100%;
        color: white;
        position: relative;
        overflow: hidden;
        .title {
          margin-top: 1.06666rem;
          text-align: center;
          font-size: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          .tag {
            border-radius: 4px;
            font-size: 0.293333rem;
            height: 0.5rem;
            line-height: 0.4rem;
            display: flex;
            align-items: center;
            border: white solid thin;
            padding: 0 0.2rem;
            margin-left: 0.4rem;
          }
        }
        .sub-title {
          font-size: 0.32rem;
          text-align: center;
          margin-top: 0.26666rem;
        }
      }
    }
    .toolbar {
      overflow: hidden;
      width: 100%;
      height: 1rem;
      line-height: 1rem;
      font-size: 0.346666rem;
      color: #999999;
      padding: 0 0.4rem;
      border-bottom: @border;
      .tips {
        float: left;
      }
      .sort {
        float: right;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          display: inline-block;
          width: 0.4rem;
          height: 0.4rem;
          background-image: url('/static/sort.svg');
          background-size: 0.4rem 0.4rem;
          background-position: center;
          background-repeat: no-repeat;
          margin-right: 0.13333rem;
        }
      }
    }
    .list {
      width: 100%;
      position: relative;
      .item {
        width: 100%;
        position: relative;
        height: 1.88rem;
        border-bottom: @border;
        padding: 0.4rem;
        color: #333333;
        .name {
          font-size: 0.4rem;
          display: flex;
          align-items: center;
          .arrow {
            display: inline-block;
            border: 0.13333rem solid #ffffff;
            border-left-color: #666666;
            width: 0;
            height: 0;
            margin-right: 0.13333rem;
          }
          span {
            margin-left: -0.1rem;
          }
        }
        .infos {
          font-size: 0.32rem;
          color: #cccccc;
          margin-top: 0.32rem;
          padding-left: 0.3rem;
          span {
            margin-right: 0.4rem;
          }
          span:last-child {
            margin-right: 0;
          }
          .ing {
            color: @red;
          }
          .left {
            color: @red;
          }
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
      .item.disable, .item.finished {
        .name {
          color: #cccccc;
          .arrow {
            border-left-color: #cccccc;
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
      border-top: #ebebeb solid thin;
      .item {
        height: 100%;
        text-align: center;
        color: #333333;
        font-size: 0.4rem;
        background: white;
      }
      .home {
        width: 2.48rem;
        border-right: #ebebeb solid thin;
        font-size: 0.32rem;
        text-align: center;
        color: #666666;
        .icon {
          width: 0.48rem;
          height: 0.48rem;
          background-image: url('/static/home.svg');
          background-size: 0.48rem 0.48rem;
          background-position: center;
          background-repeat: no-repeat;
          margin: 0.16rem auto 0 auto;
        }
        span {
          display: inline-block;
          margin-top: 0.16rem;
          line-height: 1;
        }
      }
      .left {
        width: 7.52rem;
        color: @red;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1.26666rem;
        .icon {
          display: inline-block;
          width: 0.6rem;
          height: 0.6rem;
          background-image: url('/static/play-icon.svg');
          background-size: 0.5rem 0.5rem;
          background-position: center;
          background-repeat: no-repeat;
          margin-right: 0.26666rem;
        }
      }
      .left.empty {
        color: #cccccc;
      }
    }
  }

</style>
