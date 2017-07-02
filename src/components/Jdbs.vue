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
      <div class="tips">已更新21条</div>
      <div class="sort"><div class="icon"></div>倒序</div>
    </div>
    <div class="list">
      <div class="item" :class="{disable: !l.isPublish}" @click="GotoJdbsItem(l.id)" v-for="l in lessonList">
        <div class="name">
          <div class="arrow"></div>
          <span>{{ l.title }}</span>
        </div>
        <div class="infos">
          <span>{{ l.publishTime }}</span>
          <span>{{ l.resourceSize }}</span>
          <span>{{ l.audioLen }}</span>
          <span class="left" v-if="l.listenLen">已播{{ parseInt(l.listenLen / l.audioLen * 100) }}%</span>
        </div>
        <div class="arrow-right"></div>
      </div>
    </div>
    <div class="btns">
      <div class="item home" @click="gotoHome"><div class="icon"></div><span>首页</span></div>
      <div class="item left"><div class="icon"></div>{{ notListenNum }}条未听</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import util from '../util/index'

export default {
  name: 'jdbs',
  props: [],
  data () {
    return {
      lessonList: []
    }
  },
  created() {},
  mounted() {
    document.title = '酒店邦说';
    util.getInternalLessonList((json) => {
      if (json.code === 0) {
        this.lessonList = json.data.lessonList.map((d) => {
          return {
            ...d,
            audioLen: moment(d.audioLen * 1000).format('mm:ss')
          }
        });
      } else {
        console.warn('获取自主课程列表出错！');
      }
    })
  },
  methods: {
    gotoHome: function () {
      location.href = '/#/';
    },
    GotoJdbsItem: function (id) {
      location.href = '/?id=' + id + '#/jdbsitem'
    }
  },
  computed: {
    notListenNum: function () {
      return this.lessonList.filter((d) => d.listenLen === null).length;
    }
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .jdbs-container {
    width: 100%;
    min-height: 100%;
    padding: 0 0 1.26666rem 0;
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
      border-bottom: #ebebeb solid thin;
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
        border-bottom: #ebebeb solid thin;
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
</style>
