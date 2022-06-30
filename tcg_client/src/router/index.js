import { createRouter, createWebHistory } from 'vue-router';
import { axios } from '../axios';

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/generator',
    name: 'code-gen',
    component: () => import('../views/Generator.vue'),
  },
  {
    path: '/list',
    name: 'trial-list',
    component: () => import('../views/List.vue'),
  },
  {
    path: '/summary',
    name: 'trial-summary',
    component: () => import('../views/Summary.vue'),
  },
  {
    path: '/plot',
    name: 'trial-plot',
    component: () => import('../views/Plot.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {

  // get token from localstorage and verify
  let localTokenIsValid = false;
  let decodedUserInfo;
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const response = await axios.post('/auth/verify', {
      userInfo: userInfo,
    });
    // 登录状态有效
    if (['1'].includes(response.data.statusCode)) {
      if (response.data.decodedResult.valid) {
        localTokenIsValid = true;
        decodedUserInfo = response.data.decodedResult.decoded;
      }
    }
  } catch (error) {
    console.error(error);
  }

  // to login page && already logged in
  if (['login'].includes(to.name)  && localTokenIsValid) {
    if (['t0', 't1', 't3'].includes(decodedUserInfo.userType)) {
      next({ name: 'trial-list' });
    }
    if (['t2'].includes(decodedUserInfo.userType)) {
      next({ name: 'code-gen' });
    }
  }

  // to pages other than the login page && not yet logged in
  else if (!['login'].includes(to.name) && !localTokenIsValid) {
    next({ name: 'login' });
  }

  // to generate page && already logged in && user with userType of readonly
  else if (['generator'].includes(to.name) && localTokenIsValid && ['t3'].includes(decodedUserInfo.userType)) {
    next({ name: 'trial-list' });
  }

  else {
    next();
  }

})

export default router;
