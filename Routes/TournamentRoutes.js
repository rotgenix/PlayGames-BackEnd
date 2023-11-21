import expres, { json } from 'express'
import { PlayerModel, TournamentModel } from '../Database/Models/Models.js';

import jwt from 'jsonwebtoken';
export const tournamentRoutes = expres.Router();

//complete
tournamentRoutes.post('/tournament/createTournament/:adminID', async (req, res) => {
    const {
        tournamentName,
        prizePool,
        tournamentDate,
        tournamentTime,
        gameName,
    } = req.body;
    let imgaddress = '';



    if (gameName === 'bgmi') {
        imgaddress = 'https://wallpapers.com/images/high/bgmi-cyberpunk-street-cxapqv3ux77orya3.webp';

        // console.log("set bgmi");
        // console.log(imgaddress);
    }
    else if (gameName === 'codm') {
        imgaddress = 'https://wallpaperaccess.com/full/1470805.jpg';

        // console.log("set codm");
        // console.log(imgaddress);
    }
    else if (gameName === 'csgo2') {
        imgaddress = 'https://e1.pxfuel.com/desktop-wallpaper/536/381/desktop-wallpaper-counter-csgo-pc.jpg';

        // console.log("set cs");
        // console.log(imgaddress);
    }
    else if (gameName === 'dota2') {
        imgaddress = 'https://e1.pxfuel.com/desktop-wallpaper/177/315/desktop-wallpaper-dota2-abaddon-dota-2-official.jpg';

        // console.log("set do");
        // console.log(imgaddress);
    }
    else if (gameName === 'leagueOfLegends') {
        imgaddress = 'https://e0.pxfuel.com/wallpapers/973/943/desktop-wallpaper-league-of-legends-all-warriors-video-game.jpg';

        // console.log("set lol");
        // console.log(imgaddress);
    }
    else if (gameName === 'valorant') {
        imgaddress = 'https://e0.pxfuel.com/wallpapers/182/605/desktop-wallpaper-chamber-valorant.jpg';

        // console.log("set valo");
        // console.log(imgaddress);
    }


    console.log("tourna details", tournamentName, prizePool, tournamentDate, tournamentTime, gameName);


    //accessing params
    const { adminID } = req.params;;
    console.log("params", adminID);

    //organiser id
    // const adminID = jwt.verify(data, process.env.JWT_SECRET);
    // console.log("admin id", adminID);

    //creating tournament
    const createdTournament = await TournamentModel.create({
        imgaddress,
        createdBy: adminID,
        tournamentName,
        prizePool,
        tournamentDate,
        tournamentTime,
        gameName,
    });

    res.json({
        success: true,
        message: "Tournament Created Successfully",
        createdTournament
    })
});

//Complete
tournamentRoutes.get('/getAllTournaments', async (req, res) => {

    const token = req.cookies.paaiTokenPlayer;
    const allTournaments = await TournamentModel.find({});

    if (token) {
        res.json({
            success: true,
            message: "All Tournaments fetched Successfully",
            allTournaments,
            tokenis: true,
        })
    }
    else {
        res.json({
            success: true,
            message: "All Tournaments fetched Successfully",
            allTournaments,
            tokenis: false,
        })
    }

});

//complete
tournamentRoutes.post('/tournamentregister/:tournamentID', async (req, res) => {
    try {

        const { teamName,
            teamNumber,
            teamEmail,
            noOfPlayers,
            playerID } = req.body;
        const { tournamentID } = req.params;

        const data = {
            teamName,
            teamNumber,
            teamEmail,
            noOfPlayers,
        }

        //Upddating participated team in tournament 
        const teamAdded = await TournamentModel.updateOne({ _id: tournamentID }, {
            $push: {
                participatingTeams: data
            }
        });

        const tournamentData2 = await TournamentModel.findById({ _id: tournamentID });
        // console.log("td2", tournamentData2.tournamentName)
        // console.log("td2", tournamentData2.tournamentDate)
        // console.log("td2", tournamentData2.tournamentTime)
        // console.log("td2", tournamentData2..gameName)
        console.log(teamAdded);
        const obj = {
            tournamentName: tournamentData2.tournamentName,
            tournamentDate: tournamentData2.tournamentDate,
            tournamentTime: tournamentData2.tournamentTime,
            gameName: tournamentData2.gameName
        }
        console.log(obj);

        //Adding tournament in player profile
        let playerData = await PlayerModel.updateOne({ _id: playerID }, {
            $push: {
                participatedTournaments: obj
            }
        });


        let tournamentData = await TournamentModel.findById(tournamentID);

        const participatingTeams = tournamentData.participatingTeams;

        res.json({
            success: true,
            message: "Team registered Successfully!",
            participatingTeams
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Server Error while Registering for Tournament! Please try again.",
        })
    }
});

//Complete
tournamentRoutes.get('/tournament/getAllTournament/:adminID', async (req, res) => {
    const adminID = req.params.adminID;
    console.log("admin id", adminID);
    const data = await TournamentModel.find({ createdBy: adminID });

    console.log("data", data);

    if (data) {
        res.json({
            success: true,
            message: "Admin Tournaments fetched Successfully",
            data
        })
    }
    else {
        res, json({
            success: false,
            message: "Tournaments not found"
        })
    }
})

tournamentRoutes.get('/tournaments/mytournaments/:username', async (req, res) => {
    const username = req.params.username;

    console.log(username);
    const tournaments = await TournamentModel.find({ createdBy: username });
    console.log("Tour", tournaments);

    res.json({
        success: true,
        message: "Your tournaments fetched Successfully",
        tournaments
    })
});

tournamentRoutes.get('/tournaments/teams/:tournamentID', async (req, res) => {
    const tournamentID = req.params.tournamentID;

    console.log("tourna id", tournamentID);
    const tournamentsTeam = await TournamentModel.find({ _id: tournamentID });
    console.log("Tour teams", tournamentsTeam);

    res.json({
        success: true,
        message: "Tournaments teams fetched Successfully",
        tournamentsTeam
    })
});

tournamentRoutes.get('/tournaments/deletetournament/:tournamentID', async (req, res) => {
    const tournamentID = req.params.tournamentID;

    console.log("tourna id", tournamentID);
    const deleteTournament = await TournamentModel.deleteOne({ _id: tournamentID });
    console.log("Tour teams", deleteTournament);

    res.json({
        success: true,
        message: "Tournaments Deleted Successfully",
        deleteTournament
    })
});
