import expres, { json } from 'express'
import { OrganiserModel } from '../Database/Models/Models.js';

export const organiserRoutes = expres.Router();
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"

organiserRoutes.get('/organiser', async (req, res) => {
    const data = req.cookies.paaiOrganiserToken;
    console.log("isloggedin cookie data", data);

    if (data) {
        const adminID = jwt.verify(data.paaiOrganiserToken, process.env.JWT_SECRET);
        console.log("admin id", adminID);

        const adminData = await OrganiserModel.findById({ _id: adminID });

        console.log("admin data", adminData);
        res.json({
            success: true,
            message: "Organiser Already Logged in",
            adminData
        })
    }
    else {
        res.json({
            success: false,
            message: "Organiser Not Logged in"
        })
    }
})

organiserRoutes.post('/organiser/register', async (req, res) => {

    //Checking cookies
    const data = req.cookies.paaiOrganiserToken;
    console.log("paaiOrganiserToken", data);

    //If already logged in
    if (data) {
        res.json({
            success: false,
            message: "Organiser Already Logged in"
        })
    }

    //if not logged in
    const { organisationName, email, password } = req.body;

    //Checking email in db
    let createdOrganiser = await OrganiserModel.findOne({ 'email': email });
    console.log("Create", createdOrganiser);

    //if email exists
    if (createdOrganiser) {
        res.json({
            success: false,
            message: "Organiser/Email already Registered! Please Login."
        })
    }
    else {


        const encryptedPassword = await bcrypt.hash(password, 10);

        console.log("Enc Pass ", encryptedPassword);

        createdOrganiser = await OrganiserModel.create({
            organisationName, email, password: encryptedPassword
        });
        // console.log(createdOrganiser);

        const paaiTokenOrganiser = jwt.sign({ _id: createdOrganiser._id }, process.env.JWT_SECRET);
        //cookie("paai_token", token).

        console.log("paaiTokenOrganiser", paaiTokenOrganiser);
        res

            .cookie("paaiTokenOrganiser", paaiTokenOrganiser, {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            })
            .json({
                success: true,
                message: "Organiser Registered Successfully",
                createdOrganiser,
            })
    }
});

organiserRoutes.post('/organiser/login', async (req, res) => {
    //Checking cookies
    const data = req.cookies.paaiTokenOrganiser;
    console.log("token data", data);

    //If cookies exists
    if (data) {
        res.json({
            success: false,
            message: "Organiser already logged in"
        })
    }
    else {
        console.log("organiser not llogeed in")
    }
    // console.log("128")

    const { email, password } = req.body;
    console.log("email pass", req.body);

    //Checking if email exists or not
    let organiser = await OrganiserModel.findOne({ email });
    console.log("organiser in db", organiser);

    if (!organiser) {
        res.json({
            success: false,
            message: "Email not registered"
        })
    }
    else {

        const isMatch = await bcrypt.compare(password, organiser.password);

        console.log("ismatch", isMatch);


        if (isMatch) {
            console.log("inside is match")
            const paaiTokenOrganiser = jwt.sign({ _id: organiser._id }, process.env.JWT_SECRET);
            res
                .cookie("paaiTokenOrganiser", paaiTokenOrganiser, {
                    maxAge: 10 * 60 * 1000,
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,

                }).json({
                    success: true,
                    message: "Organiser Logged In Successfully",
                    organiser
                })
        }
        else {
            res.json({
                success: false,
                message: "Incorrect Credentials",
            })
        }
    }

});

organiserRoutes.get('/organiser/logout', (req, res) => {
    const data = req.cookies.paaiTokenOrganiser;
    console.log("log out token", data);

    if (!data) {
        res.json({
            success: false,
            message: "Organiser Not Logged In, Please login"
        })
    }
    else {
        res.cookie("paaiTokenOrganiser", null, {
            expires: new Date(Date.now()),
            sameSite: "none",
            secure: true,
        }).json({
            success: true,
            message: "Organiser Logged Out Successfully",
        })
    }
})

organiserRoutes.get('/dashboard/:adminID', async (req, res) => {

    //Checcking cookies
    const data = req.cookies.paaiTokenOrganiser;
    console.log("cookes", data);
    if (!data) {
        res.json({
            success: false,
            message: "Organiser not logged in"
        })
    }

    //admin id from params
    const adminID = req.params.adminID;
    console.log("admin id", adminID);

    //admin pr in db
    const adminProfileData = await OrganiserModel.findById({ _id: adminID });
    console.log("admin pr data", adminProfileData);
    if (!adminProfileData) {
        res.json({
            success: false,
            message: "Organiser not found in db"
        })
    }

    res.json({
        success: true,
        message: "Organiser Profile",
        adminProfileData,
    })
});

organiserRoutes.post('/', (req, res) => {
    const data = req.body;
    console.log(req.body)
    console.log(data);
    res.json({
        message: "Registered for Tournament Successfully",
    })
});
