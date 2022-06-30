// Styling
// http://localhost:3000/isolated/exercise/05.js

import * as React from 'react'
import '../box-styles.css'

// 🐨 add a className prop to each div and apply the correct class names
// based on the text content
// 💰 Here are the available class names: box, box--large, box--medium, box--small
// 💰 each of the elements should have the "box" className applied

// 🐨 add a style prop to each div so their background color
// matches what the text says it should be
// 🐨 also use the style prop to make the font italic
// 💰 Here are available style attributes: backgroundColor, fontStyle

const smallBox = (
  <div className="box box--small" style={{backgroundColor: 'lightblue'}}>
    small lightblue box
  </div>
)
const mediumBox = (
  <div className="box box--medium" style={{backgroundColor: 'pink'}}>
    medium pink box
  </div>
)
const largeBox = (
  <div className="box box--large" style={{backgroundColor: 'orange'}}>
    large orange box
  </div>
)

// function App() {
//   return (
//     <div>
//       {smallBox}
//       {mediumBox}
//       {largeBox}
//     </div>
//   )
// }

// [5] TL,DR;
// For CSS, either use class name or style prop
// style prop takes an object with camelCased property names
// <div className="box" style={{marginTop: 20, backgroundColor: 'blue'}} />
// we can use JSX with template literals
// we can pass any props to a component with plain props {...props}
// as long as we define a className and style attributes in the render of the component
// we can customize those attributes with the props of the component

// a component with plain props
const Box0 = props => <div {...props} />
// console.log(Box0({className: 'box'}))

// (1)
const Box = ({className = '', styles, size, ...otherProps}) => {
  const sizeClassName = size ? `box--${size}` : ''
  return (
    <div
      className={`box ${className} ${sizeClassName}`} // JSX with template literal
      style={{fontSize: 'italic', ...styles}}
      {...otherProps}
    />
  )
}

function App() {
  return (
    <div>
      <Box0 className="box box--small" style={{backgroundColor: 'lightblue'}}>
        prototype
      </Box0>

      <Box size="small" style={{backgroundColor: 'lightblue'}}>
        small lightblue box
      </Box>
      <Box size="medium" style={{backgroundColor: 'pink'}}>
        medium pink box
      </Box>
      <Box size="large" style={{backgroundColor: 'orange'}}>
        large orange box
      </Box>
      <Box>sizeless box</Box>
    </div>
  )
}

export default App
