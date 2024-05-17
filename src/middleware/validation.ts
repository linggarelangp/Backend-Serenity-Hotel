import { ZodError } from 'zod'
import { type Request, type Response, type NextFunction } from 'express'

import handleZodError from '../utils/zodError'
import { roleSchema, updateUserDataSchema, userSchema } from '../schema/object.schemas'

export const addRoleValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { name } = req.body

    try {
        await roleSchema.parseAsync({ name })

        res.locals.name = name as string

        next()
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const addUserValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { ...body } = req.body

    try {
        const data: object = {
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            password: body.password,
            confirmPassword: body.confirmPassword
        }

        await userSchema.parseAsync(data)

        next()
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const updateUserValidation = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { ...body } = req.body
    try {
        const data: object = {
            firstname: body.firstname,
            lastname: body.lastname
        }

        await updateUserDataSchema.parseAsync(data)

        next()
    } catch (err: any) {
        if (err instanceof ZodError) {
            const data: object[] = handleZodError(err)

            return res.status(400).json({
                status: 400,
                meesage: 'Bad Request',
                data: data
            })
        }

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}