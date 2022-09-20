import express, { Express } from 'express'

import { databaseConnection, getCorsOptions } from '@helpers'
import { authenticationRouter, indexRouter } from '@routes'

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
app.use('/api/auth', authenticationRouter)

databaseConnection()
  .then(() => {
    console.info('[Starting] Connected to database')
  })
  .catch(() => {
    console.info('[Starting] Could not connect to database')
  })

export default app
