import * as React from 'react'
import {render, within} from '@testing-library/react'
import {Modal} from '../modal'

test('modal shows the children', () => {
  // render a child wrapped by the modal
  render(
    <Modal>
      <div data-testid="test" />
    </Modal>,
  )
  // within() //?
  // (2) use within from rtl
  const {getByTestId} = within(document.getElementById('modal-root'))
  expect(getByTestId('test')).toBeInTheDocument()
})
