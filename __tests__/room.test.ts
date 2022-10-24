import app from '../src/app'
import { IRoom } from '../src/types'
import { adminToken, userToken } from '../test.config'

import request = require('supertest')

let roomId: IRoom['_id']

describe('POST /', () => {
  it('returns success', async () => {
    const res = await request(app).post('/api/room').set({ bearer: adminToken }).send({ name: 'test' })
    roomId = res.body.data.room._id
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).post('/api/room').set({ bearer: adminToken }).send({ name: '' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room name is missing')
  })
})

describe('GET /', () => {
  it('returns success', async () => {
    const res = await request(app).get(`/api/room`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns success', async () => {
    const res = await request(app).get(`/api/room/stats`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns success', async () => {
    const res = await request(app).get(`/api/room/${roomId}`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).get(`/api/room/61e06d9f6a061e810904d93a`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })

  it('returns false', async () => {
    const res = await request(app).get(`/api/room/${roomId}`).set({ bearer: userToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to access this room')
  })
})

describe('UPDATE /', () => {
  it('returns success', async () => {
    const res = await request(app).put(`/api/room/${roomId}`).set({ bearer: adminToken }).send({ name: 'testtest' })
    expect(res.body.data.room.name).toEqual('testtest')
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app)
      .put(`/api/room/61dfe8b374801e63c1ab1e47`)
      .set({ bearer: adminToken })
      .send({ username: 'testtest' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })

  it('returns false', async () => {
    const res = await request(app).put(`/api/room/${roomId}`).set({ bearer: userToken }).send({ name: 'testtest' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to update this room')
  })
})

describe('DELETE /', () => {
  it('returns false', async () => {
    const res = await request(app).delete(`/api/room/${roomId}`).set({ bearer: userToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to delete this room')
  })

  it('returns success', async () => {
    const res = await request(app).delete(`/api/room/${roomId}`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).delete(`/api/room/6335ef5b38dbc3eee97d115d`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })
})
