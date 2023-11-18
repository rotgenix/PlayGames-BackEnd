import mongoose from 'mongoose'

export const OrganiserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    organisationName: {
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
    createdTournaments: {
        type: Array,
    }
})

