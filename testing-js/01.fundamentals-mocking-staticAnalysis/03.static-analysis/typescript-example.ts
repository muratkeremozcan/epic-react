function add(a: number, b: number) {
  return a + b
}

function getFullName(user) {
  const {
    name: { first, middle, last }
  } = user
  return [first, middle, last].filter(Boolean).join('')
}

add(1, 2)

getFullName({ name: { first: 'John', middle: 'Q', last: 'Doe' } })
