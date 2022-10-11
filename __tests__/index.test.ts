import app from '../src/app'
import request from 'supertest'

beforeAll((done) => {
  if (app.isDbConnected) {
    process.nextTick(done)
  } else {
    app.on('dbConnected', () => done)
  }
})

describe('GET /', () => {
  it('returns success', async () => {
    const res = await request(app).get('/api')
    expect(res.statusCode).toEqual(200)
  })
})
