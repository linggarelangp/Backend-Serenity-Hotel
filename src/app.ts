import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { type Express, type Request, type Response } from 'express'

import router from './routes/router'

dotenv.config()

const app: Express = express()

app.use(cors({
    credentials: true,
    origin: true
}))

app.use(router)

app.get('/', (req: Request, res: Response): void => {
    res.send('Hello API')
})

export default app