import * as React from 'react'
import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Counter} from '../redux-counter'
import {store} from '../redux-store'

test('can render with redux with defaults', () => {
  // problem: like react router, redux is a wrapper context around a component
  // (1) render the component within a redux Provider with a store prop
  // Arrange
  render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )
  // Act
  userEvent.click(screen.getByText('+'))
  // Assert
  expect(screen.getByLabelText(/count/i)).toHaveTextContent(1)
})
