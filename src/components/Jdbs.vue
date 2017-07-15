<template>
  <div class="jdbs-container">
    <div class="header">
      <img src="/static/banner_1.jpg">
      <div class="desc">
        <div class="title"> <span>酒店邦说</span> <span class="tag">免费</span> </div>
        <div class="sub-title">[酒店邦说]是一档酒店邦自主生产内容的栏目</div>
      </div>
    </div>
    <div class="toolbar">
      <div class="tips">已更新{{ total }}条</div>
      <div class="sort" @click="reOrder"><div class="icon"></div>倒序</div>
    </div>
    <ul class="list">
      <li class="item" :class="{disable: !l.isPublish}" @click="GotoJdbsItem(l)" v-for="l in lessonList">
        <div class="name">
          <div class="arrow"></div>
          <span>{{ l.title }}</span>
        </div>
        <div class="infos" v-if="l.isPublish">
          <span>{{ l.publishTime }}</span>
          <span>{{ l.resourceSize }}</span>
          <span>{{ l.audioLen }}</span>
          <span class="left" v-if="l.listenLen">已播{{ parseInt(l.listenLen / l.audioLen * 100) }}%</span>
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
      <div class="item left"><div class="icon"></div>{{ notListenNum }}条未听</div>
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
              audioLen: moment(d.audioLen * 1000).format('mm:ss')
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
    }
  },
  computed: {
    notListenNum: function () {
      return this.lessonList.filter((d) => d.listenLen === null).length;
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
          margin-right: 0.2rem;
        }
      }
    }
    .list {
      width: 100%;
      position: relative;
      .item {
        width: 100%;
        position: relative;
        height: 2rem;
        border-bottom: @border;
        padding: 0.4rem;
        .name {
          font-size: 0.4rem;
          color: #666666;
          display: flex;
          align-items: center;
          .arrow {
            display: inline-block;
            border: 0.12rem solid #ffffff;
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
          color: #999999;
          margin-top: 0.48rem;
          padding-left: 0.3rem;
          span {
            margin-right: 0.4rem;
          }
          span:last-child {
            margin-right: 0;
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
      .item.disable {
        .name {
          color: #999999;
          .arrow {
            border-left-color: #999999;
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
          background-image: url('/static/play.svg');
          background-size: 0.5rem 0.5rem;
          background-position: center;
          background-repeat: no-repeat;
          margin-right: 0.3rem;
        }
      }
    }
  }
.infinite-loading-container {
  font-size: 0.32rem;
}
.weui-loadmore {
  padding:10px 0;
}
.weui-loading {
  width:25px;
  height:25px;
  display: inline-block;
  vertical-align: middle;
  animation: weuiLoading 1s steps(12, end) infinite;
  background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;
  background-size: 100%;
  &.weui-loading_transparent{
    background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect xmlns='http://www.w3.org/2000/svg' width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.56)' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.5)' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.43)' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.38)' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.32)' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.28)' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.25)' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.2)' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.17)' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.14)' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.1)' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='rgba(255,255,255,.03)' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E");
  }
}

@-webkit-keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}

@keyframes weuiLoading {
  0% {
    transform: rotate3d(0, 0, 1, 0deg);
  }

  100% {
    transform: rotate3d(0, 0, 1, 360deg);
  }
}
.weui-loadmore__tips {
  display: inline-block;
  vertical-align: middle;
  color:#333;
}
.infinite-status-prompt {
  display: none;
}
</style>
