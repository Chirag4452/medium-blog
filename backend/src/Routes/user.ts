import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from 'medium-common-unkno'
import bcrypt from 'bcryptjs'

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
		const hashedPassword = await bcrypt.hash(body.password, 10);
		const user = await prisma.user.create({
			data: {
				username: body.username,
				password: hashedPassword,
				name: body.name || null
			}
		});
		const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
		return c.json({ jwt });
	} catch(e) {
		console.error('Signup error:', e);
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
	const { success } = signinInput.safeParse(body);
	if (!success) {
		return c.json({
			message: "Inputs not correct"
		})
	}

	const user = await prisma.user.findUnique({
		where: {
			username: body.username
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const isPasswordValid = await bcrypt.compare(body.password, user.password);
	if (!isPasswordValid) {
		c.status(403);
		return c.json({ error: "invalid password" });
	}

	const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt });
})