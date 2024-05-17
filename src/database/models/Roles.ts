export interface Roles {
    id: number
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface AddRole {
    name: string
    createdAt: Date
    updatedAt: Date
}

export interface UpdateRole {
    name: string
    updatedAt: Date
}