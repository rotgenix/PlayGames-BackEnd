import expres from 'express'
import { PlayerModel } from '../Database/Models/Models.js';

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

export const playerRoutes = expres.Router();

// console.log("node enc", process.env.NODE_ENV);
playerRoutes.get('/isLoggedIn', (req, res) => {

    try {
        if (req.cookies.paaiTokenPlayer) {
            console.log(req.cookies);
            console.log("/isLoggedIn", req.cookies);
            res.json({
                success: true,
                message: "Logged In as Player",
            });
        }
        else {
            res.json({
                success: false,
                message: "Not Logged",
            })
        }
    } catch (error) {
        res.json({
            success: false,
            message: "Server error while checking is logged in",
        });
    }
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
        console.log("/playerLogin", data);
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
    try {
        if (!req.cookies.paaiTokenPlayer) {
            const token = req.cookies.paaiTokenPlayer;
            console.log("token", token);
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
    } catch (error) {
        res.json({
            success: false,
            message: "Server error while fetching profile"
        })
    }
});

playerRoutes.get('/playerLogout', (req, res) => {
    const token = req.cookies.paaiTokenPlayer;

    if (!req.cookies.paaiTokenPlayer) {
        res.json({
            success: false,
            message: "Player Not Logged In Please login"
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
