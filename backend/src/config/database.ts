import mongoose from 'mongoose';

export const connectDB = async () => {

    

    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    }catch (error){
        console.error('MongoDB connection error:', error);
        process.exit(1);// exit process with failure
        //status code 1 indicates that the program ended due to an error
        //status code 0 indicates that the program ended successfully
    }
}