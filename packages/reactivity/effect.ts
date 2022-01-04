import { extend } from '../shared'

class ReactiveEffect {
  private _fn: Function
  deps: any[] = []
  active: boolean = true
  scheduler?: any
  onStop?: any

  constructor(fn: Function) {
    this._fn = fn
  }

  run() {
    activeEffect = this
    return this._fn()
  }

  stop() {
    if (!this.active) return

    cleanupEffect(this)
    this.active = false
    this.onStop && this.onStop()
  }
}

function cleanupEffect(effect: any) {
  effect.deps.forEach((dep: Set<any>) => dep.delete(effect))
}

const targetMap = new Map()
export function track(target: any, key: any) {
  // const dep = new Set()
  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  activeEffect && dep.add(activeEffect) && activeEffect.deps.push(dep)
}

export function trigger(target: any, key: any) {
  const depsMap = targetMap.get(target)
  const deps = depsMap && depsMap.get(key)
  deps &&
    deps.forEach((effect: ReactiveEffect) => {
      if (effect.scheduler) {
        return effect.scheduler()
      }
      return effect.run()
    })
}

let activeEffect: any
export function effect(fn: Function, options: any = {}) {
  const _effect = new ReactiveEffect(fn)
  extend(_effect, options)

  _effect.run()

  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

export function stop(runner: any) {
  const { effect } = runner

  effect.stop()
}
