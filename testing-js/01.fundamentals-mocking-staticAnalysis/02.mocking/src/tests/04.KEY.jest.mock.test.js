const thumbWar = require('../thumb-war')
const utils = require('../utils')

// Arrange

// problem: monkey patching works only with commonJs, 
// need to mock the whole module for esModule usage
// so we use jest.mock(..)
jest.mock('../utils', () => ({
  getWinner: jest.fn((p1, p2) => p1)
}))

test('returns winner', () => {
  // jest.spyOn(utils, 'getWinner').mockImplementation((p1, p2) => p1)

  // Act
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')

  // Assert
  expect(winner).toBe('Kent C. Dodds')
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler']
  ])

  // for cleanup with jest.mock, we use .mockReset() instead of mockRestore()
  utils.getWinner.mockReset()
  // utils.getWinner.mockRestore()
})
