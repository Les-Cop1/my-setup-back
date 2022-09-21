import { IFile, IRoom, IUser } from '@types'

import { Document } from 'mongoose'

export interface IItem extends Document {
  brand: string
  model?: string
  user: IUser['_id']
  room: IRoom['_id']
  price?: number
  purchase_date?: Date
  description?: string
  link?: string
  categories?: string[]
  image?: IFile['_id']
  invoice?: IFile['_id']
}

export interface IUpdateItemInput extends Document {
  brand?: string
  model?: string
  user?: IUser['_id']
  room?: IRoom['_id']
  price?: number
  purchase_date?: Date
  description?: string
  link?: string
  categories?: string[]
  image?: IFile['_id']
  invoice?: IFile['_id']
}
