import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {reportError as mockReportError} from '../api'
import {ErrorBoundary} from '../error-boundary'

// problem: we have to both mock the api and console.error

// (1) mock the whole module with jest.mock()
jest.mock('../api')

// (2) jest has a shorthand for keeping track of the original module and restoring it
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})
afterAll(() => {
  console.error.mockRestore()
})
// ensure all mocks from jest.mock api module have been cleared
afterEach(() => {
  jest.clearAllMocks()
})

/** We need something that will be wrapped by ErrorBoundary */
function Bomb({shouldThrow}) {
  if (shouldThrow) throw new Error('💣')
  else return null
}

test('calls reportError and renders that there was a problem', () => {
  // (3) use mockResolvedValueOnce to mock the function under test
  mockReportError.mockResolvedValueOnce({success: true})

  // render takes a 2nd argument, an object used for wrappers
  const {rerender} = render(<Bomb />, {wrapper: ErrorBoundary})
  rerender(<Bomb shouldThrow={true} />)

  const error = expect.any(Error)
  const info = {componentStack: expect.stringContaining('Bomb')}
  expect(mockReportError).toHaveBeenCalledWith(error, info)
  expect(mockReportError).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledTimes(2)

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"There was a problem."`,
  )

  // (4) reset the calls to 0, but leave the mock implementation intact
  mockReportError.mockClear()
  console.error.mockClear()

  ///////////////
  // test the non-error case
  rerender(<Bomb />)
  userEvent.click(screen.getByText(/try again/i))

  expect(mockReportError).not.toHaveBeenCalled()
  expect(console.error).not.toHaveBeenCalled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByText(/try again/i)).not.toBeInTheDocument()
})
