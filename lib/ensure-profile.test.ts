import * as ensureProfile from './ensure-profile'
describe('ensure-profile util', () => {
  it('should export a function', () => {
    expect(typeof ensureProfile.default === 'function' || typeof ensureProfile.ensureProfileExists === 'function').toBe(true)
  })
})
