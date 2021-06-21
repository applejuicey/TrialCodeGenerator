<template>

    <a-row type="flex" justify="space-around" align="middle" class="login-form-wrapper">
      <a-col :lg="12" :offset-lg="6">
        <div class="my-table-wrapper">
          <div class="my-card-header-title">
            Hengrui Department of R.&D.
            <br>
            Clinical Trial Protocol Code Registration Platform
          </div>
          <a-form :model="loginForm" :layout="loginForm.layout">
            <a-form-item label="Username">
              <a-input v-model:value="loginForm.username" placeholder="Please input the username" type="text" @pressEnter="login" autofocus>
                <template #prefix>
                  <UserOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="Password">
              <a-input v-model:value="loginForm.password" placeholder="Please input the password" type="password" @pressEnter="login">
                <template #prefix>
                  <KeyOutlined />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item :wrapper-col="loginForm.wrapperColButton" class="button-container">
              <a-button type="primary" @click="login" v-if="!loginForm.waiting">
                <LoginOutlined />Login
              </a-button>
              <a-spin v-else/>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>

</template>

<script>
import {
  UserOutlined,
  KeyOutlined,
  LoginOutlined,
} from '@ant-design/icons-vue';
export default {
  components: {
    UserOutlined,
    KeyOutlined,
    LoginOutlined,
  },
  data() {
    return {
      loginForm: {
        layout: 'vertical',
        username: '',
        password: '',
        wrapperColButton: { span: 24 },
        waiting: false,
      },
    }
  },
  methods: {
    login: async function () {
      this.loginForm.waiting = true;
      try {
        const response = await this.$axios.post('/auth/login', {
          userInfo: {
            username: this.loginForm.username,
            password: this.loginForm.password,
          }
        });
        // 登录成功
        if (['1'].includes(response.data.statusCode)) {
          // 获取所有化合物信息并存入localStorage供后续使用
          let { data } = await this.$axios.post('/compound/query', {});
          let compounds = data.queryResults.hitTargets;
          localStorage.setItem('compounds', JSON.stringify(compounds));
          // 将userInfo存入localStorage供后续使用
          localStorage.setItem('userInfo', JSON.stringify(response.data.loginResult));
          if (['t2'].includes(response.data.loginResult.userType)) {
            this.$router.push({ name: 'code-gen'});
          }
          if (['t0', 't1', 't3'].includes(response.data.loginResult.userType)) {
            this.$router.push({ name: 'trial-list'});
          }
          return true;
        }
        // 登录失败
        if (['0'].includes(response.data.statusCode)) {
          if (response.data.error.message.includes('username')) {
            this.$message.error('Invalid Username!', 6);
          }
          if (response.data.error.message.includes('password')) {
            this.$message.error('Invalid Password!', 6);
          }
          return false;
        }
        this.$message.error('Login Failed!', 6);
      } catch (error) {
        this.$message.error(`Login Failed! Details: ${ error }`, 6);
        console.error(error);
      } finally {
        this.loginForm.waiting = false;
      }
    },
  },
}
</script>

<style scoped>
.login-form-wrapper {
  min-height: 90vh;
  text-align: center;
}
.button-container {
 margin-bottom: 0;
}
</style>