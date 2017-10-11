<template>
  <div class="bought-container">
    <div class="nothing" v-if="courses && courses.length === 0">
      <div class="shopping-car"></div>
      <p>你还没有购买课程</p>
      <div class="buy" @click="gotoHome">
        <div class="magnifier"></div>
        发现课程
      </div>
    </div>
    <div v-if="courses && courses.length > 0" class="wrap">
      <div class="list">
        <div class="item" v-for="c in courses" @click="gotoCourse(c.id)">
          <div class="img" :style="{ 'background-image': 'url(\'' + c.bannerImg[0] + '\')' }"></div>
          <div class="main">
            <div class="title">{{ c.title }}</div>
            <div class="tips" :title="c.msg">{{ c.msg || '暂无' }}</div>
            <div class="time"><span v-if="c.updateDate">{{c.updateDate}}更新&nbsp;|&nbsp;</span>已发布 {{c.publishedLessonCount}}/{{c.lessonCount}}</div>
          </div>
        </div>
      </div>
      <div class="more">
        <div class="buy" @click="gotoHome">
          <div class="magnifier"></div>
          发现更多课程
        </div>
      </div>
    </div>
    <Bottomer :tag="2"></Bottomer>
  </div>
</template>

<script>
import util from '../util/index'
import Bottomer from './Bottomer.vue'

const formatDate = function(y, m, d) {
  let year = y == (new Date()).getFullYear() ? '' : y + '-';
  return year + (m.length > 1 ? m : '0' + m) + '-' + (d.length > 1 ? d : '0' + d)
}

export default {
  name: 'bought',
  props: [],
  data () {
    return {
      courses: null
    }
  },
  created() {
    document.title = '已购课程';
  },
  mounted() {
    util.getPaidCourseList((json) => {
      if (json.code === 0) {
        this.courses = json.data.courseList.map((d) => {
          const temp = d.updateDate && d.updateDate.split('-');
          const updateDate = d.updateDate ? formatDate(temp[0], temp[1], temp[2]) : ''
          return {
            ...d,
            updateDate,
            // msg: 'ddd',
          }
        });
      } else {
        console.warn('获取已购课程出错');
      }
    });
    const dict = {
      title: '酒店邦成长营',
      link: location.href,
      imgUrl: 'http://hotelpal.cn/static/jiudianbang-big.png',
      desc: '为你提供高效、有价值的行业知识服务。',
    }
    util.updateWechatShare(dict);
  },
  methods: {
    gotoHome: function () {
      location.href = '/';
    },
    gotoCourse: function (courseId) {
      location.href = '/course?cid=' + courseId;
    },
  },
  destroyed() {},
  watch: {},
  components: {
    Bottomer
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .bought-container {
    width: 100%;
    height: 100%;
    padding-bottom: 1.28rem;
    line-height: 1;
    .nothing {
      width: 100%;
      height: 100%;
      padding-top: 2rem;
      text-align: center;
      background: white;
      .shopping-car {
        display: inline-block;
        width: 3.3333rem;
        height: 3.3333rem;
        background-size: 3.3333rem 3.3333rem;
        background-image: url('/static/empty2.png')
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
    .wrap {
      background: #f5f5f5;
      padding-bottom: 0.53333rem;
      .more {
        text-align: center;
        padding-bottom: 1.6rem;
        .buy {
          border-radius: 4px;
          color: @red;
          font-size: 0.4rem;
          text-align: center;
          width: 3.53333rem;
          margin: auto;
          display: inline-block;
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
        width: 100%;
        padding: 0.4rem 0.4rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          background: white;
          width: 4.4rem;
          border-radius: 4px;
          margin-bottom: 0.4rem;
          overflow: hidden;
          .img {
            width: 100%;
            height: 3.3333rem;
            overflow: hidden;
            background-size: cover;
            background-position: center;
          }            
          .main {
            width: 100%;
            padding: 0.13333rem;
            .title {
              font-size: 0.346666rem;
              color: #333333;
              white-space: nowrap; 
              overflow: hidden; 
              text-overflow: ellipsis;
              font-weight: 600;
              line-height: 1.1;
            }
            .tips {
              margin-top: 0.48rem;
              font-size: 0.32rem;
              color: #666666;
              white-space: nowrap; 
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .time {
              font-size: 0.293333rem;
              margin-top: 0.26666rem;
              color: #cccccc;
            }
          }
        }
      }
    }
    
  }
</style>
