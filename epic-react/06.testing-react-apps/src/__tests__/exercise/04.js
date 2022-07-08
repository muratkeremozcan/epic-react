import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import faker from 'faker'
import Login from '../../components/login'

function buildLoginForm(overrides) {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    ...overrides,
  }
}
// [4] testing forms
test('submitting the form calls onSubmit with username and password', async () => {
  const handleSubmit = jest.fn() // mock the prop
  render(<Login onSubmit={handleSubmit} />) // screen.debug()
  const {username, password} = buildLoginForm()
  // use `getByLabelText(..)` and `await userEvent.type(..)
  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByText(/submit/i))
  // use jest to make assertions
  expect(handleSubmit).toHaveBeenCalledWith({username, password})
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
