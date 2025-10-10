import { Hono } from 'hono'
import { userRouter } from './user'
import { blogRouter } from './blog'

type Env = {
  DATABASE_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app
