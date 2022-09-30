import { handleMongoDBErrors } from '@helpers'
import { FileModel, ItemModel } from '@models'
import { ICreateItemInput, IFile, IItem, IUpdateItemInput, IUser, ResponseType } from '@types'

import { isValid } from 'date-fns'
import { Types } from 'mongoose'

export const createItem = async (item: ICreateItemInput, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  item.user = loggedUser._id

  if (item.purchaseDate) {
    if (!isValid(new Date(item.purchaseDate))) {
      throw new Error('Invalid date')
    }
  }

  if (item.price && item.price < 0) {
    throw new Error('Price cannot be negative')
  }

  const currentItem = new ItemModel({
    ...item,
    purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
  })

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

  try {
    const items = await ItemModel.find<IItem>({ user: loggedUser._id }).exec()

    response = { ...response, data: { items } }
  } catch (e) {
    handleMongoDBErrors(e)
  }

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

    const brands = data.map((brand) => brand?._id?.brand)

    response = { ...response, data: { brands } }
  } catch (error) {
    throw handleMongoDBErrors(error)
  }

  return response
}

export const updateItem = async (_id: IItem['_id'], item: IUpdateItemInput, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldItem = await ItemModel.findById(_id).exec()

  if (oldItem === null) {
    throw new Error('Item not found')
  }

  if (item.purchaseDate) {
    if (!isValid(new Date(item.purchaseDate))) {
      throw new Error('Invalid date')
    }
  }

  if (item.price && item.price < 0) {
    throw new Error('Price cannot be negative')
  }

  if (loggedUser._id !== oldItem.user.toString() && loggedUser.permission < 10) {
    throw new Error('Unauthorized')
  }

  try {
    const newItem = await ItemModel.findByIdAndUpdate<IItem>(
      _id,
      {
        $set: { ...item, purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined },
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
    if (deletedItem?.invoice) {
      await FileModel.findByIdAndDelete<IFile>(deletedItem.invoice._id.toString()).exec()
    }
    if (deletedItem?.image) {
      await FileModel.findByIdAndDelete<IFile>(deletedItem.image._id.toString()).exec()
    }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}
