module.exports = {
  getWinner: fn((p1, p2) => p1)
}

function fn(impl = () => {}) {
  const mockFn = (...args) => {
    mockFn.mock.calls.push(args)
    return impl(...args)
  }
  mockFn.mock = { calls: [] }

  return mockFn
}
