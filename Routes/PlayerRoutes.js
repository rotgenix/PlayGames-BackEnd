import expres from 'express'
import { PlayerModel } from '../Database/Models/Models.js';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

// console.log("node enc", process.env.NODE_ENV);
// console.log("con", process.env.NODE_ENV === 'Development' ? 'true' : 'false');

export const playerRoutes = expres.Router();

playerRoutes.get('/', (req, res) => {
    res.json({
        message: "User",
    })
});

playerRoutes.post('/playerRegister', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let userEmail = await PlayerModel.findOne({ email });

        if (userEmail) {
            res.json({
                success: false,
                message: "Email Already Registered Please Login!"
            })
        }
        else {
            const encryptedPassword = await bcrypt.hash(password, 10);
            console.log("Enc Pass ", encryptedPassword);

            let createdPlayer = await PlayerModel.create({
                name, email, password: encryptedPassword
            });

            const paaiTokenPlayer = jwt.sign({ _id: createdPlayer._id }, process.env.JWT_SECRET);

            res
                .cookie("paaiTokenPlayer", paaiTokenPlayer, {
                    maxAge: 10 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                })
                .json({
                    success: true,
                    message: "PLayer Registered Successfully",
                    createdPlayer
                })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error while Registering! Please Try Again.",
        })
    }
});

playerRoutes.post('/playerLogin', async (req, res) => {
    try {
        const data = req.cookies.paaiTokenPlayer;
        if (data) {
            res.json({
                success: false,
                message: "Player already loggedin"
            })
        }

        const { email, password } = req.body;

        let findPlayer = await PlayerModel.findOne({ email });


        if (!findPlayer) {
            res.json({
                success: false,
                message: "User not Registered! Please Register."
            })
        }
        else {

            const paaiTokenPlayer = jwt.sign({ _id: findPlayer._id }, process.env.JWT_SECRET);


            const isMatch = await bcrypt.compare(password, findPlayer.password);

            if (isMatch) {
                res.cookie("paaiTokenPlayer", paaiTokenPlayer, {
                    maxAge: 10 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                }).json({
                    success: true,
                    message: "Player Logged In Successfully",
                })
            }
            else {

                res.json({
                    success: false,
                    message: "Incorrect Credentials",
                })

            }
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server Error while Registering! Please Try Again.",
        })
    }
});

playerRoutes.get('/myProfile', async (req, res) => {
    const token = req.cookies.paaiTokenPlayer;
    if (!token) {
        res.json({
            success: false,
            message: "Player Not Logged In Please Login",
        });
    }
    else {
        const playerID = jwt.verify(token, process.env.JWT_SECRET);
        const playerData = await PlayerModel.findOne({ _id: playerID })
        res.json({
            success: true,
            message: "Player Profile",
            playerData,
        });
    }
});

playerRoutes.get('/playerLogout', (req, res) => {
    const token = req.cookies.paaiTokenPlayer;

    if (!req.cookies.paaiTokenPlayer) {
        res.json({
            success: false,
            message: "Player Not Logged In Please logins"
        })
    }
    else {
        res.cookie("paaiTokenPlayer", null, {
            expires: new Date(Date.now()),
            sameSite: "none",
            secure: true,
        }).json({
            success: true,
            message: "Player Logged Out Successfully",
        })
    }
});
