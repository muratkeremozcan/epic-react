// Testing Pure Functions
import {isPasswordAllowed} from '../auth'
// import cases from 'jest-in-case'

// 🐨 import the function that we're testing
// 💰 import {isPasswordAllowed} from '../auth'

// 🐨 write tests for valid and invalid passwords
// 💰 here are some you can use:
//
// valid:
// - !aBc123
//
// invalid:
// - a2c! // too short
// - 123456! // no alphabet characters
// - ABCdef! // no numbers
// - abc123! // no uppercase letters
// - ABC123! // no lowercase letters
// - ABCdef123 // no non-alphanumeric characters

test('should allow valid passwords', () => {
  expect(isPasswordAllowed('!aBc123')).toBe(true)
})

describe.each([
  'a2c!',
  '123456!',
  'ABCdef!',
  'abc123!',
  'ABC123!',
  'ABCdef123',
])('should not allow invalid password %s', (password) => {
  test('should not allow invalid pws', () => {
    expect(isPasswordAllowed(password)).toBe(false)
  })
})
