// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // [2] TL,DR;
  // (0) any time the component renders, useEffect is called
  // (1) useState can take a fn as an argument which runs once on mount
  // used for initial, costly calculations for initial state, so that they don't repeat on setState
  // (2) useEffect takes a second argument, the "dependency array", which signals to React
  // that the useEffect callback function should only called when those dependencies change
  // (3) custom hooks are just reuseable functions that help us tidy up the code

  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName
  // const [name, setName] = React.useState(
  //   () => window.localStorage.getItem('name') ?? initialName,
  // )
  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // React.useEffect(() => window.localStorage.setItem('name', name), [name])

  // (3) the above can be made into a custom hook
  const [name, setName] = useLocalStorageState('name', initialName)

  const handleChange = event => setName(event.target.value)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => window.localStorage.getItem('name') ?? defaultValue,
  )

  React.useEffect(
    () => window.localStorage.setItem(key, String(state)),
    [key, state],
  )

  return [state, setState]
}

function App() {
  return <Greeting />
}

export default App
