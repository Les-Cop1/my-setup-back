import app from '../src/app'
import { IItem } from '../src/types'
import { adminToken, userToken } from '../test.config'

import request = require('supertest')

let itemId: IItem['_id']

describe('POST /', () => {
  it('returns success', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'iPad',
      model: 'Air',
      room: '6352a6d76f4cc8b844d02714',
      price: 100,
      purchaseDate: '2014',
      description: '',
      link: '',
      categories: [],
    })
    itemId = res.body.data.item._id
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'iPad',
      model: 'Air',
      room: '6352a6d76f4cc8b844d02714',
      price: 100,
      purchaseDate: '2014a',
      description: '',
      link: '',
      categories: [],
    })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Invalid date')
  })

  it('returns false', async () => {
    const res = await request(app).post('/api/item').set({ bearer: adminToken }).send({
      brand: 'iPad',
      model: 'Air',
      room: '6352a6d76f4cc8b844d02714',
      price: -100,
      purchaseDate: '2014',
      description: '',
      link: '',
      categories: [],
    })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Price cannot be negative')
  })
})

describe('GET /', () => {
  it('returns success', async () => {
    const res = await request(app).get(`/api/item`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns success', async () => {
    const res = await request(app).get(`/api/item/brands`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns success', async () => {
    const res = await request(app).get(`/api/item/${itemId}`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).get(`/api/item/6336adf5fa2be22fa305a6c6`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })
})

describe('UPDATE /', () => {
  it('returns success', async () => {
    const res = await request(app).put(`/api/item/${itemId}`).set({ bearer: adminToken }).send({ price: 102 })
    expect(res.body.data.item.price).toEqual(102)
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app)
      .put(`/api/item/6336adf5fa2be22fa305a6c6`)
      .set({ bearer: adminToken })
      .send({ price: 102 })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })

  it('returns false', async () => {
    const res = await request(app)
      .put(`/api/item/${itemId}`)
      .set({ bearer: adminToken })
      .send({ purchaseDate: '2014a' })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Invalid date')
  })

  it('returns false', async () => {
    const res = await request(app).put(`/api/item/${itemId}`).set({ bearer: adminToken }).send({ price: -23 })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Price cannot be negative')
  })
})

describe('DELETE /', () => {
  it('returns true', async () => {
    const res = await request(app).delete(`/api/item/${itemId}`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(true)
  })

  it('returns false', async () => {
    const res = await request(app).delete(`/api/item/6336adf5fa2be22fa305a6c6`).set({ bearer: adminToken })
    expect(res.body.success).toEqual(false)
    expect(res.body.error).toEqual('Item not found')
  })
})
