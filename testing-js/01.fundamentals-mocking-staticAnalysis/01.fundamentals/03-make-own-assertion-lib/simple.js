const { sum, subtract } = require('./math')

let result = sum(3, 7)
let expected = 10

// (1) abstract out the error handling, and it looks just like an assertion library

// if (result !== expected) {
//   throw new Error(`${result} is not equal to ${expected}`)
// }

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    }
    // we can just make our own assertion library
    // toEqual(expected) {},
    // toBeGreaterThan(expected) {},
  }
}

expect(result).toBe(expected)

result = subtract(7, 3)
expected = 4

// if (result !== expected) {
//   throw new Error(`${result} is not equal to ${expected}`)
// }

expect(result).toBe(expected)
