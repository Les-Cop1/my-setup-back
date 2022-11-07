import { IFile } from '@types'

import mongoose, { Schema } from 'mongoose'

const FileSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

FileSchema.set('timestamps', true)

export const FileModel = mongoose.model<IFile>('File', FileSchema)
