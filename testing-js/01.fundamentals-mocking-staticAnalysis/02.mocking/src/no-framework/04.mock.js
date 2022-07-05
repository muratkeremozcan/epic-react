// this isn't something you want to do, but it shows how jest.mock works

// we make it so that when require('../utils') is invoked, it gets our version instead
const utilsPath = require.resolve('../utils')
require.cache[utilsPath] = {
  // the object needs to resemble a module
  id: utilsPath,
  filename: utilsPath,
  loaded: true,
  // and we mock the implementation of the module
  exports: {
    getWinner: fn((p1, p2) => p1)
  }
}

const assert = require('assert')
const thumbWar = require('../thumb-war')
const utils = require('../utils')

function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args)
    return impl(...args)
  }
  mockFn.mock = { calls: [] }
  // mockFn.mockImplementation = (newImpl) => (impl = newImpl)

  return mockFn
}

// function spyOn(obj, prop) {
//   const originalValue = obj[prop]
//   obj[prop] = fn()
//   obj[prop].mockRestore = () => (obj[prop] = originalValue)
// }

// spyOn(utils, 'getWinner')
// utils.getWinner.mockImplementation((p1, p2) => p1)

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')
assert.strictEqual(winner, 'Kent C. Dodds')

assert.deepStrictEqual(utils.getWinner.mock.calls, [
  ['Kent C. Dodds', 'Ken Wheeler'],
  ['Kent C. Dodds', 'Ken Wheeler']
])

// utils.getWinner.mockRestore()
delete require.cache[utilsPath]
