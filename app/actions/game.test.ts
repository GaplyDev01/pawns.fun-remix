import * as game from './game'
describe('game actions', () => {
  it('should export all expected functions', () => {
    expect(typeof game.createGame).toBe('function')
    expect(typeof game.createSpectatorSession).toBe('function')
  })
})
