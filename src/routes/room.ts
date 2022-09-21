import express, { Response } from 'express'

import { createRoom, deleteRoom, getRoom, getRoomStats, getRooms, updateRoom } from '@controllers'
import { authenticated } from '@helpers'
import { AuthenticatedRequest, IRoom, IUpdateItemInput, IUser, ResponseType } from '@types'

const router = express.Router()

// Get all rooms from user
router.get('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, data: await getRooms(<IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Get room details
router.get('/stats', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, data: await getRoomStats(<IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Get room details
router.get('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, data: await getRoom(<IRoom['_id']>_id, <IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Create room
router.post('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { name } = req.body

  try {
    response = { ...response, data: await createRoom(<IRoom['name']>name, <IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Update room
router.put('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, data: await updateRoom(<IRoom['_id']>_id, <IUpdateItemInput>req.body, <IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

// Delete room
router.delete('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, data: await deleteRoom(<IRoom['_id']>_id, <IUser>req.user) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as roomRouter }
