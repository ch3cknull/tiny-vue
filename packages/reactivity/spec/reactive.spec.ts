import { reactive, isReactive } from '../reactive'
describe('reactive', () => {
  it('should be reactive', () => {
    const origin = { age: 10 }
    const warped = reactive(origin)
    expect(warped).not.toBe(origin)
    expect(warped.age).toBe(10)
    expect(isReactive(origin)).toBe(false)
    expect(isReactive(warped)).toBe(true)
  })
})
