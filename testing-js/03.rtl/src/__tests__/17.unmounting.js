import * as React from 'react'
import {render, act} from '@testing-library/react'
import {Countdown} from '../countdown'

beforeAll(() => {
  // jest.spyOn(console, 'error').mockImplementation(() => {}) // not really needed to spy
  jest.spyOn(console, 'error')
})

afterAll(() => {
  console.error.mockRestore()
})

afterEach(() => {
  // jest.clearAllMocks() // not really needed to spy
  jest.useRealTimers()
})

test('does not attempt to set state when unmounted (to prevent memory leaks)', () => {
  jest.useFakeTimers()
  const {unmount} = render(<Countdown />)
  unmount()

  // needed to test clearInterval properly
  act(() => jest.runOnlyPendingTimers())
  expect(console.error).not.toHaveBeenCalled()
})

test('tests mount', () => {
  jest.useFakeTimers()
  render(<Countdown />)

  act(() => jest.runOnlyPendingTimers())
  expect(console.error).not.toHaveBeenCalled()
})
