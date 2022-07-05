import * as React from 'react'
import {render, act} from '@testing-library/react'
import {useCounter} from '../use-counter'

test('exposes the count and increment/decrement functions', () => {
  let result

  // (1) call the custom hook within a function component
  function TestComponent() {
    result = useCounter()
    return null
  }

  // (2) render that function component
  render(<TestComponent />)
  expect(result.count).toBe(0)

  // (3) use rtl act() to invoke the hook's functions
  act(() => result.increment())
  expect(result.count).toBe(1)

  act(() => result.decrement())
  expect(result.count).toBe(0)
})
