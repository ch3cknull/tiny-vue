import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({ age: 10 })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return effect runner', () => {
    let age = 10
    const runner = effect(() => {
      age++
      return 'foo'
    })
    expect(age).toBe(11)
    const res = runner()
    expect(age).toBe(12)
    expect(res).toBe('foo')
  })

  it('scheduler', () => {
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => (dummy = obj.foo), { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })

  it('stop', () => {
    let dummy
    const obj = reactive({ props: 1 })
    const runner = effect(() => {
      dummy = obj.props
    })

    obj.props = 2
    expect(dummy).toBe(2)
    stop(runner)
    obj.props = 3
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })

  it('onStop', () => {
    const obj = reactive({ foo: 1 })
    const onStop = jest.fn()

    let dummy

    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { onStop }
    )
    expect(onStop).toBeCalledTimes(0)
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
