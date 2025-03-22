require('dotenv').config();

const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Task Manager API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'Task Manager API endpoints', // Description
    },
  },
  // Path to the API docs (you can include other files here)
  apis: ['./index.js'],
};

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);
const port = process.env.PORT || 8000;

// Serve Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic API route for testing
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Returns the health status of the API
 *     tags: [API Health]
 *     responses:
 *       200:
 *         description: The API is healthy and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});