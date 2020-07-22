import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import iView from 'iview'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import api from './../config/api'
import files from "../public/js/files"
import exportExcel from "../public/js/exportExcel"

import './index.less'
import '@/assets/icons/iconfont.css'
// import TreeTable from 'tree-table-vue'
// import VOrgTree from 'v-org-tree'
// import 'v-org-tree/dist/v-org-tree.css'
// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.prototype.$http = api;
Vue.prototype.$config = config;
Vue.prototype.$files = files;
Vue.prototype.$exportExcel = exportExcel

Vue.use(ElementUI);
// Vue.use(iView, {
//   i18n: (key, value) => i18n.t(key, value)
// })
// Vue.use(TreeTable)
// Vue.use(VOrgTree)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)

new Vue({
  router,
  i18n,
  store,
  render: h => h(App),
}).$mount('#app')
