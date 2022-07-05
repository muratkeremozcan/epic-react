import * as React from 'react'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Counter} from '../redux-counter'
import {store as appStore} from '../redux-store'
import {reducer} from '../redux-reducer'

// problem: like react router, redux is a wrapper context around a component
test('can render with redux with defaults', () => {
  // (1) render the component within a redux Provider with a store prop
  // Arrange
  render(
    <Provider store={appStore}>
      <Counter />
    </Provider>,
  )
  // Act
  userEvent.click(screen.getByText('+'))
  // Assert
  expect(screen.getByLabelText(/count/i)).toHaveTextContent(1)
})

test('can render with redux with custom initial state', () => {
  // Redux’s createStore function takes up to three arguments: a reducer, an initial state, and an enhancer.
  const store = createStore(reducer, {count: 3})

  render(
    <Provider store={store}>
      <Counter />
    </Provider>,
  )

  userEvent.click(screen.getByText('-'))

  expect(screen.getByLabelText(/count/i)).toHaveTextContent('2')
})
