import { track, trigger } from './effect'

export function reactive(raw: any): any {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key)
      // collect effects
      track(target, key)
      return res
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      // trigger effects
      trigger(target, key)
      return res
    },
  })
}
