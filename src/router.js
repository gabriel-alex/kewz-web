import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login'
import Signup from './views/Signup'
import Store from './views/Store'
import NotFound from './views/NotFound'

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
			path: '*',
			name: 'notfound',
			component: NotFound
		},
	]
})
