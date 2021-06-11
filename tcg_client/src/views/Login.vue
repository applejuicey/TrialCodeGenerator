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
              <a-input v-model:value="loginForm.username" placeholder="Please input the username" type="text" @pressEnter="login" autofocus/>
            </a-form-item>
            <a-form-item label="Password">
              <a-input v-model:value="loginForm.password" placeholder="Please input the password" type="password" @pressEnter="login"/>
            </a-form-item>
            <a-form-item :wrapper-col="loginForm.wrapperColButton" class="button-container">
              <a-button type="primary" @click="login" v-if="!loginForm.waiting">
                Login
              </a-button>
              <a-spin v-else/>
            </a-form-item>
          </a-form>
        </div>
      </a-col>
    </a-row>

</template>

<script>
export default {
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
        let response = await this.$axios.post('/login', {
          userInfo: {
            username: this.loginForm.username,
            password: this.loginForm.password,
          }
        });
        // 登录成功后获取所有compound列表、并存入localStorage
        let { data } = await this.$axios.post('/compound', {});
        let compounds = data.queryResults.hitTargets;
        localStorage.setItem('compounds', JSON.stringify(compounds));
        // 处理路由
        if (['1'].includes(response.data.statusCode) && (['t2'].includes(response.data.loginResult.userType))) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.loginResult));
          this.$router.push({ name: 'code-gen'});
          return true;
        }
        if (['1'].includes(response.data.statusCode) && (['t0', 't1', 't3'].includes(response.data.loginResult.userType))) {
          localStorage.setItem('userInfo', JSON.stringify(response.data.loginResult));
          this.$router.push({ name: 'trial-list'});
          return true;
        }
        if (['0'].includes(response.data.statusCode) && response.data.error.message.includes('username')) {
          this.$message.error('Invalid Username!', 6);
          return false;
        }
        if (['0'].includes(response.data.statusCode) && response.data.error.message.includes('password')) {
          this.$message.error('Invalid Password!', 6);
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