
import { Socket, Server as SocketServer} from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";
import { resolve } from "dns";


//store online users in memory: userId -> socketId
export const onlineUsers: Map<string, string>= new Map();

export const initializeSocket = (httpServer: HttpServer) => {
    const allowedOrigions= [
        "http://localhost:8081",// Expo moblie app
         "http://localhost:5173" ,// Vite web dev
         process.env.FRONTEND_URL ,  // Production web app
    ].filter(Boolean) as string[]


    

    const io = new SocketServer(httpServer, {cors: {origin: allowedOrigions }});

    //verify socket connection- if the user is autenticated, we will store the user id in the socket
    
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token; // this is what user will send from client
        if(!token) return next (new Error("Authentication error"));
        try {
            const session = await verifyToken(token, {secretKey: process.env.CLERK_SECRET_KEY!});

            const  clerkId = session.sub

            const user = await User.findOne({clerkId});
            if(!user) return next (new Error("User not found"));

            socket.data.userId = user._id.toString();
            next();
        } catch (error : any) {
            next(new Error(error));
        }
    })


    //this "connection" event name is special and should be written like this
    //it's the event that is triggered when a new client connects to the server
    io.on("connection", (socket) => {
          const userId = socket.data.userId;
          
          //send list of currently online users to the newly connected client
          socket.emit("online-users", {userIds: Array.from(onlineUsers.keys())});

          //store the user in the online users map
          onlineUsers.set(userId, socket.id);

          //notify others  that this current user is online
          socket.broadcast.emit("user-online", {userId});

          socket.join(`user-${userId}`); //join a room specific to this user

          socket.on('join-chat', (chatId:string) => {
            socket.join(`chat-${chatId}`);
          });

          socket.on('leave-chat', (chatId:string) => {
            socket.leave(`chat-${chatId}`);
          });

          //handle sending messages
          socket.on('send-message', async(data : {chatId: string, text: string})=> {
            try {
                const {chatId, text} = data
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                })
                if(!chat) {
                    socket.emit('socket-error', {message: 'Chat not found'});
                    return;
                }
                const message = await Message.create({
                   chat: chatId,
                    sender: userId,
                    text
                });
                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                await message.populate('sender', 'name avatar');

                //emit to chat room (for users inside te chat)
                io.to(`chat-${chatId}`).emit('new-message', message);

                //also emit to participants personal room (for chat list view)
                for (const participantId of chat.participants) {
                    io.to(`user-${participantId}`).emit('new-message', message);
                }
            } catch (error) {
                socket.emit('socket-error', {message: 'Failed to send message'});
            }
          })

          socket.on('typing', async(data)=> {})

          socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            
            //notify others that this user is offline
            socket.broadcast.emit("user-offline", {userId});
          });
    });
    return io;
}