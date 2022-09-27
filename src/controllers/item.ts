import { handleMongoDBErrors } from '@helpers'
import { FileModel, ItemModel } from '@models'
import { IFile, IItem, IUser, ResponseType } from '@types'

import { isValid, parse } from 'date-fns'
import { Types } from 'mongoose'

export const createItem = async (item, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  item.user = loggedUser._id

  const purchaseDate = parse(item.purchase_date, 'P', new Date())
  if (!isValid(purchaseDate)) {
    throw new Error('Purchase date is invalid')
  }

  if (item.price < 0) {
    throw new Error('Price cannot be negative')
  }

  const currentItem = new ItemModel(item)

  try {
    const newItem = await currentItem.save()
    response = { ...response, data: { item: newItem } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const getItems = async (loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const items = await ItemModel.find<IItem>({ user: loggedUser._id }).exec()

  response = { ...response, data: { items } }

  return response
}

export const getItem = async (_id: IItem['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const item = await ItemModel.findById<IItem>(_id).exec()

  if (item === null) {
    throw new Error('Item not found')
  }

  if (loggedUser._id !== item.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  response = { ...response, data: { item } }

  return response
}

export const getBrandsName = async (loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    const data = await ItemModel.aggregate([
      {
        $match: {
          user: new Types.ObjectId(loggedUser._id),
        },
      },
      {
        $group: {
          _id: {
            brand: '$brand',
          },
        },
      },
      {
        $sort: {
          '_id.brand': 1,
        },
      },
    ]).exec()

    const brands = data.map((brand) => ({
      value: brand?._id?.brand,
    }))

    response = { ...response, data: { brands } }
  } catch (error) {
    throw handleMongoDBErrors(error)
  }

  return response
}

export const updateItem = async (_id: IItem['_id'], item, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const purchaseDate = parse(item.purchase_date, 'P', new Date())
  if (!isValid(purchaseDate)) {
    throw new Error('Purchase date is invalid')
  }

  if (item.price < 0) {
    throw new Error('Price cannot be negative')
  }

  const oldItem = await ItemModel.findById(_id).exec()

  if (oldItem === null) {
    throw new Error('Item not found')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  try {
    const newItem = await ItemModel.findByIdAndUpdate<IItem>(
      _id,
      {
        $set: { ...item },
      },
      { new: true },
    ).exec()
    response = { ...response, data: { item: newItem } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const setInvoice = async (_id: IItem['_id'], file, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  if (file?._id === undefined || file?.filename === undefined) {
    throw new Error('File not found')
  }

  const oldItem = await ItemModel.findById(_id).exec()

  if (oldItem?.invoice === undefined) {
    throw new Error('Item has already an invoice')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  try {
    const newItem = await ItemModel.findByIdAndUpdate<IItem>(
      _id,
      {
        $set: {
          invoice: {
            _id: file._id,
            filename: file.filename,
          },
        },
      },
      { new: true },
    ).exec()
    response = { ...response, data: { item: newItem } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const deleteInvoice = async (_id: IItem['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldItem = await ItemModel.findById(_id).exec()

  if (oldItem?.invoice === undefined) {
    throw new Error('Item has no invoice')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  try {
    await FileModel.findByIdAndDelete<IFile>(oldItem?.invoice._id.toString()).exec()
    const newItem = await ItemModel.findByIdAndUpdate<IItem>(
      _id,
      {
        $unset: {
          invoice: '',
        },
      },
      { new: true },
    ).exec()
    response = {
      ...response,
      data: { item: newItem },
    }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const setImage = async (_id: IItem['_id'], file, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  if (file?._id === undefined || file?.filename === undefined) {
    throw new Error('File not found')
  }

  const oldItem = await ItemModel.findById<IItem>(_id).exec()

  if (oldItem?.image === undefined) {
    throw new Error('Item has already an image')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  try {
    const newItem = await ItemModel.findByIdAndUpdate<IItem>(
      _id,
      {
        $set: {
          image: {
            _id: file._id,
            filename: file.filename,
          },
        },
      },
      { new: true },
    ).exec()
    response = { ...response, data: { item: newItem } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const deleteItem = async (_id: IItem['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldItem = await ItemModel.findById<IItem | null>(_id).exec()

  if (oldItem === null) {
    throw new Error('Item not found')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    response = { ...response, success: false, error: 'Unauthorized' }
    return response
  }

  try {
    const deletedItem = await ItemModel.findByIdAndDelete<IItem>(_id).exec()
    await FileModel.findByIdAndDelete(deletedItem?.invoice._id).exec()
    await FileModel.findByIdAndDelete(deletedItem?.image._id).exec()
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const deleteImage = async (_id: IItem['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldItem = await ItemModel.findById(_id).exec()

  if (oldItem === null) {
    throw new Error('Item not found')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    response = { ...response, success: false, error: 'Unauthorized' }
    return response
  }

  try {
    await FileModel.findByIdAndDelete(oldItem?.image._id.toString()).exec()
    const newItem = await ItemModel.findByIdAndUpdate(
      _id,
      {
        $unset: {
          image: '',
        },
      },
      { new: true },
    ).exec()
    response = {
      ...response,
      data: { item: newItem },
    }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}
