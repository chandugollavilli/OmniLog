import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'OmniLog Enterprise API Documentation',
    version: '1.0.0',
    description: 'REST API endpoints for FortiGate Syslog collection, log search, device management, security alerts, and reporting.',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API Version 1',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'System health check',
        responses: { '200': { description: 'Health status OK' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate user & receive JWT',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Login successful' } },
      },
    },
    '/logs': {
      get: {
        summary: 'Query and search FortiGate firewall logs',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'action', in: 'query', schema: { type: 'string' } },
          { name: 'ip', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Paginated log results' } },
      },
    },
    '/dashboard/metrics': {
      get: {
        summary: 'Fetch aggregated real-time dashboard analytics',
        responses: { '200': { description: 'Dashboard metrics payload' } },
      },
    },
  },
};

export const setupSwagger = (app: Express) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
