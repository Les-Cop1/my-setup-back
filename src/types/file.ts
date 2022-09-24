import { IUser } from '@types'

import { Document } from 'mongoose'

export interface IFile extends Document {
  name: string
  mimetype: string
  data: string
  user: IUser['_id']
}

export interface ICreateFileInput {
  buffer: Buffer
  mimetype: string
  originalname: string
  size: number
}
