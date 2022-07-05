import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Redirect as MockRedirect} from 'react-router'
import {savePost as mockSavePost} from '../api'
import {Editor} from '../post-editor-05-dates'

// problem: new feature which adds a date to the post

// (1) mock the whole module with jest.mock()
jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  }
})
jest.mock('../api')
// ensure all mocks from jest.mock api module have been cleared
afterEach(jest.clearAllMocks)

test('renders a form with title, content, tags, and a submit button', async () => {
  // (2) use mockResolvedValueOnce to mock the function under test
  mockSavePost.mockResolvedValueOnce()
  // Arrange
  const fakeUser = {id: 'user-1'}
  render(<Editor user={fakeUser} />)
  const preDate = new Date().getTime()

  // Act
  const fakePost = {
    title: 'Test title',
    content: 'Test content',
    tags: ['tag1', 'tag2'],
  }
  screen.getByLabelText(/title/i).value = fakePost.title
  screen.getByLabelText(/content/i).value = fakePost.content
  screen.getByLabelText(/tags/i).value = fakePost.tags.join(', ')
  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)

  // Assert
  expect(submitButton).toBeDisabled()
  expect(mockSavePost).toHaveBeenCalledTimes(1)
  expect(mockSavePost).toHaveBeenCalledWith({
    ...fakePost,
    date: expect.any(String),
    authorId: fakeUser.id,
  })

  const date = new Date(mockSavePost.mock.calls[0][0].date).getTime()
  const postDate = new Date().getTime()
  expect(date).toBeGreaterThanOrEqual(preDate)
  expect(date).toBeLessThanOrEqual(postDate)

  // (3) use waitFor for DOM to update
  await waitFor(() => expect(MockRedirect).toHaveBeenCalledWith({to: '/'}, {}))
})
