import express, { Response } from 'express'

import { createItem, deleteItem, getBrandsName, getItem, getItems, updateItem } from '@controllers'
import { authenticated } from '@helpers'
import {
  AuthenticatedRequest,
  ICreateItemInput,
  IItem,
  IUpdateItemInput,
  IUploadFile,
  IUser,
  ResponseType,
} from '@types'

import multer from 'multer'

const router = express.Router()
const upload = multer({})

router.use(
  upload.fields([
    { name: 'invoice', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
)

// Get all items from user
router.get('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await getItems(<IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Get brands name
router.get('/brands', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await getBrandsName(<IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Get item details
router.get('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await getItem(<IItem['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Create item
router.post('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = {
      ...response,
      ...(await createItem(<ICreateItemInput>req.body, <IUser>req.user, <IUploadFile>req.files)),
    }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Update item
router.put('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await updateItem(<IItem['_id']>_id, <IUpdateItemInput>req.body, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Delete item
router.delete('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await deleteItem(<IItem['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as itemRouter }
