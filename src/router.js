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

Vue.use(Router)

export default new Router({
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
			component: Store
		},
		{
			path: '/store/:id',
			name: 'storeDetail',
			component: StoreDetails,
			props: true
		},
		{
			path:'/user/favorite',
			name: 'bookmarks',
			component: Bookmark,
		},
		{
			path:'/user/queues',
			name: 'queues',
			component: Queues,
		},
		{
			path:'/user/settings',
			name: 'userSettings',
			component: UserSettings,
		},
		{
			path: '*',
			name: 'notfound',
			component: NotFound
		},
	]
})
