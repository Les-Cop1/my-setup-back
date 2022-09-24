import { handleMongoDBErrors, invoiceFileFilter } from '@helpers'
import { FileModel } from '@models'
import { ICreateFileInput, IFile, IUser, ResponseType } from '@types'

import CryptoJS from 'crypto-js'

export const getFile = async (_id: IFile['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    const file = await FileModel.findById(_id).exec()

    if (file === null) {
      throw new Error('File not found')
    }

    if (loggedUser._id !== file.user.toString() && loggedUser.permission < 10) {
      throw new Error('You are not allowed to access this file')
    }

    const key = `${process.env.FILE_SECRET}${loggedUser._id}`

    file.data = CryptoJS.AES.decrypt(file.data, key).toString(CryptoJS.enc.Utf8)

    response = { ...response, data: { file } }
  } catch (error) {
    throw handleMongoDBErrors(error)
  }

  return response
}

export const uploadFile = async (file: ICreateFileInput, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  if (file === undefined) {
    throw new Error('File is missing')
  }

  let validation = invoiceFileFilter(file)
  if (!validation.success) {
    throw new Error(validation.error)
  }

  const data = file.buffer.toString('base64')
  const key = `${process.env.FILE_SECRET}${loggedUser._id}`

  const file_encoded = CryptoJS.AES.encrypt(data, key).toString()

  const currentFile = new FileModel({
    name: file.originalname,
    mimetype: file.mimetype,
    data: file_encoded,
    size: file.size,
    user: loggedUser._id,
  })

  try {
    const newFile = await currentFile.save()
    response = { ...response, data: { file: newFile } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const deleteFile = async (_id: IFile['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldFile = await FileModel.findById<IFile>(_id).exec()

  if (oldFile === null) {
    throw new Error('File not found')
  }

  if (loggedUser._id !== oldFile.user.toString() && loggedUser.permission < 10) {
    response = { ...response, success: false, error: 'Unauthorized' }
    return response
  }

  try {
    await FileModel.findByIdAndDelete(_id).exec()
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}
