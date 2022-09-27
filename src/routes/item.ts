import express, { Response } from 'express'

import {
  createItem,
  deleteImage,
  deleteInvoice,
  deleteItem,
  getBrandsName,
  getItem,
  getItems,
  setImage,
  setInvoice,
  updateItem,
} from '@controllers'
import { authenticated } from '@helpers'
import { AuthenticatedRequest, IFile, IItem, IUser, ResponseType } from '@types'

const router = express.Router()

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
    response = { ...response, ...(await createItem(<IItem>req.body, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Set invoice for item
router.post('/:_id/invoice', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await setInvoice(<IItem['_id']>_id, <IFile>req.body, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Set image for item
router.post('/:_id/image', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await setImage(<IItem['_id']>_id, <IFile>req.body, <IUser>req.user)) }
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
    response = { ...response, ...(await updateItem(<IItem['_id']>_id, <IItem>req.body, <IUser>req.user)) }
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

// Delete invoice from item
router.delete('/:_id/invoice', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await deleteInvoice(<IItem['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Delete image from item
router.delete('/:_id/image', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await deleteImage(<IItem['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as itemRouter }
