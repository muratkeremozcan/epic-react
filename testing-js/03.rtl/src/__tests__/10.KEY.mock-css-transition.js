import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {HiddenMessage} from '../hidden-message'

// problem: the css transition takes 1 second to finish, we don't want to wait

// (1) mock a function of the module with jest.mock(.., cb)
// if the in prop is there, render the children, otherwise render null
// this way we skip the css transition entirely, and not have to wait 1 second
jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props) => (props.in ? props.children : null),
  }
})

test('shows hidden message when toggle is clicked', () => {
  const myMessage = 'hello world'

  // Arrange
  render(<HiddenMessage>{myMessage}</HiddenMessage>)
  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()

  // Act & Assert
  const toggleButton = screen.getByText(/toggle/i)
  userEvent.click(toggleButton)
  expect(screen.getByText(myMessage)).toBeInTheDocument()

  // Act & Assert
  userEvent.click(toggleButton)
  expect(screen.queryByText(myMessage)).not.toBeInTheDocument()
  // we could wait for the animation to finish but it takes 1 second
  // await wait( () => expect(screen.queryByText(myMessage)).not.toBeInTheDocument())
})
