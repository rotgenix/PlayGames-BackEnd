import expres from 'express'
import { TournamentModel } from '../Database/Models/Models.js';

export const tournamentRoutes = expres.Router();

tournamentRoutes.post('/createTournament', async (req, res) => {
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

    const createdTournament = await TournamentModel.create({
        tournamentName,
        prizePool,
        tournamentDate,
        gameName,
        tournamentTime,
        organiserName: "Paai esports",
        createdBy: 'paaiesports',
        imgaddress

    });

    console.log(tournamentName, prizePool, tournamentDate, gameName, tournamentTime);

    res.json({
        success: true,
        message: "Tournament Created Successfully",
        createdTournament
    })
});

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

tournamentRoutes.post('/tournamentregister/:tournamentID', async (req, res) => {
    try {
        const data = req.body;
        const { tournamentID } = req.params;

        const teamAdded = await TournamentModel.updateOne({ _id: tournamentID }, {
            $push: {
                participatingTeams: data
            }
        });
        // console.log("ta", teamAdded);
        const tournamentData = await TournamentModel.findById(tournamentID);
        // console.log("db td ", tournamentData);

        const participatingTeams = tournamentData.participatingTeams;
        // console.log("pt ", participatingTeams);

        res.json({
            success: true,
            message: "Team registered Successfully!",
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error while Registering for Tournament! Please try again.",
        })
    }
});

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
