/*
 * @Description:
 * @Autor: WJM
 * @Date: 2021-01-08 08:50:30
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-13 10:01:13
 */

/* eslint-disable @typescript-eslint/camelcase */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.gif' {
  export const gif: any
}

declare let __webpack_public_path__

interface Window {
  __POWERED_BY_QIANKUN__?: boolean
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
}
