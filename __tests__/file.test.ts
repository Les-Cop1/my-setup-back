import app from '../src/app'
import { IUser } from '../src/types'
import { adminToken } from '../test.config'

import request = require('supertest')

let userId: IUser['_id']

describe('GET /', () => {
  it('returns true', async () => {
    const res = await request(app).get('/api/file/633c187b37fbd3dbfb3fc36f').set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
  })
})
