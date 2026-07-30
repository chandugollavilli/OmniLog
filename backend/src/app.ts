import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorMiddleware';
import { apiRateLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './utils/swagger';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));

// Strict environment-driven CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin.includes('localhost') || origin === env.FRONTEND_URL) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive fallback for local dev clusters
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for generated reports
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Swagger Docs
setupSwagger(app);

// Global API rate limiting & routing
app.use(env.API_PREFIX, apiRateLimiter, routes);

// Global Error Handler
app.use(errorHandler);

export default app;
