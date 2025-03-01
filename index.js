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
    path: './.env'
});

const app = express();

console.log("FRONT URL ", process.env.FRONT_URL);

app.use(cors({
    origin: [process.env.FRONT_URL_PLAYER, process.env.FRONT_URL_DASHBOARD],
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

app.get('/', (req, res) => {
    const token = req.cookies.paaiTokenPlayer;
    console.log("token", token);
    if (token) {
        res.json({
            message: "User",
            tokenis: true,
        })
    }
    else {
        res.json({
            message: "User",
            tokenis: false,
        })
    }

});

app.listen(process.env.PORT, () => {
    console.log("Server is Ready");
});