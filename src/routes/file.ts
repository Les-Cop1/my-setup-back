import express, { Response } from 'express'

import { deleteFile, getFile, uploadFile } from '@controllers'
import { authenticated } from '@helpers'
import { AuthenticatedRequest, ICreateFileInput, IFile, IUser, ResponseType } from '@types'

import multer from 'multer'
import path from 'path'

const router = express.Router()
const upload = multer({})

router.use(upload.single('file'))

router.get('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
    data: {},
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await getFile(<IFile['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  if (!response.success) {
    return res.send(response)
  }

  const file = Buffer.from(response.data.file.data, 'base64')

  res.writeHead(200, {
    'Content-Type': response.data.file.mimetype,
    'Content-Length': file.length,
    'Content-Disposition': `inline; filename="${response.data.file.name}; filename="${
      path.parse(response.data.file.name).name
    }`,
  })

  res.end(file)
})

router.post('/', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await uploadFile(<ICreateFileInput>req.file, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

router.delete('/:_id', authenticated, async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  const { _id } = req.params

  try {
    response = { ...response, ...(await deleteFile(<IFile['_id']>_id, <IUser>req.user)) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as fileRouter }
