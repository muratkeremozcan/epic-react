import * as React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Main} from '../main'

test('main renders about and home and I can navigate to those pages', () => {
  // problem: rendering react router is tricky; any time a component needs a context,
  // that component needs to be rendered with the context provider

  // (1) create window history
  window.history.pushState({}, 'foo', '/')
  // (2) render the main component within a router (the context provider)
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>,
  )

  expect(screen.getByRole('heading')).toHaveTextContent(/home/i)

  userEvent.click(screen.getByText(/about/i))
  expect(screen.getByRole('heading')).toHaveTextContent(/about/i)
})

test('landing on a bad page shows no match component', () => {
  window.history.pushState({}, 'bar', '/something-that-does-not-match')
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>,
  )

  expect(screen.getByRole('heading')).toHaveTextContent(/404/i)
})
