import expres from 'express'
import { OrganiserModel } from '../Database/Models/Models.js';

export const organiserRoutes = expres.Router();
import jwt from 'jsonwebtoken';

organiserRoutes.post('/organiserRegister', async (req, res) => {

    console.log(req.cookies);

    const { organisationName, email, password } = req.body;

    //Checking email in db
    let createdOrganiser = await OrganiserModel.findOne({ 'email': email });

    console.log("Create", createdOrganiser);
    if (createdOrganiser) {
        res.json({
            success: false,
            message: "Organiser/Email already Registered! Please Login."
        })
    }
    else {
        createdOrganiser = await OrganiserModel.create({
            organisationName, email, password
        });
        // console.log(createdOrganiser);

        const paaiTokenOrganiser = jwt.sign({ _id: createdOrganiser._id }, process.env.JWT_SECRET);
        //cookie("paai_token", token).

        console.log("paaiTokenOrganiser", paaiTokenOrganiser);
        res.cookie("paaiTokenOrganiser", paaiTokenOrganiser, {
            httpOnly: true,

        }).json({
            success: true,
            isOrganiser: true,
            message: "Organiser Registered Successfully",
            createdOrganiser,
        })
    }
});

organiserRoutes.get('/dashboard', async (req, res) => {

    const data = req.body;
    const token = req.cookies.paaiTokenOrganiser;

    const organiserID = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Organiser ID", organiserID);

    const organiserData = await OrganiserModel.findOne({ _id: organiserID });
    console.log("Organise data", organiserData);

    res.json({
        success: true,
        message: "Organiser Dashboard",
        organiserData,
    })
});

organiserRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // const data = req.body;
    console.log(req.body)
    let organiser = await OrganiserModel.find({ email });

    console.log("organiser", organiser);


    const paaiTokenOrganiser = jwt.sign({ _id: organiser._id }, process.env.JWT_SECRET);
    //cookie("paai_token", token).


    res.cookie("paaiTokenOrganiser", paaiTokenOrganiser, {

    }).json({
        success: true,
        message: "Organiser Logged In Successfully",
        organiser
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