/*
 * @Description:
 * @Author: ZY
 * @Date: 2021-03-18 13:45:37
 * @LastEditors: ZY
 * @LastEditTime: 2021-03-18 17:13:22
 */

type PushStateCallBack = (e: Event) => void

export default function() {
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

  const pushStateListen = (callback: PushStateCallBack) => {
    window.addEventListener('pushState', function(e) {
      callback(e)
    })
  }

  return {
    pushStateListen
  }
}
