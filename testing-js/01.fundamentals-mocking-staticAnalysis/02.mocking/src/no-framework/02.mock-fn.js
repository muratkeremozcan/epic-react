const assert = require('assert')
const thumbWar = require('../thumb-war')
const utils = require('../utils')

// challenge: how would we create jest.fn on our own?

/** The same as `jest.fn(impl)`.
 * Accepts an implementation.
 * Returns a function that calls that implementation with the given arguments.
 * It also keeps track of the args it's called with, so that we can make
 * assertions on how that function is called.
 */
function fn(impl) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args)
    return impl(...args)
  }
  mockFn.mock = { calls: [] }

  return mockFn
}

const originalGetWinner = utils.getWinner
// just like we did with jest.fn, we wrap the function
utils.getWinner = fn((p1, p2) => p1)

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')
assert.strictEqual(winner, 'Kent C. Dodds')

// gives the exact same output as the jest version
// utils.getWinner.mock.calls //?
assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler']
])

utils.getWinner = originalGetWinner
