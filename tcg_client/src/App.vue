<template>
  <a-config-provider :locale="locale">

    <a-layout id="app-container">
      <a-layout-header class="header">
        <div class="logo"/>
        <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="menuSelectedKeys" class="menu">
          <a-menu-item key="1" @click="pushRoute('trial-list')">
            Trial Code List
          </a-menu-item>
          <a-menu-item key="2" @click="pushRoute('code-gen')">
            Trial Code Generator
          </a-menu-item>
          <a-menu-item key="3" @click="pushRoute('trial-summary')">
            Trial Summary
          </a-menu-item>
        </a-menu>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="router-viewer">
          <router-view/>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer" style="text-align: center">
        HENGRUI MEDICINE ©2020 -- Trial Code Generator Version 1.0.0
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enGB from 'ant-design-vue/es/locale/en_GB';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/en-gb';
moment.locale('en-gb');
export default {
  data () {
    return {
      locale: enGB,
    };
  },
  computed: {
    menuSelectedKeys: function () {
      const menuKeysRouterNameMap = new Map();
      menuKeysRouterNameMap.set( 'trial-list', ['1'])
          .set('code-gen', ['2'])
          .set('trial-summary', ['3']);
      return menuKeysRouterNameMap.get(this.$route.name);
    },
  },
  methods: {
    pushRoute: function (routeName) {
      this.$router.push({
        name: routeName,
      })
    },
  },
};
</script>

<style scoped>
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

#app-container .router-viewer {
  background-color: #fff;
}
#app-container .footer {
  text-align: center;
}
</style>
