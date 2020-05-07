import Vue from 'vue'
import App from './App.vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import vuetify from './plugins/vuetify'
import store from './store/store.js'
import router from './router'

Vue.config.productionTip = false

// begin of the automatic import
const requireComponent = require.context(
  './components',
  false,
  /[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  Vue.component(componentName, componentConfig.default || componentConfig)
})
// End of the automatic import of components


new Vue({
  vuetify,
  router,
  store: store,
  render: h => h(App),
}).$mount('#app')
