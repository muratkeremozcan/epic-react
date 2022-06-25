// Basic Forms
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'

function UsernameForm({onSubmitUsername}) {
  // [6] TL,DR; (0)
  // form needs an onSubmit={submitHandler}
  // inputs in the form need id attribute and their labels need htmlFor attribute
  // submitHandler needs to event.preventDefault(),
  // and call a prop/fn which takes the input value as event.target.elements.ID.value
  // (1) using refs
  // ref is an immutable object between renders
  // we can use the .current property to get the current value of the React element
  // const userNameInputRef = React.useRef()
  // (2) using useState: we can use this hook to manage state and handle changes such as an error state
  // (3) we can control form inputs via React: <input value={myInputValue} />
  // typically the input's value is managed with useState,
  // and an onChange handler is used to set the state

  // 🐨 add a submit event handler here (`handleSubmit`).
  // 💰 Make sure to accept the `event` as an argument and call
  // `event.preventDefault()` to prevent the default behavior of form submit
  // events (which refreshes the page).
  // 📜 https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
  // 🐨 get the value from the username input (using whichever method
  // you prefer from the options mentioned in the instructions)
  // 💰 For example: event.target.elements[0].value
  // 🐨 Call `onSubmitUsername` with the value of the input

  // const handleSubmit = event => {
  //   event.preventDefault()
  //   console.dir(event.target)
  //   return onSubmitUsername(event.target.elements.userNameInput.value)
  // }

  // // (2)
  // const [error, setError] = React.useState(null)

  // const handleChange = event => {
  //   const {value} = event.target // const value = even.target.value
  //   const isLowerCase = value.toLowerCase() === value
  //   return setError(isLowerCase ? null : 'Username must be lower case.')
  // }

  // // 🐨 add the onSubmit handler to the <form> below
  // // 🐨 make sure to associate the label to the input.
  // // to do so, set the value of 'htmlFor' prop of the label to the id of input
  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div>
  //       <label htmlFor="userNameInput">Username:</label>
  //       <input id="userNameInput" type="text" onChange={handleChange} />
  //     </div>
  //     <div style={{color: 'red'}}>{error}</div>
  //     <button type="submit" disabled={Boolean(error)}>
  //       Submit
  //     </button>
  //   </form>
  // )

  // (1) using refs
  // ref is an immutable object between renders
  // we can use the .current property to get the current value of the React element
  // const userNameInputRef = React.useRef()

  // const handleSubmit = event => {
  //   event.preventDefault()
  //   console.dir(event.target)
  //   return onSubmitUsername(userNameInputRef.current.value)
  // }

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <div>
  //       <label htmlFor="userNameInput">Username:</label>
  //       <input id="userNameInput" type="text" ref={userNameInputRef} />
  //     </div>
  //     <button type="submit">Submit</button>
  //   </form>
  // )

  // (3) control the input value
  // we can control form inputs via React: <input value={myInputValue} />
  // typically the input's value is managed with useState: const [myInputValue, setMyInputValue] = useState('')
  // and an onChange handler is used to set the state
  const [userName, setUserName] = React.useState('')

  const handleSubmit = event => {
    event.preventDefault()
    console.dir(event.target)
    return onSubmitUsername(userName)
  }

  const handleChange = event => setUserName(event.target.value.toLowerCase())

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="userNameInput">Username:</label>
        <input
          id="userNameInput"
          type="text"
          value={userName}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

function App() {
  const onSubmitUsername = username => alert(`You entered: ${username}`)
  return <UsernameForm onSubmitUsername={onSubmitUsername} />
}

export default App
