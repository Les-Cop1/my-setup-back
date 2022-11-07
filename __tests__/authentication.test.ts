import app from '../src/app'
import { userToken } from '../test.config'

import request = require('supertest')

describe('GET /', () => {
  it('check if user is logged in', async () => {
    const res = await request(app).get('/api/authenticate').set({ bearer: userToken })

    expect(res.body.success).toEqual(true)
  })

  it('sends an error if not logged in', async () => {
    const res = await request(app).get('/api/authenticate')

    expect(res.statusCode).toEqual(401)
  })
})

describe('POST /', () => {
  it('logs user', async () => {
    const res = await request(app).post('/api/authenticate').send({ username: 'user', password: 'User123%' })

    expect(res.body.success).toEqual(true)
  })

  it('requires a username', async () => {
    const res = await request(app).post('/api/authenticate').send({ password: 'User123%' })

    expect(res.body.success).toEqual(false)
  })

  it('requires a password', async () => {
    const res = await request(app).post('/api/authenticate').send({ username: 'user' })

    expect(res.body.success).toEqual(false)
  })

  it('requires an existing user', async () => {
    const res = await request(app).post('/api/authenticate').send({ username: 'user1', password: 'User123%' })

    expect(res.body.success).toEqual(false)
  })

  it('requires a valid password', async () => {
    const res = await request(app).post('/api/authenticate').send({ username: 'user', password: 'User123' })

    expect(res.body.success).toEqual(false)
  })
})

describe('DELETE /', () => {
  it('logs out the user', async () => {
    const res = await request(app).delete('/api/authenticate').set({ bearer: userToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an authenticated user', async () => {
    const res = await request(app).delete('/api/authenticate')

    expect(res.body.success).toEqual(false)
  })
})
