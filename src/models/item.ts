import { IItem } from '@types'

import mongoose, { Schema } from 'mongoose'

const ItemSchema: Schema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  price: {
    type: Number,
  },
  purchase_date: {
    type: Schema.Types.Date,
  },
  description: {
    type: String,
  },
  link: {
    type: String,
  },
  categories: [String],
  image: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'File',
  },
})

ItemSchema.set('timestamps', true)

export const ItemModel = mongoose.model<IItem>('Item', ItemSchema)
