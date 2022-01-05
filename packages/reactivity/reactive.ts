import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export function reactive(raw: any): any {
  return createActiveObject(raw)
}

export function readonly(raw: any) {
  return createActiveObject(raw, readonlyHandlers)
}

function createActiveObject(raw: any, baseHandlers: any = mutableHandlers) {
  return new Proxy(raw, baseHandlers)
}
