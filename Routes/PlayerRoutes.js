import expres from 'express'

import { playerLoginCheckController, playerLoginController, playerLogoutController, playerProfileController, playerRegisterController } from '../Controllers/PlayerControllers.js';

export const playerRoutes = expres.Router();

// console.log("node enc", process.env.NODE_ENV);
playerRoutes.get('/isLoggedIn', playerLoginCheckController);

playerRoutes.post('/playerRegister', playerRegisterController);

playerRoutes.post('/playerLogin', playerLoginController);

playerRoutes.get('/myProfile/:playerID', playerProfileController);

playerRoutes.get('/playerLogout', playerLogoutController);
