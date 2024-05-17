import express, { type Router } from 'express'
import cookieParser from 'cookie-parser'

import roles from './roles.router'
import users from './users.router'

const router: Router = express.Router()

router.use(cookieParser())
router.use(express.json())
router.use(express.urlencoded({ extended: false }))

router.use(roles)
router.use(users)

export default router