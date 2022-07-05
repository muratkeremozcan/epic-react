import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {loadGreeting as mockLoadGreeting} from '../api'
import {GreetingLoader} from '../greeting-loader-01-mocking'

// problem: the component makes an http call to the server
// (1) mock the whole module with jest.mock()
jest.mock('../api')

test('loads greetings on click', async () => {
  const testGreeting = 'TEST_GREETING'
  // (2) use mockResolvedValueOnce to mock the function under test
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})

  // Arrange
  render(<GreetingLoader />)
  const nameInput = screen.getByLabelText(/name/i)
  const loadButton = screen.getByText(/load/i)

  // Act
  userEvent.type(nameInput, 'Mary')
  userEvent.click(loadButton)

  // Assert
  // expect(mockLoadGreeting).toHaveBeenCalledWith('Mary')
  // expect(mockLoadGreeting).toHaveBeenCalledTimes(1)
  // short version
  expect(mockLoadGreeting.mock.calls).toEqual([['Mary']])

  // use waitFor for DOM to update
  await waitFor(() =>
    expect(screen.getByLabelText(/greeting/i)).toHaveTextContent(testGreeting),
  )
})
