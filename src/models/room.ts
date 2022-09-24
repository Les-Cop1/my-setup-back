import { IRoom } from '@types'

import mongoose, { Schema } from 'mongoose'

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

RoomSchema.set('timestamps', true)

export const RoomModel = mongoose.model<IRoom>('Room', RoomSchema)
