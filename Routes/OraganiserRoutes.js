import expres, { json } from 'express'
import { OrganiserModel } from '../Database/Models/Models.js';

export const organiserRoutes = expres.Router();
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import {
    dashboardAdminController,
    organiserLoginCheckController,
    organiserLoginController,
    organiserLogoutController,
    organiserRegisterController
} from '../Controllers/OrganiserController.js';


organiserRoutes.get('/organiser', organiserLoginCheckController)

organiserRoutes.post('/organiser/register', organiserRegisterController);

organiserRoutes.post('/organiser/login', organiserLoginController);

organiserRoutes.get('/organiser/logout', organiserLogoutController)

organiserRoutes.get('/dashboard/:adminID', dashboardAdminController);

organiserRoutes.post('/', (req, res) => {
    const data = req.body;
    console.log(req.body)
    console.log(data);
    res.json({
        message: "Registered for Tournament Successfully",
    })
});
