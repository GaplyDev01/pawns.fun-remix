import * as utils from './utils'
describe('utils', () => {
  it('should export at least one function', () => {
    expect(Object.values(utils).some(v => typeof v === 'function')).toBe(true)
  })
})
