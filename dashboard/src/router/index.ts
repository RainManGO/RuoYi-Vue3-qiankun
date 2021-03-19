/*
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-15 14:42:28
 */
import { RouteRecordRaw } from 'vue-router'
import view from '@/components/parentView/Index.vue'

export const constantRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: view,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: '#icondashboard',
          affix: true
        }
      }
    ]
  }
]

// const router = createRouter({
//   history: createWebHistory(),
//   routes: constantRoutes
// })

// export function resetRouter() {
//   const newRouter = router;
//   (router as any).matcher = (newRouter as any).matcher // reset router
// }

export default constantRoutes
