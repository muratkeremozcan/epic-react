// Testing Middleware
// (1) mock all the arguments of the middleWare function and test the error cases
// (2) use jest.fn() to mock. jest.fn is a built-in mock function, which takes a function implementation

import {UnauthorizedError} from 'express-jwt'
import errorMiddleware from '../error-middleware'

// the response is an object with fake functions
function buildRes(overrides) {
  const res = {
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    ...overrides,
  }
  return res
}

// 🐨 Write a test for the headersSent case
test('should call next if headersSent', async () => {
  const error = new Error('bla')
  const req = {}
  const res = buildRes({headersSent: true})
  const next = jest.fn()

  errorMiddleware(error, req, res, next)

  expect(next).toHaveBeenCalledWith(error)
  expect(next).toHaveBeenCalledTimes(1)
  expect(res.status).not.toHaveBeenCalled()
  expect(res.json).not.toHaveBeenCalled()
})

// 🐨 Write a test for the UnauthorizedError case
test('should respond with 401 for UnauthorizedError', async () => {
  const message = 'some message'
  const code = 'some code'

  const error = new UnauthorizedError(code, {message})
  const req = {}
  const res = buildRes()
  const next = jest.fn()

  errorMiddleware(error, req, res, next)

  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    code: error.code,
    message: error.message,
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

// 🐨 Write a test for the else case (responds with a 500)
test('should respond with 500 and the error object', async () => {
  const error = new Error('bla')
  const req = {}
  const res = buildRes()
  const next = jest.fn()

  errorMiddleware(error, req, res, next)

  expect(next).not.toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(500)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({
    message: error.message,
    stack: error.stack,
  })
  expect(res.json).toHaveBeenCalledTimes(1)

  // const error = jest.fn()
  // const req = {}
  // // the response is an object with fake functions
  // const res = {
  //   json: {
  //     message: 'some err msg',
  //     stack: 'some stack',
  //   },
  //   status: 500,
  // }
  // const next = jest.fn()

  // expect(next).not.toHaveBeenCalled()
  // expect(res.status).toHaveBeenCalledWith(500)
})
