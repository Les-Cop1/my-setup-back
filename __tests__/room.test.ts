import app from '../src/app'
import { IRoom } from '../src/types'
import { adminToken, userToken } from '../test.config'

import request = require('supertest')

let roomId: IRoom['_id']

describe('POST /', () => {
  it('creates a room', async () => {
    const res = await request(app).post('/api/room').set({ bearer: adminToken }).send({ name: 'test-roomName' })
    roomId = res.body.data.room._id

    expect(res.body.success).toEqual(true)
  })

  it('requires a name', async () => {
    const res = await request(app).post('/api/room').set({ bearer: adminToken }).send({ name: '' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room name is missing')
  })
})

describe('GET /', () => {
  it('gets rooms', async () => {
    const res = await request(app).get(`/api/room`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('gets room stats', async () => {
    const res = await request(app).get(`/api/room/stats`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('gets room info', async () => {
    const res = await request(app).get(`/api/room/${roomId}`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an existing room', async () => {
    const res = await request(app).get(`/api/room/61e06d9f6a061e810904d93a`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })

  it('requires authorization to access a room', async () => {
    const res = await request(app).get(`/api/room/${roomId}`).set({ bearer: userToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to access this room')
  })
})

describe('PUT /', () => {
  it('updates a room', async () => {
    const res = await request(app)
      .put(`/api/room/${roomId}`)
      .set({ bearer: adminToken })
      .send({ name: 'test-editedRoomName' })

    expect(res.body.data.room.name).toEqual('test-editedRoomName')
    expect(res.body.success).toEqual(true)
  })

  it('requires an existing room', async () => {
    const res = await request(app)
      .put(`/api/room/61dfe8b374801e63c1ab1e47`)
      .set({ bearer: adminToken })
      .send({ username: 'test-editedRoomName' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })

  it('requires authorization to update a room', async () => {
    const res = await request(app)
      .put(`/api/room/${roomId}`)
      .set({ bearer: userToken })
      .send({ name: 'test-editedRoomName' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to update this room')
  })
})

describe('DELETE /', () => {
  it('requires authorization to delete a room', async () => {
    const res = await request(app).delete(`/api/room/${roomId}`).set({ bearer: userToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('You are not allowed to delete this room')
  })

  it('deletes a room', async () => {
    const res = await request(app).delete(`/api/room/${roomId}`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an existing room', async () => {
    const res = await request(app).delete(`/api/room/6335ef5b38dbc3eee97d115d`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Room not found')
  })
})
