import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: string,
        required: true
    },
    receiverId: {
        type: string,
        required: true
    },
    text: {
        type: string,
    },
    image: {
        type: string,
        default: '',
    }
});

export const Message = mongoose.model("Message", messageSchema);