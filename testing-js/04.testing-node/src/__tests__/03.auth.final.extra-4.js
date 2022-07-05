import axios from 'axios'
import {resetDb} from 'utils/db-utils'
import * as generate from 'utils/generate'
import {getData, handleRequestFailure, resolve} from 'utils/async'
import * as usersDB from '../db/users'
import startServer from '../start'

let api, server

beforeAll(async () => {
  server = await startServer()
  // KEY: we a randomized port for each test file, so they can run concurrently
  const baseURL = `http://localhost:${server.address().port}/api`
  // so that we don't repeat the long  await axios.post('longUrlString')
  api = axios.create({baseURL})
  // so that errors are more clear when things fail (onFulfilled, onRejected)
  api.interceptors.response.use(getData, handleRequestFailure)
})

afterAll(() => server.close())

beforeEach(() => resetDb())

test('auth flow', async () => {
  const {username, password} = generate.loginForm()

  // register
  const rData = await api.post('auth/register', {username, password})
  expect(rData.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })

  // login
  // KEY: notice how we shorten the long await axios.post('longUrlString')
  const lData = await api.post('auth/login', {username, password})
  expect(lData.user).toEqual(rData.user)

  // authenticated request
  const mData = await api.get('auth/me', {
    headers: {
      Authorization: `Bearer ${lData.user.token}`,
    },
  })
  expect(mData.user).toEqual({
    token: expect.any(String),
    id: expect.any(String),
    username,
  })
})

test('username must be unique', async () => {
  const username = generate.username()
  await usersDB.insert(generate.buildUser({username}))
  const error = await api
    .post('auth/register', {
      username,
      password: 'Nancy-is-#1',
    })
    // weth resolve (an identity function a => a), we don't let the test fail
    // and we are able to assert the error
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username taken"}]`,
  )
})

test('get me unauthenticated returns error', async () => {
  const error = await api.get('auth/me').catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 401: {"code":"credentials_required","message":"No authorization token was found"}]`,
  )
})

test('username required to register', async () => {
  const error = await api
    .post('auth/register', {password: generate.password()})
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('password required to register', async () => {
  const error = await api
    .post('auth/register', {username: generate.username()})
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"password can't be blank"}]`,
  )
})

test('username required to login', async () => {
  const error = await api
    .post('auth/login', {password: generate.password()})
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username can't be blank"}]`,
  )
})

test('password required to login', async () => {
  const error = await api
    .post('auth/login', {username: generate.username()})
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"password can't be blank"}]`,
  )
})

test('user must exist to login', async () => {
  const error = await api
    .post('auth/login', generate.loginForm({username: '__will_never_exist__'}))
    .catch(resolve)
  expect(error).toMatchInlineSnapshot(
    `[Error: 400: {"message":"username or password is invalid"}]`,
  )
})
