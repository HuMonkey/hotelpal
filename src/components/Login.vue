<template>
  <div class="login-container">
    <div class="wrapper" v-if="render">
      <Error :error="error" v-if="error"></Error>
      <div class="step first" v-if="step === 1">
        <div class="logo">
          <img src="/static/jiudianbang.png">
        </div>
        <div class="phone">
          <input type="number" name="phone" placeholder="请输入11位手机号" v-model="phone">
        </div>
        <div class="verify">
          <input type="number" name="verify" placeholder="请输入验证码" v-model="code">
          <div class="btn" :class="{disabled: disabled}" @click="getVerifyCode">{{ btnText }}</div>
        </div>
        <div class="login" @click="verifyPhone">登录</div>
        <div class="tips">点击 [登录] 代表您已阅读并同意《酒店邦成长营会员条款》</div>
      </div>
      <div class="step second" v-if="step === 2">
        <div class="welcome">欢迎加入酒店营成长邦！</div>
        <div class="avater">
          <img :src="userinfo.headImg" @click="changeHeader">
        </div>
        <input class="avater-upload" type="file" @change="uploadAvater"></input>
        <div class="wechat-name">{{ userinfo.nickname }}</div>
        <div class="row name">
          <div class="label">姓名</div>
          <div class="vr"></div>
          <input type="text" name="name" placeholder="请输入您的姓名" v-model="userinfo.nickname">
        </div>
        <div class="row company">
          <div class="label">公司</div>
          <div class="vr"></div>
          <input type="text" name="company" placeholder="请输入您的公司（选填）" v-model="userinfo.company">
        </div>
        <div class="row position">
          <div class="label">职位</div>
          <div class="vr"></div>
          <input type="text" name="position" placeholder="请输入您的职位（选填）" v-model="userinfo.title">
        </div>
        <div class="confirm" @click="submitChange">确认</div>
        <div class="skip" @click="skip">跳过</div>
      </div>
    </div>
    
  </div>
</template>

<script>
import util from '../util/index'
import isMobilePhone from 'validator/lib/isMobilePhone'

import Error from './Error.vue'

export default {
  name: 'login',
  props: [],
  data () {
    return {
      step: 1,
      error: null,
      btnText: '获取验证码',
      disabled: false,

      phone: '',
      code: '',

      userinfo: {},

      errorTimeout: null,

      render: false,
    }
  },
  created() {
    document.title = '登录';
  },
  mounted() {
    const force = util.getParam('force')
    if (force == 1) {
      this.render = true;
      return false;
    }
    util.getUserInfo((json) => {
      if (json.code === 0) {
        // 绑定过手机，就不用绑定了
        this.userinfo = json.data;
        if (json.data.phone) {
          // location.href = decodeURIComponent(util.getParam('redirect') || '/#/')
        } else {
          this.render = true;
        }
      } else {
        console.warn('获取用户信息失败')
      }
    })
  },
  methods: {
    setError: function (error) {
      this.error = error;
      this.errorTimeout && clearTimeout(this.errorTimeout)
      this.errorTimeout = setTimeout(() => {
        this.error = null;
      }, 4000);
    },
    getVerifyCode: function () {
      if (this.disabled) {
        return false;
      }
      if (!isMobilePhone(this.phone, 'zh-CN')) {
        this.setError('请输入正确的手机号码！');
        return false;
      }
      this.disabled = true;
      let time = 60;
      this.btnText = time + '秒';
      let inter = setInterval(() => {
        time--;
        this.btnText = time === 0 ? '重新获取' : time + '秒';
        if (time === 0) {
          clearInterval(inter);
          this.disabled = false;
        }
      }, 1000);
      util.sendCaptcha(this.phone, (json) => {
        if (json.code === 0) {
          // TODO
        } else {
          console.warn('获取失败，请重试');
        }
      })
    },
    verifyPhone: function () {
      if (!isMobilePhone(this.phone, 'zh-CN')) {
        this.setError('请填写正确的手机号码！');
        return false;
      }
      if (!this.code) {
        this.setError('请填写验证码！');
        return false;
      }
      util.verifyPhone(this.phone, this.code, (json) => {
        if (json.code === 0) {
          // util.setCookie('isLogin', '1', '12d');
          // 新用户
          if (json.data.newPhone) {
            // 邀请注册
            if (util.getParam('invited') == 1) {
              util.newInvitedUser((json1) => {
                if (json.code === 0) {
                  console.log(json1)
                } else {
                  console.warn('获取用户信息失败')
                }
              })
            }
            this.step = 2;
          } else {
            location.href = decodeURIComponent(util.getParam('redirect') || '/#/')
          }
        } else {
          this.setError('验证码错误!');
        }
      })
    },
    skip: function () {
      location.href = decodeURIComponent(util.getParam('redirect') || '/#/')
    },
    changeHeader: function () {
      document.querySelector('.avater-upload').click();
    },
    uploadAvater: function (ev) {
      const input = ev.target;
      var data = new FormData()
      data.append('file', input.files[0])
      fetch('/hotelpal/image/uploadImg', {
        method: 'POST',
        body: data
      }).then(function(response) {
        return response.json()
      }).then((json) => {
        if (json.code === 0) {
          this.userinfo.headImg = json.data.imgurl;
        } else {
          console.warn('上传图片失败');
        }
      }).catch(function(ex) {
        console.log('parsing failed', ex)
      })
    },
    submitChange: function () {
      const { headImg, nickname, company, title } = this.userinfo;
      if (nickname.length === 0) {
        this.setError('请输入你的昵称');
        return false;
      }
      util.saveUserProp(headImg, nickname, company, title, (json) => {
        if (json.code === 0) {
          location.href = decodeURIComponent(util.getParam('redirect') || '/#/');
        } else {
          console.warn('修改用户信息不成功！');
        }
      })
    },
  },
  destroyed() {},
  watch: {},
  components: {
    Error
  }
}
</script>

<style lang="less">
  @import '../variable.less';

  .login-container {
    width: 100%;
    height: 100%;
    .step {
      width: 100%;
      height: 100%;
    }
    ::-webkit-input-placeholder { /* WebKit browsers */ 
      color: #cccccc; 
    } 
    :-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
      color: #cccccc; 
    } 
    ::-moz-placeholder { /* Mozilla Firefox 19+ */ 
      color: #cccccc; 
    } 
    :-ms-input-placeholder { /* Internet Explorer 10+ */ 
      color: #cccccc; 
    }
    .wrapper {
      width: 100%;
      height: 100%;
    }
    .first {
      background: white;
      padding-top: 0.8rem;
      width: 100%;
      height: 100%;
      .logo {
        text-align: center;
        img {
          height: 1.44rem;
        }
      }
      .phone, .verify {
        position: relative;
        margin-top: 1.06666rem;
        width: 100%;
        font-size: 0.4rem;
        input {
          height: 1.173333rem;
          border-radius: 4px;
          border: #cccccc solid thin;
          padding: 0 0.4rem;
          display: block;
          width: 7.86666rem;
          margin: auto;
          color: #333333;
          -webkit-appearance: none;
        }
        .btn {
          color: @red;
          position: absolute;
          right: 1.46666rem;
          top: 0;
          height: 1.173333rem;
          line-height: 1.173333rem;
        }
        .btn.disabled {
          color: #cccccc;
        }
      }
      .verify {
        margin-top: 0.53333rem;
      }
      .login {
        font-size: 0.426666rem;
        width: 7.86666rem;
        margin: auto;
        background: @red;
        color: white;
        text-align: center;
        line-height: 1.173333rem;
        height: 1.173333rem;
        border-radius: 4px;
        margin-top: 0.8rem;
      }
      .tips {
        font-size: 0.30rem;
        width: 100%;
        text-align: center;
        color: #999999;
        margin-top: 0.4rem;
      }
    }
    .second {
      background: white;
      padding-top: 0.66666rem;
      color: #666666;
      .avater-upload {
        display: none;
      }
      .welcome {
        height: 0.48rem;
        font-size: 0.48rem;
        width: 100%;
        color: #666666;
        text-align: center;
      }
      .avater {
        height: 1.92rem;
        width: 100%;
        text-align: center;
        margin-top: 0.6666rem;
        img {
          width: 1.92rem;
          height: 1.92rem;
          border-radius: 1.92rem;
        }
      }
      .wechat-name {
        height: 0.4rem;
        width: 100%;
        text-align: center;
        font-size: 0.4rem;
        color: #333333;
        margin-top: 0.26666rem;
        margin-bottom: 0.48rem;
      }
      .row {
        width: 7.86666rem;
        height: 1.173333rem;
        margin: auto;
        margin-bottom: 0.26666rem;
        font-size: 0.4rem;
        position: relative;
        .label {
          height: 100%;
          line-height: 1.2rem;
          position: absolute;
          z-index: 1;
          top: 0;
          left: 0.4rem;
          color: #666666;
        }
        .vr {
          height: 0.6666rem;
          border-left: @border;
          position: absolute;
          top: 0.26666rem;
          left: 1.46666rem;
          color: #666666;
        }
        input {
          height: 1.173333rem;
          border-radius: 4px;
          border: #cccccc solid thin;
          padding: 0 0.4rem 0 1.73333rem;
          display: block;
          width: 100%;
          margin: auto;
          color: #333333;
          -webkit-appearance: none;
        }
      }
      .confirm {
        margin: auto;
        margin-top: 0.8rem;
        font-size: 0.426666rem;
        width: 7.86666rem;
        background: @red;
        color: white;
        text-align: center;
        line-height: 1.173333rem;
        height: 1.173333rem;
        border-radius: 4px;
      }
      .skip {
        margin: auto;
        margin-top: 0.26666rem;
        font-size: 0.426666rem;
        width: 7.86666rem;
        color: #999999;
        text-align: center;
        line-height: 1.173333rem;
        height: 1.173333rem;
        border-radius: 4px;
      }
    }
  }
</style>
