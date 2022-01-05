import { readonly, isReadonly } from '..'

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { baz: 2 } }
    const warped = readonly(original)

    expect(warped).not.toBe(original)
    expect(warped.foo).toBe(1)
    expect(isReadonly(warped)).toBe(true)
    expect(isReadonly(original)).toBe(false)
    warped.foo = 2
    expect(warped.foo).toBe(1)
  })

  it('warn when call set', () => {
    console.warn = jest.fn()

    const user = readonly({ age: 10 })
    user.age = 11
    expect(console.warn).toBeCalled()
  })
})
