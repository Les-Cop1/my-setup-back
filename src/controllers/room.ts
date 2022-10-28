import { handleMongoDBErrors } from '@helpers'
import { FileModel, ItemModel, RoomModel } from '@models'
import { IFile, IItem, IRoom, IUpdateItemInput, IUser, ResponseType } from '@types'

interface RoomObjectType {
  [index: string]: {
    _id: IRoom['_id']
    name: string
    items_count: number
    room_price: number
  }
}

export const createRoom = async (name: string, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  if (name === undefined || name.length <= 0) {
    throw new Error('Room name is missing')
  }

  const room = new RoomModel({
    name,
    user: loggedUser._id,
  })

  try {
    const newRoom = await room.save()
    response = { ...response, data: { room: newRoom } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const getRooms = async (loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    const rooms = await RoomModel.find({ user: loggedUser._id }).exec()

    response = { ...response, data: { rooms } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const getRoom = async (_id: IRoom['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const room = await RoomModel.findById(_id).exec()

  const items = await ItemModel.find({ room: _id })
    .populate({ path: 'image', select: 'name' })
    .populate({ path: 'invoice', select: 'name' })
    .exec()

  if (room === null) {
    throw new Error('Room not found')
  }

  if (loggedUser._id !== room.user.toString() && loggedUser.permission < 10) {
    throw new Error('You are not allowed to access this room')
  }

  const roomData = { ...room.toObject(), items }

  response = { ...response, data: { room: roomData } }

  return response
}

export const updateRoom = async (_id: IRoom['_id'], room: IUpdateItemInput, loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldRoom = await RoomModel.findById<IRoom | null>(_id).exec()

  if (oldRoom === null) {
    throw new Error('Room not found')
  }

  if (loggedUser._id !== oldRoom.user.toString() && loggedUser.permission < 10) {
    throw new Error('You are not allowed to update this room')
  }

  try {
    const newRoom = await RoomModel.findByIdAndUpdate(_id, { $set: room }, { new: true }).exec()
    response = { ...response, data: { room: newRoom } }
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const deleteRoom = async (_id: IRoom['_id'], loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
  }

  const oldRoom = await RoomModel.findById(_id).exec()

  if (oldRoom === null) {
    throw new Error('Room not found')
  }

  if (loggedUser._id !== oldRoom.user.toString() && loggedUser.permission < 10) {
    throw new Error('You are not allowed to delete this room')
  }

  try {
    await RoomModel.findByIdAndDelete(_id).exec()

    let files: IFile['_id'][] = []

    const items = await ItemModel.find({ room: _id }).exec()

    items.forEach((item: IItem) => {
      if (item?.invoice) {
        files.push(item.invoice)
      }

      if (item?.image) {
        files.push(item.image)
      }
    })

    await ItemModel.deleteMany({ room: _id }).exec()
    await FileModel.deleteMany({ _id: { $in: files } }).exec()
  } catch (e) {
    throw handleMongoDBErrors(e)
  }

  return response
}

export const getRoomStats = async (loggedUser: IUser) => {
  let response: ResponseType = {
    success: true,
    data: {},
  }

  const rooms = [...(await RoomModel.find<IRoom>({ user: loggedUser }).exec())]
  const items = [...(await ItemModel.find<IItem>({ user: loggedUser }).exec())]

  let rooms_object: RoomObjectType = {}
  rooms.forEach((room: IRoom) => {
    const room_items = items.filter((item) => item.room.toString() === room._id.toString())
    rooms_object[room.name] = {
      _id: room._id.toString(),
      name: room.name,
      items_count: room_items.length,
      room_price: Math.round(room_items.reduce((sum, item) => sum + (item.price || 0), 0) * 100) / 100,
    }
  })

  const rooms_count = rooms.length
  const items_count = items.length

  const total_price = Math.round(items.reduce((sum, item) => sum + (item.price || 0), 0) * 100) / 100

  const average_price = Math.round((items_count > 0 ? total_price / items_count : 0) * 100) / 100

  const [most_item_room, most_expensive_room] = Object.keys(rooms_object).reduce(
    ([tmp_most_item_room, tmp_most_expensive_room], roomId: IRoom['_id']) => {
      const room = rooms_object[roomId]

      if (tmp_most_item_room.count < room.items_count) {
        tmp_most_item_room = {
          name: room.name,
          count: room.items_count,
        }
      }

      if (tmp_most_expensive_room.count < room.room_price) {
        tmp_most_expensive_room = {
          name: room.name,
          count: room.room_price,
        }
      }

      return [tmp_most_item_room, tmp_most_expensive_room]
    },
    [
      { name: '', count: 0 },
      { name: '', count: 0 },
    ],
  )

  const first_year = new Date().getFullYear()

  const [min_year, max_year] = items.reduce(
    ([min, max], item: IItem) => {
      if (item.purchaseDate) {
        const currentYear = item.purchaseDate.getFullYear()

        if (min > currentYear) {
          min = currentYear
        }
        if (max < currentYear) {
          max = currentYear
        }
      }

      return [min, max]
    },
    [first_year, first_year],
  )

  let tmp_years: any = {}
  for (let i = min_year; i <= max_year; i++) {
    tmp_years[i] = items
      .filter((item: IItem) => i === item.purchaseDate?.getFullYear())
      .reduce((sum: number, item: IItem) => {
        const price = item.price ? item.price : 0
        return sum + price
      }, 0)
  }

  response.data.stats = {
    global: {
      rooms_count,
      items_count,
      total_price,
      average_price,
      most_item_room,
      most_expensive_room,
    },
    rooms: rooms_object,
    years: tmp_years,
  }

  return response
}
