import express, { Request, Response } from 'express'

import { createUser, deleteUser, getUsers, updateUser } from '@controllers'
import { authenticated } from '@helpers'
import { AuthenticatedRequest, ICreateUserInput, IGetUserInput, IUpdateUserInput, IUser, ResponseType } from '@types'

const router = express.Router()

router.get('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await getUsers(<IGetUserInput>req.query, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

router.post('/', async (req: Request, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await createUser(<ICreateUserInput>req.body)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

router.put('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = {
      ...response,
      ...(await updateUser(<IUser['_id']>req.params._id, <IUpdateUserInput>req.body, <IUser>req.user)),
    }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

router.delete('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await deleteUser(<IUser['_id']>req.params._id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as userRouter }
