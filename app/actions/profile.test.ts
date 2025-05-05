import * as profile from './profile'
describe('profile actions', () => {
  it('should export updateProfile', () => {
    expect(typeof profile.updateProfile).toBe('function')
  })
})
