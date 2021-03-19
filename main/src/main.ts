/*
 * @Description:
 * @Autor: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-18 11:10:14
 */
// import './public-path'
import { createApp, Directive } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
import { loadAllPlugins } from './plugins'
import '@/assets/iconfont/iconfont.css'
import '@/styles/index.scss'
import 'normalize.css'
import * as directives from '@/directives'
import '@/permission'
import { registerMicroApps, setDefaultMountApp } from 'qiankun'

const app = createApp(App)
// 加载所有插件
loadAllPlugins(app)
// 自定义指令
Object.keys(directives).forEach(key => {
  app.directive(key, (directives as { [key: string ]: Directive })[key])
})

app.use(store).use(router).mount('#app')

registerMicroApps([
  {
    name: 'dashboard',
    entry: '//localhost:8881',
    container: '#subapp-viewport',
    activeRule: '/dashboard'
  },
  {
    name: 'system',
    entry: '//localhost:7777',
    container: '#subapp-viewport',
    activeRule: '/system'
  },
  {
    name: 'monitor',
    entry: '//localhost:8888',
    container: '#subapp-viewport',
    activeRule: '/monitor'
  }
],
{
  beforeLoad: [
    app => {
      console.log('[LifeCycle] before load %c%s', 'color: green;', app.name)
      return Promise.resolve()
    }
  ],
  beforeMount: [
    app => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
      return Promise.resolve()
    }
  ],
  afterUnmount: [
    app => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
      return Promise.resolve()
    }
  ]
}
)

setDefaultMountApp('/system')
