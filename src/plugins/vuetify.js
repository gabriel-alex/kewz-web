import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
		iconfont: 'mdi'
	},
	theme:{
		themes:{
			light:
			{
				primary: '#44c53d',
				secondary: '#103f0e',
				accent: '#a3f99e',
				error: '#f14b4f',
				warning: '#f3ce4f',
				info: '#6be465',
				success: '#278f21'
				}
			},
			default:{
				primary: '#1976D2',
				secondary: '#424242',
				accent: '#82B1FF',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107',
			}
	}
});
