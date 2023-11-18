import mongoose from 'mongoose'

export const PlayerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    participatedTournaments: {
        type: Array,
    }
})
