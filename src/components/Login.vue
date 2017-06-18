<template>
  <div class="login-container">
    <div class="error-tips" v-if="error">
      {{ error }}
      <img src="/static/cross.png" @click="closeErrorTips">
    </div>
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
        <img src="/static/header.png" @click="changeHeader">
      </div>
      <input class="avater-upload" type="file" @change="uploadAvater"></input>
      <div class="wechat-name">李坚</div>
      <div class="row name">
        <div class="label">姓名</div>
        <input type="text" name="name" placeholder="请输入您的姓名">
      </div>
      <div class="row company">
        <div class="label">公司</div>
        <input type="text" name="company" placeholder="请输入您的公司（选填）">
      </div>
      <div class="row position">
        <div class="label">职位</div>
        <input type="text" name="position" placeholder="请输入您的职位（选填）">
      </div>
      <div class="confirm">确认</div>
      <div class="skip">跳过</div>
    </div>
  </div>
</template>

<script>
import util from '../util/index'
import isMobilePhone from 'validator/lib/isMobilePhone'

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
    }
  },
  created() {},
  mounted() {
    document.title = '登录';
  },
  methods: {
    closeErrorTips: function () {
      this.error = null;
    },
    getVerifyCode: function () {
      if (this.disabled) {
        return false;
      }
      if (!isMobilePhone(this.phone, 'zh-CN')) {
        this.setError('请填写手机号码！');
      }
      this.disabled = true;
      let time = 60;
      this.btnText = time + '秒后获取';
      let inter = setInterval(() => {
        time--;
        this.btnText = time === 0 ? '重新获取' : time + '秒后获取';
        if (time === 0) {
          clearInterval(inter);
          this.disabled = false;
        }
      }, 1000);
      util.sendCaptcha(this.phone, (json) => {
        if (json.code === 0) {
          // TODO
          // util.setCookie('isLogin', '1', '12d');
        } else {
          this.setError('获取失败，请重试');
        }
      })
    },
    verifyPhone: function () {
      if (!isMobilePhone(this.phone, 'zh-CN')) {
        this.setError('请填写手机号码！');
      }
      if (!this.code) {
        this.setError('请填写验证码！');
      }
      util.verifyPhone(this.phone, this.code, (json) => {
        console.log(json);
        if (json.code === 0) {
          util.setCookie('isLogin', '1', '12d');
          location.href = decodeURIComponent(util.getParam('redirect') || '/#/')
        } else {
          this.setError('验证失败，请重试');
        }
      })
    },
    changeHeader: function () {
      document.querySelector('.avater-upload').click();
    },
    uploadAvater: function (ev) {
      console.log(ev)
    },
    setError: function (text) {
      this.error = text;
      setTimeout(() => {
        this.error = null;
      }, 4000);
      return false;
    }
  },
  destroyed() {},
  watch: {},
  components: {}
}
</script>

<style lang="less">
  @import '../variable.less';

  .login-container {
    width: 100%;
    height: 100%;
    .error-tips {
      position: fixed;
      z-index: 99;
      background: @red;
      color: white;
      padding: 0 0.4rem;
      height: 0.8rem;
      width: 100%;
      font-size: 0.4rem;
      line-height: 0.8rem;
      img {
        height: 0.4rem;
        position: absolute;
        top: 0.2rem;
        right: 0.4rem;
      }
    }
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
    .first {
      background: white;
      padding-top: 1rem;
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
          color: #999999;
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
      padding-top: 0.53333rem;
      color: #cccccc;
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
          height: 100%;
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
        input {
          height: 1.173333rem;
          border-radius: 4px;
          border: #cccccc solid thin;
          padding: 0 0.4rem 0 1.73333rem;
          display: block;
          width: 100%;
          margin: auto;
          color: #cccccc;
          -webkit-appearance: none;
        }
      }
      .confirm {
        margin: auto;
        margin-top: 0.53333rem;
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
