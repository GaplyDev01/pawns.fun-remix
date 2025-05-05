import * as profileCheck from './profile-check'
describe('profile-check actions', () => {
  it('should export checkAndCreateProfile', () => {
    expect(typeof profileCheck.checkAndCreateProfile).toBe('function')
  })
})
