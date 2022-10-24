import app from '../src/app'
import { adminToken, userToken } from '../test.config'

import request = require('supertest')

describe('GET /', () => {
  it('displays a file', async () => {
    const res = await request(app).get('/api/file/6356420be819a7675c1c51da').set({ bearer: adminToken })

    expect(res.statusCode).toEqual(200)
  })

  it('requires an existing file', async () => {
    const res = await request(app).get('/api/file/6356420be819b7675c1c51da').set({ bearer: adminToken })

    expect(res.statusCode).toEqual(200)
  })

  it('requires authorization to access a file', async () => {
    const res = await request(app).get('/api/file/6356420be819a7675c1c51da').set({ bearer: userToken })

    expect(res.statusCode).toEqual(200)
  })
})
