import express, { Express } from 'express'

import { databaseConnection, getWhitelist } from '@helpers'
import { authRouter, categoryRouter, fileRouter, indexRouter, itemRouter, roomRouter, userRouter } from '@routes'

import cookieParser from 'cookie-parser'
import cors, { CorsOptions } from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app: Express = express()

if (process.env.NODE_ENV === 'development') {
  const whitelist = getWhitelist()

  let corsOptions: CorsOptions = {
    origin: function (origin: any, callback: (arg0: Error | null, arg1: boolean) => void) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'), false)
      }
    },
    credentials: true,
  }

  app.use(cors(corsOptions))
} else {
  app.use(cors({ credentials: true }))
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api', indexRouter)
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/room', roomRouter)
app.use('/api/item', itemRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', fileRouter)

databaseConnection()
  .then(() => {
    console.info('[Starting] Connected to database')
  })
  .catch(() => {
    console.info('[Starting] Could not connect to database')
  })

export default app
