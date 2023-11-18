import mongoose, { mongo } from 'mongoose'

export const TournamentSchema = new mongoose.Schema({
    imgaddress: {
        type: String,
        required: true,
    },
    createdBy: {
        type: String,
        required: true,
    },
    organiserName: {
        type: String,
        required: true,
    },
    tournamentName: {
        type: String,
        required: true,
    },
    prizePool: {
        type: Number,
        required: true,
    },
    tournamentDate: {
        type: String,
        required: true,
    },
    tournamentTime: {
        type: String,
        required: true,
    },
    gameName: {
        type: String,
        required: true,
    },
    participatingTeams: {
        type: Array,
    }
});

