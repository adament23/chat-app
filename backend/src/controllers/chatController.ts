import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { Chat } from '../models/Chat';
import { Types } from 'mongoose';

export async function getChats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const userId = req.userId;

        const chats = await Chat.find({participants: userId})
        .populate('participants', 'name email avatar')
        .populate('lastMessage')
        .sort({lastMessageAt: -1});

        const formattedChats = chats.map(chat => {
            const otherParticipants = chat.participants.find((p) => p._id.toString() !== userId);
            return {
                _id: chat._id,
                participants: otherParticipants?? null,
                lastMessage: chat.lastMessage,
                lastMessageAt: chat.lastMessageAt,
                createdAt: chat.createdAt,

            }
    })
    res.json(formattedChats);
} catch (error) {
        res.status(500)
        next(error);
    }
}

export async function getOrCreateChat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
       const userId = req.userId;
       const {participantId} = req.params;

       if(!participantId || Array.isArray(participantId)) {
        res.status(400).json({message: 'Participant ID is required'});
        return;
       }
    if(!Types.ObjectId.isValid(participantId)) {
        res.status(400).json({message: 'Invalid Participant ID'});
        return;
    }

       if(participantId === userId) {
        res.status(400).json({message: 'Cannot create chat with yourself'});
        return;
       }
       
       // Check if chat already exists
         let chat = await Chat.findOne({
            participants: { $all: [userId, participantId], $size: 2 }
        })
        .populate('participants', 'name email avatar')
        .populate('lastMessage');
        if(!chat) {
            // Create new chat
            const newChat = new Chat({
                participants: [userId, participantId],
            });
            await newChat.save();
            chat = await newChat.populate('participants', 'name email avatar')
        }
        const otherParticipants = chat.participants.find((p: any) => p._id.toString() !== userId);

        res.json({
            _id: chat._id,
            participants: otherParticipants?? null,
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            createdAt: chat.createdAt,
        })
    } catch (error) {
        res.status(500)
        next(error);
    }
}
