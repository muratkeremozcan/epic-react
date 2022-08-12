// useContext: simple Counter
// http://localhost:3000/isolated/exercise/03.js
// [3] why useContext?
// Context api lets us pass a value deep into the component tree
// without explicitly threading it through every component (prop drilling)
// identify what components may need in common (ex: Auth)
// Manage state and effects related to a hook’s functionality within the hook and return only the value(s) that components need

import * as React from 'react'

// 🐨 create your CountContext here with React.createContext
// (1) createContext
const CountContext = React.createContext()

// 🐨 create a CountProvider component here that does this:
//   🐨 get the count state and setCount updater with React.useState
//   🐨 create a `value` array with count and setCount
//   🐨 return your context provider with the value assigned to that array and forward all the other props
//   💰 more specifically, we need the children prop forwarded to the context provider
// (3) use a ThemeProvider to provide the context/props/values/state to the children
function CountProvider({children}) {
  const [count, setCount] = React.useState(0)

  return (
    <CountContext.Provider value={[count, setCount]}>
      {children}
    </CountContext.Provider>
  )
}

function CountDisplay() {
  // 🐨 get the count from useContext with the CountContext
  // (2) import and useContext
  const [count] = React.useContext(CountContext)
  return <div>{`The current count is ${count}`}</div>
}

function Counter() {
  // 🐨 get the setCount from useContext with the CountContext
  // (2) import and useContext
  const [, setCount] = React.useContext(CountContext)
  const increment = () => setCount(c => c + 1)
  return <button onClick={increment}>Increment count</button>
}

function App() {
  return (
    <div>
      {/*
        🐨 (4) wrap these two components in the CountProvider so they can access
        the CountContext value
      */}
      <CountProvider>
        <CountDisplay />
        <Counter />
      </CountProvider>
    </div>
  )
}

export default App
