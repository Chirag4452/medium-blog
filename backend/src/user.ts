import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput } from './zod'

type Env = {
  DATABASE_URL: string
  JWT_SECRET: string
}

export const userRouter = new Hono<{ Bindings: Env }>();

userRouter.post('signup', async (c) => {
	const body = await c.req.json();
	const { success } = signupInput.safeParse(body);
	if (!success) {
		return c.json({
			message: "Inputs not correct"
		})
	}
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	,
	}).$extends(withAccelerate());
	try {
		const user = await prisma.user.create({
			data: {
				username: body.username,
				password: body.password,
				name: body.name || null
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		console.error('Signup error:');
		c.status(403);
		return c.json({ error: "error while signing up"});
	}
})

// Signin route
userRouter.post('signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			username: body.username
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})