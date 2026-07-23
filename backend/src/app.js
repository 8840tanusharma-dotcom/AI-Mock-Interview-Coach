import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Temporary "Hello World" route to verify the server works
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is alive!' });
});

export default app;