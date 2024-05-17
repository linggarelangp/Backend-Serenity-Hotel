import { type Request, type Response } from 'express'

import prisma from '../database/prisma/prisma'
import { formatterDate, getDateNow } from '../utils/date'
import { comparePassword, hashingPassword } from '../utils/hash'
import { AddUser, Users, UserToken } from '../database/models/Users'
import { generateAccessToken, generateRefreshToken } from '../utils/token'

export const addUser = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {
        const emailChecking: Users | null = await prisma.users.findUnique({ where: { email: body.email } })

        if (emailChecking) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: [
                    {
                        "path": "email",
                        "message": "Email address has already taken"
                    }
                ]
            })
        }

        const hashingPasswording: string = await hashingPassword(body.password)

        const addUserData: AddUser = {
            roleId: body.roleId,
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            fullname: body.firstname + ' ' + body.lastname,
            password: hashingPasswording,
            accessToken: null,
            refreshToken: null,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        const user: Users = await prisma.users.create({ data: addUserData })

        const data: object = {
            roleId: body.roleId ?? 3,
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            fullname: body.firstname + ' ' + body.lastname,
            accessToken: null,
            refreshToken: null,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
        const users: Users[] = await prisma.users.findMany()

        const data: object[] = users.map(user => {
            return {
                id: user.id,
                roleId: user.roleId,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                fullname: user.fullname,
                accessToken: user.accessToken,
                refreshToken: user.refreshToken,
                createdAt: formatterDate(user.createdAt),
                updatedAt: formatterDate(user.updatedAt)
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id

    try {
        const user: Users | null = await prisma.users.findUnique({ where: { id: parseInt(id) } })

        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: object = {
            id: user.id,
            roleId: user.roleId,
            email: user.email,
            fullname: user.fullname,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            createdAt: formatterDate(user.createdAt),
            updatedAt: formatterDate(user.updatedAt)
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id
    const { ...body } = req.body

    try {
        const userId: number = parseInt(id)

        const checkingUserId: Users | null = await prisma.users.findUnique({ where: { id: userId } })

        if (!checkingUserId) {
            return res.status(404).json({
                status: 404,
                message: 'User ID Not Found'
            })
        }

        const updateData: object = {
            firstname: body.firstname,
            lastname: body.lastname,
            fullname: body.firstname + ' ' + body.lastname,
            // dob: body.dob,
            updatedAt: new Date(getDateNow())
        }

        await prisma.users.update({ where: { id: userId }, data: updateData })


        const data: object = {
            id: userId,
            ...updateData
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id

    try {
        const userId = parseInt(id)

        const user: Users | null = await prisma.users.findUnique({ where: { id: userId } })

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        await prisma.users.delete({ where: { id: Number(user.id) } })

        return res.status(200).json({
            status: 200,
            message: 'OK'
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const userSignIn = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body

    try {
        // Checking User Email
        const user: Users | null = await prisma.users.findUnique({ where: { email: email } })

        if (user === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const data: UserToken = {
            id: user.id,
            roleId: user.roleId,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.fullname
        }

        const compareUserPassword: boolean = await comparePassword(password, user.password)

        if (!compareUserPassword) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        const accessToken: string = generateAccessToken(data)
        const refreshToken: string = generateRefreshToken(data)


        res.cookie('xyzbcat', accessToken, {
            maxAge: 12 * 60 * 60 * 1000, // for 12 hours
            httpOnly: true,
        })

        res.cookie('xyzbcrt', refreshToken, {
            maxAge: 24 * 7 * 60 * 60 * 1000, // for 1 week
            httpOnly: true,
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: { accessToken, refreshToken }
        })

    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const userSignUp = async (req: Request, res: Response): Promise<Response> => {
    const { ...body } = req.body

    try {
        const emailChecking: Users | null = await prisma.users.findUnique({ where: { email: body.email } })

        if (emailChecking) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request',
                data: [
                    {
                        "path": "email",
                        "message": "Email address has already taken"
                    }
                ]
            })
        }

        const hashingPasswording: string = await hashingPassword(body.password)

        const addUserData: AddUser = {
            roleId: 3,
            email: body.email,
            firstname: body.firstname,
            lastname: body.lastname,
            fullname: body.firstname + ' ' + body.lastname,
            password: hashingPasswording,
            accessToken: null,
            refreshToken: null,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        const user: Users = await prisma.users.create({ data: addUserData })

        const data: object = {
            roleId: user.roleId,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            fullname: user.firstname + ' ' + user.lastname,
            accessToken: null,
            refreshToken: null,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: data
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}