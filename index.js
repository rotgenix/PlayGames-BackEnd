import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import cookieParser from 'cookie-parser';

//Routes Files
import { playerRoutes } from './Routes/PlayerRoutes.js';
import { organiserRoutes } from './Routes/OraganiserRoutes.js';
import { tournamentRoutes } from './Routes/TournamentRoutes.js';
import { ConnectDB } from './Database/ConnectDB.js';

config({
    path: './Dotenv/config.env'
});

const app = express();

console.log(process.env.FRONT_URL);

app.use(cors({
    origin: [process.env.FRONT_URL],
    methods: ["GET", "PUT", "DELETE", "POST"],
    credentials: true,
}));

//Middlewares
app.use(express.json());
app.use(cookieParser());

//Route-middlewares
app.use(playerRoutes);
app.use(organiserRoutes);
app.use(tournamentRoutes);

//DB Connection
ConnectDB();

app.get('/isLoggedIn', (req, res) => {

    console.log(req.cookies);

    if (req.cookies.paaiTokenPlayer) {
        res.json({
            success: true,
            isLoggedin: true,
            message: "Logged In as Player",
        });
    }
    else {
        res.json({
            success: false,
            message: "Not Logged",
        })
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server is Ready");
});