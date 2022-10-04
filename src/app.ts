import express, { Express } from 'express'

import { databaseConnection, getCorsOptions } from '@helpers'
import { authenticationRouter, categoryRouter, fileRouter, indexRouter, itemRouter, roomRouter, userRouter } from '@routes'

import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()

app.use(cors(getCorsOptions()))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', indexRouter)
app.use('/api/authenticate', authenticationRouter)
app.use('/api/user', userRouter)
app.use('/api/room', roomRouter)
app.use('/api/file', fileRouter)
app.use('/api/category', categoryRouter)
app.use('/api/item', itemRouter)

databaseConnection()
  .then(() => {
    console.info('[starting] Connected to database')
  })
  .catch(() => {
    console.info('[starting] Could not connect to database')
  })

export default app
