const thumbWar = require('../thumb-war')
const utils = require('../utils')

// problem: what if the function is not called with two arguments? utils.getWinner(player1)

test('returns winner', () => {
  const originalGetWinner = utils.getWinner

  // (1) mock the function we depend on (utils.getWinner)
  // jest.fn is a built-in mock function, which takes a function implementation
  // instead of utils.getWinner = (p1, p2) => p1  we just wrap the right hand side with jest.fn(..)
  utils.getWinner = jest.fn((p1, p2) => p1)

  // Act
  const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')

  // Assert
  expect(winner).toBe('Kent C. Dodds')

  // (2) check if the mocked fn is called correctly by the main function (thumbWar)
  // expect(utils.getWinner).toHaveBeenCalledTimes(2)
  // expect(utils.getWinner).toHaveBeenCalledWith('Kent C. Dodds', 'Ken Wheeler')
  // expect(utils.getWinner).toHaveBeenNthCalledWith(
  //   1,
  //   'Kent C. Dodds',
  //   'Ken Wheeler'
  // )
  // expect(utils.getWinner).toHaveBeenNthCalledWith(
  //   2,
  //   'Kent C. Dodds',
  //   'Ken Wheeler'
  // )

  // (3) shorter assertion
  // check out the mock, it has many properties on it
  // utils.getWinner //?
  // .mock property is an object that has a .calls property, which is an array that holds all arg this fn is called with
  // utils.getWinner.mock //?
  // the below covers all of (2)
  expect(utils.getWinner.mock.calls).toEqual([
    ['Kent C. Dodds', 'Ken Wheeler'],
    ['Kent C. Dodds', 'Ken Wheeler']
  ])

  utils.getWinner = originalGetWinner
})
