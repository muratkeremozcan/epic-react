// Lifting state
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'

// [3] TL,DR; when 2 sibling components need to share state,
// (1) move state management to their parent component
// (2) pass the state and setState down to the components
// (3) the components receive the state as props
// (4) manage state where all the components care for it

function Name({name, onNameChange}) {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={onNameChange} />
    </div>
  )
}

// (3) the components receive the state as props
// 🐨 accept `animal` and `onAnimalChange` props to this component
function FavoriteAnimal({animal, onAnimalChange}) {
  // (1) move state management to their parent component
  // 💣 delete this, it's now managed by the App
  // const [animal, setAnimal] = React.useState('')
  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input id="animal" value={animal} onChange={onAnimalChange} />
    </div>
  )
}

// 🐨 uncomment this
function Display({name, animal}) {
  return <div>{`Hey ${name}, your favorite animal is: ${animal}`}</div>
}

// 💣 remove this component in favor of the new one
// function Display({name}) {
//   return <div>{`Hey ${name}, you are great!`}</div>
// }

function App() {
  const [name, setName] = React.useState('')
  // 🐨 add a useState for the animal
  // (1) move state management to the parent component
  const [animal, setAnimal] = React.useState('')
  return (
    <form>
      {/* (2) pass the state and setState down to the components */}
      <Name name={name} onNameChange={event => setName(event.target.value)} />
      {/* 🐨 pass the animal and onAnimalChange prop here (similar to the Name component above) */}
      <FavoriteAnimal
        animal={animal}
        onAnimalChange={event => setAnimal(event.target.value)}
      />
      {/* 🐨 pass the animal prop here */}
      <Display name={name} animal={animal} />
    </form>
  )
}

export default App
