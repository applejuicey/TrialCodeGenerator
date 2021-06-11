<template>
  <a-config-provider :locale="locale">

    <a-layout id="app-container" :style="backgroundImageStyle">
      <a-layout-header class="header" v-if="!onLoginPage">
        <a class="logo" href="https://www.hrs.com.cn/index.html"/>
        <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="menuSelectedKeys" class="menu">
          <a-menu-item key="1" @click="pushRoute('trial-list')">
            <ToolOutlined/>Control Panel
          </a-menu-item>
          <a-menu-item key="2" @click="pushRoute('code-gen')" v-if="!['t3'].includes(userInfo.userType)">
            <SettingOutlined/>Protocol Code Generator
          </a-menu-item>
          <a-menu-item key="3" @click="pushRoute('trial-summary')">
            <TableOutlined/>Summary Table
          </a-menu-item>
          <a-menu-item key="4" @click="pushRoute('about')">
            <InfoCircleOutlined/>About
          </a-menu-item>
          <a-menu-item key="5" @click="logout">
            <LogoutOutlined/>Logout ({{ userInfo.username }})
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="router-viewer">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer" v-if="!onLoginPage">
        HENGRUI PHARMA. ©2020 -- Clinical Trial Protocol Code Registration Platform Version 5.0.0
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
  ToolOutlined,
  SettingOutlined,
  TableOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
moment.locale('en-gb');
export default {
  components: {
    ToolOutlined,
    SettingOutlined,
    TableOutlined,
    InfoCircleOutlined,
    LogoutOutlined,
  },
  data () {
    return {
      locale: enGB,
      allBackgroundImages: allBackgroundImages,

    };
  },
  computed: {
    menuSelectedKeys: function () {
      const menuKeysRouterNameMap = new Map();
      menuKeysRouterNameMap.set( 'trial-list', ['1'])
          .set('code-gen', ['2'])
          .set('trial-summary', ['3'])
          .set('about', ['4']);
      return menuKeysRouterNameMap.get(this.$route.name);
    },
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
    }
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
  },
};
</script>

<style>
#app {
  overflow-x: hidden;
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