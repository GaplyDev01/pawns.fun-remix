import * as auth from './auth'
describe('auth actions', () => {
  it('should export all expected functions', () => {
    expect(typeof auth.signIn).toBe('function')
    expect(typeof auth.signUp).toBe('function')
    expect(typeof auth.resetPassword).toBe('function')
    expect(typeof auth.signOut).toBe('function')
  })
})
