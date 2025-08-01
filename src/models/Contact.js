import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        isFavourite: {
            type: Boolean,
            default: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
            required: true,
        },
    },
    { timestamps: true }
);

export default model('Contact', contactSchema);
