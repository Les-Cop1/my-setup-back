import app from '../src/app'
import { IUser } from '../src/types'
import { adminToken } from '../test.config'

import request = require('supertest')

let userId: IUser['_id']

describe('GET /', () => {
  it('gets an user', async () => {
    const res = await request(app).get('/api/user').set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })
})

describe('POST /', () => {
  it('creates an user', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'test-userName', password: 'Test123%', confirmation: 'Test123%' })
    userId = res.body.data.user._id

    expect(res.body.success).toEqual(true)
  })

  it('requires a unique username', async () => {
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'test-userName', password: 'test123%', confirmation: 'test123%' })

    expect(res.body.success).toEqual(false)
  })
})

describe('UPDATE /', () => {
  it('updates an user', async () => {
    const res = await request(app)
      .put(`/api/user/${userId}`)
      .set({ bearer: adminToken })
      .send({ username: 'test-editedUserName' })

    expect(res.body.data.user.username).toEqual('test-editedUserName')
    expect(res.body.success).toEqual(true)
  })

  it('requires confirmation when the password is edited', async () => {
    const res = await request(app).put(`/api/user/${userId}`).set({ bearer: adminToken }).send({ password: 'Test223%' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Password confirmation is required')
  })

  it('requires an existing user', async () => {
    const res = await request(app)
      .put(`/api/user/6335eb118f3b06674271d33a`)
      .set({ bearer: adminToken })
      .send({ username: 'test-editedUserName' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('User not found')
  })
})

describe('DELETE /', () => {
  it('deletes an user', async () => {
    const res = await request(app).delete(`/api/user/${userId}`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an existing user', async () => {
    const res = await request(app).delete(`/api/user/61dde7494b9ea24af77614cb`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('User not found')
  })
})
