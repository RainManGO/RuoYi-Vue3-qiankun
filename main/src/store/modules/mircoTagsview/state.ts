/*
 * @Description: tags-view state
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-19 15:51:09
 */

export interface MicroTagView {
  title?: string
  path?: string
  isActive?: boolean
  noCache?: boolean
  affix?: boolean
}

export interface TagsViewState {
  visitedViews: MicroTagView[]
  cachedViews: (string | undefined)[]
}

export const state: TagsViewState = {
  visitedViews: [],
  cachedViews: []
}
