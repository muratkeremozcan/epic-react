const { sum, subtract } = require('./math')

// the problem with the previous example:
// when the first test fails, the later tests are not executed

// (1) create a test function
function test(title, callback) {
  try {
    callback()
    console.log(`✓ ${title}`)
  } catch (error) {
    console.error(`x ${title}`)
    console.error(error)
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`${actual} is not equal to ${expected}`)
      }
    }
  }
}

// (2) create test suite functions
// function sumTest() {
//   const result = sum(3, 7)
//   const expected = 10
//   expect(result).toBe(expected)
// }

// function subtractTest() {
//   const result = subtract(7, 3)
//   const expected = 4
//   expect(result).toBe(expected)
// }

// (3) use the test suite function with the test suite functions as callbacks
// test('sum adds numbers', sumTest)

// test('subtract subtracts numbers', subtractTest)

// (4) refactor

test('sum adds numbers', () => {
  const result = sum(3, 7)
  const expected = 10
  expect(result).toBe(expected)
})

test('subtract subtracts numbers', () => {
  const result = subtract(7, 3)
  const expected = 4
  expect(result).toBe(expected)
})
