import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'
// [6] mocking browser apis
// Anytime you have a module, whether it be third party or your own, and you don't want its code to run in the test
// then you can use the Jest mock API to mock out that particular component.
// Mock implementations of functions to make them do whatever you want them to do in your test

// 🐨 set window.navigator.geolocation to an object that has a getCurrentPosition mock function
beforeAll(() => {
  window.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  }
})

// 💰 I'm going to give you this handy utility function
// it allows you to create a promise that you can resolve/reject on demand.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}
// 💰 Here's an example of how you use this:
// const {promise, resolve, reject} = deferred()
// promise.then(() => {/* do something */})
// // do other setup stuff and assert on the pending state
// resolve()
// await promise
// // assert on the resolved state

test('displays the users current location', async () => {
  // 🐨 create a fakePosition object that has an object called "coords" with latitude and longitude
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition
  const fakePosition = {
    coords: {
      latitude: 35,
      longitude: 139,
    },
  }
  // 🐨 create a deferred promise here
  const {promise, resolve} = deferred()
  // 🐨 Now we need to mock the geolocation's getCurrentPosition function
  // To mock something you need to know its API and simulate that in your mock:
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
  //
  // here's an example of the API:
  // function success(position) {}
  // function error(error) {}
  // navigator.geolocation.getCurrentPosition(success, error)
  //
  // 🐨 so call mockImplementation on getCurrentPosition
  // 🐨 the first argument of your mock should accept a callback
  // 🐨 you'll call the callback when the deferred promise resolves
  // 💰 promise.then(() => {/* call the callback with the fake position */})
  window.navigator.geolocation.getCurrentPosition.mockImplementation(callback =>
    promise.then(() => callback(fakePosition)),
  )
  // 🐨 now that setup is done, render the Location component itself
  render(<Location />)
  //
  // 🐨 verify the loading spinner is showing up
  // 💰 tip: try running screen.debug() to know what the DOM looks like at this point.
  // screen.debug()
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  //
  // 🐨 resolve the deferred promise
  // 🐨 wait for the promise to resolve
  // 💰 right around here, you'll probably notice you get an error log in the
  // test output. You can ignore that for now and just add this next line:
  // act(() => {})
  // If you'd like, learn about what this means and see if you can figure out
  // how to make the warning go away (tip, you'll need to use async act)
  // 📜 https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
  await act(async () => {
    resolve()
    await promise
  })
  //
  // 🐨 verify the loading spinner is no longer in the document
  //    (💰 use queryByLabelText instead of getByLabelText)
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  // 🐨 verify the latitude and longitude appear correctly
  // screen.debug()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays error message when geolocation is not supported', async () => {
  const fakeError = new Error(
    'Geolocation is not supported or permission denied',
  )
  const {promise, reject} = deferred()

  window.navigator.geolocation.getCurrentPosition.mockImplementation(
    (successCallback, errorCallback) =>
      promise.catch(() => errorCallback(fakeError)),
  )

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  await act(async () => {
    reject()
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(screen.getByRole('alert')).toHaveTextContent(fakeError.message)
})

/*
eslint
  no-unused-vars: "off",
*/
