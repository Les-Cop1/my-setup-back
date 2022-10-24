import app from '../src/app'
import { IItem } from '../src/types'
import { adminToken } from '../test.config'

import request = require('supertest')

let itemId: IItem['_id']

describe('POST /', () => {
  it('creates an item', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'test-brand',
      model: 'test-model',
      room: '6356c9b38f7be4979ecc3e04',
      price: 100,
      purchaseDate: '2022',
      description: 'test-description',
    })
    itemId = res.body.data.item._id

    expect(res.body.success).toEqual(true)
  })

  it('requires a valid purchase date', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'test-brand',
      model: 'test-model',
      room: '6356c9b38f7be4979ecc3e04',
      price: 100,
      purchaseDate: '2022-55-12',
      description: 'test-description',
    })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Invalid date')
  })

  it('requires a positive price', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'test-brand',
      model: 'test-model',
      room: '6356c9b38f7be4979ecc3e04',
      price: -23,
      purchaseDate: '2022',
      description: 'test-description',
    })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Price cannot be negative')
  })
})

describe('GET /', () => {
  it('gets items', async () => {
    const res = await request(app).get(`/api/item`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('gets brands', async () => {
    const res = await request(app).get(`/api/item/brands`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('gets item info', async () => {
    const res = await request(app).get(`/api/item/${itemId}`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an existing item', async () => {
    const res = await request(app).get(`/api/item/6336adf5fa2be22fa305a6c6`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })
})

describe('UPDATE /', () => {
  it('updates an item', async () => {
    const res = await request(app).put(`/api/item/${itemId}`).set({ bearer: adminToken }).send({ price: 102 })

    expect(res.body.data.item.price).toEqual(102)
    expect(res.body.success).toEqual(true)
  })

  it('requires an existing item', async () => {
    const res = await request(app)
      .put(`/api/item/6336adf5fa2be22fa305a6c6`)
      .set({ bearer: adminToken })
      .send({ price: 102 })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })

  it('requires a valid purchase date', async () => {
    const res = await request(app)
      .put(`/api/item/${itemId}`)
      .set({ bearer: adminToken })
      .send({ purchaseDate: '2014a' })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Invalid date')
  })

  it('requires a positive price', async () => {
    const res = await request(app).put(`/api/item/${itemId}`).set({ bearer: adminToken }).send({ price: -23 })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Price cannot be negative')
  })
})

describe('DELETE /', () => {
  it('deletes an item', async () => {
    const res = await request(app).delete(`/api/item/${itemId}`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(true)
  })

  it('requires an existing item', async () => {
    const res = await request(app).delete(`/api/item/6336adf5fa2be22fa305a6c6`).set({ bearer: adminToken })

    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })
})
