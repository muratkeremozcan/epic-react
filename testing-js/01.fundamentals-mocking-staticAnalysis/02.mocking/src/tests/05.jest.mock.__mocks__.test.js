const thumbWar = require('../thumb-war')
const utils = require('../utils')

// Arrange

// problem: what do we do if this mock is common to multiple tests? We use __mocks__ directory
// and we remove the 2nd argument to jest.mock()
jest.mock('../utils')

test('returns winner', () => {
  // Act
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')

  // Assert
  expect(winner).toBe('Kent C. Dodds')
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler']
  ])

  utils.getWinner.mockReset()
})
