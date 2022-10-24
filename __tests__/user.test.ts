import app from '../src/app'
import { IUser } from '../src/types'
import { adminToken } from '../test.config'

import request = require('supertest')

let userId: IUser['_id']

describe('GET /', () => {
  it('returns success', async () => {
    const res = await request(app).get('/api/user').set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).get('/api/user?_id=61dde7494b9ea24af77614caa').set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
  })
})

describe('POST /', () => {
  it('returns success', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'test', password: 'Test123%', confirmation: 'Test123%' })
    userId = res.body.data.user._id
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'test', password: 'test123%', confirmation: 'test123%' })
    expect(res.body.success).toEqual(false)
  })
})

describe('UPDATE /', () => {
  it('returns success', async () => {
    const res = await request(app).put(`/api/user/${userId}`).set({ bearer: adminToken }).send({ username: 'testtest' })
    expect(res.body.data.user.username).toEqual('testtest')
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).put(`/api/user/${userId}`).set({ bearer: adminToken }).send({ password: 'Test223%' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Password confirmation is required')
  })

  it('returns false', async () => {
    const res = await request(app)
      .put(`/api/user/6335eb118f3b06674271d33a`)
      .set({ bearer: adminToken })
      .send({ username: 'testtest' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('User not found')
  })
})

describe('DELETE /', () => {
  it('returns success', async () => {
    const res = await request(app).delete(`/api/user/${userId}`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).delete(`/api/user/61dde7494b9ea24af77614cb`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('User not found')
  })
})
