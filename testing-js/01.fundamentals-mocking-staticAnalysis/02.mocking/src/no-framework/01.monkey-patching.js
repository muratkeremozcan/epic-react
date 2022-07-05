const assert = require('assert')
const thumbWar = require('../thumb-war')
const utils = require('../utils')

// problem: the test will pass at 50% chance, because of randomization algorithm

// (1) : mock the utils module which thumbWar is using
// mocking the modules our main function depends on is called monkey-patching
const originalGetWinner = utils.getWinner // (2.1) save a copy of the original
utils.getWinner = (p1, p2) => p1

const winner = thumbWar('Kent C. Dodds', 'Ken Wheeler')

winner //?
assert.strictEqual(winner, 'Kent C. Dodds')

// (2.2) restore the original module, for stateless usage by other tests
utils.getWinner = originalGetWinner
