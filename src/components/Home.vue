<template>
  <div class="home-container">
    <swiper :options="swiperOption">
      <swiper-slide v-for="slide in swiperSlides">
        <img :src="slide">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <!-- <div class="free" v-if="jdbsList.length > 0"> -->
    <div class="free">
      <div class="title">
        <div class="name">酒店邦说 | 免费</div>
        <div class="all" @click="gotoJdbs">查看全部
          <div class="arrow-right"></div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <div class="name">
            <div class="arrow"></div>
            <span>怎么在工作中快速学习、获得晋升？</span>
          </div>
          <div class="time">昨天</div>
        </div>
      </div>
    </div>
    <div class="pay">
      <div class="title">
        <div class="name">专家课堂 | 付费</div>
        <!-- <div class="all">查看全部</div> -->
      </div>
      <div class="list">
        <div class="item" @click="gotoCourse(c.id)" v-for="c in courseList">
          <div class="avater">
            <div class="state" :class="{ coming: c.isPublish === 0, isnew: c.isPublish === 1 }">{{ c.isPublish ? '上新' : '预告' }}</div>
            <img :src="c.headImg">
          </div>
          <div class="desc">
            <div class="name">{{ c.title }}</div>
            <div class="who">{{ c.userName }} · {{ c.userTitle }}</div>
            <div class="content">{{ c.subtitle || '暂无介绍' }}</div>
            <div class="row">
              <div class="tags">
                <div class="tag" :title="tag" v-for="tag in c.tag">{{ tag.name }}</div>
              </div>
              <div class="price">¥ {{ c.charge / 100 }} / {{ c.lessonCount }}课时</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Bottomer :tag="1"></Bottomer>
  </div>
</template>

<script>
import util from '../util/index'
import Bottomer from './Bottomer.vue'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'home',
  props: [],
  data () {
    return {
      swiperOption: {
        autoplay: 8000,
        setWrapperSize: true,
        pagination: '.swiper-pagination',
        paginationClickable:true,
        mousewheelControl: true,
        observeParents: true,
      },
      swiperSlides: [
        '/static/banner_1.jpg',
        '/static/banner_2.jpg',
        '/static/banner_3.jpg',
      ],
      selectedTab: 0,
      courseList: [],
      jdbsList: [],
    }
  },
  created() {},
  mounted() {
    util.getCourseList((json) => {
      if (json.code === 0) {
        this.courseList = json.data.courseList.map((c) => {
          return {
            ...c,
            tag: c.tag ? c.tag.slice(0, 2) : []
          }
        });
      } else {
        console.warn('get course list fail');
      }
    })
    util.getUserInfo(function (json) {
      console.log(json)
    })
  },
  methods: {
    gotoCourse: function (courseId) {
      location.href = '/?cid=' + courseId + '#/course';
    },
    gotoJdbs: function () {
      location.href = '/#/jdbs';
    }
  },
  destroyed() {},
  watch: {},
  components: {
    swiper,
    swiperSlide,
    Bottomer
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  @paddingLR: 0.4rem;

  .home-container {
    width: 100%;  
    color: #666666;  
    padding-bottom: 1.6rem;
    .swiper-container {
      width: 100%;
      height: 3.3333rem;
      .swiper-slide {
        img {
          width: 100%;
          height: 3.3333rem;
        }
      }
      .swiper-pagination {
        width: 100%;
        text-align: right;
        padding: 0 0.4rem 0.26666rem 0.4rem;
        bottom: 0;
        line-height: 0;
        .swiper-pagination-bullet {
          width: 0.26666rem;
          height: 0.053333rem;
          background: #ffffff;
          margin: 0 0.13333rem;
          opacity: 0.6;
          border-radius: 4px;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: @red;
        }
      }
    }
    .free, .pay {
      width: 100%;
      position: relative;
      margin-top: 0.26666rem;
      background: white;
      .title {
        width: 100%;
        height: 0.986666rem;
        line-height: 0.986666rem;
        font-size: 0.346666rem;
        display: flex;
        justify-content: space-between;
        padding: 0 @paddingLR;
        .name {
          color: #999999;
        }
        .arrow-right {
          position: relative;
          top: 0.04rem;
          margin-left: 0.13333rem;
          width: 0.16rem;
          height: 0.346666rem;
          display: inline-block;
          background-size: 0.16rem 0.346666rem;
          background-position: center;
          background-image: url("/static/arrow-right.svg");
        }
      }
      .hr {
        margin: 0 @paddingLR 0 @paddingLR;
        background: #ebebeb;
        height: 1px;
      }
    }
    .free {
      .list {
        width: 100%;
        padding: 0.28rem @paddingLR;
        .item {
          width: 100%;
          height: 0.853333rem;
          line-height: 0.853333rem;
          font-size: 0.4rem;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          .name {
            .arrow {
              display: inline-block;
              border: 0.12rem solid #ffffff;
              border-left-color: #666666;
              width: 0;
              height: 0;
            }
            span {
              margin-left: -0.1rem;
            }
          }
          .time {
            font-size: 0.293333rem;
          }
        }
        .item:active {
          color: @red;
          .name {
            .arrow {
              border-left-color: @red;
            }
          }
        }
      }
    }
    .pay {
      .list {
        width: 100%;
        padding: 0 @paddingLR;
        .item {
          padding: 0.26666rem 0 0.26666rem 0;
          border-top: solid thin #ebebeb;
          display: flex;
          justify-content: space-between;
          .avater {
            width: 2rem;
            height: 2.6666rem;
            position: relative;
            border-radius: 0.13333rem;
            overflow: hidden;
            .state {
              width: 0.82rem;
              height: 0.426666rem;
              border-radius: 4px;
              padding-left: 0.1rem;
              text-align: center;
              line-height: 0.426666rem;
              color: white;
              position: absolute;
              top: 10px;
              left: -0.1rem;
              font-size: 0.26666rem;
            }
            .state.isnew {
              background: #f04a4c;
            }
            .state.coming {
              background: #f0944a;
            }
            img {
              width: 100%;
              height: 100%;
            }
          }
          .desc {
            width: 6.8rem;
            height: 2.6666rem;
            padding: 0.13333rem 0;
            line-height: 1;
            .name {
              width: 100%;
              font-size: 0.4rem;
              height: 0.4rem;
              color: #333333;
            }
            .who {
              margin-top: 0.186666rem;
              font-size: 0.346666rem;
              color: #666666;
            }
            .content {
              margin-top: 0.48rem;
              font-size: 0.293333rem;
            }
            .row {
              margin-top: 0.153333rem;
              display: flex;
              justify-content: space-between;
              .tags {
                flex: 2;
                display: relative;
                .tag {
                  padding: 0 0.186666rem;
                  border: #cccccc solid thin;
                  font-size: 0.32rem;
                  height: 0.48rem;
                  line-height: 0.453333rem;
                  border-radius: 4px;
                  color: #aaaaaa;
                  float: left;
                  white-space: nowrap; 
                  max-width: 2rem;
                  margin-right: 0.26666rem;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              .price {
                flex: 1;
                color: @red;
                font-size: 0.32rem;
                text-align: right;
                line-height: 0.48rem;
              }
            }
          }
        }
      }
    }
  }
</style>
