import { type Request, type Response } from 'express'


import prisma from '../database/prisma/prisma'
import { getDateNow } from '../utils/date'
import { AddRole, Roles, UpdateRole } from '../database/models/Roles'

export const addRole = async (req: Request, res: Response): Promise<Response> => {
    const name: string = res.locals.name as string
    try {
        const data: AddRole = {
            name: name,
            createdAt: new Date(getDateNow()),
            updatedAt: new Date(getDateNow())
        }

        const role: Roles = await prisma.roles.create({ data })

        return res.status(201).json({
            status: 201,
            message: 'Created',
            data: role
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const getRoles = async (req: Request, res: Response): Promise<Response> => {
    try {
        const roles: Roles[] = await prisma.roles.findMany()

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: roles
        })

    } catch (err: any) {

        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const getRoleById = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id
    try {
        const role: Roles | null = await prisma.roles.findUnique({ where: { id: parseInt(id) } })

        if (role === null) {
            return res.status(404).json({
                status: 404,
                message: 'Bad Request',
            })
        }

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: role
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const updateRole = async (req: Request, res: Response): Promise<Response> => {
    const id: string = req.params.id as string ?? null
    const { ...body } = req.body
    try {
        if (id === null) {
            return res.status(400).json({
                status: 400,
                message: 'Bad Request'
            })
        }

        const roleId: number = Number(id)

        const role: Roles | null = await prisma.roles.findUnique({ where: { id: roleId } })

        if (role === null) {
            return res.status(404).json({
                status: 400,
                message: 'Not Found'
            })
        }

        const data: UpdateRole = {
            name: body.name,
            updatedAt: new Date(getDateNow())
        }

        await prisma.roles.update({
            where: {
                id: roleId
            }, data: {
                ...data
            }
        })

        return res.status(200).json({
            status: 200,
            message: 'OK',
            data: role
        })

    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: 'An error occurred while loading the data. Please try again later'
        })
    }
}

export const deleteRole = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id

    try {
        const roleId: number = parseInt(id)
        const role: Roles | null = await prisma.roles.findUnique({ where: { id: roleId } })

        if (role === null) {
            return res.status(404).json({
                status: 404,
                message: 'Not Found'
            })
        }

        await prisma.roles.delete({ where: { id: role.id } })

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