import { reactive } from '../reactive'
describe('reactive', () => {
  it('should be reactive', () => {
    const origin = { age: 10 }
    const a = reactive(origin)
    expect(a).not.toBe(origin)
    expect(a.age).toBe(10)
  })
})
