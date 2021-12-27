class ReactiveEffect {
  private _fn: Function
  deps: any[] = []
  scheduler?: any

  constructor(fn: Function, scheduler?: any) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    activeEffect = this
    return this._fn()
  }
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
  const { scheduler } = options
  const _effect = new ReactiveEffect(fn, scheduler)

  _effect.run()

  const runner = _effect.run.bind(_effect)
  return runner
}
