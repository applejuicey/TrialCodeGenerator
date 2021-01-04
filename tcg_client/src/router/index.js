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

// router.beforeEach(async (to, from, next) => {
//
//   // get token from localstorage and do verification
//   let localTokenIsValid = false;
//   let decodedUserInfo;
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//   await axios.post(
//     '/verify-token',
//     {
//       userInfo: userInfo,
//     },
//   ).then((response) => {
//     if (['1'].includes(response.data.statusCode)) {
//       if (response.data.decodedResult.valid) {
//         localTokenIsValid = true;
//         decodedUserInfo = response.data.decodedResult.decoded;
//       }
//     }
//   }).catch((error) => {
//     console.log(error);
//   });
//
//   // to login page && already logged in
//   if (to.name === 'login' && localTokenIsValid) {
//     if (['t0', 't1'].includes(decodedUserInfo.userType)) {
//       next({ name: 'trial-list' });
//     }
//     if (['t2'].includes(decodedUserInfo.userType)) {
//       next({ name: 'code-gen' });
//     }
//   }
//
//   // to pages other than the login page && not yet logged in
//   else if (to.name !== 'login' && !localTokenIsValid) {
//     next({ name: 'login' });
//   }
//
//   else {
//     next();
//   }
//
// })

export default router;
