/*
 * @Description:
 * @Author: ZY
 * @Date: 2021-03-12 15:49:21
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-12 15:56:52
 */

import { registerMicroApps, start } from 'qiankun'

registerMicroApps([
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
])

// 启动 qiankun
start()
