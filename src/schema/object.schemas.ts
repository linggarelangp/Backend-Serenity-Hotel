import { ZodTypeAny, z } from 'zod'

export const roleSchema: ZodTypeAny = z.object({
    name: z.string({
        required_error: 'Role name is Required!',
        invalid_type_error: 'Role name must be a string'
    })
})

export const userSchema: ZodTypeAny = z.object({
    email: z.string({
        required_error: 'Email is Required!',
        invalid_type_error: 'Email must be a string'
    }).email({
        message: 'Invalid email address'
    }).max(254, {
        message: 'Email must be less than 30 characters'
    }),
    firstname: z.string({
        required_error: 'Firstname is Required!',
        invalid_type_error: 'Firstname must be a string'
    }).max(30, {
        message: 'Firstname must be less than 30 characters'
    }),
    lastname: z.string({
        required_error: 'Lastname is Required!',
        invalid_type_error: 'Lastname must be a string'
    }).max(30, {
        message: 'Lastname must be less than 30 characters'
    }),
    password: z.string({
        required_error: "Password is Required!",
        invalid_type_error: "Password must be a string"
    }).min(8, {
        message: "Password must be 8 or more characters long"
    }),
    confirmPassword: z.string({
        required_error: "Confirm Password is Required!",
        invalid_type_error: "Confirm Password must be a string"
    }).min(8, {
        message: "Confirm Password must be 8 or more characters long"
    })
}).superRefine(({ confirmPassword, password }, ctx: z.RefinementCtx): void => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Confirm Password must match with Password"
        })
    }
})

export const updateUserDataSchema: ZodTypeAny = z.object({
    firstname: z.string({
        required_error: 'Firstname is Required!',
        invalid_type_error: 'Firstname must be a string'
    }).max(30, {
        message: 'Firstname must be less than 30 characters'
    }),
    lastname: z.string({
        required_error: 'Lastname is Required!',
        invalid_type_error: 'Lastname must be a string'
    }).max(30, {
        message: 'Lastname must be less than 30 characters'
    })
})