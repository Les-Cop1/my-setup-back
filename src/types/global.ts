import { Request } from 'express'

import { IUser } from '@types'

import mongoose from 'mongoose'

export type ResponseType = {
  success: boolean
  error?: string
  data?: any
}

export interface AuthenticatedRequest extends Request {
  user?: IUser
}

export const ObjectId = mongoose.Types.ObjectId
