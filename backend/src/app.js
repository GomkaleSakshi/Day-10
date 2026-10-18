import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import { config } from './config/env.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const { FRONTEND_URL, ANGULAR_URL } = config;

const app = express();
const allowedOrigins = [FRONTEND_URL, ANGULAR_URL, 'http://localhost:5173', 'http://localhost:4200'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy does not allow this origin'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Smart Facility Management API is running.' });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
