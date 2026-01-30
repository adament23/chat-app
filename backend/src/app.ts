import express from 'express';
import path from 'path'
import { clerkMiddleware } from '@clerk/express'
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();


app.use(express.json()); // parsing incoming JSON request bodies and making them available under req.body in your route handlers

app.use(clerkMiddleware())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Service is running' });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);

//error handlers must come after routes and other middleware so they can catch errors passed with next(err) or thrown inside async route handlers
app.use(errorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../web/dist')));
  app.get('/{*}', (_, res) => {
    res.sendFile(path.join(__dirname, '../../web/dist', 'index.html'));
  }
}

export default  app;