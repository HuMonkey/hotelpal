<template>
  <div class="coursedetail-container">
    <div v-if="course">
      <div class="teacher">
        <div class="avatar">
          <img :src="course.headImg">
        </div>
        <div class="desc">
          <div class="label">主讲人</div>
          <div class="user">
            <span class="userName">{{ course.userName }}</span>
            <span class="userTitle">{{ course.userTitle }}</span>
          </div>
        </div>
      </div>
      <div class="intro" v-if="course.speakerDescribe" v-html="course.speakerDescribe || '暂无介绍'"></div>
      <div class="hr"></div>
      <div class="block course-intro">
        <div class="label">课程介绍</div>
        <div class="intro" v-html="course.introduce || '暂无'"></div>
        <div class="hr"></div>
      </div>
      <div class="block who">
        <div class="label">适宜人群</div>
        <div class="intro">
          <div v-html="course.crowd || '暂无'"></div>
          <!-- 以及那些对酒店创意感兴趣的你 -->
        </div>
        <div class="hr"></div>
      </div>
      <div class="block getting">
        <div class="label">你将收获</div>
        <div class="intro" v-html="course.gain || '暂无'"></div>
        <div class="hr"></div>
      </div>
      <div class="block care">
        <div class="label">订阅须知</div>
        <div class="intro" v-html="course.subscribe || '暂无'"></div>
        <div class="hr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'

export default {
  name: 'coursedetail',
  data () {
    return {
      course: null
    }
  },
  created() {},
  mounted() {
    const courseId = util.getParam('cid');
    util.getCourse(courseId, (json) => {
      if (json.code === 0) {
        const course = json.data;
        document.title = course.title;
        this.course = course;
      } else {
        console.warn('获取课程信息失败！')
      }
    })
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

  .coursedetail-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: white;
    line-height: 1;
    padding: 0 0.4rem;
    .teacher {
      padding: 0.8rem 0 0.53333rem 0;
      display: flex;
      .avatar {
        float: left;
        width: 1.3333rem;
        height: 1.3333rem;
        border-radius: 1.3333rem;
        overflow: hidden;
        display: flex;
        justify-content: center;
        img {
          height: 100%;
        }
      }
      .desc {
        float: left;
        height: 1.3333rem;
        margin-left: 0.26666rem;
        line-height: 1.5;
        .label {
          font-size: 0.453333rem;
          color: #666666;
        }
        .user {
          display: flex;
          align-items: center;
          .userName {
            color: #333333;
            font-size: 0.4rem;
            margin-right: 0.26666rem;
          }
          .userTitle {
            color: #999999;
            font-size: 0.32rem;
          }
        }
      }
    }
    .intro {
      clear: both;
      width: 100%;
      font-size: 0.4rem;
      line-height: 1.8;
      color: #666666;
      margin-top: 0.26666rem;
      p {}
      p:last-child {
        margin-bottom: 0;
      }
      img {
        margin: 0.26666rem 0;
      }
    }
    .hr {
      border-top: @border;
      margin-top: 0.4rem;
    }
    .block {
      padding: 0.53333rem 0 0 0;
      .label {
        width: 100%;
        font-size: 0.48rem;
        margin: 0 0 0.53333rem 0;
      }
      .name {
        width: 100%;
        font-size: 0.32rem;
        height: 0.426666rem;
        border-left: @red 4px solid;
        color: #999999;
        display: flex;
        align-items: center;
        .userName {
          margin: 0 0.26666rem;
          color: black;
          font-size: 0.426666rem;
        }
        .userTitle {
          vertical-align: bottom;
          display: flex;
          align-items: flex-end;
          height: 0.426666rem;
        }
      }
      .intro {
        width: 100%;
        font-size: 0.4rem;
        line-height: 1.8;
        color: #666666;
        margin-top: 0.26666rem;
        p {}
        p:last-child {
          margin-bottom: 0;
        }
        img {
          margin: 0.26666rem 0;
        }
      }
      .open {
        margin-top: 0.4rem;
        font-size: 0.4rem;
        text-align: center;
        color: @red;
      }
      .hr {
        border-top: @border;
        margin-top: 0.4rem;
      }
    }
  }
</style>
