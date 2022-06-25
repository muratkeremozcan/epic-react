// useState: greeting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'

function Greeting({initialName = ''}) {
  // [1] TL,DR; useState is used to create a state variable and a setter function to update that state
  // it is to persist & manage state in a functional component

  const [name, setName] = React.useState(initialName)

  // 🐨 update the name here based on event.target.value
  const handleChange = event => setName(event.target.value)

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="you" />
}

export default App
