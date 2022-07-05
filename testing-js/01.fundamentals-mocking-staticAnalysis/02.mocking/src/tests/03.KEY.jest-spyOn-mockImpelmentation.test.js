const thumbWar = require('../thumb-war')
const utils = require('../utils')

test('returns winner', () => {
  // Arrange

  // (1) jest has a shorthand for keeping track of the original module and restoring it
  // jest.spyOn(utils, 'getWinner')

  // don't need jest.fn
  // utils.getWinner = jest.fn((p1, p2) => p1)
  //  .mockImplementation(..) can be used instead of = jest.fn(..)
  // utils.getWinner.mockImplementation((p1, p2) => p1)

  // the above 2 can even be a one liner
  jest.spyOn(utils, 'getWinner').mockImplementation((p1, p2) => p1)

  // Act
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')

  // Assert
  expect(winner).toBe('Kent C. Dodds')
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler']
  ])

  // (1) jest has a shorthand for keeping track of the original module and restoring it
  utils.getWinner.mockRestore()
})
