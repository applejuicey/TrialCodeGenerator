<template>
  <a-config-provider :locale="locale">

    <a-layout id="app-container" :style="backgroundImageStyle">
      <a-layout-header class="header" v-if="!onLoginPage">
        <a class="logo" href="https://www.hrs.com.cn/index.html"/>
        <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="menuSelectedKeys" class="menu">
          <a-menu-item key="1" @click="pushRoute('trial-list')">
            <OrderedListOutlined />Trials
          </a-menu-item>
          <a-menu-item key="2" @click="pushRoute('code-gen')" v-if="!['t3'].includes(userInfo.userType)">
            <PlusCircleOutlined />CREATE!
          </a-menu-item>
          <a-menu-item key="3" @click="pushRoute('trial-summary')">
            <TableOutlined/>Summary
          </a-menu-item>
          <a-menu-item key="4" @click="pushRoute('about')">
            <InfoCircleOutlined/>About
          </a-menu-item>
          <a-menu-item key="5" @click="aboutMe">
            <UserOutlined />Me
            <a-modal centered :title="modelSpec.title" v-model:visible="modelSpec.visible" :confirm-loading="modelSpec.confirmLoading" @ok="handleOk">
              <a-form layout="vertical" :model="userInfoEditForm">
                <a-form-item label="Username" >
                  <a-input v-model:value="userInfoEditForm.username" type="text" placeholder="Please fill in your username" :disabled="true"/>
                </a-form-item>
                <a-form-item label="Old Password" >
                  <a-input v-model:value="userInfoEditForm.oldPassword" type="text" placeholder="Please fill in your old password"/>
                </a-form-item>
                <a-form-item label="New Password" >
                  <a-input v-model:value="userInfoEditForm.newPassword" type="text" placeholder="Please fill in your new password"/>
                </a-form-item>
              </a-form>
            </a-modal>
          </a-menu-item>
          <a-menu-item key="6" @click="logout">
            <LogoutOutlined/>Logout
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="router-viewer">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer" v-if="!onLoginPage">
        HENGRUI PHARMA. ©2020 -- Clinical Trial Protocol Code Registration Platform Version 5.1.0
      </a-layout-footer>
    </a-layout>

  </a-config-provider>
</template>

<script>
import allBackgroundImages from './utils/bg.js';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enGB from 'ant-design-vue/es/locale/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
import {
  OrderedListOutlined,
  PlusCircleOutlined,
  TableOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
moment.locale('en-gb');
export default {
  components: {
    OrderedListOutlined,
    PlusCircleOutlined,
    TableOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
    UserOutlined,
  },
  data () {
    return {
      locale: enGB,
      allBackgroundImages: allBackgroundImages,
      modelSpec: {
        title: 'Edit personal info',
        visible: false,
        confirmLoading: false,
      },
      userInfoEditForm: {
        username: '',
        oldPassword: '',
        newPassword: '',
      },
      menuSelectedKeys: [],
      routerNameToMenuKeys: {
        'trial-list': ['1'],
        'code-gen': ['2'],
        'trial-summary': ['3'],
        'about': ['4'],
      },
    };
  },
  mounted() {
    this.menuSelectedKeys = this.routerNameToMenuKeys[this.$route.name];
  },
  watch: {
    '$route.name': function (newVal, oldVal) {
      this.menuSelectedKeys = this.routerNameToMenuKeys[newVal];
    }
  },
  computed: {
    onLoginPage: function () {
      return ['login', undefined].includes(this.$route.name);
    },
    backgroundImageStyle: function () {
      const randIndex = Math.floor(Math.random() * this.allBackgroundImages.length)
      return {
        backgroundImage: `url(${ this.allBackgroundImages[randIndex] })`
      }
    },
    userInfo: function () {
      return JSON.parse(localStorage.getItem('userInfo'));
    },
  },
  methods: {
    pushRoute: function (routeName) {
      this.$router.push({
        name: routeName,
      })
    },
    logout: function () {
      const self = this;
      Modal.confirm({
        title: 'Logout Confirmation',
        icon: createVNode(LogoutOutlined),
        content: 'Are you sure to logout? Please click \'OK\' to confirm your action.',
        onOk() {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('compounds');
          self.$router.push({
            name: 'login',
          });
          location.reload();
        },
      });
    },
    aboutMe: function () {
      this.userInfoEditForm.username = this.userInfo.username;
      this.modelSpec.visible = true;
    },
    handleOk: async function () {
      this.modelSpec.confirmLoading = true;
      try {
        const response = await this.$axios.patch('/user/update', {
          userInfo: {
            username: this.userInfoEditForm.username,
            oldPassword: this.userInfoEditForm.oldPassword,
            newPassword: this.userInfoEditForm.newPassword,
          },
        });
        // 更新用户资料成功
        if (['1'].includes(response.data.statusCode)) {
          this.$notification['success']({
            message: 'Action Succeed',
            description: 'User information has been updated successfully. The page will be refreshed in 5 seconds.',
          });
          setTimeout(() => {
            location.reload();
          }, 5000);
        }
        // 更新用户资料失败
        if (['0'].includes(response.data.statusCode)) {
          this.$notification['error']({
            message: 'Action Failed',
            description: `Sorry, your request failed. Detailed error description is listed as follows:${ response.data.error.message }`,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.modelSpec.visible = false;
        this.modelSpec.confirmLoading = false;
      }
    },
  },
};
</script>

<style>
@font-face {
  font-family: 'Lora';
  src: url('../public/fonts/Lora-Regular.ttf');
}
@font-face {
  font-family: 'Noto Serif SC';
  src: url('../public/fonts/NotoSerifSC-Light.otf');
}
#app {
  overflow-x: hidden;
  font-family: 'Lora', 'Noto Serif SC', serif;
}
#app-container {
  min-height: 100vh;
  background-size:cover;
  background-repeat: no-repeat;
  width: 100vw;
}
#app-container .logo {
  width: 120px;
  height: 50px;
  background: url('~@/../public/logo2.png') no-repeat;
  background-size: 100% 100%;
  margin: 7px 28px 7px 0;
  float: left;
}
#app-container .menu {
  line-height: 64px;
}
@media screen and (min-width: 768px) {
  #app-container .content {
    padding: 25px 50px;
  }
}
@media screen and (max-width: 768px) {
  #app-container .content {
    padding: 25px 15px;
  }
}
#app-container .footer {
  text-align: center;
  background: #f0f2f51f;
}
.ant-alert {
  border-radius: 25px !important;
  background-color: #e6f7ffde !important;
  border: none !important;
}
.ant-blue {
  color: #108ee9;
}
.ant-green {
  color: #87d068;
}
.ant-red {
  color: #f50;
}
.my-table-wrapper {
  border-radius: 25px;
  background-color: #ffffffde;
  padding: 30px;
  margin-bottom: 20px;
}
.ant-btn {
  border-radius: 5px !important;
}
.my-card-header-title {
  text-transform: uppercase;
  text-align: center;
  font-weight: lighter;
  font-size: large;
  padding: 30px 0 30px 0;
}
.my-table-wrapper-header {
  font-weight: lighter;
  font-size: xx-large;
  margin: 4px 4px 20px 4px;
  padding: 4px;
  text-align: center;
}
</style>