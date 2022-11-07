import mongoose from 'mongoose'

global.beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URL_TEST || '')
})

global.afterEach(async () => {
  await mongoose.connection.close()
})
