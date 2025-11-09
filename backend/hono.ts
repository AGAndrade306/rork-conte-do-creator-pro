import { Hono } from 'hono';
import { trpcServer } from '@hono/trpc-server';
import { cors } from 'hono/cors';
import { appRouter } from './trpc/app-router';
import { createContext } from './trpc/create-context';
import {
  generateIdeasInputSchema,
  generateContentIdeas,
} from './services/content/generate-ideas';

const app = new Hono();

app.use('*', cors());

app.use(
  '/trpc/*',
  trpcServer({
    endpoint: '/api/trpc',
    router: appRouter,
    createContext,
  })
);

app.get('/', (c) => {
  return c.json({ status: 'ok', message: 'API is running' });
});

app.post('/api/content/generate', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = generateIdeasInputSchema.safeParse(body);

    if (!parsed.success) {
      console.error('[HTTP] Validation error on /api/content/generate', parsed.error.flatten());
      return c.json({ error: 'Invalid request payload' }, 400);
    }

    const ideas = await generateContentIdeas(parsed.data);
    return c.json({ ideas });
  } catch (error) {
    console.error('[HTTP] Failed to generate ideas', error);
    return c.json({ error: 'Failed to generate ideas' }, 500);
  }
});

export default app;
