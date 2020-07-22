<template>
  <div class="user-avator-dropdown">
    <el-dropdown @command="handleClick">
      <el-badge :is-dot="!!messageUnreadCount">
        <el-avatar :size="28" :src="userAvator"/>
      </el-badge>
      <i class="el-icon-caret-bottom" :size="18"></i>
      <el-dropdown-menu slot="dropdown" >
        <!-- <el-dropdown-item command="message" >
          消息中心<el-badge style="margin-left: 10px" :value="messageUnreadCount"></el-badge>
        </el-dropdown-item> -->
        <el-dropdown-item command="logout" >退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvator: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
