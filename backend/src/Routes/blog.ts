import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { createBlogInput, UpdateBlogInput } from 'medium-common-unkno'

type Env = {
  DATABASE_URL: string
  JWT_SECRET: string
}
type Var = {
    userId: string
}
export const blogRouter = new Hono<{ Bindings: Env, Variables: Var }>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const user = await verify(token, c.env.JWT_SECRET) as { id: string };
    if (user) {
        c.set("userId", user.id);
        await next();
    } else {
        c.status(403);
        return c.json({
            message: "You are not logged in"
        })
    }
});

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            author_id: Number(authorId)
        }
    })

    return c.json({
        id: blog.id
    })

})
blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = UpdateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content
        }
    })

    return c.json({
        id: blog.id
    })
})
//bulk
blogRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json({ 
        blogs
     });
})
//get blog
blogRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL,
	}).$extends(withAccelerate());

    try{
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select:{
                        name: true
                    }
                }
            }
        })
        if (!blog) {
            return c.json({ message: 'Blog not found' }, 404)
        }
        return c.json(blog)
    } catch(e){
        c.status(500);
        return c.json({
            message: "Error while fetching blog post"
        })
    }
})
