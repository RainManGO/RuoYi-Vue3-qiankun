<!--
 * @Description: 面包屑组件
 * @Author: ZY
 * @Date: 2020-12-22 11:02:14
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-16 21:29:04
-->

<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator-class="el-icon-arrow-right"
  >
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="item"
      >
        <span
          v-if="item.redirect === 'noredirect' || index === breadcrumbs.length-1"
          class="no-redirect"
        >{{ item }}</span>
        <a
          v-else
          @click.prevent="handleLink(item,index)"
        >{{ item }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, toRefs } from 'vue'
import { RouteLocationMatched, useRouter } from 'vue-router'
// import { compile } from 'path-to-regexp'
import { useI18n } from 'vue-i18n'
import { last } from 'lodash'
export default defineComponent({
  setup() {
    const router = useRouter()
    // let currentRoute: RouteLocationMatched = router.getRoutes()[0]
    // const pathCompile = (path: string) => {
    //   const { params } = currentRoute
    //   const toPath = compile(path)
    //   return toPath(params)
    // }

    const { t } = useI18n()
    const state = reactive({
      breadcrumbs: ['dashboard'] as Array<string>,
      // getBreadcrumb: () => {
      //   let matched = route.matched.filter((item: any) => item.meta && item.meta.title)
      //   const frist = matched[0]
      //   if (!state.isDashboard(frist)) {
      //     matched = [{ path: '/dashboard', meta: { title: 'dashboard' } } as any].concat(matched)
      //   }
      //   state.breadcrumbs = matched.filter((item: any) => {
      //     return item.meta && item.meta.title && item.meta.breadcrumb !== false
      //   })
      // },
      isDashboard(route: RouteLocationMatched) {
        const name = route && route.name
        if (!name) {
          return false
        }
        return name.toString().trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
      },
      handleLink(item: string, index: number) {
        const breadcrumbs = state.breadcrumbs
        /**
         * @description: 如果是首页，直接跳转
         */
        if (item === 'dashboard') {
          history.pushState(null, 'dashboard', '/dashboard')
          return
        } else {
          breadcrumbs.splice(0, 1)
        }

        /**
         * @description: 如果是第一个路由，不需要拼接，其他需要拼接
         */
        if (index === 1) {
          history.pushState(null, item, `/${item}`)
        } else {
          let path = ''
          for (let i = 0; i < index; i++) {
            path = path + `/${breadcrumbs[i]}`
          }
          history.pushState(null, path, `/${path}`)
        }
        // const { redirect, path } = item
        // if (redirect) {
        //   router.push(redirect)
        // }
        // router.push(pathCompile(path) as any)
      }
    })

    // watch(() => currentRoute.path, (path) => {
    //   if (path.startsWith('/redirect/')) {
    //     return
    //   }
    //   state.getBreadcrumb()
    // })

    // const getCurrentRouteFromHistory = (path: string) => {
    //   currentRoute = router.getRoutes().filter((item: RouteLocationMatched) => {
    //     return item.path === path
    //   })[0]
    // }

    /* eslint-disable prefer-rest-params */
    // 重写方法
    const _wr = (type: string) => {
      const origin = history[type]
      return function() {
        const event = new Event(type);
        (event as any).arguments = arguments
        window.dispatchEvent(event)
        return origin.apply(history, arguments)
      }
    }

    // 重写方法
    history.pushState = _wr('pushState')
    history.replaceState = _wr('replaceState')
    // 实现监听
    window.addEventListener('replaceState', function(e) {
      console.log('THEY DID IT AGAIN! replaceState 111111' + e)
    })

    window.addEventListener('pushState', function(e) {
      const fullPath: string | undefined = last((e as any).arguments)
      if (fullPath === '/dashboard') {
        state.breadcrumbs = [fullPath]
      } else {
        let breadcrumbs = fullPath?.split('/') ?? []
        breadcrumbs = breadcrumbs.filter((item: string) => {
          return item !== ''
        })
        console.log(breadcrumbs)
        breadcrumbs.unshift('dashboard')
        state.breadcrumbs = breadcrumbs
      }
      console.log(router.getRoutes())
      // state.getBreadcrumb()
      // getCurrentRouteFromHistory()
    })

    onBeforeMount(() => {
      // state.getBreadcrumb()
    })

    return {
      t,
      ...toRefs(state)
    }
  }

})

</script>

<style lang="scss" scoped>
.el-breadcrumb__inner,
.el-breadcrumb__inner a {
  font-weight: 400 !important;
}

.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
