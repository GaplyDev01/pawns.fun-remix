import * as openChallenge from './open-challenge'
describe('open-challenge util', () => {
  it('should export a function', () => {
    expect(typeof openChallenge.default === 'function' || typeof openChallenge.findOpenChallengeUser === 'function').toBe(true)
  })
})
