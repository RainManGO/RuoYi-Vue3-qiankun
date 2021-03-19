/*
 * @Description: app Mutations
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-08 17:26:27
 */
import { MutationTree } from 'vuex'
import { TagsViewState, MicroTagView } from './state'
import { TagsMutationTypes } from './mutation-types'

export type Mutations<S = TagsViewState> = {
  [TagsMutationTypes.ADD_VISITED_VIEW](state: S, view: MicroTagView): void
  [TagsMutationTypes.ADD_CACHED_VIEW](state: S, view: MicroTagView): void
  [TagsMutationTypes.DEL_VISITED_VIEW](state: S, view: MicroTagView): void
  [TagsMutationTypes.DEL_CACHED_VIEW](state: S, view: MicroTagView): void
  [TagsMutationTypes.DEL_OTHERS_VISITED_VIEWS](state: S, view: MicroTagView): void
  [TagsMutationTypes.DEL_OTHERS_CACHED_VIEWS](state: S, view: MicroTagView): void
  [TagsMutationTypes.DEL_ALL_VISITED_VIEWS](state: S): void
  [TagsMutationTypes.DEL_ALL_CACHED_VIEWS](state: S): void
  [TagsMutationTypes.UPDATE_VISITED_VIEW](state: S, view: MicroTagView): void
}

export const mutations: MutationTree<TagsViewState> & Mutations = {
  [TagsMutationTypes.ADD_VISITED_VIEW](state: TagsViewState, view: MicroTagView) {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.title || 'no-name'
      })
    )
  },
  [TagsMutationTypes.ADD_CACHED_VIEW](state: TagsViewState, view: MicroTagView) {
    if (view.title === null) return
    if (state.cachedViews.includes(view.title?.toString())) return
    if (!view.noCache) {
      state.cachedViews.push(view.title?.toString())
    }
  },
  [TagsMutationTypes.DEL_VISITED_VIEW](state: TagsViewState, view: MicroTagView) {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  [TagsMutationTypes.DEL_CACHED_VIEW](state: TagsViewState, view: MicroTagView) {
    if (view.title === null) return
    const index = state.cachedViews.indexOf(view.title?.toString())
    index > -1 && state.cachedViews.splice(index, 1)
  },
  [TagsMutationTypes.DEL_OTHERS_VISITED_VIEWS](state: TagsViewState, view: MicroTagView) {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.affix || v.path === view.path
    })
  },
  [TagsMutationTypes.DEL_OTHERS_CACHED_VIEWS](state: TagsViewState, view: MicroTagView) {
    if (view.title === null) return
    const index = state.cachedViews.indexOf(view.title?.toString())
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },
  [TagsMutationTypes.DEL_ALL_VISITED_VIEWS](state: TagsViewState) {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.affix)
    state.visitedViews = affixTags
  },
  [TagsMutationTypes.DEL_ALL_CACHED_VIEWS](state: TagsViewState) {
    state.cachedViews = []
  },
  [TagsMutationTypes.UPDATE_VISITED_VIEW](state: TagsViewState, view: MicroTagView) {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }

}
