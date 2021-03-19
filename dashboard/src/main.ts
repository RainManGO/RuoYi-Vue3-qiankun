/*
 * @Description:
 * @Autor: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-15 17:18:21
 */
import './public-path'
import { createApp, Directive } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from './router'
import { store } from './store'
import { loadAllPlugins } from './plugins'
import '@/assets/iconfont/iconfont.css'
import '@/styles/index.scss'
import 'normalize.css'
import * as directives from '@/directives'

let router: ReturnType<typeof createRouter> | null 
let instance: ReturnType<typeof createApp> | null 

function render(props = {}) {
  const { container } = props as any
  router =  createRouter({
    history: createWebHistory(
      window.__POWERED_BY_QIANKUN__ ? '/' : '/'
    ),
    routes
  })
  instance = createApp(App)
  instance?.use(router!)
  instance?.use(store)
  // 加载所有插件
  loadAllPlugins(instance!)
  // 自定义指令
  Object.keys(directives).forEach(key => {
    instance?.directive(key, (directives as { [key: string ]: Directive })[key])
  })

  instance?.mount(container ? container.querySelector('#app') : '#app')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('%c ', 'color: green;', 'vue3.0 app bootstraped')
}

export async function mount(props: Record<string, any>) {
  render(props)
  instance!.config.globalProperties.$onGlobalStateChange =
    props.onGlobalStateChange
  instance!.config.globalProperties.$setGlobalState = props.setGlobalState
}

export async function unmount() {
  if (instance!._container === null) {
    throw Error('instance._container is null')
  }
  instance?.unmount('#app')
  instance!._container.innerHTML = ''
  instance = null
  router = null
}
