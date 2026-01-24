import express from 'express';
import authRoutes from './routes/authRoutes';
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import userRoutes from './routes/userRoutes';

const app = express();


app.use(express.json()); // parsing incoming JSON request bodies and making them available under req.body in your route handlers


// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Service is running' });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users", userRoutes);


export default  app;