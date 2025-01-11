import mongoose from 'mongoose';

export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    }
    catch (err) {
        console.error(`Error in src/lib/db.js/connectDb: ${error}`);
        process.exit(1);
    }
};