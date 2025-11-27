import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server as SocketServer } from 'socket.io';

import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import notesRoutes from './routes/notes.js';
import reviewRoutes from './routes/reviews.js';
import oralRoutes from './routes/oral.js';
import poemRoutes from './routes/poems.js';
import chatRoutes from './routes/chats.js';
import { handleAssistantSocket } from './sockets/assistant.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json({ limit: '2mb' }));

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/oral', oralRoutes);
app.use('/api/poems', poemRoutes);
app.use('/api/chats', chatRoutes);

io.on('connection', (socket) => {
  handleAssistantSocket(io, socket);
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running');
});