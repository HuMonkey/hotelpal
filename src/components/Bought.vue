<template>
  <div class="bought-container">
    <div class="nothing" v-if="courses.length === 0">
      <div class="shopping-car"></div>
      <p>你还没有购买课程</p>
      <div class="buy">
        <div class="magnifier"></div>
        发现课程
      </div>
    </div>
    <div class="list" v-if="courses.length > 0">
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
      <div class="item">
        <div class="img"><img src="/static/banner_1.jpg"></div>
        <div class="main">
          <div class="title">标题标题标题标题标题标题标题标题</div>
          <div class="tips">已听完</div>
          <div class="time">05-20更新 | 已发布 11/12</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'bought',
  props: [],
  data () {
    return {
      courses: [1]
    }
  },
  created() {},
  mounted() {
    document.title = '已购课程'
  },
  methods: {
    
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .bought-container {
    width: 100%;
    height: 100%;
    .nothing {
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      text-align: center;
      background: white;
      .shopping-car {
        display: inline-block;
        width: 3.3333rem;
        height: 2.6666rem;
        background-size: 3.3333rem 2.6666rem;
        background-image: url('/static/jiudianbang.png')
      }
      p {
        margin-top: 0.8rem;
        font-size: 0.46rem;
        color: #cccccc;
      }
      .buy {
        border: @red solid thin;
        border-radius: 4px;
        color: @red;
        font-size: 0.4rem;
        text-align: center;
        width: 3.53333rem;
        height: 1.146666rem;
        margin-top: 0.53333rem;
        line-height: 1.14rem;
        display: inline-block;
        text-align: center;
        .magnifier {
          display: inline-block;
          width: 0.5rem;
          height: 0.5rem;
          position: relative;
          top: 0.12rem;
          background-size: 0.5rem 0.5rem;
          background-image: url('/static/magnifier.svg');
          margin-right: 0.2rem;
        }
      }
    }
    .list {
      background: #f5f5f5;
      width: 100%;
      padding: 0.53333rem 0.4rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .item {
        background: white;
        width: 4.4rem;
        height: 5.46666rem;
        border-radius: 4px;
        margin-bottom: 0.53333rem;
        overflow: hidden;
        .img {
          width: 100%;
          height: 3.3333rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .main {
          width: 100%;
          padding: 0.26666rem;
          .title {
            font-size: 0.346666rem;
            color: #333333;
            white-space: nowrap; 
            overflow: hidden; 
            text-overflow: ellipsis;
          }
          .tips {
            margin-top: 0.2rem;
            font-size: 0.32rem;
            color: #666666;
          }
          .time {
            font-size: 0.293333rem;
            margin-top: 0.1rem;
            color: #cccccc;
          }
        }
      }
    }
  }
</style>
