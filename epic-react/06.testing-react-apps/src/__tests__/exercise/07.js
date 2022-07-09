// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

test('renders with the dark styles for the light theme - raw', () => {
  render(
    <ThemeProvider initialTheme="light">
      <EasyButton>Easy</EasyButton>,
    </ThemeProvider>,
  )

  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
  background-color: white;
  color: black;
  `)
})

test('renders with the dark styles for the light theme', () => {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme="light">{children}</ThemeProvider>
  )
  render(<EasyButton>Easy</EasyButton>, {wrapper: Wrapper})

  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
  background-color: white;
  color: black;
  `)
})

/* eslint no-unused-vars:0 */
const renderWithProviders = (ui, {theme = 'light', ...options} = {}) => {
  const Wrapper = ({children}) => (
    <ThemeProvider initialTheme={theme}>{children}</ThemeProvider>
  )
  return render(ui, {wrapper: Wrapper, ...options})
}

test('renders with the light styles for the dark theme', () => {
  renderWithProviders(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  const button = screen.getByRole('button', {name: /easy/i})

  expect(button).toHaveStyle(`
  background-color: black;
  color: white;
  `)
})
