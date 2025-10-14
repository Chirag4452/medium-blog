import { Hono } from 'hono'
import { userRouter } from './Routes/user'
import { blogRouter } from './Routes/blog'
import { cors } from 'hono/cors'

type Env = {
  DATABASE_URL: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors())
app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

export default app
