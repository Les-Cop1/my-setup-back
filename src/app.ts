import express, { Express } from 'express'

import { databaseConnection, getCorsOptions } from '@helpers'
import { authenticationRouter, indexRouter, userRouter } from '@routes'

import { roomRouter } from './routes/room'
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

databaseConnection()
  .then(() => {
    console.info('[Starting] Connected to database')
  })
  .catch(() => {
    console.info('[Starting] Could not connect to database')
  })

export default app
