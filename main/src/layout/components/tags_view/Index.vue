<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-24 10:35:59
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-19 16:03:28
-->
<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <ScrollPane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <div
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="tag.isActive ? 'active' : ''"
        :to="{path: tag.path}"
        tag="span"
        class="tags-view-item"
        @click="tagClick(tag)"
        @click.middle="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </div>
    </ScrollPane>
    <!-- <ul
      v-show="visible"
      :style="{left: left+'px', top: top+'px'}"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        {{ t('tagsView.refresh') }}
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
        {{
          t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">
        {{ t('tagsView.closeOthers') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        {{ t('tagsView.closeAll') }}
      </li>
    </ul> -->
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store'
import { TagsActionTypes } from '@/store/modules/mircoTagsview/action-types'
import { MicroTagView } from '@/store/modules/mircoTagsview/state'
import { computed, defineComponent, getCurrentInstance, nextTick, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ScrollPane from './ScrollPane.vue'
import watchPushState from '@/utils/watchPushState'
import { last } from 'lodash'
export default defineComponent({
  components: {
    ScrollPane
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const instance = getCurrentInstance()
    const { t } = useI18n()
    const scrollPaneRef = ref(null)
    const { ctx } = instance as any
    const { pushStateListen } = watchPushState()
    let currentPath = '/dashboard'

    const visitedViews = computed(() => {
      return store.state.tagViews.visitedViews
    })

    const getTagFromPath = (path: string) => {
      const title = last(path.split('/'))
      const tag: MicroTagView = {
        title,
        path,
        isActive: path === currentPath,
        noCache: false,
        affix: path === '/dashboard'
      }
      return tag
    }
    const addTags = () => {
      store.dispatch(TagsActionTypes.ACTION_ADD_VIEW, getTagFromPath(currentPath))
    }

    const moveToCurrentTag = () => {
      for (const tag of visitedViews.value) {
        if (tag.path === currentPath) {
          tag.isActive = true
        } else {
          tag.isActive = false
        }
        store.dispatch(TagsActionTypes.ACTION_UPDATE_VISITED_VIEW, getTagFromPath(currentPath))
      }
    }

    const listenHistoryPush = (e: Event) => {
      currentPath = last((e as any).arguments) ?? '/dashboard'
      addTags()
      moveToCurrentTag()
    }

    pushStateListen(listenHistoryPush)

    const toLastView = (visitedViews: MicroTagView[], view: MicroTagView) => {
      console.log(view)
      const latestView = visitedViews.slice(-1)[0]
      const path = latestView.path ?? '/'
      history.pushState(null, path, latestView.path)
    }

    const state = reactive({
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {} as MicroTagView,
      affixTags: [] as MicroTagView[],
      isActive: (route: MicroTagView) => {
        return route.path === currentPath
      },
      isAffix: (tag: MicroTagView) => {
        return tag.affix
      },
      refreshSelectedTag: (view: MicroTagView) => {
        store.dispatch(TagsActionTypes.ACTION_DEL_CACHED_VIEW, view)
        const { path } = view
        nextTick(() => {
          router.replace({ path: '/redirect' + path }).catch(err => {
            console.warn(err)
          })
        })
      },
      closeSelectedTag: (view: MicroTagView) => {
        store.dispatch(TagsActionTypes.ACTION_DEL_VIEW, view)
        if (state.isActive(view)) {
          toLastView(store.state.tagViews.visitedViews, view)
        }
      },
      closeOthersTags: () => {
        if (state.selectedTag.path !== currentPath && state.selectedTag.path !== undefined) {
          router.push(state.selectedTag.path).catch(err => {
            console.log(err)
          })
        }
        store.dispatch(TagsActionTypes.ACTION_DEL_OTHER_VIEW, state.selectedTag as MicroTagView)
      },
      closeAllTags: (view: MicroTagView) => {
        store.dispatch(TagsActionTypes.ACTION_DEL_ALL_VIEWS, undefined)
        if (state.affixTags.some(tag => tag.path === currentPath)) {
          return
        }
        toLastView(store.state.tagViews.visitedViews, view)
      },
      openMenu: (tag: MicroTagView, e: MouseEvent) => {
        const menuMinWidth = 105
        const offsetLeft = ctx.$el.getBoundingClientRect().left // container margin left
        const offsetWidth = ctx.$el.offsetWidth // container width
        const maxLeft = offsetWidth - menuMinWidth // left boundary
        const left = e.clientX - offsetLeft + 15 // 15: margin right
        if (left > maxLeft) {
          state.left = maxLeft
        } else {
          state.left = left
        }
        state.top = e.clientY
        state.visible = true
        state.selectedTag = tag
      },
      closeMenu: () => {
        state.visible = false
      },
      handleScroll: () => {
        state.closeMenu()
      }
    })

    const initTags = () => {
      store.dispatch(TagsActionTypes.ACTION_ADD_VISITED_VIEW, getTagFromPath('/dashboard'))
    }

    const tagClick = (tag: MicroTagView) => {
      console.log(tag)
      const path = tag.path ?? '/'
      history.pushState(null, path, path)
    }

    // life cricle
    onBeforeMount(() => {
      initTags()
      addTags()
    })

    return {
      visitedViews,
      scrollPaneRef,
      tagClick,
      t,
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>

// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
