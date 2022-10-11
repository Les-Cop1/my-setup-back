import app from '../src/app'

import request = require('supertest')

describe('GET /', () => {
  it('returns success', async () => {
    const res = await request(app).get('/api/category')
    expect(res.body.success).toEqual(true)
  })
})
