/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-17 09:12:50
 */
import { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/Index.vue'
const constantFiles = require.context('./constantModules', true, /\.ts$/)
let constantModules: Array<RouteRecordRaw> = []
constantFiles.keys().forEach((key) => {
  if (key === './index.ts') return
  constantModules = constantModules.concat(constantFiles(key).default)
})

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/Index.vue')
      }
    ]
  },
  {
    path: '/',
    redirect:'/system'
  },
  ...constantModules
]

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes: constantRoutes
// })

// export function resetRouter() {
//   const newRouter = router;
//   (router as any).matcher = (newRouter as any).matcher // reset router
// }

export default constantRoutes
