import { Document } from 'mongoose'

export interface IUser extends Document {
  username: string
  password: string
  permission: number
}

export interface IGetUserInput {
  _id?: IUser['_id']
  username?: IUser['username']
  password?: IUser['password']
  permission?: IUser['permission']
}

export interface ICreateUserInput {
  username: IUser['username']
  password: IUser['password']
  confirmation: IUser['password']
  permission: IUser['permission']
}
