import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login'
import Signup from './views/Signup'
import Store from './views/StoreList'
import StoreDetails from './views/StoreDetails'
import NotFound from './views/NotFound'
import Bookmark from './views/Bookmark'
import UserSettings from './views/UserSetting'
import Queues from './views/Queues'
import store from './store/store.js';

Vue.use(Router)

let router = new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
        {
			path: '/',
			redirect: 'home'
		},
		{
			path: '/home',
			name: 'home',
			component: Home
		},
		{
			path: '/login',
			name: 'login',
			component: Login
        },
        {
			path: '/signup',
			name: 'signup',
			component: Signup
		},
		{
			path: '/store',
			name: 'store',
			component: Store,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '/store/:id',
			name: 'storeDetail',
			component: StoreDetails,
			props: true,
			meta: {
				requiresAuth: true
			}
		},
		{
			path:'/user/favorite',
			name: 'bookmarks',
			component: Bookmark,
			meta: {
				requiresAuth: true
			}
		},
		{
			path:'/user/queues',
			name: 'queues',
			component: Queues,
			meta: {
				requiresAuth: true
			}
		},
		{
			path:'/user/settings',
			name: 'userSettings',
			component: UserSettings,
			meta: {
				requiresAuth: true
			}
		},
		{
			path: '*',
			name: 'notfound',
			component: NotFound
		},
	]
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		store.dispatch("onChangeUserCheck")
		if (store.getters.isLogged) {
			next()
			return
		}
		next('/login')
	} else {
		next()
	}
  });

  export default router;