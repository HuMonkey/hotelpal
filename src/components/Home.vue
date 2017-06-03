<template>
  <div class="home-container">
    <swiper :options="swiperOption">
      <swiper-slide v-for="slide in swiperSlides">
        <img :src="slide">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <div class="free">
      <div class="title">
        <div class="name">酒店邦说 | 免费</div>
        <div class="all">查看全部
          <div class="arrow-right"></div>
        </div>
      </div>
      <div class="hr"></div>
      <div class="list">
        <div class="item">
          <div class="name">
            <div class="arrow"></div>
            怎么在工作中快速学习、获得晋升？
          </div>
          <div class="time">昨天</div>
        </div>
        <div class="item">
          <div class="name">
            <div class="arrow"></div>
            怎么在工作中快速学习、获得晋升？
          </div>
          <div class="time">昨天</div>
        </div>
        <div class="item">
          <div class="name">
            <div class="arrow"></div>
            怎么在工作中快速学习、获得晋升？
          </div>
          <div class="time">昨天</div>
        </div>
        <div class="item">
          <div class="name">
            <div class="arrow"></div>
            怎么在工作中快速学习、获得晋升？
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
        <div class="item">
          <div class="avater">
            <div class="state coming">预告</div>
            <img src="/static/logo.png">
          </div>
          <div class="desc">
            <div class="name">酒店经营法则</div>
            <div class="who">胡万祺 · 布丁生活CEO&住友酒店VP</div>
            <div class="content">酒店如果不先打动自己，怎么打动顾客</div>
            <div class="row">
              <div class="tag">创业宝典</div>
              <div class="price">¥ 199 / 10课时</div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="avater">
            <div class="state new">上新</div>
            <img src="/static/logo.png">
          </div>
          <div class="desc">
            <div class="name">酒店经营法则</div>
            <div class="who">胡万祺 · 布丁生活CEO&住友酒店VP</div>
            <div class="content">酒店如果不先打动自己，怎么打动顾客</div>
            <div class="row">
              <div class="tag">创业宝典</div>
              <div class="price">¥ 199 / 10课时</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="item selected">
        <div class="img"></div>
        发现
      </div>
      <div class="item">
        <div class="img"></div>
        已购课程
      </div>
      <div class="item">
        <div class="img"></div>
        我的
      </div>
    </div>
  </div>
</template>

<script>
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
      selectedTab: 0
    }
  },
  created() {},
  mounted() {},
  methods: {},
  destroyed() {},
  watch: {},
  components: {
    swiper,
    swiperSlide
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
          left: 0.13333rem;
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
              border: 0.16rem solid #ffffff;
              border-left-color: #666666;
              width: 0;
              height: 0;
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
            .state {
              width: 0.72rem;
              height: 0.426666rem;
              border-radius: 4px;
              text-align: center;
              line-height: 0.426666rem;
              color: white;
              position: absolute;
              top: 10px;
              left: 0;
              font-size: 0.26666rem;
            }
            .state.new {
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
            .name {
              width: 100%;
              font-size: 0.4rem;
              height: 0.4rem;
              color: #333333;
              font-weight: 600;
            }
            .who {
              margin-top: 0.186666rem;
              font-size: 0.346666rem;
              color: #666666;
            }
            .content {
              margin-top: 0.26rem;
              font-size: 0.293333rem;
            }
            .row {
              margin-top: 0.153333rem;
              display: flex;
              justify-content: space-between;
              .tag {
                padding: 0 0.186666rem;
                border: #cccccc solid thin;
                font-size: 0.32rem;
                height: 0.48rem;
                line-height: 0.453333rem;
                border-radius: 4px;
                color: #aaaaaa;
              }
              .price {
                color: @red;
                font-size: 0.32rem;
              }
            }
          }
        }
      }
    }
    .footer {
      width: 100%;
      height: 1.6rem;
      position: fixed;
      bottom: 0;
      left: 0;
      display: flex;
      font-size: 0.32rem;
      justify-content: space-between;
      border-top: #cccccc solid thin;
      background: white;
      padding: 0.16rem 1.253333rem;
      .item {
        height: 1.28rem;
        text-align: center;
        .img {
          width: 0.783333rem;
          height: 0.783333rem;
          margin: auto;
          margin-bottom: 0.1rem;
          background-size: 0.783333rem 0.783333rem;
          background-position: center;
        }
      }
      .item:first-child {
        .img {
          background-image: url('/static/footer-1.svg');
        }
      }
      .item.selected:first-child {
        .img {
          background-image: url('/static/footer-1-selected.svg');
        }
      }
      .item:nth-child(2) {
        .img {
          background-image: url('/static/footer-2.svg');
        }
      }
      .item.selected:nth-child(2) {
        .img {
          background-image: url('/static/footer-2-selected.svg');
        }
      }
      .item:nth-child(3) {
        .img {
          background-image: url('/static/footer-3.svg');
        }
      }
      .item.selected:nth-child(3) {
        .img {
          background-image: url('/static/footer-3-selected.svg');
        }
      }
      .item.selected {
        color: @red;
      }
    }
  }
</style>
