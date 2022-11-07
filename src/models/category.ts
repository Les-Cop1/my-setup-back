import { ICategory } from '@types'

import mongoose, { Schema } from 'mongoose'

const CategorySchema: Schema = new mongoose.Schema({
  en: {
    type: String,
    required: true,
    unique: true,
  },
  fr: {
    type: String,
    required: true,
  },
})

CategorySchema.set('timestamps', true)

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema)
