import mongoose from 'mongoose'

global.beforeEach(async () => {
  await mongoose.connect(decodeURI(process.env.MONGO_URL_TEST))
})

global.afterEach(async () => {
  await mongoose.connection.close()
})
