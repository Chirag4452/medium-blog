import z from 'zod';

export const signupInput = z.object({
	username: z.string().email(),
	password: z.string().min(6),
	name: z.string().optional()
})



//signin
export const signinInput = z.object({
	username: z.string().email(),
	password: z.string().min(6),
})

// type inference in zod


//blog post
export const createBlogInput = z.object({
    title: z.string(),
    content: z.string()
})

//blog update
export const UpdateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number()
})

// type inference in zod
export type SignupInput= z.infer<typeof signupInput>
export type SigninInput= z.infer<typeof signinInput>
export type UpdateBlogInput= z.infer<typeof UpdateBlogInput>
export type CreateBlogInput= z.infer<typeof createBlogInput>
