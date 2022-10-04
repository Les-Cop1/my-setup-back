import express, { Response } from 'express'

import { getCategories } from '@controllers'
import { AuthenticatedRequest, ResponseType } from '@types'

const router = express.Router()

// Get categories
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  let response: ResponseType = {
    success: true,
  }

  try {
    response = { ...response, ...(await getCategories()) }
  } catch (error: any) {
    response = { ...response, success: false, error: error.message }
  }

  res.send(response)
})

export { router as categoryRouter }
