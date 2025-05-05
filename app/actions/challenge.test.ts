import * as challenge from './challenge'
describe('challenge actions', () => {
  it('should export all expected functions', () => {
    expect(typeof challenge.createChallenge).toBe('function')
    expect(typeof challenge.acceptChallenge).toBe('function')
    expect(typeof challenge.rejectChallenge).toBe('function')
    expect(typeof challenge.cancelChallenge).toBe('function')
  })
})
