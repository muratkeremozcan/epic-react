const { sumAsync, subtractAsync } = require('./math')
const { test, expect } = require('./setup-globals')

test('sumAsync adds numbers', async () => {
  const result = await sumAsync(3, 7)
  const expected = 10
  expect(result).toBe(expected)
})

test('subtractAsync subtracts numbers', async () => {
  const result = await subtractAsync(7, 3)
  const expected = 4
  expect(result).toBe(expected)
})
