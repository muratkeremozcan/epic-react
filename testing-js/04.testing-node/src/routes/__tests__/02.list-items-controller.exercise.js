// Testing Controllers

// 💰 remember, you can import files in the test/utils directory as if they're node_modules
import {
  buildRes,
  buildReq,
  buildNext,
  buildUser,
  buildBook,
  buildListItem,
  notes,
} from 'utils/generate'
// 🐨 getListItem calls `expandBookData` which calls `booksDB.readById`
// so you'll need to import the booksDB from '../../db/books'
import * as booksDB from '../../db/books'
import * as listItemsDB from '../../db/list-items'
// 🐨 don't forget to import the listItemsController from '../list-items-controller'
// here, that's the thing we're testing after all :)
import * as listItemsController from '../list-items-controller'

// 🐨 use jest.mock to mock '../../db/books' because we don't actually want to make
// database calls in this test file.
jest.mock('../../db/books')
jest.mock('../../db/list-items')

// 🐨 ensure that all mock functions have their call history cleared using
// jest.resetAllMocks here as in the example.
// beforeEach(() => jest.clearAllMocks())
beforeEach(() => jest.resetAllMocks()) // same thing

test('getListItem returns the req.listItem', async () => {
  // 🐨 create a user
  // 🐨 create a book
  // 🐨 create a listItem that has the user as the owner and the book
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})

  // 🐨 mock booksDB.readById to resolve to the book
  //  use mockResolvedValueOnce to mock the function under test (getListItem > expandBookData)
  booksDB.readById.mockResolvedValueOnce(book)

  // 🐨 make a request object that has properties for the user and listItem
  // 💰 checkout the implementation of getListItem in ../list-items-controller
  // to see how the request object is used and what properties it needs.
  // 💰 and you can use buildReq from utils/generate
  const req = buildReq({user, listItem})
  // 🐨 make a response object
  // 💰 just use buildRes from utils/generate
  const res = buildRes()

  // 🐨 make a call to getListItem with the req and res (`await` the result)
  await listItemsController.getListItem(req, res)
  // 🐨 assert that booksDB.readById was called correctly (expandBookData fn)
  expect(booksDB.readById).toHaveBeenCalledWith(book.id)
  expect(booksDB.readById).toHaveBeenCalledTimes(1)

  //🐨 assert that res.json was called correctly (getListItem fn)
  expect(res.json).toHaveBeenCalledWith({
    listItem: {...listItem, book},
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

it('createListItem returns a 400 error if no bookId is provided', async () => {
  const req = buildReq({body: {bookId: undefined}})
  const res = buildRes()

  await listItemsController.createListItem(req, res)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json).toHaveBeenCalledWith({message: `No bookId provided`})
  expect(res.json).toHaveBeenCalledTimes(1)
  // same thing as above
  // expect(res.json.mock.calls[0][0]).toEqual({message: `No bookId provided`})
  // when copy pasting error message assertions, matchInlineSnapshot is useful
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No bookId provided",
      },
    ]
  `)
})

test('setListItem sets the listItem on the req', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})

  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = buildReq({user, params: {id: listItem.id}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)

  expect(next).toHaveBeenCalledWith(/* nothing */)
  expect(next).toHaveBeenCalledTimes(1)

  expect(req.listItem).toBe(listItem)
})

test('setListItem returns a 404 error if the list item does not exit', async () => {
  listItemsDB.readById.mockResolvedValueOnce(null)
  const fakeId = 'foo'

  const req = buildReq({params: {id: fakeId}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledWith(fakeId)
  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById.mock.calls[0][0]).toEqual(fakeId) //?

  expect(next).not.toHaveBeenCalled()

  expect(res.status).toHaveBeenCalledWith(404)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status.mock.calls[0][0]).toEqual(404)

  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "No list item was found with the id of foo",
      },
    ]
  `)
})

test('setListItem returns a 403 error if the list item does not belong to the user', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const listItem = buildListItem({
    ownerId: 'SOMEONE_ELSE',
    id: 'FAKE_LIST_ITEM_ID',
  })
  listItemsDB.readById.mockResolvedValueOnce(listItem)

  const req = buildReq({user, params: {id: listItem.id}})
  const res = buildRes()
  const next = buildNext()

  await listItemsController.setListItem(req, res, next)

  expect(listItemsDB.readById).toHaveBeenCalledWith(listItem.id)
  expect(listItemsDB.readById).toHaveBeenCalledTimes(1)
  expect(listItemsDB.readById.mock.calls[0][0]).toBe(listItem.id)

  expect(next).not.toHaveBeenCalled()

  expect(res.status).toHaveBeenCalledWith(403)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.status.mock.calls[0][0]).toBe(403)

  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User with id FAKE_USER_ID is not authorized to access the list item FAKE_LIST_ITEM_ID",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test(`getListItems returns a user's list items`, async () => {
  const user = buildUser()
  const books = [buildBook(), buildBook()]
  const userListItems = [
    buildListItem({
      ownerId: user.id,
      bookId: books[0].id,
    }),
    buildListItem({
      ownerId: user.id,
      bookId: books[1].id,
    }),
  ]

  booksDB.readManyById.mockResolvedValueOnce(books)
  listItemsDB.query.mockResolvedValueOnce(userListItems)

  const req = buildReq({user})
  const res = buildRes()

  await listItemsController.getListItems(req, res)

  expect(booksDB.readManyById).toHaveBeenCalledWith([books[0].id, books[1].id])
  expect(booksDB.readManyById).toHaveBeenCalledTimes(1)

  expect(listItemsDB.query).toHaveBeenCalledWith({ownerId: user.id})
  expect(listItemsDB.query).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({
    listItems: [
      {...userListItems[0], book: books[0]},
      {...userListItems[1], book: books[1]},
    ],
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('createListItem creates and returns a list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const createdListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce([])
  listItemsDB.create.mockResolvedValueOnce(createdListItem)
  booksDB.readById.mockResolvedValueOnce(book)

  const req = buildReq({user, body: {bookId: book.id}})
  const res = buildRes()

  await listItemsController.createListItem(req, res)

  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(listItemsDB.query).toHaveBeenCalledTimes(1)

  expect(listItemsDB.create).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(listItemsDB.create).toHaveBeenCalledTimes(1)

  expect(booksDB.readById).toHaveBeenCalledWith(book.id)
  expect(booksDB.readById).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({listItem: {...createdListItem, book}})
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('createListItem returns a 400 error if the user already has a list item for the given book', async () => {
  const user = buildUser({id: 'FAKE_USER_ID'})
  const book = buildBook({id: 'FAKE_BOOK_ID'})
  const existingListItem = buildListItem({ownerId: user.id, bookId: book.id})
  listItemsDB.query.mockResolvedValueOnce([existingListItem])

  const req = buildReq({user, body: {bookId: book.id}})
  const res = buildRes()

  await listItemsController.createListItem(req, res)
  expect(listItemsDB.query).toHaveBeenCalledWith({
    ownerId: user.id,
    bookId: book.id,
  })
  expect(listItemsDB.query).toHaveBeenCalledTimes(1)

  expect(res.status).toHaveBeenCalledWith(400)
  expect(res.status).toHaveBeenCalledTimes(1)
  expect(res.json.mock.calls[0]).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "User FAKE_USER_ID already has a list item for the book with the ID FAKE_BOOK_ID",
      },
    ]
  `)
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('updateListItem updates an existing list item', async () => {
  const user = buildUser()
  const book = buildBook()
  const listItem = buildListItem({ownerId: user.id, bookId: book.id})
  const updates = {notes: notes()}

  const mergedListItemAndUpdates = {...listItem, ...updates}

  listItemsDB.update.mockResolvedValueOnce(mergedListItemAndUpdates)
  booksDB.readById.mockResolvedValueOnce(book)

  const req = buildReq({
    user,
    listItem,
    body: updates,
  })
  const res = buildRes()

  await listItemsController.updateListItem(req, res)

  expect(listItemsDB.update).toHaveBeenCalledWith(listItem.id, updates)
  expect(listItemsDB.update).toHaveBeenCalledTimes(1)

  expect(booksDB.readById).toHaveBeenCalledWith(book.id)
  expect(booksDB.readById).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({
    listItem: {...mergedListItemAndUpdates, book},
  })
  expect(res.json).toHaveBeenCalledTimes(1)
})

test('deleteListItem deletes an existing list item', async () => {
  const user = buildUser()
  const listItem = buildListItem({ownerId: user.id})

  const req = buildReq({
    user,
    listItem,
  })
  const res = buildRes()

  await listItemsController.deleteListItem(req, res)

  expect(listItemsDB.remove).toHaveBeenCalledWith(listItem.id)
  expect(listItemsDB.remove).toHaveBeenCalledTimes(1)

  expect(res.json).toHaveBeenCalledWith({success: true})
  expect(res.json).toHaveBeenCalledTimes(1)
})
