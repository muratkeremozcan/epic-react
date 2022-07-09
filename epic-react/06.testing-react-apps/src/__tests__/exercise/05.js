import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import Login from '../../components/login-submission'

// [5] mocking http requests
// mock the server responses using msw (setupServer, server.listen, server.close...)
// use waitForElementToBeRemoved(..)
// test the edge cases too

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

describe('Mocking http requests', () => {
  // 🐨 get the server setup with an async function to handle the login POST request:
  const server = setupServer(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        if (!req.body.password) {
          return res(ctx.status(400), ctx.json({message: 'password required'}))
        }
        if (!req.body.username) {
          return res(ctx.status(400), ctx.json({message: 'username required'}))
        }
        return res(ctx.json({username: req.body.username})) // respond with an JSON object that has the username
      },
    ),
  )

  beforeAll(() => server.listen()) // before all the tests, start the server with `server.listen()`
  afterAll(() => server.close()) // after all the tests, stop the server with `server.close()`
  afterEach(() => server.resetHandlers())

  test(`logging in displays the user's username`, async () => {
    render(<Login />)
    const {username, password} = buildLoginForm()

    await userEvent.type(screen.getByLabelText(/username/i), username)
    await userEvent.type(screen.getByLabelText(/password/i), password)
    await userEvent.click(screen.getByRole('button', {name: /submit/i})) // screen.debug()
    // as soon as the user hits submit, we render a spinner to the screen. That
    // spinner has an aria-label of "loading" for accessibility purposes, so
    // 🐨 wait for the loading spinner to be removed using waitForElementToBeRemoved
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitforelementtoberemoved
    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))
    // once the login is successful, then the loading spinner disappears and we render the username.
    // 🐨 assert that the username is on the screen
    expect(screen.getByText(username)).toBeInTheDocument()
  })

  test('omitting the password results in an error', async () => {
    render(<Login />)
    const {username} = buildLoginForm()

    await userEvent.type(screen.getByLabelText(/username/i), username)
    await userEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

    expect(screen.getByRole('alert')).toHaveTextContent('password required')
  })

  test('omitting the username results in an error', async () => {
    render(<Login />)
    const {password} = buildLoginForm()

    await userEvent.type(screen.getByLabelText(/password/i), password)
    await userEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

    expect(screen.getByRole('alert')).toHaveTextContent('username required')
  })

  test('unknown server error displays the error message', async () => {
    const testErrorMessage = 'Oh no, something bad happened'
    server.use(
      rest.post(
        'https://auth-provider.example.com/api/login',
        async (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({message: testErrorMessage}))
        },
      ),
    )
    render(<Login />)
    await userEvent.click(screen.getByRole('button', {name: /submit/i}))

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))

    expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
  })
})
