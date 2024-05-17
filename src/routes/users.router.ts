import express, { type Router } from 'express'

import { addUserValidation, updateUserValidation } from '../middleware/validation'
import { addUser, deleteUser, getAllUsers, getRefreshToken, getUserById, updateUser, userSignIn, userSignUp } from '../controllers/users.controller'
import { authentication } from '../middleware/authentication'

const users: Router = express()

users.get('/refresh-token', getRefreshToken)

users.post('/user/signin', userSignIn)
users.post('/user/signup', addUserValidation, userSignUp)
users.post('/user/add', authentication, addUserValidation, addUser)
users.get('/users/get', authentication, getAllUsers)
users.get('/user/get/:id', authentication, getUserById)
users.put('/user/update/:id', authentication, updateUserValidation, updateUser)
users.delete('/user/delete/:id', authentication, deleteUser)

export default users