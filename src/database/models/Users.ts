export interface Users {
    id: number
    roleId: number
    email: string
    firstname: string
    lastname: string
    fullname: string
    password: string
    accessToken: string | null
    refreshToken: string | null
    createdAt: Date
    updatedAt: Date
}

export interface AddUser {
    roleId: number
    email: string
    firstname: string
    lastname: string
    fullname: string
    password: string
    accessToken: string | null
    refreshToken: string | null
    createdAt: Date
    updatedAt: Date
}

export interface UserToken {
    id: number
    roleId: number
    email: string
    firstname: string
    lastname: string
    fullname: string
}