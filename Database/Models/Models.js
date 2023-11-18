import mongoose from 'mongoose'

import { TournamentSchema } from '../Schemas/TournamentSchema.js';
import { OrganiserSchema } from '../Schemas/OrganiserSchema.js';
import { PlayerSchema } from '../Schemas/PlayerSchema.js';

export const PlayerModel = mongoose.model("Player", PlayerSchema);
export const OrganiserModel = mongoose.model("Organiser", OrganiserSchema);
export const TournamentModel = mongoose.model("Tournament", TournamentSchema);