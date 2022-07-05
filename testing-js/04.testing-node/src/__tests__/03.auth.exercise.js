// Testing Authentication API Routes

// 🐨 import the things you'll need
import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import startServer from '../start'

// 🐨 you'll need to start/stop the server using beforeAll and afterAll
// 💰 This might be helpful: server = await startServer({port: 8000})
let server

beforeAll(async () => {
  server = await startServer({port: 8000})
})

afterAll(() => server.close())
// 🐨 beforeEach test in this file we want to reset the database
beforeEach(() => resetDb())

test('auth flow', async () => {
  // 🐨 get a username and password from generate.loginForm()
  const {username, password} = generate.loginForm()

  // register
  // 🐨 use axios.post to post the username and password to the registration endpoint
  const registerResp = await axios.post(
    'http://localhost:8000/api/auth/register',
    {
      username,
      password,
    },
  )

  // registerResp.data //?
  // 🐨 assert that the result you get back is correct
  // 💰 it'll have an id and a token that will be random every time.
  // You can either only check that `result.data.user.username` is correct, or
  // for a little extra credit 💯 you can try using `expect.any(String)`
  // (an asymmetric matcher) with toEqual.
  // 📜 https://jestjs.io/docs/en/expect#expectanyconstructor
  // 📜 https://jestjs.io/docs/en/expect#toequalvalue
  expect(registerResp.data.user).toEqual({
    id: expect.any(String),
    username,
    token: expect.any(String),
  })

  // login
  // 🐨 use axios.post to post the username and password again, but to the login endpoint
  // 💰 http://localhost:8000/api/auth/login
  const loginResp = await axios.post('http://localhost:8000/api/auth/login', {
    username,
    password,
  })

  // loginResp.data //?
  // 🐨 assert that the result you get back is correct
  // 💰 tip: the data you get back is exactly the same as the data you get back
  // from the registration call, so this can be done really easily by comparing
  // the data of those results with toEqual
  expect(loginResp.data.user).toEqual(registerResp.data.user)

  // authenticated request
  // 🐨 use axios.get(url, config) to GET the user's information
  // 💰 http://localhost:8000/api/auth/me
  // 💰 This request must be authenticated via the Authorization header which
  // you can add to the config object: {headers: {Authorization: `Bearer ${token}`}}
  // Remember that you have the token from the registration and login requests.
  const authResp = await axios.get('http://localhost:8000/api/auth/me', {
    headers: {
      Authorization: `Bearer ${loginResp.data.user.token}`,
    },
  })

  //
  // 🐨 assert that the result you get back is correct
  // 💰 (again, this should be the same data you get back in the other requests,
  // so you can compare it with that).
  expect(authResp.data.user).toEqual(loginResp.data.user)
})
