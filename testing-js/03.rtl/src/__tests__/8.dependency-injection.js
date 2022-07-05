import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {GreetingLoader} from '../greeting-loader-02-dependency-injection'

test('loads greetings on click', async () => {
  const mockLoadGreeting = jest.fn()
  const testGreeting = 'TEST_GREETING'

  // (2) use mockResolvedValueOnce to mock the function under test
  mockLoadGreeting.mockResolvedValueOnce({data: {greeting: testGreeting}})

  // Arrange
  render(<GreetingLoader loadGreeting={mockLoadGreeting} />)
  const nameInput = screen.getByLabelText(/name/i)
  const loadButton = screen.getByText(/load/i)

  // Act
  nameInput.value = 'Mary'
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
