import { track, trigger } from './effect'
import { ReactiveFlags } from './reactive'

function createGetter(isReadonly: boolean = false) {
  return function (target: any, key: string) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    !isReadonly && track(target, key)

    return res
  }
}

function createSetter(isReadonly: boolean = false) {
  return function (target: any, key: string, newVal: any) {
    if (!isReadonly) {
      Reflect.set(target, key, newVal)
      trigger(target, key)
    } else {
      console.warn(`key ${key} is not settable`, target)
    }
    return true
  }
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const readonlySet = createSetter(true)

export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: readonlySet,
}
