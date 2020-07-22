<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <el-card icon="log-in" title="欢迎登录" :bordered="false">
        <div slot="header" class="clearfix">
          <span>歡迎登入</span>
        </div>
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      let _this = this;
      this.handleLogin({ userName, password }).then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
      })
      // let obj = {
      //   url: "/api/auth",
      //   data:{
      //     username: userName,
      //     password: password
      //   }
      // };

      // _this.$store.dispatch('auth/login',obj).then(()=>{
      //   console.log('登录成功')
      //   console.log(_this.userInfo)
      //   let loginInfo = {
      //     uid:_this.userInfo.info.im_name,
      //     sdktoken:_this.userInfo.info.im_token
      //   }
      //   _this.$router.push({name : 'home'})

      // })
      // .catch(e=>{
      //   console.log('登录失败')
      // })
    }
  }
}
</script>

<style>

</style>
