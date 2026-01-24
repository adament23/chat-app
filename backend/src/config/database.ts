import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log('MongoDB connected successfully');
    }catch (error){
        process.exit(1);// exit process with failure
        //status code 1 indicates that the program ended due to an error
        //status code 0 indicates that the program ended successfully
    }
}