import expres, { json } from 'express'
import { PlayerModel, TournamentModel } from '../Database/Models/Models.js';

import jwt from 'jsonwebtoken';
import { createTournamentController, deleteTournamentController, getAllAdminTournamentController, getAllTournamensController, registerTournamenController } from '../Controllers/TournamentController.js';
export const tournamentRoutes = expres.Router();

//complete createtournamnet
tournamentRoutes.post('/tournament/createTournament/:adminID', createTournamentController);

//Complete all tournas for player
tournamentRoutes.get('/getAllTournaments', getAllTournamensController);

//complete teams register in tourna
tournamentRoutes.post('/tournamentregister/:tournamentID', registerTournamenController);

//Complete get all tournas for admin
tournamentRoutes.get('/tournament/getAllTournament/:adminID', getAllAdminTournamentController)

// tournamentRoutes.get('/tournaments/mytournaments/:username', async (req, res) => {
//     const username = req.params.username;

//     console.log(username);
//     const tournaments = await TournamentModel.find({ createdBy: username });
//     console.log("Tour", tournaments);

//     res.json({
//         success: true,
//         message: "Your tournaments fetched Successfully",
//         tournaments
//     })
// });

tournamentRoutes.get('/tournaments/registeredteams/:tournamentID', async (req, res) => {
    const tournamentID = req.params.tournamentID;
    console.log("tourna id", tournamentID);

    const data = await TournamentModel.findOne({ _id: tournamentID });

    console.log("Tour teams", data.participatingTeams);
    const tournamentRegisteredTeams = data.participatingTeams;
    res.json({
        success: true,
        message: "Tournaments teams fetched Successfully",
        tournamentRegisteredTeams
    })
});

//complete delete tournmanet
tournamentRoutes.get('/tournaments/deletetournament/:tournamentID', deleteTournamentController);
