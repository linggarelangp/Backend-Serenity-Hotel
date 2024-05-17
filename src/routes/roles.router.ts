import express, { type Router } from 'express'

import { addRoleValidation } from '../middleware/validation'
import { addRole, deleteRole, getRoleById, getRoles, updateRole } from '../controllers/roles.controller'
import { authentication } from '../middleware/authentication'

const roles: Router = express.Router()

roles.get('/roles/get', authentication, getRoles)
roles.get('/role/get/:id', authentication, getRoleById)
roles.put('/role/update/:id', authentication, updateRole)
roles.delete('/role/delete/:id', authentication, deleteRole)
roles.post('/role/add', authentication, addRoleValidation, addRole)

export default roles
